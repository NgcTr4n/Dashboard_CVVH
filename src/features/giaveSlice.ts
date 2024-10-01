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
  "giave/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "giave", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "giave/uploadDataWithImage",
  async (payload: {
    imageUrl: File;
    
    title: string;
    price: string;
    description: string;
    backgroundColor: string;
    bgColor: string;
    textColor: string;
    svgColor: string;
    link: string;

  }) => {
    const {
      imageUrl,
      title,
      price,
      description,
      backgroundColor,
      bgColor,
      textColor,
      svgColor,
      link

      


    } = payload;

    // Upload images to Firebase Storage
  
    const imageUrlRef = ref(storage, `giave/${imageUrl.name}`);

  
    await uploadBytes(imageUrlRef, imageUrl);
    const imageUrlURL = await getDownloadURL(imageUrlRef);

  
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "giave"), {
      title,
      price,
      description,
      backgroundColor,
      bgColor,
      textColor,
      svgColor,
      link,
      imageUrl: imageUrlURL
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
      title,
      price,
      description,
      backgroundColor,
      bgColor,
      textColor,
      svgColor,
      link,
      imageUrl: imageUrlURL
    };
  }
);

interface Giave {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  description: string;
  backgroundColor: string;
  bgColor: string;
  textColor: string;
  svgColor: string;
  link: string;
 

 
}

interface GiaveState {
  giave: Giave[];
  loading: boolean;
  error: string | null;
}

const initialState: GiaveState = {
  giave: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchGiave = createAsyncThunk<Giave[]>(
  "giave/fetchGiave",
  async () => {
    const querySnapshot = await getDocs(collection(db, "giave"));
    const giave: Giave[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Giave, "id">), // Ensure correct data type
    }));
    return giave;
  }
);


const giaveSlice = createSlice({
  name: "giave",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.giave.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchGiave.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGiave.fulfilled, (state, action) => {
        state.giave = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchGiave.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.giave = state.giave.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default giaveSlice.reducer;
