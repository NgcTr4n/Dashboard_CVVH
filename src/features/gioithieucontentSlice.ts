import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk to delete data
export const deleteData = createAsyncThunk(
  "gioithieucontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "gioithieucontent", id));
    return id;
  }
);

// Define the detail type


// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "gioithieucontent/uploadDataWithImage",
  async (payload: {
    banner: File;
    title: string;
    description: string;
  }) => {
    const { banner, title, description } = payload;

    // Upload banner to Firebase Storage
    const bannerRef = ref(storage, `gioithieucontent/${banner.name}`);
    await uploadBytes(bannerRef, banner);
    const bannerURL = await getDownloadURL(bannerRef);

    // Prepare details with image URLs
 

    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "gioithieucontent"), {
      banner: bannerURL,
      title,
      description,
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      banner: bannerURL,
      description,
      title,
    };
  }
);

interface Gioithieucontent {
    id: string;
    banner: string;
    title: string;
    description: string;
}

interface GioithieucontentState {
  gioithieucontent: Gioithieucontent[];
  loading: boolean;
  error: string | null;
}

const initialState: GioithieucontentState = {
  gioithieucontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchGioithieucontent = createAsyncThunk<Gioithieucontent[]>(
  "gioithieucontent/fetchGioithieucontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "gioithieucontent"));
    const gioithieucontent: Gioithieucontent[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Gioithieucontent, "id">;
      return {
        id: doc.id,
        ...data,
      };
    });
    return gioithieucontent;
  }
);

const gioithieucontentSlice = createSlice({
  name: "gioithieucontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        // Ensure the type is consistent with the state type
        state.gioithieucontent.push(action.payload as Gioithieucontent); // Cast if necessary
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      // Fetch all content data
      .addCase(fetchGioithieucontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGioithieucontent.fulfilled, (state, action) => {
        state.gioithieucontent = action.payload;
        state.loading = false;
      })
      .addCase(fetchGioithieucontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        state.gioithieucontent = state.gioithieucontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default gioithieucontentSlice.reducer;
