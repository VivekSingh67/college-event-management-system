/**
 * useAuth hook — Redux-backed.
 *
 * Provides the same API surface as before (user, loading, login, register, logout)
 * so all existing consumers (Dashboard, ProfilePage, etc.) require ZERO changes.
 *
 * Internally, this reads from Redux store and dispatches auth thunks.
 */
import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  logoutUser,
  selectUser,
  selectAuthLoading,
} from "@/redux/slices/authSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);

  /**
   * Login — dispatches Redux thunk.
   * Returns { success: boolean } for backwards-compatible consumers (Login.jsx).
   */
  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      return { success: true };
    }
    return { success: false, message: result.payload };
  };

  /**
   * Register — dispatches Redux thunk.
   * Returns { success: boolean } for backwards-compatible consumers (Register.jsx).
   * Always forces role="student".
   */
  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      return { success: true };
    }
    return { success: false, message: result.payload };
  };

  /**
   * Logout — dispatches Redux thunk.
   */
  const logout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
