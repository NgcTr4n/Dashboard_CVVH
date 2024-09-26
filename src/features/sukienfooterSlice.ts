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
  "waterfooter/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "waterfooter", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage = createAsyncThunk(
  "waterfooter/uploadDataWithImage",
  async (payload: {
    file: File;
    title: string;
    description: string;
    date: string;
  }) => {
    const { file, title, description, date } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `waterfooter/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "waterfooter"), {
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

interface Waterfooter {
  id: string; // Thêm id vào kiểu dữ liệu
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

interface WaterfooterState {
  waterfooter: Waterfooter[];
  loading: boolean;
  error: string | null;
}

const initialState: WaterfooterState = {
  waterfooter: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchWaterfooter = createAsyncThunk<Waterfooter[]>(
  "waterfooter/fetchWaterfooter",
  async () => {
    const querySnapshot = await getDocs(collection(db, "waterfooter"));
    const waterfooter: Waterfooter[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Waterfooter, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return waterfooter;
  }
);

const waterfooterSlice = createSlice({
  name: "waterfooter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.waterfooter.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchWaterfooter.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWaterfooter.fulfilled, (state, action) => {
        state.waterfooter = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchWaterfooter.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.waterfooter = state.waterfooter.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default waterfooterSlice.reducer;
