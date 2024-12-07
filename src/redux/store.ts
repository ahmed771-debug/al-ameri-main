import { configureStore } from "@reduxjs/toolkit";
import trainerReducer from "./slice/trainer";
import programsReducer from "./slice/programs";
import programsMonthSlice from "./slice/months";
import gallerySlice from "./slice/gallery";
import searchSlice from "./slice/search";
import subscriptionSlice from "./slice/subscription";
import accountSlice from "./slice/account";

export const store = configureStore({
  reducer: {
    Trainers: trainerReducer,
    Programs: programsReducer,
    ProgramsMonths: programsMonthSlice,
    Gallery: gallerySlice,
    Search: searchSlice,
    getSubscription: subscriptionSlice,
    AccountType: accountSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
