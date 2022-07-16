import React, { useContext, useState, createContext, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { InvalidTokenError } from "jwt-decode";

export const LOCAL_STORAGE_TOKEN_KEY = "snkrsAccessToken";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    accessToken: null,
    refreshToken: null,
    user: null,
  });

  // const isAuthenticated = () => {};

  // // use this for when the current access token is expired
  // const getNewToken = (currToken) => {

  // };

  // useEffect(() => {
  //   // get the token from localstorage
  //   const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  //   if (!token) {
  //     setLoading(false);
  //   }

  //   // token exists, do some validation
  //   let decoded; // the user object
  //   try {
  //     decoded = jwt_decode(token);
  //   } catch (e) {
  //     if (e instanceof InvalidTokenError) {
  //       // here we should simply do nothing
  //       console.log("JWT token was invalid");
  //       return setLoading(false);
  //     } else {
  //       console.log("BIG BIG BIG BIG ERROR, we need to catch something else");
  //       console.log(typeof e);
  //       console.log(e.toString());
  //     }
  //   }

  //   console.log("decoded jwt", decoded);

  //   const expired = decode.exp < (Date.now() / 1000);

  //   if (expired) {

  //   }

  //   setAuthUser((currAuth) => ({ token, user: decoded.user }));
  //   setLoading(false);
  // });

  function applyLogin(accessToken, refreshToken, cb) {
    const decoded = jwt_decode(accessToken);
    console.log("decoded user", decoded);
    setUser({ user: decoded, accessToken, refreshToken });
    console.log("login set");

    return cb ? cb() : null;
  }

  return (
    <AuthContext.Provider value={{ user, applyLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
