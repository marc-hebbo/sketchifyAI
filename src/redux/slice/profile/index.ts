import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    name : 'profile',
    initialState,
    reducers : {
        setProfile : (state, action: PayloadAction<AppProfile | null>) => {
            state.user = action.payload;
        },
        clearProfile(state){
            state.user = { id: null, name: "guest", email: null, image: null };
        },
    },
})


export const {setProfile, clearProfile} = slice.actions;
export default slice.reducer;
