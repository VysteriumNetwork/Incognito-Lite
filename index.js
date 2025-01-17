import createBareServer from '@tomphttp/bare-server-node';
import fetch from 'node-fetch';
import http from 'node:http';
const bare = createBareServer("/security/api/protection/");
const server = http.createServer();

server.on('request', async (req, res) => {
  if(bare.shouldRoute(req)) return bare.routeRequest(req, res); 
  if(req.url.startsWith("/service/")) return res.end('OK');

  const asset = await fetch("https://vyst1612-1d3fras.onrender.com/" + req.url);
  const body = new Buffer.from(await asset.arrayBuffer());
  res.writeHead(asset.status, { "Content-Type": asset.headers.get("content-type").split(";")[0] });
  res.end(body);
});

server.on("upgrade", (req, socket, head) => {
  if(bare.shouldRoute(req, socket, head)) bare.routeUpgrade(req, socket, head); else socket.end();
});

server.on("listening", () => {
  const addr = server.address();

  console.log(`Server running on port ${addr.port}`);
  console.log("");
  console.log("You can now view it in your browser.");
  /* Code for listing IPS from website-aio */
  console.log(`Local: http://${addr.family === 'IPv6' ? `[${addr.address}]` : addr.address}:${addr.port}`);
  try { console.log(`On Your Network: http://${address.ip()}:${addr.port}`); } catch (err) {/* Can't find LAN interface */};
  if(process.env.REPL_SLUG && process.env.REPL_OWNER) console.log(`Replit: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
});

server.listen({ port: (process.env.PORT || 8080) })
