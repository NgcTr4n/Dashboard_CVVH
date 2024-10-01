import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk to delete data
export const deleteData = createAsyncThunk(
  "tapthecontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "tapthecontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "tapthecontent/uploadDataWithImage",
  async (payload: {
    banner: File;
    title: string;
    mota: string;
    description1: string[];
    list1: string;
    content1: string[];
    list2: string;
    content2: string;
    list3: string;
    content3: string[];
    list4: string;
    content4: string;
    description2: string;
    diachi: string;
    sodt: string;
  }) => {
    const {
      banner,
      title,
      mota,
      description1,
      list1,
      content1,
      list2,
      content2,
      list3,
      content3,
      list4,
      content4,
      description2,
      diachi,
      sodt,
    } = payload;

    // Upload images to Firebase Storage
    const bannerRef = ref(storage, `tapthecontent/${banner.name}`);
    await uploadBytes(bannerRef, banner);
    const bannerURL = await getDownloadURL(bannerRef);

    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "tapthecontent"), {
      banner: bannerURL,
      title,
      mota,
      description1,
      list1,
      content1,
      list2,
      content2,
      list3,
      content3,
      list4,
      content4,
      description2,
      diachi,
      sodt,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      banner: bannerURL,
      title,
      mota,
      description1,
      list1,
      content1,
      list2,
      content2,
      list3,
      content3,
      list4,
      content4,
      description2,
      diachi,
      sodt,
    };
  }
);

interface Tapthecontent {
  id: string;
  banner: string;
  title: string;
  mota: string;
  description1: string[];
  list1: string;
  content1: string[];
  list2: string;
  content2: string;
  list3: string;
  content3: string[];
  list4: string;
  content4: string;
  description2: string;
  diachi: string;
  sodt: string;
}

interface TapthecontentState {
  tapthecontent: Tapthecontent[];
  loading: boolean;
  error: string | null;
}

const initialState: TapthecontentState = {
  tapthecontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchTapthecontent = createAsyncThunk<Tapthecontent[]>(
  "tapthecontent/fetchTapthecontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "tapthecontent"));
    const tapthecontent: Tapthecontent[] = querySnapshot.docs.map(
      (doc) => ({
        id: doc.id, // Get Firestore document ID
        ...(doc.data() as Omit<Tapthecontent, "id">), // Ensure correct data type
      })
    );
    return tapthecontent;
  }
);

const tapthecontentSlice = createSlice({
  name: "tapthecontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.tapthecontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchTapthecontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTapthecontent.fulfilled, (state, action) => {
        state.tapthecontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchTapthecontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.tapthecontent = state.tapthecontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default tapthecontentSlice.reducer;
