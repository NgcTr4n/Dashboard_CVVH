// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk để xóa dữ liệu
export const deleteData = createAsyncThunk(
  "sukienslider/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "sukienslider", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage = createAsyncThunk(
  "sukienslider/uploadDataWithImage",
  async (payload: {
    file: File;
    title: string;
    description: string;
  }) => {
    const { file, title, description } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `sukienslider/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "sukienslider"), {
      title,
      description,
      imageUrl: downloadURL,
    });

    // Trả về dữ liệu mới được thêm vào từ Firestore
    return {
      id: docRef.id,
      title,
      description,
      imageUrl: downloadURL,
    };
  }
);
export const updateData = createAsyncThunk(
  "sukienslider/updateData",
  async (payload: { id: string; title: string; description: string; file?: File }) => {
    const { id, title, description, file } = payload;

    // Tạo đối tượng cập nhật ban đầu không có imageUrl
    let updatedData: { title: string; description: string; imageUrl?: string } = { title, description };

    // Nếu có tệp mới, cập nhật cả hình ảnh
    if (file) {
      const storageRef = ref(storage, `sukienslider/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.imageUrl = downloadURL; // Chỉ thêm imageUrl khi có tệp mới
    }

    // Cập nhật tài liệu trong Firestore
    const docRef = doc(db, "sukienslider", id);
    await updateDoc(docRef, updatedData);

    return { id, ...updatedData }; // Trả về dữ liệu đã cập nhật, bao gồm cả imageUrl (nếu có)
  }
);


interface SukienSlider {
  id: string; // Thêm id vào kiểu dữ liệu
  title: string;
  description: string;
  imageUrl?: string;
}

interface SukienSliderState {
  sukienslider: SukienSlider[];
  loading: boolean;
  error: string | null;
}

const initialState: SukienSliderState = {
  sukienslider: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchSukienSlider = createAsyncThunk<SukienSlider[]>(
  "sukienslider/fetchSukienSlider",
  async () => {
    const querySnapshot = await getDocs(collection(db, "sukienslider"));
    const sukienslider: SukienSlider[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<SukienSlider, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return sukienslider;
  }
);

const sukiensliderSlice = createSlice({
  name: "sukienslider",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.sukienslider.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchSukienSlider.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSukienSlider.fulfilled, (state, action) => {
        state.sukienslider = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchSukienSlider.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.sukienslider = state.sukienslider.filter(item => item.id !== action.payload);
      })
      .addCase(updateData.fulfilled, (state, action) => {
        // Cập nhật mục đã chỉnh sửa trong state
        const index = state.sukienslider.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.sukienslider[index] = action.payload;
        }
      });
  },
});

export default sukiensliderSlice.reducer;
