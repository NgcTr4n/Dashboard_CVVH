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
  "chuy/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "chuy", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "chuy/uploadDataWithImage",
  async (payload: {
    content: string;
    description: string;
  }) => {
    const {
      content,
      description
    } = payload;


  
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "chuy"), {
      content,
      description
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      content,
      description
    };
  }
);

interface Chuy {
  id: string;
  content: string;
  description: string;  

}

interface ChuyState {
  chuy: Chuy[];
  loading: boolean;
  error: string | null;
}

const initialState: ChuyState = {
  chuy: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchChuy = createAsyncThunk<Chuy[]>(
  "chuy/fetchChuy",
  async () => {
    const querySnapshot = await getDocs(collection(db, "chuy"));
    const chuy: Chuy[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Chuy, "id">), // Ensure correct data type
    }));
    return chuy;
  }
);

const chuySlice = createSlice({
  name: "chuy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.chuy.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchChuy.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChuy.fulfilled, (state, action) => {
        state.chuy = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchChuy.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.chuy = state.chuy.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default chuySlice.reducer;
