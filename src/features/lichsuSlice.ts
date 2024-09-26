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
  "services/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "services", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage = createAsyncThunk(
  "services/uploadDataWithImage",
  async (payload: {
    file: File;
    title: string;
    description: string;
    color: string;
  }) => {
    const { file, title, description, color } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `waterfooter/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "waterfooter"), {
      title,
      description,
      color,
      imageUrl: downloadURL,
    });

    // Trả về dữ liệu mới được thêm vào từ Firestore
    return {
      id: docRef.id,
      title,
      description,
      color,
      imageUrl: downloadURL,
    };
  }
);

interface Services {
  id: string; // Thêm id vào kiểu dữ liệu
  title: string;
  description: string;
  color: string;
  imageUrl: string;
}

interface ServicesState {
  services: Services[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchServices = createAsyncThunk<Services[]>(
  "services/fetchServices",
  async () => {
    const querySnapshot = await getDocs(collection(db, "services"));
    const services: Services[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Services, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return services;
  }
);

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.services.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.services = state.services.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export default servicesSlice.reducer;
