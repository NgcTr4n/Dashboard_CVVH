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

export const deleteData = createAsyncThunk(
  "thucvat_card/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "thucvat_card", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);
// Thunk to upload data (including images) to Firebase
export const uploadDataWithImage = createAsyncThunk(
  "thucvat_card/uploadDataWithImage",
  async (payload: {
    file: File;
    title: string;
    description: string;
    link: string;
    date: string;
  }) => {
    const { file, title, description, link, date } = payload;

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `thucvat_card/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Save data (including image URL) to Firestore
    const docRef = await addDoc(collection(db, "thucvat_card"), {
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
  "thucvat_card/updateData",
  async (payload: {
    id: string;
    title: string;
    description: string;
    link: string;
    date: string;
    file?: File;
  }) => {
    const { id, title, description, link, date, file } = payload;

    // Tạo đối tượng cập nhật ban đầu không có imageUrl
    let updatedData: {
      title: string;
      description: string;
      link: string;
      date: string;
      imageUrl?: string;
    } = { title, description, date, link };

    // Nếu có tệp mới, cập nhật cả hình ảnh
    if (file) {
      const storageRef = ref(storage, `thucvat_card/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.imageUrl = downloadURL; // Chỉ thêm imageUrl khi có tệp mới
    }

    // Cập nhật tài liệu trong Firestore
    const docRef = doc(db, "thucvat_card", id);
    await updateDoc(docRef, updatedData);

    return { id, ...updatedData }; // Trả về dữ liệu đã cập nhật, bao gồm cả imageUrl (nếu có)
  }
);

interface ThucvatCard {
  id: string; // Thêm trường id
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  date: string;
}

interface ThucvatCardState {
  thucvatcard: ThucvatCard[]; // Đổi về kiểu ThucvatCard[]
  loading: boolean;
  error: string | null;
}

const initialState: ThucvatCardState = {
  thucvatcard: [],
  loading: false,
  error: null,
};

export const fetchThucvatCard = createAsyncThunk<ThucvatCard[]>(
  "thucvat_card/fetchThucvatCard",
  async () => {
    const querySnapshot = await getDocs(collection(db, "thucvat_card"));
    const thucvatcard: ThucvatCard[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...doc.data(),
    })) as ThucvatCard[];
    return thucvatcard;
  }
);

const thucvatcardSlice = createSlice({
  name: "thucvatcard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataWithImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDataWithImage.fulfilled, (state, action) => {
        state.thucvatcard.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadDataWithImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchThucvatCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThucvatCard.fulfilled, (state, action) => {
        state.thucvatcard = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchThucvatCard.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.thucvatcard = state.thucvatcard.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(updateData.fulfilled, (state, action) => {
        // Cập nhật mục đã chỉnh sửa trong state
        const index = state.thucvatcard.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.thucvatcard[index] = action.payload;
        }
      });
  },
});

export default thucvatcardSlice.reducer;
