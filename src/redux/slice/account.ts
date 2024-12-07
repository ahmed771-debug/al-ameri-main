import { getApi } from "@/utils/apis";
import { URLS } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const fetchAccountType = createAsyncThunk(
  "profile/fetchAccountType",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("access_token");

    try {
      const response = await getApi(URLS.ACCOUNT_TYPE, {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      });

      return response?.data?.account_type;
    } catch (error: any) {
      // Use rejectWithValue to return a custom error payload
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);
interface AccountState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  data: string; // Explicitly define data as a string array
}
const initialState: AccountState = {
  isLoading: false,
  isError: false,
  errorMessage: "",
  data: "", // Initial value is an empty string array
};
// Create the slice
const account = createSlice({
  name: "accountType",
  initialState,
  reducers: {
    // Action to clear only the data field
    clearAccountType: (state: any) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccountType.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.isError = false;
      state.errorMessage = ""; // Clear error message on success
    });
    builder.addCase(fetchAccountType.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = "";
    });
    builder.addCase(fetchAccountType.rejected, (state: any, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload || "An error occurred";
      console.error("Trainer fetching Error:", action.payload);
    });
  },
});
export const { clearAccountType } = account.actions;
export default account.reducer;
