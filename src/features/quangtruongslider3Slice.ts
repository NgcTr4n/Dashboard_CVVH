// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk để xóa dữ liệu
export const deleteData3 = createAsyncThunk(
  "quangtruongslider3/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "quangtruongslider3", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage3 = createAsyncThunk(
  "quangtruongslider3/uploadDataWithImage",
  async (payload: {
    file: File;
    description: string;
  }) => {
    const { file, description } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `quangtruongslider3/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "quangtruongslider3"), {
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

interface Quangtruongslider3 {
  id: string; // Thêm id vào kiểu dữ liệu
  description: string;
  imageUrl: string;
}

interface Quangtruongslider3State {
  quangtruongslider3: Quangtruongslider3[];
  loading: boolean;
  error: string | null;
}

const initialState: Quangtruongslider3State = {
  quangtruongslider3: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchQuangtruongslider3 = createAsyncThunk<Quangtruongslider3[]>(
  "quangtruongslider3/fetchQuangtruongslider3",
  async () => {
    const querySnapshot = await getDocs(collection(db, "quangtruongslider3"));
    const quangtruongslider3: Quangtruongslider3[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Quangtruongslider3, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return quangtruongslider3;
  }
);

const quangtruongslider3Slice = createSlice({
  name: "quangtruongslider3",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage3.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage3.fulfilled, (state, action) => {
        state.quangtruongslider3.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage3.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchQuangtruongslider3.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuangtruongslider3.fulfilled, (state, action) => {
        state.quangtruongslider3 = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchQuangtruongslider3.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData3.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.quangtruongslider3 = state.quangtruongslider3.filter(item => item.id !== action.payload);
      });
  },
});

export default quangtruongslider3Slice.reducer;
