const { createServer } = require('node:http');
const { existsSync } = require('node:fs');
const { readFile } = require('node:fs/promises');
const { extname, resolve } = require('node:path');

const hostname = '127.0.0.1';
const port = 3000;
const distDir = resolve(__dirname, 'dist');
const rootDir = existsSync(distDir) ? distDir : __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  const requestedPath = decodeURIComponent(req.url || '/');
  const safePath = requestedPath === '/' ? '/index.html' : requestedPath.split('?')[0];
  const filePath = resolve(rootDir, safePath.replace(/^\/+/, ''));

  try {
    const content = await readFile(filePath);
    const contentType = mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(content);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});