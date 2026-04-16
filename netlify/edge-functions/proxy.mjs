const TARGET = "http://77.68.22.95:10003/hu";

export default async (request) => {
  const headers = new Headers();
  
  for (const [key, value] of request.headers.entries()) {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  }
  headers.set("host", "77.68.22.95");

  const response = await fetch(TARGET, {
    method: request.method,
    headers: headers,
    body: request.body,
  });

  const resHeaders = new Headers();
  for (const [key, value] of response.headers.entries()) {
    resHeaders.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    headers: resHeaders,
  });
};

export const config = {
  path: "/hu",
};
