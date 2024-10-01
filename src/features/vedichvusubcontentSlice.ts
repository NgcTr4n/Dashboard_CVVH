// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk to delete data
export const deleteData = createAsyncThunk(
  "vedichvusubcontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "vedichvusubcontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "vedichvusubcontent/uploadDataWithImage",
  async (payload: {
    title1: string;
    title2: string;
    title3: string;
    note1: string;
    note2: string;
    description1: string[];
    description3: string[];
  }) => {
    const {
      title1,
      title2,
      title3,
      note1,
      note2,
      description1,
      description3,



    } = payload;

  
  
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "vedichvusubcontent"), {
     title1,
      title2,
      title3,
      note1,
      note2,
      description1,
      description3,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      title1,
      title2,
      title3,
      note1,
      note2,
      description1,
      description3,
    };
  }
);

interface Vedichvusubcontent {
  id: string;
  title1: string;
  title2: string;
  title3: string;
  note1: string;
  note2: string;
  description1: string[];
  description3: string[];

}

interface VedichvusubcontentState {
  vedichvusubcontent: Vedichvusubcontent[];
  loading: boolean;
  error: string | null;
}

const initialState: VedichvusubcontentState = {
  vedichvusubcontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchVedichvusubcontent = createAsyncThunk<Vedichvusubcontent[]>(
  "vedichvusubcontent/fetchVedichvusubcontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "vedichvusubcontent"));
    const vedichvusubcontent: Vedichvusubcontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Vedichvusubcontent, "id">), // Ensure correct data type
    }));
    return vedichvusubcontent;
  }
);

const vedichvusubcontentSlice = createSlice({
  name: "vedichvusubcontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.vedichvusubcontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchVedichvusubcontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVedichvusubcontent.fulfilled, (state, action) => {
        state.vedichvusubcontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchVedichvusubcontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.vedichvusubcontent = state.vedichvusubcontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default vedichvusubcontentSlice.reducer;
