// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk để xóa dữ liệu
export const deleteData4 = createAsyncThunk(
  "quangtruongslider4/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "quangtruongslider4", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage4 = createAsyncThunk(
  "quangtruongslider4/uploadDataWithImage",
  async (payload: {
    file: File;
    description: string;
  }) => {
    const { file, description } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `quangtruongslider4/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "quangtruongslider4"), {
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
export const updateData4 = createAsyncThunk(
  "quangtruongslider4/updateData",
  async (payload: { id: string; description: string; file?: File }) => {
    const { id, description, file } = payload;

    // Tạo đối tượng cập nhật ban đầu không có imageUrl
    let updatedData: {  description: string; imageUrl?: string } = { description };

    // Nếu có tệp mới, cập nhật cả hình ảnh
    if (file) {
      const storageRef = ref(storage, `quangtruongslider4/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.imageUrl = downloadURL; // Chỉ thêm imageUrl khi có tệp mới
    }

    // Cập nhật tài liệu trong Firestore
    const docRef = doc(db, "quangtruongslider4", id);
    await updateDoc(docRef, updatedData);

    return { id, ...updatedData }; // Trả về dữ liệu đã cập nhật, bao gồm cả imageUrl (nếu có)
  }
);

interface Quangtruongslider4 {
  id: string; // Thêm id vào kiểu dữ liệu
  description: string;
  imageUrl?: string;
}

interface Quangtruongslider4State {
  quangtruongslider4: Quangtruongslider4[];
  loading: boolean;
  error: string | null;
}

const initialState: Quangtruongslider4State = {
  quangtruongslider4: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchQuangtruongslider4 = createAsyncThunk<Quangtruongslider4[]>(
  "quangtruongslider4/fetchQuangtruongslider4",
  async () => {
    const querySnapshot = await getDocs(collection(db, "quangtruongslider4"));
    const quangtruongslider4: Quangtruongslider4[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Quangtruongslider4, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return quangtruongslider4;
  }
);

const quangtruongslider4Slice = createSlice({
  name: "quangtruongslider4",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage4.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage4.fulfilled, (state, action) => {
        state.quangtruongslider4.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage4.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchQuangtruongslider4.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuangtruongslider4.fulfilled, (state, action) => {
        state.quangtruongslider4 = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchQuangtruongslider4.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData4.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.quangtruongslider4 = state.quangtruongslider4.filter(item => item.id !== action.payload);
      })
      .addCase(updateData4.fulfilled, (state, action) => {
        // Cập nhật mục đã chỉnh sửa trong state
        const index = state.quangtruongslider4.findIndex(item => item.id === action.payload.id);
        if (index !== -4) {
          state.quangtruongslider4[index] = action.payload;
        }
      });
  },
});

export default quangtruongslider4Slice.reducer;
