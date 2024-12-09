import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

interface ColumnNameState {
  firstColumn: string;
  secondColumn: string;
  thirdColumn: string;
}

interface ModalState {
  roomID: string;
  columns: ColumnNameState;
}

const initialState: ModalState = {
  roomID: '',
  columns: {
    firstColumn: '',
    secondColumn: '',
    thirdColumn: '',
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setRoomID: (state, action: PayloadAction<string>) => {
      state.roomID = action.payload;
    },
    setcolumnsName: (state, action: PayloadAction<{ roomID: string; columns: ColumnNameState }>) => {
      const { roomID, columns } = action.payload; // roomID ve columns'u al
      state.columns = columns;
      state.roomID = roomID;

      const docRef = doc(db, roomID, "columns");
      setDoc(docRef, { columns })
    },
  },
});

export const { setcolumnsName, setRoomID } = modalSlice.actions;
export default modalSlice.reducer;
