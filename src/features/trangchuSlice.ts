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
  "trangchu/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "trangchu", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage = createAsyncThunk(
  "trangchu/uploadDataWithImage",
  async (payload: {
    file: File;
   
  }) => {
    const { file } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `trangchu/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "trangchu"), {
    
      imageUrl: downloadURL,
    });

    // Trả về dữ liệu mới được thêm vào từ Firestore
    return {
      id: docRef.id,
     
      imageUrl: downloadURL,
    };
  }
);





interface Trangchu {
  id: string; // Thêm id vào kiểu dữ liệu
  
  imageUrl: string;
}

interface TrangchuState {
  trangchu: Trangchu[];
  loading: boolean;
  error: string | null;
}

const initialState: TrangchuState = {
  trangchu: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchTrangchu = createAsyncThunk<Trangchu[]>(
  "trangchu/fetchTrangchu",
  async () => {
    const querySnapshot = await getDocs(collection(db, "trangchu"));
    const trangchu: Trangchu[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Trangchu, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return trangchu;
  }
);

const trangchuSlice = createSlice({
  name: "trangchu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.trangchu.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchTrangchu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrangchu.fulfilled, (state, action) => {
        state.trangchu = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchTrangchu.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.trangchu = state.trangchu.filter(
          (item) => item.id !== action.payload
        );
      })
      ;
  },
});

export default trangchuSlice.reducer;
