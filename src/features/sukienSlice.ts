// src/features/dataSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";

export const deleteData = createAsyncThunk(
  "watershow/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "watershow", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);
// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "watershow/uploadDataWithImage",
  async (payload: {
    file: File;
    title: string;
    description: string;
    link: string;
    date: string;
  }) => {
    const { file, title, description, link, date } = payload;

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `watershow/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Save data (including image URL) to Firestore
    const docRef = await addDoc(collection(db, "watershow"), {
      title,
      description,
      link,
      date,
      imageUrl: downloadURL,
    });

    // Return the newly added data from Firestore
    return {
      id: docRef.id,
      title,
      description,
      link,
      date,
      imageUrl: downloadURL,
    };
  }
);
export const updateData = createAsyncThunk(
  "watershow/updateData",
  async (payload: { id: string; title: string; description: string;link:string; date:string; file?: File }) => {
    const { id, title, description,date,link, file } = payload;

    // Tạo đối tượng cập nhật ban đầu không có imageUrl
    let updatedData: { title: string; description: string;link:string; date:string; imageUrl?: string } = { title, description,date,link };

    // Nếu có tệp mới, cập nhật cả hình ảnh
    if (file) {
      const storageRef = ref(storage, `watershow/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.imageUrl = downloadURL; // Chỉ thêm imageUrl khi có tệp mới
    }

    // Cập nhật tài liệu trong Firestore
    const docRef = doc(db, "watershow", id);
    await updateDoc(docRef, updatedData);

    return { id, ...updatedData }; // Trả về dữ liệu đã cập nhật, bao gồm cả imageUrl (nếu có)
  }
);



interface Watershow {
  id: string; // Thêm trường id
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  date: string;
}

interface WatershowState {
  watershow: Watershow[]; // Đổi về kiểu Watershow[]
  loading: boolean;
  error: string | null;
}

const initialState: WatershowState = {
  watershow: [],
  loading: false,
  error: null,
};

export const fetchWatershows = createAsyncThunk<Watershow[]>(
  'watershow/fetchWatershows',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'watershow'));
    const watershow: Watershow[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...doc.data(),
    })) as Watershow[];
    return watershow;
  }
);

const watershowSlice = createSlice({
  name: "watershow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.watershow.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchWatershows.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWatershows.fulfilled, (state, action) => {
        state.watershow = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchWatershows.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.watershow = state.watershow.filter(item => item.id !== action.payload);
      })
      .addCase(updateData.fulfilled, (state, action) => {
        // Cập nhật mục đã chỉnh sửa trong state
        const index = state.watershow.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.watershow[index] = action.payload;
        }
      });
  },
});

export default watershowSlice.reducer;
