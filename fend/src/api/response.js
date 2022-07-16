export function handleReponse(requestFunc, successCb, failureCb, expectedCode) {
  requestFunc().then((res) => {
    if (!res.ok) {
      console.log("The response is NOT okay", requestFunc);
      return failureCb(res);
    }
    console.log("The response is okay", requestFunc);


    if (expectedCode && res.status !== expectedCode) {
      console.log(
        `The expected response code was ${expectedCode} and got ${res.status}`
      );
      console.log("Running the failure callback");
      return failureCb(res);
    }
    console.log("Running the success callback");
    return successCb(res);
  })
  .catch((e) => {
    console.error(`An unexpected error occured. The error as a string -> "${e?.toString() ?? "undefined"}"`, );
    if (e?.toString() === "TypeError: Failed to fetch") {
      console.error("The request failed to fetch. Is the server on????");
    }
  });
}
