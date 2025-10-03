import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getStoredUser = () => {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  const parsed = JSON.parse(stored);
  const now = Date.now();

  if (parsed.expiresAt && now > parsed.expiresAt) {
    localStorage.clear();
    return null; // expired
  }
  return parsed;
};

const initialState = {
  user: getStoredUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userData, token } = action.payload;

      if (!token || typeof token !== "string") {
        console.error("Invalid token in setUser:", token);
        return;
      }

      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000;

      const userWithExpiry = { ...userData, token, expiresAt };

      state.user = userWithExpiry;
      localStorage.setItem("user", JSON.stringify(userWithExpiry));
    },

    logOut: (state) => {
      state.user = null;
      localStorage.clear();
    },
    updateUser: (state, action) => {
      const updatedUser = { ...state.user, ...action.payload };
      state.user = updatedUser;
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
  },
});

export const { setUser, logOut, updateUser } = authSlice.actions;
export default authSlice.reducer;
