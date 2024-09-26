// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk để xóa dữ liệu
export const deleteData2 = createAsyncThunk(
  "quangtruongslider2/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "quangtruongslider2", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage2 = createAsyncThunk(
  "quangtruongslider2/uploadDataWithImage",
  async (payload: {
    file: File;
    description: string;
  }) => {
    const { file, description } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `quangtruongslider2/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "quangtruongslider2"), {
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

interface Quangtruongslider2 {
  id: string; // Thêm id vào kiểu dữ liệu
  description: string;
  imageUrl: string;
}

interface Quangtruongslider2State {
  quangtruongslider2: Quangtruongslider2[];
  loading: boolean;
  error: string | null;
}

const initialState: Quangtruongslider2State = {
  quangtruongslider2: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchQuangtruongslider2 = createAsyncThunk<Quangtruongslider2[]>(
  "quangtruongslider2/fetchQuangtruongslider2",
  async () => {
    const querySnapshot = await getDocs(collection(db, "quangtruongslider2"));
    const quangtruongslider2: Quangtruongslider2[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Quangtruongslider2, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return quangtruongslider2;
  }
);

const quangtruongslider2Slice = createSlice({
  name: "quangtruongslider2",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage2.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage2.fulfilled, (state, action) => {
        state.quangtruongslider2.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage2.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchQuangtruongslider2.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuangtruongslider2.fulfilled, (state, action) => {
        state.quangtruongslider2 = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchQuangtruongslider2.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData2.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.quangtruongslider2 = state.quangtruongslider2.filter(item => item.id !== action.payload);
      });
  },
});

export default quangtruongslider2Slice.reducer;
