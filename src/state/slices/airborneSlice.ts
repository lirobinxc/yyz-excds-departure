import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RunwayId } from '../../data/sidsCollection';
import { DepFDE, genDepFdeData } from '../../functions/genDepFdeData';
import { genSatFdeData } from '../../functions/genSatFdeData';
import type { RootState } from '../store';

// Define the initial state using that type
function genFdeList(
  rwyId: RunwayId,
  count: number,
  onlySatellites: boolean = false
) {
  const defaultDepSequence: DepFDE[] = [];

  for (let i = 1; i <= count; i++) {
    if (onlySatellites) {
      defaultDepSequence.push(genSatFdeData(rwyId));
      continue;
    }

    const num1to10 = _.random(1, 10);
    if (num1to10 > 9) {
      defaultDepSequence.push(genSatFdeData(rwyId));
      continue;
    }
    defaultDepSequence.push(genDepFdeData(rwyId));
  }

  return defaultDepSequence;
}

// Randomly adds Dep or Sat strip
function randomStrip(rwyId: RunwayId, onlySatellites: boolean) {
  if (onlySatellites) return genSatFdeData(rwyId);

  const num1to10 = _.random(1, 10);
  if (num1to10 > 9) return genSatFdeData(rwyId);

  return genDepFdeData(rwyId);
}

const initialState = genFdeList(RunwayId['05, 06LR'], 6);

export const airboneList = createSlice({
  name: 'airborne',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addStrip: (
      state,
      action: PayloadAction<{ rwyId: RunwayId; onlySatellites: boolean }>
    ) => {
      state.push(
        randomStrip(action.payload.rwyId, action.payload.onlySatellites)
      );
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    deleteStrip: (state, action: PayloadAction<string>) => {
      console.log('Removed', action.payload);
      return state.filter((item) => item.acId !== action.payload);
    },
    refreshStrips: (
      state,
      action: PayloadAction<{
        runwayId: RunwayId;
        count: number;
        onlySatellites: boolean;
      }>
    ) => {
      console.log('Refresh strips for', action.payload);
      return genFdeList(
        action.payload.runwayId,
        action.payload.count,
        action.payload.onlySatellites
      );
    },
  },
});

export const airborneListActions = airboneList.actions;
export const airborneListReducer = airboneList.reducer;

// Other code such as selectors can use the imported `RootState` type
export const selectAirborneList = (state: RootState) => state.airborneList;
