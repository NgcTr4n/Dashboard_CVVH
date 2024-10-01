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
  "vedichvucontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "vedichvucontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "vedichvucontent/uploadDataWithImage",
  async (payload: {
    banner1: File;
    title: string;
    mota: string;
    description: string[];
  }) => {
    const {
      banner1,
      title,
      mota,
      description,


    } = payload;

    // Upload images to Firebase Storage
    const banner1Ref = ref(storage, `vedichvucontent/${banner1.name}`);

  
    await uploadBytes(banner1Ref, banner1);
    const banner1URL = await getDownloadURL(banner1Ref);

  
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "vedichvucontent"), {
      banner1: banner1URL,
      title,
      mota,
      description,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      banner1: banner1URL,
      title,
      mota,
      description,
    };
  }
);

interface Vedichvucontent {
  id: string;
  banner1: string;
  title: string;
  mota: string;
  description: string[];
}

interface VedichvucontentState {
  vedichvucontent: Vedichvucontent[];
  loading: boolean;
  error: string | null;
}

const initialState: VedichvucontentState = {
  vedichvucontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchVedichvucontent = createAsyncThunk<Vedichvucontent[]>(
  "vedichvucontent/fetchVedichvucontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "vedichvucontent"));
    const vedichvucontent: Vedichvucontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Vedichvucontent, "id">), // Ensure correct data type
    }));
    return vedichvucontent;
  }
);

const vedichvucontentSlice = createSlice({
  name: "vedichvucontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.vedichvucontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchVedichvucontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVedichvucontent.fulfilled, (state, action) => {
        state.vedichvucontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchVedichvucontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.vedichvucontent = state.vedichvucontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default vedichvucontentSlice.reducer;
