const BASE_URL = "https://portfolio-wheat-iota-47.vercel.app";
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo-dark.png`;

interface PageSEOOptions {
  title: string;
  description: string;
  path: string;
  ogType?: string;
  ogImage?: string;
}

function setMeta(selector: string, value: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute("content", value);
}

function setOrCreateLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link") as HTMLLinkElement;
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function updatePageSEO({
  title,
  description,
  path,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
}: PageSEOOptions) {
  const url = `${BASE_URL}${path}`;

  document.title = title;

  setMeta('meta[name="title"]', title);
  setMeta('meta[name="description"]', description);

  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:url"]', url);
  setMeta('meta[property="og:type"]', ogType);
  setMeta('meta[property="og:image"]', ogImage);

  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:url"]', url);

  setOrCreateLink("canonical", url);
}

export function addSchema(id: string, data: object) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.type = "application/ld+json";
  s.text = JSON.stringify(data);
  document.head.appendChild(s);
}

export function removeSchemas(ids: string[]) {
  ids.forEach((id) => document.getElementById(id)?.remove());
}
