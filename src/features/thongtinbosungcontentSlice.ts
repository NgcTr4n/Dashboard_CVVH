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
  "thongtinbosung/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "thongtinbosung", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "thongtinbosung/uploadDataWithImage",
  async (payload: {
    description: string[];
  }) => {
    const {
      description,


    } = payload;


    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "thongtinbosung"), {
      description,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      description,
    };
  }
);

interface Thongtinbosung {
  id: string;
  description: string[];
}

interface ThongtinbosungState {
  thongtinbosung: Thongtinbosung[];
  loading: boolean;
  error: string | null;
}

const initialState: ThongtinbosungState = {
  thongtinbosung: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchThongtinbosung = createAsyncThunk<Thongtinbosung[]>(
  "thongtinbosung/fetchThongtinbosung",
  async () => {
    const querySnapshot = await getDocs(collection(db, "thongtinbosung"));
    const thongtinbosung: Thongtinbosung[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Thongtinbosung, "id">), // Ensure correct data type
    }));
    return thongtinbosung;
  }
);

const thongtinbosungSlice = createSlice({
  name: "thongtinbosung",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.thongtinbosung.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchThongtinbosung.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThongtinbosung.fulfilled, (state, action) => {
        state.thongtinbosung = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchThongtinbosung.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.thongtinbosung = state.thongtinbosung.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default thongtinbosungSlice.reducer;
