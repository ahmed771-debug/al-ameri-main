import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "@/utils/apis";
import { URLS } from "@/utils/constants";
import Cookies from "js-cookie";

// Define the thunk to fetch trainers
export const fetchProgramsMonths = createAsyncThunk(
  "programsMonths/fetchProgramsMonths",
  async (programId: number, { rejectWithValue }) => {
    // const token = Cookies.get("access_token");
    const token = localStorage.getItem("access_token");

    try {
      const response = await getApi(`${URLS.MONTHS}/?program=${programId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        programId,
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
const programsMonthSlice = createSlice({
  name: "programs",
  initialState: {
    isLoading: false,
    isError: false,
    errorMessage: "",
    data: {} as Record<number, any[]>, // Mapping trainerId to their programs
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProgramsMonths.fulfilled, (state, action) => {
      state.isLoading = false;
      const { programId, programs } = action.payload;
      state.data[programId] = programs; // Store programs under the trainerId
      state.isError = false;
      state.errorMessage = ""; // Clear error message on success
    });
    builder.addCase(fetchProgramsMonths.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(fetchProgramsMonths.rejected, (state: any, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload || "An error occurred";
      console.error("Trainer Programs fetching Error:", action.payload);
    });
  },
  reducers: {},
});

export default programsMonthSlice.reducer;
