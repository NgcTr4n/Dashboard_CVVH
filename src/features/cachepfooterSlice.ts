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

// Thunk để xóa dữ liệu
export const deleteData1 = createAsyncThunk(
  "cachep/deleteData1",
  async (id: string) => {
    await deleteDoc(doc(db, "cachep", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage1 = createAsyncThunk(
  "cachep/uploadDataWithImage1",
  async (payload: {
    file: File;
    title: string;
    description: string;
    date: string;
  }) => {
    const { file, title, description, date } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `cachep/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "cachep"), {
      title,
      description,
      date,
      imageUrl: downloadURL,
    });

    // Trả về dữ liệu mới được thêm vào từ Firestore
    return {
      id: docRef.id,
      title,
      description,
      date,
      imageUrl: downloadURL,
    };
  }
);

interface Cachep {
  id: string; // Thêm id vào kiểu dữ liệu
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

interface CachepfooterState {
  cachep: Cachep[];
  loading: boolean;
  error: string | null;
}

const initialState: CachepfooterState = {
  cachep: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchCachep = createAsyncThunk<Cachep[]>(
  "cachep/fetchCachep",
  async () => {
    const querySnapshot = await getDocs(collection(db, "cachep"));
    const cachep: Cachep[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Cachep, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return cachep;
  }
);

const cachepSlice = createSlice({
  name: "cachep",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage1.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage1.fulfilled, (state, action) => {
        state.cachep.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage1.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchCachep.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCachep.fulfilled, (state, action) => {
        state.cachep = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchCachep.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData1.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.cachep = state.cachep.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default cachepSlice.reducer;
