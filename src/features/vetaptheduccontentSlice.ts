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
  "vetaptheduccontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "vetaptheduccontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "vetaptheduccontent/uploadDataWithImage",
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
    const banner1Ref = ref(storage, `vetaptheduccontent/${banner1.name}`);

  
    await uploadBytes(banner1Ref, banner1);
    const banner1URL = await getDownloadURL(banner1Ref);

  
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "vetaptheduccontent"), {
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

interface Vetaptheduccontent {
  id: string;
  banner1: string;
  title: string;
  mota: string;
  description: string[];
}

interface VetaptheduccontentState {
  vetaptheduccontent: Vetaptheduccontent[];
  loading: boolean;
  error: string | null;
}

const initialState: VetaptheduccontentState = {
  vetaptheduccontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchVetaptheduccontent = createAsyncThunk<Vetaptheduccontent[]>(
  "vetaptheduccontent/fetchVetaptheduccontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "vetaptheduccontent"));
    const vetaptheduccontent: Vetaptheduccontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Vetaptheduccontent, "id">), // Ensure correct data type
    }));
    return vetaptheduccontent;
  }
);

const vetaptheduccontentSlice = createSlice({
  name: "vetaptheduccontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.vetaptheduccontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchVetaptheduccontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVetaptheduccontent.fulfilled, (state, action) => {
        state.vetaptheduccontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchVetaptheduccontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.vetaptheduccontent = state.vetaptheduccontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default vetaptheduccontentSlice.reducer;
