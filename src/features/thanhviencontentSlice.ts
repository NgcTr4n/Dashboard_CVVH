// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk to delete data
export const deleteData = createAsyncThunk(
  "thanhviencontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "thanhviencontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "thanhviencontent/uploadDataWithImage",
  async (payload: {
    banner: File;
    title: string;
    mota: string;
    content1: string;
    description1: string[];
    logo1: File;
    content2: string;
    description2: string[];
    logo2: File;
  }) => {
    const {banner, title, mota, content1, description1, logo1, content2, description2, logo2} = payload;

    // Upload images to Firebase Storage
    const bannerRef = ref(storage, `thanhviencontent/${banner.name}`);

    const logo1Ref = ref(storage, `thanhviencontent/${logo1.name}`);
    const logo2Ref = ref(storage, `thanhviencontent/${logo2.name}`);

    await uploadBytes(bannerRef, banner);
    const bannerURL = await getDownloadURL(bannerRef);

    await uploadBytes(logo1Ref, logo1);
    const logo1URL = await getDownloadURL(logo1Ref);

    await uploadBytes(logo2Ref, logo2);
    const logo2URL = await getDownloadURL(logo2Ref);
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "thanhviencontent"), {
      banner: bannerURL, title, mota, content1, description1, logo1: logo1URL, content2, description2, logo2: logo2URL
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      banner: bannerURL, title, mota, content1, description1, logo1: logo1URL, content2, description2, logo2: logo2URL
    };
  }
);

interface Thanhviencontent {
  id: string;
  banner: string;
  title: string;
  mota: string;
  content1: string;
  description1: string[];
  logo1: string;
  content2: string;
  description2: string[];
  logo2: string;
}

interface ThanhviencontentState {
  thanhviencontent: Thanhviencontent[];
  loading: boolean;
  error: string | null;
}

const initialState: ThanhviencontentState = {
  thanhviencontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchThanhviencontent = createAsyncThunk<Thanhviencontent[]>(
  "thanhviencontent/fetchThanhviencontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "thanhviencontent"));
    const thanhviencontent: Thanhviencontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Thanhviencontent, "id">), // Ensure correct data type
    }));
    return thanhviencontent;
  }
);

const thanhviencontentSlice = createSlice({
  name: "thanhviencontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.thanhviencontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchThanhviencontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThanhviencontent.fulfilled, (state, action) => {
        state.thanhviencontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchThanhviencontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.thanhviencontent = state.thanhviencontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default thanhviencontentSlice.reducer;
