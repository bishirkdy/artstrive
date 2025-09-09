import { createSlice } from "@reduxjs/toolkit";

const profileModeSlice = createSlice({
    name: "profileMode",
    initialState: { forceProfileMode : null },
    reducers : {
        setForceProfileMode: (state, action) => {
            state.forceProfileMode = action.payload;
        }
    }
});
export const { setForceProfileMode } = profileModeSlice.actions;
export default profileModeSlice.reducer;