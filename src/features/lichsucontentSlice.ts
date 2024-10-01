// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk to delete data
export const deleteData = createAsyncThunk(
  "lichsucontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "lichsucontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "lichsucontent/uploadDataWithImage",
  async (payload: {
    title: string;
    mota: string;
    description: string[];
    history: string;
    milestones: string[];
    banner1: File;
    banner2: File;
  }) => {
    const { title, mota, description, history, milestones, banner1, banner2 } = payload;

    // Upload images to Firebase Storage
    const banner1Ref = ref(storage, `lichsucontent/${banner1.name}`);
    const banner2Ref = ref(storage, `lichsucontent/${banner2.name}`);

    await uploadBytes(banner1Ref, banner1);
    const banner1URL = await getDownloadURL(banner1Ref);

    await uploadBytes(banner2Ref, banner2);
    const banner2URL = await getDownloadURL(banner2Ref);

    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "lichsucontent"), {
      title,
      description,
      mota,
      history,
      milestones,
      banner1: banner1URL,
      banner2: banner2URL,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      title,
      description,
      mota,
      history,
      milestones,
      banner1: banner1URL,
      banner2: banner2URL,
    };
  }
);

interface Trangchucontent {
  id: string;
  title: string;
  mota: string;
  description: string[];
  history: string;
  milestones: string[];
  banner1: string; // Store URLs of the images
  banner2: string;
}

interface TrangchucontentState {
  lichsucontent: Trangchucontent[];
  loading: boolean;
  error: string | null;
}

const initialState: TrangchucontentState = {
  lichsucontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchLichsucontent = createAsyncThunk<Trangchucontent[]>(
  "lichsucontent/fetchLichsucontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "lichsucontent"));
    const lichsucontent: Trangchucontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Trangchucontent, "id">), // Ensure correct data type
    }));
    return lichsucontent;
  }
);

const lichsucontentSlice = createSlice({
  name: "lichsucontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.lichsucontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchLichsucontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLichsucontent.fulfilled, (state, action) => {
        state.lichsucontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchLichsucontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.lichsucontent = state.lichsucontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default lichsucontentSlice.reducer;
