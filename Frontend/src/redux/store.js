import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import eventReducer from "./slices/eventSlice";
import coreReducer from "./slices/coreSlice";

const store = configureStore({
  reducer: {
    auth:   authReducer,
    events: eventReducer,
    core:   coreReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;
