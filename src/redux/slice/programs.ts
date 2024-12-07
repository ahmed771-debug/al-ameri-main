import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "@/utils/apis";
import { URLS } from "@/utils/constants";
import Cookies from "js-cookie";

// Define the thunk to fetch trainers
export const fetchTrainerPrograms = createAsyncThunk(
  "programs/fetchTrainerPrograms",
  async (trainerId: number, { rejectWithValue }) => {
    // const token = Cookies.get("access_token");
    const token = localStorage.getItem("access_token");

    try {
      const response = await getApi(`${URLS.PROGRAMS}/?owner=${trainerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        trainerId,
        programs: response?.data?.results,
      };
    } catch (error: any) {
      // Use rejectWithValue to return a custom error payload
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

// Create the slice
const programsSlice = createSlice({
  name: "programs",
  initialState: {
    isLoading: false,
    isError: false,
    errorMessage: "",
    data: {} as Record<number, any[]>, // Mapping trainerId to their programs
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrainerPrograms.fulfilled, (state, action) => {
      state.isLoading = false;
      const { trainerId, programs } = action.payload;
      state.data[trainerId] = programs; // Store programs under the trainerId
      state.isError = false;
      state.errorMessage = ""; // Clear error message on success
    });
    builder.addCase(fetchTrainerPrograms.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(fetchTrainerPrograms.rejected, (state: any, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload || "An error occurred";
      console.error("Trainer Programs fetching Error:", action.payload);
    });
  },
  reducers: {},
});

export default programsSlice.reducer;
