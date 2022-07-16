import React, { useRef, useState } from "react";
import Fragment from "../common/Fragment";
import Nav from "../nav/Nav";
import { login } from "../../api/fetcher";
import { AlertTop, useAlert, ALERT_COLOR } from "../common/AlertTop";
import { handleReponse } from "../../api/response";
import { LOCAL_STORAGE_TOKEN_KEY } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

function Login() {
  const emailRef = useRef("");
  const pwRef = useRef("");
  const [alert, setAlert] = useState(null);
  const displayAlert = useAlert(setAlert);
  const { user, applyLogin } = useAuth();
  const NAV = useNavigate();

  const submit = (e) => {
    e.preventDefault();

    login(emailRef.current.value, pwRef.current.value)
      .then((res) => res.json())
      .then((data) => {
        console.log("logged in response", data);
        applyLogin(data.accessToken, data.refreshToken, () =>
          NAV("/dashboard")
        );
      })

    // handleReponse(
    //   () => login(emailRef.current.value, pwRef.current.value),
    //   (res) => {
    //     res.json().then((data) => {
    //       const accessToken = data.accessToken;

    //       // store token in localStorage for later as well as give it to AuthContext
    //       localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, accessToken);
    //       displayAlert("Login successful", ALERT_COLOR.GREEN);
    //       // TODO redirect to dashboard
    //     });
    //   },
    //   (res) => {
    //     res.json().then((data) => {
    //       displayAlert(data.error, ALERT_COLOR.RED);
    //     });
    //   },
    //   200
    // );
  };

  return (
    <Fragment>
      <Nav />
      <AlertTop alert={alert} />
      <div class="form-control w-full min-h-[70%] justify-center items-center">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          ref={emailRef}
          type="text"
          class="input input-bordered w-full max-w-xs"
        />

        <label class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          ref={pwRef}
          type="password"
          class="input input-bordered w-full max-w-xs"
        />
        <button
          onClick={submit}
          type="submit"
          className="w-[30%] btn btn-primary mt-5"
        >
          Login
        </button>
      </div>
      <AlertTop />
    </Fragment>
  );
}

export default Login;
