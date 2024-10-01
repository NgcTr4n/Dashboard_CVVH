// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
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
export const updateData3 = createAsyncThunk(
  "quangtruongslider3/updateData",
  async (payload: { id: string; description: string; file?: File }) => {
    const { id, description, file } = payload;

    // Tạo đối tượng cập nhật ban đầu không có imageUrl
    let updatedData: {  description: string; imageUrl?: string } = { description };

    // Nếu có tệp mới, cập nhật cả hình ảnh
    if (file) {
      const storageRef = ref(storage, `quangtruongslider3/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.imageUrl = downloadURL; // Chỉ thêm imageUrl khi có tệp mới
    }

    // Cập nhật tài liệu trong Firestore
    const docRef = doc(db, "quangtruongslider3", id);
    await updateDoc(docRef, updatedData);

    return { id, ...updatedData }; // Trả về dữ liệu đã cập nhật, bao gồm cả imageUrl (nếu có)
  }
);

interface Quangtruongslider3 {
  id: string; // Thêm id vào kiểu dữ liệu
  description: string;
  imageUrl?: string;
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
      })
      .addCase(updateData3.fulfilled, (state, action) => {
        // Cập nhật mục đã chỉnh sửa trong state
        const index = state.quangtruongslider3.findIndex(item => item.id === action.payload.id);
        if (index !== -3) {
          state.quangtruongslider3[index] = action.payload;
        }
      });
  },
});

export default quangtruongslider3Slice.reducer;
