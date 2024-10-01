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
export const deleteData1 = createAsyncThunk(
  "thucvat/deleteData1",
  async (id: string) => {
    await deleteDoc(doc(db, "thucvat", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk để upload dữ liệu (bao gồm hình ảnh) lên Firebase
export const uploadDataWithImage1 = createAsyncThunk(
  "thucvat/uploadDataWithImage1",
  async (payload: {
    file: File;
    title: string;
    description: string;
    date: string;
  }) => {
    const { file, title, description, date } = payload;

    // Upload hình ảnh lên Firebase Storage
    const storageRef = ref(storage, `thucvat/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Lưu dữ liệu (bao gồm URL hình ảnh) vào Firestore
    const docRef = await addDoc(collection(db, "thucvat"), {
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
export const updateData1 = createAsyncThunk(
  "thucvat/updateData",
  async (payload: { id: string; title: string; description: string;date:string; file?: File }) => {
    const { id, title, description,date, file } = payload;

    // Tạo đối tượng cập nhật ban đầu không có imageUrl
    let updatedData: { title: string; description: string; date:string; imageUrl?: string } = { title, description,date };

    // Nếu có tệp mới, cập nhật cả hình ảnh
    if (file) {
      const storageRef = ref(storage, `thucvat/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.imageUrl = downloadURL; // Chỉ thêm imageUrl khi có tệp mới
    }

    // Cập nhật tài liệu trong Firestore
    const docRef = doc(db, "thucvat", id);
    await updateDoc(docRef, updatedData);

    return { id, ...updatedData }; // Trả về dữ liệu đã cập nhật, bao gồm cả imageUrl (nếu có)
  }
);


interface Thucvat {
  id: string; // Thêm id vào kiểu dữ liệu
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

interface ThucvatfooterState {
  thucvat: Thucvat[];
  loading: boolean;
  error: string | null;
}

const initialState: ThucvatfooterState = {
  thucvat: [],
  loading: false,
  error: null,
};

// Thunk để lấy dữ liệu từ Firestore
export const fetchThucvat = createAsyncThunk<Thucvat[]>(
  "thucvat/fetchThucvat",
  async () => {
    const querySnapshot = await getDocs(collection(db, "thucvat"));
    const thucvat: Thucvat[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...(doc.data() as Omit<Thucvat, "id">), // Đảm bảo kiểu dữ liệu chính xác
    }));
    return thucvat;
  }
);

const thucvatSlice = createSlice({
  name: "thucvat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage1.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage1.fulfilled, (state, action) => {
        state.thucvat.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage1.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchThucvat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThucvat.fulfilled, (state, action) => {
        state.thucvat = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchThucvat.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData1.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.thucvat = state.thucvat.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(updateData1.fulfilled, (state, action) => {
        // Cập nhật mục đã chỉnh sửa trong state
        const index = state.thucvat.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.thucvat[index] = action.payload;
        }
      });
  },
});

export default thucvatSlice.reducer;
