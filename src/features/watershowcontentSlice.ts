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
  "watershowcontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "watershowcontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "watershowcontent/uploadDataWithImage",
  async (payload: {
    banner1: File;
    banner2: File;
    banner3: File;
    title: string;
    mota: string;
    content1: string;
    content2: string;

    description1: string[];
    description2: string[];
    description3: string[];

  }) => {
    const {
      banner1,
      banner2,
      banner3,
      title,
      mota,
      content1,
      content2,
      description1,
      description2,
      description3


    } = payload;

    // Upload images to Firebase Storage
    const banner1Ref = ref(storage, `watershowcontent/${banner1.name}`);
    const banner2Ref = ref(storage, `watershowcontent/${banner2.name}`);
    const banner3Ref = ref(storage, `watershowcontent/${banner3.name}`);

  
    await uploadBytes(banner1Ref, banner1);
    const banner1URL = await getDownloadURL(banner1Ref);

    await uploadBytes(banner2Ref, banner2);
    const banner2URL = await getDownloadURL(banner2Ref);

    await uploadBytes(banner3Ref, banner3);
    const banner3URL = await getDownloadURL(banner3Ref);
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "watershowcontent"), {
      banner1: banner1URL,
      banner2: banner2URL,
      banner3: banner3URL,
     
      title,
      mota,
      content1,
      content2,
      description1,
      description2,
      description3
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      banner1: banner1URL,
      banner2: banner2URL,
      banner3: banner3URL,
      title,
      mota,
      content1,
      content2,
      description1,
      description2,
      description3
    };
  }
);

interface Watershowcontent {
  id: string;
  banner1: string;
  banner2: string;
  banner3: string;

  title: string;
  mota: string;
  content1: string;
  content2: string;

  description1: string[];
  description2: string[];
  description3: string[];
}

interface WatershowcontentState {
  watershowcontent: Watershowcontent[];
  loading: boolean;
  error: string | null;
}

const initialState: WatershowcontentState = {
  watershowcontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchWatershowcontent = createAsyncThunk<Watershowcontent[]>(
  "watershowcontent/fetchWatershowcontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "watershowcontent"));
    const watershowcontent: Watershowcontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Watershowcontent, "id">), // Ensure correct data type
    }));
    return watershowcontent;
  }
);


const watershowcontentSlice = createSlice({
  name: "watershowcontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.watershowcontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchWatershowcontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWatershowcontent.fulfilled, (state, action) => {
        state.watershowcontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchWatershowcontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.watershowcontent = state.watershowcontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default watershowcontentSlice.reducer;
