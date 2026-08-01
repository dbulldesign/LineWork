#!/usr/bin/env node
/* ============================================================
   LineWork rendezvous — the same thing, on a machine you already have
   ------------------------------------------------------------
   If there is a computer that is always on in the office, this is the whole
   server. It does exactly what the Worker does and is the same twenty lines of
   logic; the only reason both exist is that some people would rather not deploy
   anything and some would rather not depend on anybody.

     node rendezvous/node.js 8787

   Then Settings › Files › Rendezvous on both devices:
     http://<that machine's address>:8787

   It never sees the job — only the handshake WebRTC needs to open a direct
   connection between the two devices, which is worthless a minute later.
   ============================================================ */
const http = require('node:http');

const PORT = +(process.argv[2] || process.env.PORT || 8787);
const TTL = 5 * 60 * 1000;
const holes = new Map();

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
  'cache-control': 'no-store',
};

http.createServer((req, res) => {
  const send = (code, body, type) =>
    res.writeHead(code, Object.assign({}, CORS, type ? { 'content-type': type } : {})).end(body);

  if (req.method === 'OPTIONS') return send(204, '');

  const url = new URL(req.url, 'http://x');
  const room = (url.searchParams.get('room') || '').slice(0, 80);
  const side = url.searchParams.get('side') === 'b' ? 'b' : 'a';
  if (!/^[A-Za-z0-9_-]{4,80}$/.test(room)) return send(400, 'bad room');

  const now = Date.now();
  for (const [k, v] of holes) if (now - v.at > TTL) holes.delete(k);
  const key = room + '/' + side;

  if (req.method === 'POST') {
    /* A handshake is under a kilobyte. Anything bigger is read to the end and
       then refused, rather than answered early or dropped: replying before the
       body has arrived closes the socket under the sender, who sees a network
       failure instead of the plain 413 that would have told them what happened. */
    let body = '', over = false;
    req.on('data', c => {
      if (over) return;
      body += c;
      if (body.length > 8000) { over = true; body = ''; }
    });
    req.on('end', () => {
      if (over) return send(413, 'too big');
      holes.set(key, { body, at: Date.now() });
      send(200, 'ok');
    });
    return;
  }

  const hit = holes.get(key);
  if (!hit) return send(204, '');
  /* read once: the other side has it, and a handshake is not reusable */
  holes.delete(key);
  send(200, hit.body, 'text/plain');
}).listen(PORT, () => {
  console.log('LineWork rendezvous on port ' + PORT);
  console.log('Put http://<this machine>:' + PORT + ' into Settings > Files > Rendezvous');
});
