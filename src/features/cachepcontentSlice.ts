// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk to delete data
export const deleteData = createAsyncThunk(
  "cachepcontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "cachepcontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "cachepcontent/uploadDataWithImage",
  async (payload: {
    title: string;
    mota: string;
    content: string;
    date: string;
    description: string[];
    banner: File;
  }) => {
    const { title, mota, description, content, date, banner } = payload;

    // Upload images to Firebase Storage
    const bannerRef = ref(storage, `cachepcontent/${banner.name}`);

    await uploadBytes(bannerRef, banner);
    const bannerURL = await getDownloadURL(bannerRef);

    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "cachepcontent"), {
      title,
      description,
      content,
      mota,
      date,
      banner: bannerURL,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      title,
      content,
      description,
      mota,
      date,   
      banner: bannerURL,
    };
  }
);

interface Cachepcontent {
  id: string;
  title: string;
  mota: string;
  content: string;
  date: string;
  description: string[];
  banner: string;
}

interface CachepcontentState {
  cachepcontent: Cachepcontent[];
  loading: boolean;
  error: string | null;
}

const initialState: CachepcontentState = {
  cachepcontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchCachepcontent = createAsyncThunk<Cachepcontent[]>(
  "cachepcontent/fetchCachepcontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "cachepcontent"));
    const cachepcontent: Cachepcontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Cachepcontent, "id">), // Ensure correct data type
    }));
    return cachepcontent;
  }
);

const cachepcontentSlice = createSlice({
  name: "cachepcontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.cachepcontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchCachepcontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCachepcontent.fulfilled, (state, action) => {
        state.cachepcontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchCachepcontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.cachepcontent = state.cachepcontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default cachepcontentSlice.reducer;
