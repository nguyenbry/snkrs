export async function inventory(email, password, format = true) {
  const [token, refresh] = await login(email, password)

  const consId = await getConsignerId(token)

  const inv = await getInventory(consId, token)

  const out = { inventory: format ? formatInv(inv) : inv, consignerId: consId }
  return out
}

function login(email, password) {
  const body = {
    email: email,
    password: password,
    returnSecureToken: true,
    tenantId: process.env.REACT_APP_TENANT_ID,
  }
  console.log("body", body)

  const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.REACT_APP_GOOGLE_API_KEY}`

  return fetch(url, {
    method: "POST",
    "Content-Type": "application/json",
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status !== 200) {
      return res.json().then((j) => {
        const error = j.error
        console.log("error", error)

        if (error == null) {
          throw new Error("Unable to parse inventory. Please try again later")
        }

        const msg = error.message

        if (msg == null) {
          throw new Error("Unable to parse inventory. Please try again later")
        }

        if (msg === "MISSING_EMAIL") {
          throw new Error("Email was not entered for login")
        } else if (msg === "INVALID_EMAIL") {
          throw new Error(`${email} is an invalid email`)
        } else if (msg === "MISSING_PASSWORD") {
          throw new Error("Password is required")
        } else if (
          msg === "PASSWORD_LOGIN_DISABLED" ||
          msg === "INVALID_PASSWORD"
        ) {
          throw new Error("Password is incorrect")
        } else if (msg?.includes?.("TOO_MANY_ATTEMPTS_TRY_LATER")) {
          throw new Error(
            "Access to this account has been temporarily disabled due to many failed login attempts. Try again later"
          )
        } else {
          throw new Error(
            "Unable to parse inventory. Please try again later or contact and admin"
          )
        }
      })
    } else {
      return res.json().then((j) => {
        return [j.idToken, j.refreshToken]
      })
    }
  })
}

function getConsignerId(token) {
  const url =
    "https://fulltrace-server.herokuapp.com/api/consigners/YWKGcfGjC7fS4SNagTrIkPjVI2O2"

  return fetch(url, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => data.id)
    .catch((e) => {
      throw new Error(e.toString())
    })
}

async function getInventory(consId, token) {
  const url = `https://fulltrace-server.herokuapp.com/api/inventories?location=undefined&subLocation=undefined&productId=undefined&category=&status=&search=&consigner=${consId}&option1Value=&option2Value=&option3Value=&printed=`

  const res = await fetch(url, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  return data
}

function roundPrice(price) {
  if (typeof price === "string") {
    return Number(Math.round(parseFloat(price) + "e" + 2) + "e-" + 2)
  } else {
    return Number(Math.round(price + "e" + 2) + "e-" + 2)
  }
}

function formatInv(arr) {
  return arr.map((item) => formatItem(item))
}

function formatItem(item) {
  const transform_options = [
    {
      key: "id",
      savekey: "itemId",
    },
    {
      key: "code",
      savekey: "code",
    },
    {
      key: "option1Value",
      savekey: "size",
    },
    {
      key: "location",
      savekey: "location",
    },
    {
      key: "price",
      savekey: "price",
      transform: roundPrice,
    },

    {
      key: "payout",
      savekey: "payout",
      transform: roundPrice,
    },
    {
      key: "status",
      savekey: "status",
    },
    {
      key: "acceptedOn",
      savekey: "acceptedAt",
    },
    {
      key: "consignerId",
      savekey: "consignerId",
      transform: (id_) => parseInt(id_),
    },
  ]

  const unwind = [
    {
      key: "product",
      transform: [
        {
          key: "id",
          savekey: "productId",
        },
        {
          key: "title",
        },
        {
          key: "sku",
        },
        {
          key: "stockXHandle",
          savekey: "stockxPath",
        },
      ],
    },
    {
      key: "consigner",
      transform: [
        {
          key: "id",
          savekey: "consignerId",
        },
      ],
    },
  ]
  const out = {}

  transform_options.forEach((t) => {
    const og_value = t.key
    const new_key = t.savekey
    const transformFunc = t.transform

    out[new_key] = transformFunc
      ? transformFunc(item[og_value])
      : item[og_value]
  })

  unwind.forEach((u) => {
    const unwind_key = u["key"]

    u.transform.forEach((t) => {
      const og_value = t.key
      const new_key = t.savekey || og_value

      const value = item[unwind_key][og_value]

      out[new_key] = t.transform ? t.transform(value) : value
    })
  })

  return out
}
