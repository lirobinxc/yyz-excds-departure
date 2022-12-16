import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RunwayId } from '../../data/sidsCollection';
import { FDE, genFdeData } from '../../functions/genFdeData';
import type { RootState } from '../store';

// Define the initial state using that type
function genFdeList(rwyId: RunwayId, count: number) {
  const defaultDepSequence: FDE[] = [];

  for (let i = 1; i <= count; i++) {
    defaultDepSequence.push(genFdeData(rwyId));
  }

  return defaultDepSequence;
}

const initialState = genFdeList(RunwayId['05, 06LR'], 6);

export const airboneList = createSlice({
  name: 'airborne',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addStrip: (state, action: PayloadAction<RunwayId>) => {
      state.push(genFdeData(action.payload));
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    deleteStrip: (state, action: PayloadAction<string>) => {
      console.log('Removed', action.payload);
      return state.filter((item) => item.acId !== action.payload);
    },
    refreshStrips: (
      state,
      action: PayloadAction<{ runwayId: RunwayId; count: number }>
    ) => {
      console.log('Refresh strips for', action.payload);
      return genFdeList(action.payload.runwayId, action.payload.count);
    },
  },
});

export const airborneListActions = airboneList.actions;
export const airborneListReducer = airboneList.reducer;

// Other code such as selectors can use the imported `RootState` type
export const selectAirborneList = (state: RootState) => state.airborneList;
