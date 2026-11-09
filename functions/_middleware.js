// Cloudflare Pages middleware: one canonical host, and keep the old July 2026 copy out of search.
// Copied to the repo root on deploy (the GitHub Action deploys the root, functions/ included).
const CANONICAL = 'cranklabs.tech';
const REDIRECT_HOSTS = new Set(['www.cranklabs.tech', 'crank-labs-website.pages.dev']);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (REDIRECT_HOSTS.has(url.hostname)) {
    url.hostname = CANONICAL;
    return Response.redirect(url.toString(), 301);
  }
  const res = await next();
  if (decodeURIComponent(url.pathname).startsWith('/New Website July 2')) {
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex');
    return out;
  }
  return res;
}
