import { getApi } from "@/utils/apis";
import { URLS } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface IPayload {
  page: number;
  limit: number;
  url: any;
}

export const fetchSearch = createAsyncThunk(
  "fetchSearch",
  async (payload: IPayload) => {
    try {
      const token = Cookies.get("access_token");
      let _url =
        URLS.GET_GALLERY +
        `?limit=${payload.limit}&offset=${payload.page * 20}`;
      const galleryResponse = await getApi(_url, {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      });

      return galleryResponse?.data;
    } catch (error) {
      throw error;
    }
  }
);

const searchSlice = createSlice({
  name: "gallery",
  initialState: {
    isLoading: false,
    isError: false,
    errorMessage: "",
    data: [],
    count: 0,
    next: null,
    previous: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearch.fulfilled, (state: any, action) => {
      const { count, next, previous, results } = action.payload;

      state.isLoading = false;
      state.data = [...state.data, ...results];
      state.count = count;
      state.next = next;
      state.previous = previous;
      state.isError = false;
    });
    builder.addCase(fetchSearch.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchSearch.rejected, (state: any, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.error.message;
      console.error("Trainer fetching Error:", action.payload);
    });
  },
  reducers: {},
});

export default searchSlice.reducer;
