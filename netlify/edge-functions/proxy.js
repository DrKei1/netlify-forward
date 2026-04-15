export default async (request, context) => {
  const targetHost = "77.68.22.95";
  const url = new URL(request.url);
  const targetUrl = `http://${targetHost}:80${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set("host", targetHost);
  
  // حذف هدرهای سنگین نت‌لیفای که باعث ارور ۴۰۰ در سرور می‌شوند
  const headersToDelete = [
    "x-nf-blobs-info", 
    "x-nf-deploy-context", 
    "x-nf-deploy-id", 
    "x-nf-edge-function-log-token", 
    "x-nf-request-id",
    "x-nf-trace-span-id",
    "cdn-loop",
    "netlify-agent-category"
  ];
  headersToDelete.forEach(h => headers.delete(h));

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: "manual",
    });

    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Accel-Buffering", "no");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (e) {
    return new Response("Bridge Error: " + e.message, { status: 502 });
  }
};

export const config = { path: "/*" };
