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
  "thongtincanhan/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "thongtincanhan", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "thongtincanhan/uploadDataWithImage",
  async (payload: {
    content: string;
    description: string[];
  }) => {
    const {
      content,
      description
    } = payload;


  
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "thongtincanhan"), {
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

interface Thongtincanhan {
  id: string;
  content: string;
  description: string[];  

}

interface ThongtincanhanState {
  thongtincanhan: Thongtincanhan[];
  loading: boolean;
  error: string | null;
}

const initialState: ThongtincanhanState = {
  thongtincanhan: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchThongtincanhan = createAsyncThunk<Thongtincanhan[]>(
  "thongtincanhan/fetchThongtincanhan",
  async () => {
    const querySnapshot = await getDocs(collection(db, "thongtincanhan"));
    const thongtincanhan: Thongtincanhan[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Thongtincanhan, "id">), // Ensure correct data type
    }));
    return thongtincanhan;
  }
);

const thongtincanhanSlice = createSlice({
  name: "thongtincanhan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.thongtincanhan.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchThongtincanhan.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThongtincanhan.fulfilled, (state, action) => {
        state.thongtincanhan = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchThongtincanhan.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.thongtincanhan = state.thongtincanhan.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default thongtincanhanSlice.reducer;
