import { getApi } from "@/utils/apis";
import { URLS } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Define the thunk to fetch trainers
export const fetchTrainers = createAsyncThunk(
  "trainers/fetchTrainers",
  async (_, { rejectWithValue }) => {
    // const token = Cookies.get("access_token");
    const token = Cookies.get("access_token");

    try {
      const response = await getApi(URLS.TRAINERS);

      return response?.data?.results;
    } catch (error: any) {
      // Use rejectWithValue to return a custom error payload
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

// Create the slice
const trainersSlice = createSlice({
  name: "trainers",
  initialState: {
    isLoading: false,
    isError: false,
    errorMessage: "",
    data: [],
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrainers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.isError = false;
      state.errorMessage = ""; // Clear error message on success
    });
    builder.addCase(fetchTrainers.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(fetchTrainers.rejected, (state: any, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload || "An error occurred";
      console.error("Trainer fetching Error:", action.payload);
    });
  },
  reducers: {},
});

export default trainersSlice.reducer;
