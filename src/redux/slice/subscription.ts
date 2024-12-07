import { getApi, getSubs } from "@/utils/apis";
import { URLS } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Define the thunk to fetch trainers
export const fetchSubscription = createAsyncThunk(
  "subscription/fetchSubscription",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("access_token");

    try {
      const response = await getSubs(URLS.GET_SUBSCRIPTION, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data;
    } catch (error: any) {
      // Use rejectWithValue to return a custom error payload
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

// Create the slice
const subscriptionSlice = createSlice({
  name: "getSubscription",
  initialState: {
    isLoading: false,
    isError: false,
    errorMessage: "",
    data: [],
  },
  reducers: {
    // Action to clear only the data field
    clearData: (state: any) => {
      state.data = [];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchSubscription.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.isError = false;
      state.errorMessage = ""; // Clear error message on success
    });
    builder.addCase(fetchSubscription.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(fetchSubscription.rejected, (state: any, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload || "An error occurred";
      console.error("Trainer fetching Error:", action.payload);
    });
  },
});
export const { clearData } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
