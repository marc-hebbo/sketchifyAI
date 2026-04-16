import { createSlice } from "@reduxjs/toolkit";

export type AppProfile = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type ProfileState = { user: AppProfile | null };

const initialState: ProfileState = {
  user: { id: null, name: "guest", email: null, image: null },
};

const slice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action: { payload: AppProfile | null }) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = initialState.user;
    },
  },
});

export const { setUser, clearUser } = slice.actions;

export default slice.reducer;
