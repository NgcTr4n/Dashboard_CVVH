// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk để xóa dữ liệu
export const deleteData = createAsyncThunk(
  "thanhviennhahang/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "thanhviennhahang", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage = createAsyncThunk(
  "thanhviennhahang/uploadDataWithImage",
  async (payload: {
    file: File;
    description: string;
  }) => {
    const { file, description } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `thanhviennhahang/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "thanhviennhahang"), {
      description,
      imageUrl: downloadURL,
    });

    // Trả về dữ liệu mới được thêm vào từ Firestore
    return {
      id: docRef.id,
      description,
      imageUrl: downloadURL,
    };
  }
);

interface Thanhviennhahang {
  id: string; // Thêm id vào kiểu dữ liệu
  description: string;
  imageUrl: string;
}

interface ThanhviennhahangState {
  thanhviennhahang: Thanhviennhahang[];
  loading: boolean;
  error: string | null;
}

const initialState: ThanhviennhahangState = {
  thanhviennhahang: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchThanhviennhahang = createAsyncThunk<Thanhviennhahang[]>(
  "thanhviennhahang/fetchThanhviennhahang",
  async () => {
    const querySnapshot = await getDocs(collection(db, "thanhviennhahang"));
    const thanhviennhahang: Thanhviennhahang[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Thanhviennhahang, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return thanhviennhahang;
  }
);

const thanhviennhahangSlice = createSlice({
  name: "thanhviennhahang",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.thanhviennhahang.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchThanhviennhahang.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThanhviennhahang.fulfilled, (state, action) => {
        state.thanhviennhahang = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchThanhviennhahang.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.thanhviennhahang = state.thanhviennhahang.filter(item => item.id !== action.payload);
      });
  },
});

export default thanhviennhahangSlice.reducer;
