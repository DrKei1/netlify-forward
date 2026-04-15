export default async (request, context) => {
  const url = new URL(request.url);
  const targetHost = "77.68.22.95"; 
  const newUrl = `http://${targetHost}:80${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set("host", targetHost);

  return fetch(newUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: "manual",
  });
};

export const config = { path: "/*" };