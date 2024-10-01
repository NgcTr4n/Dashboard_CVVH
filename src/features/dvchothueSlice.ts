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
  "dvchothue/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "dvchothue", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "dvchothue/uploadDataWithImage",
  async (payload: {
    chothue: string;
    gia: string[];
  }) => {
    const {
     chothue,
     gia,


    } = payload;

  
  
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "dvchothue"), {
      chothue,
      gia,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      chothue,
     gia,
    };
  }
);

interface Dvchothue {
  id: string;
  chothue: string;
   gia: string[];
}

interface DvchothueState {
  dvchothue: Dvchothue[];
  loading: boolean;
  error: string | null;
}

const initialState: DvchothueState = {
  dvchothue: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchDvchothue = createAsyncThunk<Dvchothue[]>(
  "dvchothue/fetchDvchothue",
  async () => {
    const querySnapshot = await getDocs(collection(db, "dvchothue"));
    const dvchothue: Dvchothue[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Dvchothue, "id">), // Ensure correct data type
    }));
    return dvchothue;
  }
);

const dvchothueSlice = createSlice({
  name: "dvchothue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.dvchothue.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchDvchothue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDvchothue.fulfilled, (state, action) => {
        state.dvchothue = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchDvchothue.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.dvchothue = state.dvchothue.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default dvchothueSlice.reducer;
