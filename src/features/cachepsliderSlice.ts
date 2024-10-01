// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

// Thunk để xóa dữ liệu
export const deleteData = createAsyncThunk(
  "cachepslider/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "cachepslider", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage = createAsyncThunk(
  "cachepslider/uploadDataWithImage",
  async (payload: {
    file: File;
    description: string;
  }) => {
    const { file, description } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `cachepslider/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "cachepslider"), {
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
export const updateData = createAsyncThunk(
  "cachepslider/updateData",
  async (payload: { id: string; title: string; description: string; file?: File }) => {
    const { id, title, description, file } = payload;

    // Tạo đối tượng cập nhật ban đầu không có imageUrl
    let updatedData: { title: string; description: string; imageUrl?: string } = { title, description };

    // Nếu có tệp mới, cập nhật cả hình ảnh
    if (file) {
      const storageRef = ref(storage, `cachepslider/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.imageUrl = downloadURL; // Chỉ thêm imageUrl khi có tệp mới
    }

    // Cập nhật tài liệu trong Firestore
    const docRef = doc(db, "cachepslider", id);
    await updateDoc(docRef, updatedData);

    return { id, ...updatedData }; // Trả về dữ liệu đã cập nhật, bao gồm cả imageUrl (nếu có)
  }
);



interface Cachepslider {
  id: string; // Thêm id vào kiểu dữ liệu
  description: string;
  imageUrl?: string;
}

interface CachepsliderState {
  cachepslider: Cachepslider[];
  loading: boolean;
  error: string | null;
}

const initialState: CachepsliderState = {
  cachepslider: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchCachepslider = createAsyncThunk<Cachepslider[]>(
  "cachepslider/fetchCachepslider",
  async () => {
    const querySnapshot = await getDocs(collection(db, "cachepslider"));
    const cachepslider: Cachepslider[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Cachepslider, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return cachepslider;
  }
);

const cachepsliderSlice = createSlice({
  name: "cachepslider",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.cachepslider.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchCachepslider.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCachepslider.fulfilled, (state, action) => {
        state.cachepslider = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchCachepslider.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.cachepslider = state.cachepslider.filter(item => item.id !== action.payload);
      })
      .addCase(updateData.fulfilled, (state, action) => {
        // Cập nhật mục đã chỉnh sửa trong state
        const index = state.cachepslider.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.cachepslider[index] = action.payload;
        }
      });
  },
});

export default cachepsliderSlice.reducer;
