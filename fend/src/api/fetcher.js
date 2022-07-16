const base = "http://localhost:4000"

const GET = "GET"
const POST = "POST"
const DELETE = "DELETE"
const PUT = "PUT"

// wrappers around fetch to make it easier
function post(path, data, token) {
  const options = {
    method: POST,
    headers: {},
  }
  if (token) {
    options.headers.authorization = `Bearer ${token}`
  }

  if (data) {
    options.body = JSON.stringify(data)
    options.headers["Content-Type"] = "application/json"
  }
  console.log("options", options)
  return fetch(getFullEndpoint(path), options)
}

function get(path, token) {
  const options = {}
  if (token) {
    options.headers.authorization = `Bearer ${token}`
  }
  return fetch(getFullEndpoint(path), options)
}

function getFullEndpoint(path) {
  return base + path
}

export function register(email, pw1, pw2, discordId, discordAvatar) {
  const data = {
    email,
    pw1,
    pw2,
    discordId,
    avatar: discordAvatar,
  }
  return post("/register", data)

  // return post("/register", data);
}

export function applyConsigner(email, password, fulltraceConsignerId, token) {
  return post(
    `/consigner`,
    {
      email,
      password,
      consignerId: fulltraceConsignerId,
    },
    token
  )
}

export function login(email, password) {
  return post("/login", { email, password })
}
