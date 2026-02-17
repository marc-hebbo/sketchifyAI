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
  reducers: {},
});

export default slice.reducer;
