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
  "baomatsubcontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "baomatsubcontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "baomatsubcontent/uploadDataWithImage",
  async (payload: {
    content: string;
    description: string[];
  }) => {
    const {
      content,
      description,


    } = payload;


    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "baomatsubcontent"), {
      content,
      description,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      content,
      description,
    };
  }
);

interface Baomatsubcontent {
  id: string;
  content: string;
  description: string[];
}

interface BaomatsubcontentState {
  baomatsubcontent: Baomatsubcontent[];
  loading: boolean;
  error: string | null;
}

const initialState: BaomatsubcontentState = {
  baomatsubcontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchBaomatsubcontent = createAsyncThunk<Baomatsubcontent[]>(
  "baomatsubcontent/fetchBaomatsubcontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "baomatsubcontent"));
    const baomatsubcontent: Baomatsubcontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Baomatsubcontent, "id">), // Ensure correct data type
    }));
    return baomatsubcontent;
  }
);

const baomatsubcontentSlice = createSlice({
  name: "baomatsubcontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.baomatsubcontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchBaomatsubcontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBaomatsubcontent.fulfilled, (state, action) => {
        state.baomatsubcontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchBaomatsubcontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.baomatsubcontent = state.baomatsubcontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default baomatsubcontentSlice.reducer;
