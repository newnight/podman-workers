addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 获取原始请求的 URL
  let url = new URL(request.url);
  
  // 将请求转发到 Docker Hub
  let newUrl = new URL(url.pathname, 'https://registry-1.docker.io');
  
  // 复制原始请求的 headers，并修改 Host 头为 Docker Hub 的地址
  let headers = new Headers(request.headers);
  headers.set('Host', 'registry-1.docker.io');
  
  // 转发请求并获取响应
  let response = await fetch(newUrl.toString(), {
    method: request.method,
    headers: headers,
    body: request.body
  });
  
  // 修改响应的 headers，确保正确返回
  let newHeaders = new Headers(response.headers);
  newHeaders.delete('content-encoding');
  newHeaders.delete('content-length');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
