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
  "dvxedien/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "dvxedien", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "dvxedien/uploadDataWithImage",
  async (payload: {
    loaihinh: string;
    songuoi: string;
    sotien: string
  }) => {
    const {
      loaihinh,
      songuoi,
      sotien,



    } = payload;

  
  
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "dvxedien"), {
      
      loaihinh,
      songuoi,
      sotien,

    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      loaihinh,
      songuoi,
      sotien,
    };
  }
);

interface Dvxedien {
  id: string;
  loaihinh: string;
  songuoi: string;
  sotien: string;
 
}

interface DvxedienState {
  dvxedien: Dvxedien[];
  loading: boolean;
  error: string | null;
}

const initialState: DvxedienState = {
  dvxedien: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchDvxedien = createAsyncThunk<Dvxedien[]>(
  "dvxedien/fetchDvxedien",
  async () => {
    const querySnapshot = await getDocs(collection(db, "dvxedien"));
    const dvxedien: Dvxedien[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Dvxedien, "id">), // Ensure correct data type
    }));
    return dvxedien;
  }
);

const dvxedienSlice = createSlice({
  name: "dvxedien",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.dvxedien.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchDvxedien.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDvxedien.fulfilled, (state, action) => {
        state.dvxedien = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchDvxedien.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.dvxedien = state.dvxedien.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default dvxedienSlice.reducer;
