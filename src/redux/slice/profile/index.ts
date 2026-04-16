import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppProfile = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type ProfileState = {
  user: AppProfile | null;
  authResolved: boolean;
};

const initialState: ProfileState = {
  user: { id: null, name: "guest", email: null, image: null },
  authResolved: false,
};

const slice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AppProfile | null>) {
      state.user = action.payload;
      state.authResolved = true;
    },
    clearUser(state) {
      state.user = initialState.user;
      state.authResolved = true;
    },
    setAuthResolved(state, action: PayloadAction<boolean>) {
      state.authResolved = action.payload;
    },
  },
});

export const { setUser, clearUser, setAuthResolved } = slice.actions;

export default slice.reducer;
