// Cloudflare Pages middleware: one canonical host, and keep the old July 2026 copy out of search.
// Copied to the repo root on deploy (the GitHub Action deploys the root, functions/ included).
const CANONICAL = 'cranklabs.tech';
const REDIRECT_HOSTS = new Set(['www.cranklabs.tech', 'crank-labs-website.pages.dev']);
// Pages deliberately removed from the site: answer 410 so search engines drop them immediately
// (Cloudflare would otherwise keep serving the old copy from cache for up to a week).
const GONE = new Set(['/ai-for-jewellers/', '/ai-for-jewellers']);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (REDIRECT_HOSTS.has(url.hostname)) {
    url.hostname = CANONICAL;
    return Response.redirect(url.toString(), 301);
  }
  if (GONE.has(url.pathname)) {
    return new Response('This page has been removed. Visit https://cranklabs.tech/', { status: 410, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
  const res = await next();
  if (decodeURIComponent(url.pathname).startsWith('/New Website July 2')) {
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex');
    return out;
  }
  return res;
}
