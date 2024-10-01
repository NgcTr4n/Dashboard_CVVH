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
  "khiduoidaicontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "khiduoidaicontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "khiduoidaicontent/uploadDataWithImage",
  async (payload: {
    title: string;
    mota: string;
    content: string;
    content1: string;
    date: string;
    description1: string[];
    banner: File;
    content2: string;
    description2: string[];
    description3: string[];
    khi1: File;
    khi2: File;
    khi3: File;
  }) => {
    const {
      title,
      mota,
      content,
      description1,
      content1,
      description2,
      content2,
      description3,
      date,
      banner,
      khi1,
      khi2,
      khi3,
    } = payload;

    // Upload images to Firebase Storage
    const bannerRef = ref(storage, `khiduoidaicontent/${banner.name}`);
    const khi1Ref = ref(storage, `khiduoidaicontent/${khi1.name}`);
    const khi2Ref = ref(storage, `khiduoidaicontent/${khi2.name}`);
    const khi3Ref = ref(storage, `khiduoidaicontent/${khi3.name}`);

    await uploadBytes(bannerRef, banner);
    const bannerURL = await getDownloadURL(bannerRef);
    await uploadBytes(khi1Ref, khi1);
    const khi1URL = await getDownloadURL(khi1Ref);
    await uploadBytes(khi2Ref, khi2);
    const khi2URL = await getDownloadURL(khi2Ref);
    await uploadBytes(khi3Ref, khi3);
    const khi3URL = await getDownloadURL(khi3Ref);
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "khiduoidaicontent"), {
      title,
      mota,
      content,
      description1,
      content1,
      description2,
      content2,
      description3,
      date,
      banner: bannerURL,
      khi1: khi1URL,
      khi2: khi2URL,
      khi3: khi3URL,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      title,
      mota,
      content,
      description1,
      content1,
      description2,
      content2,
      description3,
      date,
      banner: bannerURL,
      khi1: khi1URL,
      khi2: khi2URL,
      khi3: khi3URL,
    };
  }
);

interface Khiduoidaicontent {
  id: string;
  title: string;
  mota: string;
  content: string;
  content1: string;
  date: string;
  description1: string[];
  banner: string;
  content2: string;
  description2: string[];
  description3: string[];
  khi1: string;
  khi2: string;
  khi3: string;
}

interface KhiduoidaicontentState {
  khiduoidaicontent: Khiduoidaicontent[];
  loading: boolean;
  error: string | null;
}

const initialState: KhiduoidaicontentState = {
  khiduoidaicontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchKhiduoidaicontent = createAsyncThunk<Khiduoidaicontent[]>(
  "khiduoidaicontent/fetchKhiduoidaicontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "khiduoidaicontent"));
    const khiduoidaicontent: Khiduoidaicontent[] = querySnapshot.docs.map(
      (doc) => ({
        id: doc.id, // Get Firestore document ID
        ...(doc.data() as Omit<Khiduoidaicontent, "id">), // Ensure correct data type
      })
    );
    return khiduoidaicontent;
  }
);

const khiduoidaicontentSlice = createSlice({
  name: "khiduoidaicontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.khiduoidaicontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchKhiduoidaicontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKhiduoidaicontent.fulfilled, (state, action) => {
        state.khiduoidaicontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchKhiduoidaicontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.khiduoidaicontent = state.khiduoidaicontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default khiduoidaicontentSlice.reducer;
