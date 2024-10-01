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
  "congviencontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "congviencontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "congviencontent/uploadDataWithImage",
  async (payload: {
    banner: File;
    title: string;
    mota: string;
    // note: string;
    // content1: string;
    // content2: string;
    // content3: string;
    // content4: string;
    // content5: string;
    // content6: string;
    // content7: string;
    // content8: string;
  }) => {
    const {
      banner,
      title,
      mota,
      // note,
      // content1,
      // content2,
      // content3,
      // content4,
      // content5,
      // content6,
      // content7,
      // content8,
    } = payload;

    // Upload images to Firebase Storage
    const bannerRef = ref(storage, `congviencontent/${banner.name}`);

  
    await uploadBytes(bannerRef, banner);
    const bannerURL = await getDownloadURL(bannerRef);

  
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "congviencontent"), {
      banner: bannerURL,
      title,
      mota,
      // note,
      // content1,
      // content2,
      // content3,
      // content4,
      // content5,
      // content6,
      // content7,
      // content8,

    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      banner: bannerURL,
      title,
      mota,
      // note,
      // content1,
      // content2,
      // content3,
      // content4,
      // content5,
      // content6,
      // content7,
      // content8,
    };
  }
);

interface Congviencontent {
  id: string;
  banner: string;
  title: string;
  mota: string;
  // note: string;
  // content1: string;
  // content2: string;
  // content3: string;
  // content4: string;
  // content5: string;
  // content6: string;
  // content7: string;
  // content8: string;

}

interface CongviencontentState {
  congviencontent: Congviencontent[];
  loading: boolean;
  error: string | null;
}

const initialState: CongviencontentState = {
  congviencontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchCongviencontent = createAsyncThunk<Congviencontent[]>(
  "congviencontent/fetchCongviencontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "congviencontent"));
    const congviencontent: Congviencontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Congviencontent, "id">), // Ensure correct data type
    }));
    return congviencontent;
  }
);

const congviencontentSlice = createSlice({
  name: "congviencontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.congviencontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchCongviencontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCongviencontent.fulfilled, (state, action) => {
        state.congviencontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchCongviencontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.congviencontent = state.congviencontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default congviencontentSlice.reducer;
