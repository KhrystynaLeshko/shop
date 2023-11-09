import { loginFailure, loginStart, loginSuccess, logout, resetUser } from "./userRedux";
import { publicRequest } from "../requestMethods";
import { resetCart } from "./cartRedux";

// LOGIN
export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

// LOGOUT
export const logoutUser = (dispatch,) => {
  // Clear any user-related data on the client-side if needed.
  localStorage.removeItem("accessToken");

  // Dispatch the resetUser action to reset the user state to its initial state
  dispatch(resetUser());

  // Dispatch the logout action to clear the user's login status
  dispatch(logout());

  // Manually clear the storage for the cart
  localStorage.removeItem("persist:root");

  // Dispatch the resetCart action to reset the cart state to its initial state
  dispatch(resetCart());
}