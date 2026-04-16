export default async (request, context) => {
  // آدرس سرور x-ui تو - پورت رو با پورت اینباندت عوض کن
  const TARGET_HOST = "77.68.22.95";  // آدرس IP سرورت (مطمئن شو IP درسته)
  const TARGET_PORT = "10001";         // پورت اینباند x-ui
  const TARGET_PATH = "/vless";        // WebSocket path

  const url = new URL(request.url);
  const upgradeHeader = request.headers.get("Upgrade");

  // اگه WebSocket upgrade request بود
  if (upgradeHeader === "websocket") {
    const targetUrl = `ws://${TARGET_HOST}:${TARGET_PORT}${TARGET_PATH}`;

    // اتصال به سرور x-ui
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(request);

    // WebSocket به سمت سرور
    const serverSocket = new WebSocket(targetUrl);
    serverSocket.binaryType = "arraybuffer";

    serverSocket.onopen = () => {
      clientSocket.onmessage = (event) => {
        if (serverSocket.readyState === WebSocket.OPEN) {
          serverSocket.send(event.data);
        }
      };
    };

    serverSocket.onmessage = (event) => {
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(event.data);
      }
    };

    serverSocket.onerror = (err) => {
      console.error("Server socket error:", err);
      clientSocket.close();
    };

    serverSocket.onclose = () => {
      clientSocket.close();
    };

    clientSocket.onerror = (err) => {
      console.error("Client socket error:", err);
      serverSocket.close();
    };

    clientSocket.onclose = () => {
      serverSocket.close();
    };

    return response;
  }

  // برای درخواست‌های HTTP معمولی
  return new Response("OK", { status: 200 });
};
