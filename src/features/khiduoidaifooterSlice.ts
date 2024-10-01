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

// Thunk để xóa dữ liệu
export const deleteData = createAsyncThunk(
  "khiduoidai/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "khiduoidai", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage = createAsyncThunk(
  "khiduoidai/uploadDataWithImage",
  async (payload: {
    file: File;
    title: string;
    description: string;
    date: string;
  }) => {
    const { file, title, description, date } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `khiduoidai/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "khiduoidai"), {
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
export const updateData = createAsyncThunk(
  "khiduoidai/updateData",
  async (payload: { id: string; title: string; description: string;date:string; file?: File }) => {
    const { id, title, description,date, file } = payload;

    // Tạo đối tượng cập nhật ban đầu không có imageUrl
    let updatedData: { title: string; description: string;date:string; imageUrl?: string } = { title, description,date };

    // Nếu có tệp mới, cập nhật cả hình ảnh
    if (file) {
      const storageRef = ref(storage, `khiduoidai/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.imageUrl = downloadURL; // Chỉ thêm imageUrl khi có tệp mới
    }

    // Cập nhật tài liệu trong Firestore
    const docRef = doc(db, "khiduoidai", id);
    await updateDoc(docRef, updatedData);

    return { id, ...updatedData }; // Trả về dữ liệu đã cập nhật, bao gồm cả imageUrl (nếu có)
  }
);


interface Khiduoidai {
  id: string; // Thêm id vào kiểu dữ liệu
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

interface KhiduoidaiState {
  khiduoidai: Khiduoidai[];
  loading: boolean;
  error: string | null;
}

const initialState: KhiduoidaiState = {
  khiduoidai: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchKhiduoidai = createAsyncThunk<Khiduoidai[]>(
  "khiduoidai/fetchKhiduoidai",
  async () => {
    const querySnapshot = await getDocs(collection(db, "khiduoidai"));
    const khiduoidai: Khiduoidai[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Khiduoidai, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return khiduoidai;
  }
);

const khiduoidaiSlice = createSlice({
  name: "khiduoidai",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.khiduoidai.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchKhiduoidai.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKhiduoidai.fulfilled, (state, action) => {
        state.khiduoidai = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchKhiduoidai.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.khiduoidai = state.khiduoidai.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(updateData.fulfilled, (state, action) => {
        // Cập nhật mục đã chỉnh sửa trong state
        const index = state.khiduoidai.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.khiduoidai[index] = action.payload;
        }
      });
  },
});

export default khiduoidaiSlice.reducer;
