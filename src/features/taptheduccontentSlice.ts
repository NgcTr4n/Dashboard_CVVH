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
  "tapthduccontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "tapthduccontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "tapthduccontent/uploadDataWithImage",
  async (payload: {
    banner: File;
    title: string;
    mota: string;
    description: string[];
    content1: string;
    description1: string[];
    content2: string;
    description2: string[];
    content3: string;
    description3: string[];
  }) => {
    const {
      banner,
      title,
      mota,
      description,
      content1,
      description1,
      content2,
      description2,
      content3,
      description3,
    
    } = payload;

    // Upload images to Firebase Storage
    const bannerRef = ref(storage, `tapthduccontent/${banner.name}`);

  
    await uploadBytes(bannerRef, banner);
    const bannerURL = await getDownloadURL(bannerRef);

  
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "tapthduccontent"), {
      banner: bannerURL,
      title,
      mota,
      description,
      content1,
      description1,
      content2,
      description2,
      content3,
      description3,
    
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      banner: bannerURL,
      title,
      mota,
      description,
      content1,
      description1,
      content2,
      description2,
      content3,
      description3,
    
    };
  }
);

interface Tapthduccontent {
  id: string;
  banner: string;
  title: string;
  mota: string;
  description: string[];
  content1: string;
  description1: string[];
  content2: string;
  description2: string[];
  content3: string;
  description3: string[];
 

}

interface TapthduccontentState {
  tapthduccontent: Tapthduccontent[];
  loading: boolean;
  error: string | null;
}

const initialState: TapthduccontentState = {
  tapthduccontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchTapthduccontent = createAsyncThunk<Tapthduccontent[]>(
  "tapthduccontent/fetchTapthduccontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "tapthduccontent"));
    const tapthduccontent: Tapthduccontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Tapthduccontent, "id">), // Ensure correct data type
    }));
    return tapthduccontent;
  }
);

const tapthduccontentSlice = createSlice({
  name: "tapthduccontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.tapthduccontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchTapthduccontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTapthduccontent.fulfilled, (state, action) => {
        state.tapthduccontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchTapthduccontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.tapthduccontent = state.tapthduccontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default tapthduccontentSlice.reducer;
