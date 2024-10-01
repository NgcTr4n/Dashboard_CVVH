import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk to delete data
export const deleteData = createAsyncThunk(
  "gioithieulist/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "gioithieulist", id));
    return id;
  }
);

// Define the detail type


// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "gioithieulist/uploadDataWithImage",
  async (payload: {
    banner: File;
    title: string;
    description: string;
  }) => {
    const { banner, title, description } = payload;

    // Upload banner to Firebase Storage
    const bannerRef = ref(storage, `gioithieulist/${banner.name}`);
    await uploadBytes(bannerRef, banner);
    const bannerURL = await getDownloadURL(bannerRef);

    // Prepare details with image URLs
 

    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "gioithieulist"), {
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

interface Gioithieulist {
    id: string;
    banner: string;
    title: string;
    description: string;
}

interface GioithieulistState {
  gioithieulist: Gioithieulist[];
  loading: boolean;
  error: string | null;
}

const initialState: GioithieulistState = {
  gioithieulist: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchGioithieulist = createAsyncThunk<Gioithieulist[]>(
  "gioithieulist/fetchGioithieulist",
  async () => {
    const querySnapshot = await getDocs(collection(db, "gioithieulist"));
    const gioithieulist: Gioithieulist[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Gioithieulist, "id">;
      return {
        id: doc.id,
        ...data,
      };
    });
    return gioithieulist;
  }
);

const gioithieulistSlice = createSlice({
  name: "gioithieulist",
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
        state.gioithieulist.push(action.payload as Gioithieulist); // Cast if necessary
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      // Fetch all content data
      .addCase(fetchGioithieulist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGioithieulist.fulfilled, (state, action) => {
        state.gioithieulist = action.payload;
        state.loading = false;
      })
      .addCase(fetchGioithieulist.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        state.gioithieulist = state.gioithieulist.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default gioithieulistSlice.reducer;
