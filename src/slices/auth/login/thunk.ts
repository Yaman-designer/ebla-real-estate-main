//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
} from "../../../helpers/fakebackend_helper";
import { login as espoLogin } from "../../../helpers/espocrm/authService";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';

export const loginUser = (user: any, history: any) => async (dispatch: any) => {
  try {
    let response;
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.loginUser(
        user.email,
        user.password
      );
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = postJwtLogin({
        email: user.email,
        password: user.password
      });
    } else if (process.env.REACT_APP_DEFAULTAUTH === "espocrm") {
      // EspoCRM authentication
      const espoResponse = await espoLogin(user.email, user.password);
      // Store full user data for Redux state
      localStorage.setItem("authUser", JSON.stringify(espoResponse.user));
      dispatch(loginSuccess(espoResponse.user));
      history("/dashboard");
      return;
    } else if (process.env.REACT_APP_DEFAULTAUTH) {
      response = postFakeLogin({
        email: user.email,
        password: user.password,
      });
    }

    var data = await response;

    if (data) {
      localStorage.setItem("authUser", JSON.stringify(data));
      if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
        var finallogin: any = JSON.stringify(data);
        finallogin = JSON.parse(finallogin);
        data = finallogin.data;
        if ((finallogin.status === "success") || (finallogin.username && finallogin.password)) {
          dispatch(loginSuccess(data));
          history("/dashboard");
        } else {
          history("/login");
          dispatch(apiError(finallogin));
        }
      } else {
        dispatch(loginSuccess(data));
        history("/dashboard");
      }
    }
  } catch (error: any) {
    let message = "An error occurred during login";
    if (error.response) {
      // Axios error with response
      if (error.response.status === 401) {
        message = "Invalid username or password";
      } else if (error.response.data) {
        message = typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data);
      } else {
        message = `Server error: ${error.response.status}`;
      }
    } else if (error.message) {
      message = error.message;
    }
    dispatch(apiError(message));
  }
};


export const logoutUser = () => async (dispatch: any) => {
  try {
    localStorage.removeItem("authUser");
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else if (process.env.REACT_APP_DEFAULTAUTH === "espocrm") {
      // Clear all EspoCRM cached data
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUsername");
      localStorage.removeItem("espoSettings");
      localStorage.removeItem("userPreferences");
      dispatch(logoutUserSuccess(true));
    } else {
      dispatch(logoutUserSuccess(true));
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type: any, history: any) => async (dispatch: any) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
    //   response = postSocialLogin(data);
    // }

    const socialdata = await response;
    if (socialdata) {
      localStorage.setItem("authUser", JSON.stringify(socialdata));
      dispatch(loginSuccess(socialdata));
      history('/dashboard');
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch: any) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};