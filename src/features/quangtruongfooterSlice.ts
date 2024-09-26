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
export const deleteData = createAsyncThunk(
  "quangtruong/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "quangtruong", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage = createAsyncThunk(
  "quangtruong/uploadDataWithImage",
  async (payload: {
    file: File;
    title: string;
    description: string;
    date: string;
  }) => {
    const { file, title, description, date } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `quangtruong/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "quangtruong"), {
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

interface Quangtruong {
  id: string; // Thêm id vào kiểu dữ liệu
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

interface WaterfooterState {
  quangtruong: Quangtruong[];
  loading: boolean;
  error: string | null;
}

const initialState: WaterfooterState = {
  quangtruong: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchQuangtruong = createAsyncThunk<Quangtruong[]>(
  "quangtruong/fetchQuangtruong",
  async () => {
    const querySnapshot = await getDocs(collection(db, "quangtruong"));
    const quangtruong: Quangtruong[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Quangtruong, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return quangtruong;
  }
);

const quangtruongSlice = createSlice({
  name: "quangtruong",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.quangtruong.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchQuangtruong.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuangtruong.fulfilled, (state, action) => {
        state.quangtruong = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchQuangtruong.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.quangtruong = state.quangtruong.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default quangtruongSlice.reducer;
