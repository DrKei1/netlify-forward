const TARGET_HOST = "77.68.22.95";
const TARGET_PORT = "10002";
const TARGET_PATH = "/xhttp";

export default async (request) => {
  const url = new URL(request.url);
  const targetUrl = `http://${TARGET_HOST}:${TARGET_PORT}${TARGET_PATH}${url.search}`;

  // کپی کردن همه هدرها به جز host
  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  }
  headers.set("host", TARGET_HOST);

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== "GET" && request.method !== "HEAD" 
        ? request.body 
        : null,
      duplex: "half",
    });

    const responseHeaders = new Headers();
    for (const [key, value] of response.headers.entries()) {
      responseHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 502 });
  }
};

export const config = {
  path: ["/xhttp", "/xhttp/*"],
};
