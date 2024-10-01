// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk để xóa dữ liệu
export const deleteThanhviencf = createAsyncThunk(
  "thanhviencf/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "thanhviencf", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadThanhviencfWithImage = createAsyncThunk(
  "thanhviencf/uploadDataWithImage",
  async (payload: {
    file: File;
    description: string;
  }) => {
    const { file, description } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `thanhviencf/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "thanhviencf"), {
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
export const updateThanhvien = createAsyncThunk(
  "thanhviencf/updateData",
  async (payload: { id: string; description: string; file?: File }) => {
    const { id, description, file } = payload;

    // Tạo đối tượng cập nhật ban đầu không có imageUrl
    let updatedData: { description: string; imageUrl?: string } = {  description };

    // Nếu có tệp mới, cập nhật cả hình ảnh
    if (file) {
      const storageRef = ref(storage, `thanhviencf/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.imageUrl = downloadURL; // Chỉ thêm imageUrl khi có tệp mới
    }

    // Cập nhật tài liệu trong Firestore
    const docRef = doc(db, "thanhviencf", id);
    await updateDoc(docRef, updatedData);

    return { id, ...updatedData }; // Trả về dữ liệu đã cập nhật, bao gồm cả imageUrl (nếu có)
  }
);




interface Thanhviencf {
  id: string; // Thêm id vào kiểu dữ liệu
  description: string;
  imageUrl?: string;
}

interface ThanhviencfState {
  thanhviencf: Thanhviencf[];
  loading: boolean;
  error: string | null;
}

const initialState: ThanhviencfState = {
  thanhviencf: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchThanhviencf = createAsyncThunk<Thanhviencf[]>(
  "thanhviencf/fetchThanhviencf",
  async () => {
    const querySnapshot = await getDocs(collection(db, "thanhviencf"));
    const thanhviencf: Thanhviencf[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Thanhviencf, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return thanhviencf;
  }
);

const thanhviencfSlice = createSlice({
  name: "thanhviencf",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadThanhviencfWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadThanhviencfWithImage.fulfilled, (state, action) => {
        state.thanhviencf.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadThanhviencfWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchThanhviencf.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThanhviencf.fulfilled, (state, action) => {
        state.thanhviencf = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchThanhviencf.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteThanhviencf.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.thanhviencf = state.thanhviencf.filter(item => item.id !== action.payload);
      })
      .addCase(updateThanhvien.fulfilled, (state, action) => {
        // Cập nhật mục đã chỉnh sửa trong state
        const index = state.thanhviencf.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.thanhviencf[index] = action.payload;
        }
      });
  },
});

export default thanhviencfSlice.reducer;
