const BASE_URL = import.meta.env.VITE_SITE_URL || "https://saifcraft.dev";
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo-dark.png`;

interface PageSEOOptions {
  title: string;
  description: string;
  path: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
}

function setMeta(selector: string, value: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute("content", value);
}

function setOrCreateMeta(attrs: Record<string, string>, content: string) {
  const selector = Object.entries(attrs)
    .map(([k, v]) => `[${k}="${v}"]`)
    .join("");
  let el = document.querySelector(`meta${selector}`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setOrCreateLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setRobotsDirective(content: string) {
  let el = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "robots");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function updatePageSEO({
  title,
  description,
  path,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
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
  setOrCreateMeta({ name: "twitter:image" }, ogImage);

  setRobotsDirective(noindex ? "noindex, nofollow" : "index, follow");
  setOrCreateLink("canonical", url);
}

export function addSchema(id: string, data: object) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

export function removeSchemas(ids: string[]) {
  ids.forEach((id) => document.getElementById(id)?.remove());
}
