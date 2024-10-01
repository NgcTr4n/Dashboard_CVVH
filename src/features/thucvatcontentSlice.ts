// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk to delete data
export const deleteData = createAsyncThunk(
  "thucvatcontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "thucvatcontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "thucvatcontent/uploadDataWithImage",
  async (payload: {
    title: string;
    title2: string;
    content: string;
    date: string;
    description: string[];
    banner: File;
  }) => {
    const { title, title2, description, content, date, banner } = payload;

    // Upload images to Firebase Storage
    const bannerRef = ref(storage, `thucvatcontent/${banner.name}`);

    await uploadBytes(bannerRef, banner);
    const bannerURL = await getDownloadURL(bannerRef);

    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "thucvatcontent"), {
      title,
      title2,
      description,
      content,
      date,
      banner: bannerURL,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      title,
      title2,
      content,
      description,
      date,   
      banner: bannerURL,
    };
  }
);

interface Thucvatcontent {
  id: string;
  title: string;
  title2: string;
  content: string;
  date: string;
  description: string[];
  banner: string;
}

interface ThucvatcontentState {
  thucvatcontent: Thucvatcontent[];
  loading: boolean;
  error: string | null;
}

const initialState: ThucvatcontentState = {
  thucvatcontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchThucvatcontent = createAsyncThunk<Thucvatcontent[]>(
  "thucvatcontent/fetchThucvatcontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "thucvatcontent"));
    const thucvatcontent: Thucvatcontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Thucvatcontent, "id">), // Ensure correct data type
    }));
    return thucvatcontent;
  }
);

const thucvatcontentSlice = createSlice({
  name: "thucvatcontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.thucvatcontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchThucvatcontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThucvatcontent.fulfilled, (state, action) => {
        state.thucvatcontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchThucvatcontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.thucvatcontent = state.thucvatcontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default thucvatcontentSlice.reducer;
