/* ============================================================
   LineWork rendezvous — a Cloudflare Worker
   ------------------------------------------------------------
   Two devices cannot find each other on their own. This is the smallest thing
   that lets them: a note left in a numbered pigeonhole, picked up by the other
   side, and thrown away shortly afterwards.

   It never sees the job. What passes through here is the handshake WebRTC needs
   to open a direct connection — addresses and a certificate fingerprint, a few
   hundred bytes, useless once the connection is made. The drawings, the takeoff
   and everything else go straight between the two devices and never touch this.

   Deploying it:
     npm i -g wrangler
     wrangler deploy rendezvous/worker.js --name linework-rendezvous \
       --compatibility-date 2024-01-01
   then put the URL it prints into Settings › Files › Rendezvous.

   The free tier covers this a hundred thousand times over: pairing is two small
   requests and a few polls, once, per session.
   ============================================================ */

/* A pigeonhole lives for this long and no longer. Long enough to walk across the
   room with an iPad; short enough that a code someone read over your shoulder is
   worthless by the time they type it. */
const TTL = 5 * 60 * 1000;

/* Held in memory rather than in a store, deliberately. A Worker isolate may be
   recycled between the two halves of a handshake, in which case the devices try
   again a second later — and in exchange nothing about anybody is ever written
   down anywhere. */
const holes = new Map();

function sweep() {
  const now = Date.now();
  for (const [k, v] of holes) if (now - v.at > TTL) holes.delete(k);
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
  'access-control-max-age': '86400',
  'cache-control': 'no-store',
};

export default {
  async fetch(req) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    const url = new URL(req.url);
    const room = (url.searchParams.get('room') || '').slice(0, 80);
    const side = url.searchParams.get('side') === 'b' ? 'b' : 'a';
    if (!/^[A-Za-z0-9_-]{4,80}$/.test(room))
      return new Response('bad room', { status: 400, headers: CORS });

    sweep();
    const key = room + '/' + side;

    if (req.method === 'POST') {
      const body = await req.text();
      /* a handshake is under a kilobyte; anything larger is not one */
      if (body.length > 8000) return new Response('too big', { status: 413, headers: CORS });
      holes.set(key, { body, at: Date.now() });
      return new Response('ok', { headers: CORS });
    }

    const hit = holes.get(key);
    if (!hit) return new Response(null, { status: 204, headers: CORS });
    /* read once: the other side has it now, and a handshake is not reusable */
    holes.delete(key);
    return new Response(hit.body, {
      headers: Object.assign({ 'content-type': 'text/plain' }, CORS),
    });
  },
};
