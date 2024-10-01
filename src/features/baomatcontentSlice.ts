// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk to delete data
export const deleteData = createAsyncThunk(
  "baomatcontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "baomatcontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "baomatcontent/uploadDataWithImage",
  async (payload: {
    banner1: File;
    banner2: File;
    title: string;
    mota: string;
    content: string;
    description: string[];
  }) => {
    const {
      banner1,
      banner2,
      title,
      mota,
      content,
      description,


    } = payload;

    // Upload images to Firebase Storage
    const banner1Ref = ref(storage, `baomatcontent/${banner1.name}`);
    const banner2Ref = ref(storage, `baomatcontent/${banner2.name}`);

  
    await uploadBytes(banner1Ref, banner1);
    const banner1URL = await getDownloadURL(banner1Ref);

    await uploadBytes(banner2Ref, banner2);
    const banner2URL = await getDownloadURL(banner2Ref);
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "baomatcontent"), {
      banner1: banner1URL,
      banner2: banner2URL,
      title,
      mota,
      content,
      description,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      banner1: banner1URL,
      banner2: banner2URL,
      title,
      mota,
      content,
      description,
    };
  }
);

interface Baomatcontent {
  id: string;
  banner1: string;
  banner2: string;
  title: string;
  mota: string;
  content: string;
  description: string[];
}

interface BaomatcontentState {
  baomatcontent: Baomatcontent[];
  loading: boolean;
  error: string | null;
}

const initialState: BaomatcontentState = {
  baomatcontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchBaomatcontent = createAsyncThunk<Baomatcontent[]>(
  "baomatcontent/fetchBaomatcontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "baomatcontent"));
    const baomatcontent: Baomatcontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Baomatcontent, "id">), // Ensure correct data type
    }));
    return baomatcontent;
  }
);


const baomatcontentSlice = createSlice({
  name: "baomatcontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.baomatcontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchBaomatcontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBaomatcontent.fulfilled, (state, action) => {
        state.baomatcontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchBaomatcontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.baomatcontent = state.baomatcontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default baomatcontentSlice.reducer;
