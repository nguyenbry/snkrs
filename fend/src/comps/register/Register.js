import React, { useEffect, useRef, useState } from "react";
import Nav from "../nav/Nav";
import Fragment from "../common/Fragment";
import Loading from "../common/Loading";
import Between from "../common/Between";
import { AlertTop, useAlert, ALERT_COLOR } from "../common/AlertTop";
import { register } from "../../api/fetcher";
import { handleReponse } from "../../api/response";

function DiscordCardAndForm({ discord, submit }) {
  const [emailOptions, setHasSelected] = useState(false);

  const [email, setEmail] = useState("");
  const emailRef = useRef();
  const pw1Ref = useRef();
  const pw2Ref = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const pw1 = pw1Ref.current.value;
    const pw2 = pw2Ref.current.value;

    // the parent calls it actually
    submit(email, pw1, pw2);
  };

  return (
    <Fragment>
      <div className="w-full flex justify-center items-center">
        <div class="form-control w-full max-w-xs mr-4">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            defaultValue={discord.email}
            ref={emailRef}
            type="text"
            class="input input-bordered w-full max-w-xs"
          />

          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            ref={pw1Ref}
            type="password"
            class="input input-bordered w-full max-w-xs"
          />
          <label class="label">
            <span class="label-text">Password (confirm)</span>
          </label>
          <input
            ref={pw2Ref}
            type="password"
            class="input input-bordered w-full max-w-xs"
          />
        </div>
        <div class="card w-96 bg-primary text-primary-content ml-4">
          <div class="card-body pb-4">
            <Between>
              <h2 class="card-title">{"@" + discord.username}</h2>
              <div class="avatar">
                <div class="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={`https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}`}
                  />
                </div>
              </div>
            </Between>
            <p>
              Your Discord account is linked to extend these services to Discord
            </p>
            {/* <p>Choose what email to use for this site</p>
          <input type="text" defaultValue={discord.email} onChange={({ target: { value }}) => {
            console.log(value);
            setEmail(value);
          }} class="input input-bordered w-full max-w-xs" />
          <div class="card-actions">
            <button className="btn w-full">
              Use this email
            </button>
          </div> */}
            <div class="card-actions mt-3">
              <button onClick={handleSubmit} className="btn w-full">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function Register() {
  const [loading, setLoading] = useState(true);
  const [discord, setDiscord] = useState();
  const [alert, setAlert] = useState(null);
  const displayAlert = useAlert(setAlert);

  useEffect(() => {
    // passed in by discord redirect
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
    ];

    if (!accessToken) {
      // they have not connected their Discord yet
      setLoading(false);
    } else {
      // LOGGED IN
      // Get Discord
      fetch("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${tokenType} ${accessToken}`,
        },
      })
        .then((result) => result.json())
        .then((data) => {
          console.log("got user", data);
          setDiscord(data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  }, []);

  const submit = (email, pw1, pw2) => {
    handleReponse(
      () => register(email, pw1, pw2, discord.id, discord.avatar),
      (res) => {
        res.json().then((data) => {
          displayAlert(data.message, ALERT_COLOR.GREEN);
          // TODO redirect to login page
        });
      },
      (res) => {
        res.json().then((data) => {
          displayAlert(data.error, ALERT_COLOR.RED);
        });
      },
      201
    );
  };

  return (
    <Fragment>
      <Nav />
      <AlertTop alert={alert} />
      <div className="flex justify-center min-h-[70%] items-center">
        <Loading show={!loading && !discord}>
          <div className="flex justify-center w-[30%]">
            <button
              onClick={() =>
                (window.location.href =
                  "https://discord.com/api/oauth2/authorize?client_id=806183406216019998&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=token&scope=identify%20email%20guilds%20guilds.join")
              }
              type="submit"
              className="w-full btn btn-primary mt-5"
            >
              Link Discord
            </button>
          </div>
        </Loading>
        <Loading show={!loading && !!discord}>
          <DiscordCardAndForm discord={discord} submit={submit} />
        </Loading>
      </div>
    </Fragment>
  );
}

export default Register;
