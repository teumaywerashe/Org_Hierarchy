import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Position, CreatePositionPayload, UpdatePositionPayload } from '@/types/position';
import { positionService } from '@/services/positionService';

interface PositionState {
  tree: Position[];
  flat: Position[];
  selected: Position | null;
  loading: boolean;
  error: string | null;
}

const initialState: PositionState = {
  tree: [],
  flat: [],
  selected: null,
  loading: false,
  error: null,
};

export const fetchTree = createAsyncThunk('positions/fetchTree', async () => {
  return positionService.getTree();
});

export const fetchFlat = createAsyncThunk('positions/fetchFlat', async () => {
  return positionService.getAll();
});

export const fetchOne = createAsyncThunk('positions/fetchOne', async (id: string) => {
  return positionService.getOne(id);
});

export const createPosition = createAsyncThunk(
  'positions/create',
  async (data: CreatePositionPayload) => positionService.create(data),
);

export const updatePosition = createAsyncThunk(
  'positions/update',
  async ({ id, data }: { id: string; data: UpdatePositionPayload }) =>
    positionService.update(id, data),
);

export const deletePosition = createAsyncThunk(
  'positions/delete',
  async (id: string) => {
    await positionService.remove(id);
    return id;
  },
);

const positionSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<Position | null>) {
      state.selected = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchTree
    builder.addCase(fetchTree.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchTree.fulfilled, (state, action) => {
      state.loading = false;
      state.tree = action.payload;
    });
    builder.addCase(fetchTree.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch tree';
    });
    // fetchFlat
    builder.addCase(fetchFlat.fulfilled, (state, action) => {
      state.flat = action.payload;
    });
    // fetchOne
    builder.addCase(fetchOne.fulfilled, (state, action) => {
      state.selected = action.payload;
    });
    // create


    // RTK
    // TUNK
    
    builder.addCase(createPosition.pending, (state) => { state.loading = true; });
    builder.addCase(createPosition.fulfilled, (state) => { state.loading = false; });
    builder.addCase(createPosition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create position';
    });
    // update
    builder.addCase(updatePosition.pending, (state) => { state.loading = true; });
    builder.addCase(updatePosition.fulfilled, (state) => { state.loading = false; });
    builder.addCase(updatePosition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update position';
    });
    // delete
    builder.addCase(deletePosition.pending, (state) => { state.loading = true; });
    builder.addCase(deletePosition.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(deletePosition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete position';
    });
  },
});

export const { setSelected, clearError } = positionSlice.actions;
export default positionSlice.reducer;
