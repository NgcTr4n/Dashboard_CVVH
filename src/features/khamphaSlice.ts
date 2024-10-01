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
import { db } from "../services/firebase";

// Thunk to delete data by id
export const deleteData = createAsyncThunk(
  "khampha/deleteData",
  async (id: string) => {
    await deleteDoc(doc(db, "khampha", id)); // Xóa tài liệu từ Firestore
    return id; // Trả về id đã xóa
  }
);

// Thunk to upload data without images to Firebase
export const uploadData = createAsyncThunk(
  "khampha/uploadData",
  async (payload: {
    label_id: number;
    top: string;
    left: string;
    label: string;
    description: string;
  }) => {
    const { label_id, top, left, label, description } = payload;

    // Save data to Firestore
    const docRef = await addDoc(collection(db, "khampha"), {
      label_id,
      top,
      left,
      label,
      description,
    });

    // Return the newly added data from Firestore
    return {
      id: docRef.id,
      label_id,
      top,
      left,
      label,
      description,
    };
  }
);
export const updateData = createAsyncThunk(
  "khampha/updateData",
  async (payload: {
    id: string;
    label_id: number;
    top: string;
    left: string;
    label: string;
    description: string;
  }) => {
    const { id, label_id, top, left, label, description } = payload;

    // Tạo đối tượng cập nhật ban đầu không có imageUrl
    let updatedData: {
      label_id: number;
      top: string;
      left: string;
      label: string;
      description: string;
    } = { label_id, top, left, label, description };


    // Cập nhật tài liệu trong Firestore
    const docRef = doc(db, "khampha", id);
    await updateDoc(docRef, updatedData);

    return { id, ...updatedData }; // Trả về dữ liệu đã cập nhật, bao gồm cả imageUrl (nếu có)
  }
);

// Define the KhamPha interface with the new structure
interface KhamPha {
  id: string; // Unique identifier
  label_id: number; // Numeric identifier for the label
  top: string; // Position from the top (percentage or pixel)
  left: string; // Position from the left (percentage or pixel)
  label: string; // The label text
  description: string; // Description for the kham pha
}

// Define the state interface for KhamPha
interface KhamPhaState {
  khampha: KhamPha[]; // Array of KhamPha objects
  loading: boolean;
  error: string | null;
}

// Initial state for KhamPha
const initialState: KhamPhaState = {
  khampha: [],
  loading: false,
  error: null,
};

// Thunk to fetch KhamPha data from Firestore
export const fetchKhamPha = createAsyncThunk<KhamPha[]>(
  "khampha/fetchKhamPha",
  async () => {
    const querySnapshot = await getDocs(collection(db, "khampha"));
    const khampha: KhamPha[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id từ Firestore
      ...doc.data(),
    })) as KhamPha[];
    return khampha;
  }
);

// Create the slice for KhamPha
const khamphaSlice = createSlice({
  name: "khampha",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadData.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadData.fulfilled, (state, action) => {
        state.khampha.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadData.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload data";
        state.loading = false;
      })
      .addCase(fetchKhamPha.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKhamPha.fulfilled, (state, action) => {
        state.khampha = action.payload; // Cập nhật tất cả dữ liệu
        state.loading = false;
      })
      .addCase(fetchKhamPha.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.loading = false;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Xóa mục khỏi state
        state.khampha = state.khampha.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(updateData.fulfilled, (state, action) => {
        // Cập nhật mục đã chỉnh sửa trong state
        const index = state.khampha.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.khampha[index] = action.payload;
        }
      });
  },
});

// Export the reducer
export default khamphaSlice.reducer;
