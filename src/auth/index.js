import React, { createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { EnqueueSnackbar, enqueueSnackbar } from 'notistack';
import api from '../api';

const AuthContext = createContext();
console.log('create AuthContext: ' + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  GET_LOGGED_IN: 'GET_LOGGED_IN',
  REGISTER_USER: 'REGISTER_USER',
  LOGIN_USER: 'LOGIN_USER',
  LOGOUT_USER: 'LOGOUT_USER',
};

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
    error: false,
    errorMsg: null,
  });
  const history = useHistory();

  useEffect(() => {
    console.log('Auth User Effect');
    auth.getLoggedIn();
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          error: false,
          errorMsg: null,
          // guest: auth.guest,
        });
      }
      case AuthActionType.LOGIN_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          error: false,
          errorMsg: null,
          // guest: false,
        });
      }
      case AuthActionType.LOGOUT_USER: {
        return setAuth({
          user: null,
          loggedIn: false,
          error: false,
          errorMsg: null,
          // guest: false,
        });
      }
      default:
        return auth;
    }
  };

  auth.getLoggedIn = async function () {
    try {
      const response = await api.getLoggedIn();
      console.log(response);
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.GET_LOGGED_IN,
          payload: {
            loggedIn: response.data.loggedIn,
            user: response.data.user,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  auth.registerUser = async function (userData, store) {
    try {
      const response = await api.registerUser(userData);
      if (response.status === 200) {
        history.push('/');
      }
    } catch (err) {
      // store.showErr(err.response.status, err.response.data.errorMessage);
      enqueueSnackbar(err.response.data.errorMessage, {
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  };

  auth.loginUser = async function (userData, store) {
    try {
      const response = await api.loginUser(userData);
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.LOGIN_USER,
          payload: {
            user: response.data.user,
          },
        });
        store.loadMapCards();
        history.push('/home');
      }
    } catch (err) {
      enqueueSnackbar(err.response.data.errorMessage, {
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  };

  auth.forgotPassword = async function (userData, store) {
    try {
      const response = await api.forgotPassword(userData);
      if (response.status === 200) {
        history.push('/');
      } else {
        enqueueSnackbar('Could not reset Password', {
          variant: 'error',
          autoHideDuration: 5000,
        });
      }
    } catch (err) {
      // store.showErr(err.response.status, err.response.data.errorMessage);
      enqueueSnackbar(err.response.data.errorMessage, {
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  };

  auth.changePassword = async function (userData, store) {
    try {
      const response = await api.changePassword(userData);
      if (response.status === 200) {
        history.push('/');
      }
    } catch (err) {
      // store.showErr(err.response.status, err.response.data.errorMessage);
      enqueueSnackbar(err.response.data.errorMessage, {
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  };

  auth.logoutUser = async function (store) {
    try {
      const response = await api.logoutUser();
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.LOGOUT_USER,
          payload: {},
        });
        history.push('/');
      }
    } catch (err) {}
  };

  auth.fakeLogin = async function () {
    setAuth({
      user: { firstName: 'Atlas', lastName: 'Craft' },
      loggedIn: true,
    });
    history.push('/home');
  };
  return (
    <AuthContext.Provider
      value={{
        auth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
