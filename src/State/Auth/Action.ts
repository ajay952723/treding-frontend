import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
} from "./ActionTypes";
import type { Dispatch } from "redux";

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = (userData: RegisterData) => async (dispatch: Dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const response = await axios.post("http://localhost:5454/auth/signup", userData);
    const data = response.data;

    alert("Registered successfully ✅");

    dispatch({
      type: REGISTER_SUCCESS,
      payload: {
        jwt: data.jwt,
        user: data.user,
      },
    });

    localStorage.setItem("user_jwt", data.jwt);
  } catch (error: any) {
    console.error("Registration error:", error);

    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.message || "Registration failed",
    });

    alert("Registration failed ❌");
  }
};

export const login = (userData: LoginData) => async (dispatch: Dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await axios.post("http://localhost:5454/auth/signin", userData);
    const data = response.data;

    alert("Login successfully ✅");

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        jwt: data.jwt,
        user: data.user,
      },
    });

    localStorage.setItem("user_jwt", data.jwt);
  } catch (error: any) {
    console.error("Login error:", error);

    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || "Login failed",
    });

    alert("Login failed ❌");
  }
};

export const getUser = (jwt: string) => async (dispatch: Dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  try {
    const response = await axios.get("http://localhost:5454/api/users/profile", {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    dispatch({
      type: GET_USER_SUCCESS,
      payload: response.data,
    });
  } catch (error: any) {
    dispatch({
      type: GET_USER_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch user",
    });

    alert("User fetch failed ❌");
  }
};
