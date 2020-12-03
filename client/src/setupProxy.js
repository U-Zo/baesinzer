const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080/',
      changeOrigin: true,
    })
  );

  app.use(
    '/ws-stomp',
    createProxyMiddleware({
      target: 'ws://localhost:8080/',
      changeOrigin: true,
      ws: true,
    })
  );
};
