import React, { useEffect, useRef } from "react"
import { useAuth } from "../auth/AuthContext"
import Nav from "../nav/Nav"
import Fragment from "../common/Fragment"
import { inventory as getConsignerData } from "../../api/fulltrace/fulltrace"
import { applyConsigner } from "../../api/fetcher"

function Dashboard() {
  const { user } = useAuth()
  const emailRef = useRef("")
  const pwRef = useRef("")

  useEffect(() => {
    console.log("in dashboard, the user is", user)
  }, [user])

  const submit = () => {
    getConsignerData(emailRef.current.value, pwRef.current.value)
      .then((data) => {
        const { consignerId } = data
        console.log(consignerId)
        return applyConsigner(
          emailRef.current.value,
          pwRef.current.value,
          consignerId,
          user.accessToken
        )
      })
      .then((res) => {
        console.log("res", res)
      })
  }

  return (
    <Fragment>
      <Nav />
      <div>
        <span>fieruybhjknelmfiou</span>
        <span>{user ? JSON.stringify(user) : null}</span>
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
            Attach Consigner
          </button>
        </div>
      </div>
    </Fragment>
  )
}

export default Dashboard
