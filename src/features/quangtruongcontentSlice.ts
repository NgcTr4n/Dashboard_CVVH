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
  "quangtruongcontent/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "quangtruongcontent", id)); // Delete document from Firestore
    return id; // Return deleted document ID
  }
);

// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "quangtruongcontent/uploadDataWithImage",
  async (payload: {
    banner: File;
    banner1: File;
    banner2: File;
    banner3: File;
    banner4: File;
    banner5: File;
    banner6: File;
    banner7: File;
    banner8: File;
    title: string;
    mota: string;
    date: string;
    content: string;
    pic1: string;
    pic2: string;
    pic3: string;
    pic4: string;
    pic5: string;
    pic6: string;
    pic7: string;
    pic8: string;

    description1: string[];
    description2: string[];
    description3: string[];
    description4: string[];
    description5: string[];
    description6: string[];
    description7: string[];
    description8: string[];
    description9: string[];
    description10: string[];
    description11: string[];
    description12: string[];
    description13: string[];
    description14: string[];
  }) => {
    const {
      banner1,
      banner2,
      banner3,
      banner4,
      banner5,
      banner6,
      banner7,
      banner8,
      banner,
      title,
      mota,
      date,
      content,
      pic1,
      pic2,
      pic3,
      pic4,
      pic5,
      pic6,
      pic7,
      pic8,
      description1,
      description2,
      description3,
      description4,
      description5,
      description6,
      description7,
      description8,
      description9,
      description10,
      description11,
      description12,
      description13,
      description14


    } = payload;

    // Upload images to Firebase Storage
    const bannerRef = ref(storage, `quangtruongcontent/${banner.name}`);
    const banner1Ref = ref(storage, `quangtruongcontent/${banner1.name}`);
    const banner2Ref = ref(storage, `quangtruongcontent/${banner2.name}`);
    const banner3Ref = ref(storage, `quangtruongcontent/${banner3.name}`);
    const banner4Ref = ref(storage, `quangtruongcontent/${banner4.name}`);
    const banner5Ref = ref(storage, `quangtruongcontent/${banner5.name}`);
    const banner6Ref = ref(storage, `quangtruongcontent/${banner6.name}`);
    const banner7Ref = ref(storage, `quangtruongcontent/${banner7.name}`);
    const banner8Ref = ref(storage, `quangtruongcontent/${banner8.name}`);

    await uploadBytes(bannerRef, banner);
    const bannerURL = await getDownloadURL(bannerRef);

    await uploadBytes(banner1Ref, banner1);
    const banner1URL = await getDownloadURL(banner1Ref);

    await uploadBytes(banner2Ref, banner2);
    const banner2URL = await getDownloadURL(banner2Ref);

    await uploadBytes(banner3Ref, banner3);
    const banner3URL = await getDownloadURL(banner3Ref);

    await uploadBytes(banner4Ref, banner4);
    const banner4URL = await getDownloadURL(banner4Ref);

    await uploadBytes(banner5Ref, banner5);
    const banner5URL = await getDownloadURL(banner5Ref);

    await uploadBytes(banner6Ref, banner6);
    const banner6URL = await getDownloadURL(banner6Ref);

    await uploadBytes(banner3Ref, banner3);
    const banner7URL = await getDownloadURL(banner7Ref);

    await uploadBytes(banner8Ref, banner8);
    const banner8URL = await getDownloadURL(banner8Ref);
    // Save data (including image URLs) to Firestore
    const docRef = await addDoc(collection(db, "quangtruongcontent"), {
      banner: bannerURL,
      banner1: banner1URL,
      banner2: banner2URL,
      banner3: banner3URL,
      banner4: banner4URL,
      banner5: banner5URL,
      banner6: banner6URL,
      banner7: banner7URL,
      banner8: banner8URL,

     
      title,
      mota,
      date,
      content,
      pic1,
      pic2,
      pic3,
      pic4,
      pic5,
      pic6,
      pic7,
      pic8,
      description1,
      description2,
      description3,
      description4,
      description5,
      description6,
      description7,
      description8,
      description9,
      description10,
      description11,
      description12,
      description13,
      description14
    });

    // Return new document data from Firestore
    return {
      id: docRef.id,
        banner: bannerURL,
      banner1: banner1URL,
      banner2: banner2URL,
      banner3: banner3URL,
      banner4: banner4URL,
      banner5: banner5URL,
      banner6: banner6URL,
      banner7: banner7URL,
      banner8: banner8URL,
      
     
      title,
      mota,
      date,
      content,
      pic1,
      pic2,
      pic3,
      pic4,
      pic5,
      pic6,
      pic7,
      pic8,
      description1,
      description2,
      description3,
      description4,
      description5,
      description6,
      description7,
      description8,
      description9,
      description10,
      description11,
      description12,
      description13,
      description14
    };
  }
);

interface Quangtruongcontent {
  id: string;
  banner: string;
  banner1: string;
  banner2: string;
  banner3: string;
  banner4: string;
  banner5: string;
  banner6: string;
  banner7: string;
  banner8: string;
  title: string;
  mota: string;
  date: string;
  content: string;
  pic1: string;
  pic2: string;
  pic3: string;
  pic4: string;
  pic5: string;
  pic6: string;
  pic7: string;
  pic8: string;
  
  description1: string[];
  description2: string[];
  description3: string[];
  description4: string[];
  description5: string[];
  description6: string[];
  description7: string[];
  description8: string[];
  description9: string[];
  description10: string[];
  description11: string[];
  description12: string[];
  description13: string[];
  description14: string[];

}

interface QuangtruongcontentState {
  quangtruongcontent: Quangtruongcontent[];
  loading: boolean;
  error: string | null;
}

const initialState: QuangtruongcontentState = {
  quangtruongcontent: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from Firestore
export const fetchQuangtruongcontent = createAsyncThunk<Quangtruongcontent[]>(
  "quangtruongcontent/fetchQuangtruongcontent",
  async () => {
    const querySnapshot = await getDocs(collection(db, "quangtruongcontent"));
    const quangtruongcontent: Quangtruongcontent[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Get Firestore document ID
      ...(doc.data() as Omit<Quangtruongcontent, "id">), // Ensure correct data type
    }));
    return quangtruongcontent;
  }
);


const quangtruongcontentSlice = createSlice({
  name: "quangtruongcontent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload data with images
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.quangtruongcontent.push(action.payload); // Add new content to the state
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })

      // Fetch all content data
      .addCase(fetchQuangtruongcontent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuangtruongcontent.fulfilled, (state, action) => {
        state.quangtruongcontent = action.payload; // Update state with all content
        state.loading = false;
      })
      .addCase(fetchQuangtruongcontent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })

      // Delete content
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove deleted content from state
        state.quangtruongcontent = state.quangtruongcontent.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default quangtruongcontentSlice.reducer;
