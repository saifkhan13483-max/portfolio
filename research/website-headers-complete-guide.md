# Website Headers: Complete Type Reference Guide

**Research Date:** June 7, 2026
**Depth:** Standard
**Sources Consulted:** 15+

---

## Executive Summary

The website header is the most strategically critical zone of any web page. It is the first element users see, the primary navigation hub, and a key determinant of first impressions. Research across design resources, UX studies, and industry publications reveals that website headers can be categorized across five distinct dimensions: **structural behavior** (how they move/position), **layout geometry** (how they are shaped and sized), **navigation pattern** (how menus are organized), **visual treatment** (how they look aesthetically), and **industry/purpose** (what specific site type they serve).

In total, this report identifies and details **30+ distinct header types** across these five dimensions. Many websites combine types — for example, a "Sticky + Transparent + Mega Menu" header is common among large eCommerce sites. Understanding these categories enables designers and developers to make intentional, conversion-optimized, and accessible choices.

Key findings include: sticky headers outperform static headers for navigation discoverability on long pages [1]; video background headers can increase engagement significantly but carry performance tradeoffs [2]; mega menus are favored for enterprise and retail while hamburger menus remain the mobile standard; and modern trends in 2024–2026 are moving toward minimal, floating, and glassmorphism-style headers with reduced visual weight.

---

## Background

A website header is the topmost section of a webpage, typically containing the logo/brand identity, primary navigation, and key utility elements such as a search bar, login button, or shopping cart. It serves as both a wayfinding anchor and a brand statement. As web design has evolved from static HTML pages to rich, animated, responsive experiences, the typology of headers has expanded dramatically.

The header's design directly impacts three critical metrics: **bounce rate** (a confusing or ugly header causes users to leave), **session depth** (a clear nav encourages exploring more pages), and **conversion** (a well-placed CTA in the header drives action). A Nielsen Norman Group study found that persistent navigation headers meaningfully increase the discoverability of key site features [1].

Modern headers must also address the dual-viewport reality — a desktop experience and a mobile experience that often look entirely different — while meeting WCAG 2.1/2.2 accessibility standards for contrast, focus states, and keyboard navigation.

---

## Part I — Structural Behavior Types

These header types are defined by how they respond to scrolling and interact with the page layout.

---

### 1. Static Header

The static header is the most basic form: it sits at the top of the page content and scrolls away as the user moves down. It uses the default CSS `position: static` and occupies space in the document flow naturally [1].

**Best use cases:** Minimalist portfolios, single-page landing sites, editorial blogs, and any page short enough that users rarely need to scroll far before finding navigation.

| Attribute | Detail |
|---|---|
| CSS | `position: static` (default) |
| Behavior | Scrolls with page — disappears on scroll-down |
| Performance | Zero overhead |
| Mobile-friendly | Yes — no extra considerations needed |

**Pros:** Zero performance cost, no layout shifts, maximizes reading space.
**Cons:** Inconvenient on long pages — users must scroll to the top to navigate.

---

### 2. Sticky Header

A sticky header stays pinned to the top of the viewport once the user has scrolled past its original position. It is the most widely used header behavior on modern websites [1]. Implemented with `position: sticky; top: 0`, it remains in the document flow — unlike fixed positioning — which prevents content from jumping when it activates.

Research notes that sticky headers increase discoverability of navigation and utility elements versus static headers, particularly on long-form pages [1].

**Best use cases:** Most modern commercial sites, eCommerce, blogs, SaaS marketing pages.

**Pros:** Persistent navigation access; natural document flow prevents CLS; works well across screen sizes.
**Cons:** Consumes vertical viewport space while scrolling; requires careful implementation to avoid layout shift bugs.

---

### 3. Fixed Header

A fixed header is permanently locked to the top of the browser viewport regardless of scrolling. It uses `position: fixed; top: 0`, which removes it from the normal document flow entirely, meaning the page body must be manually padded to compensate [1].

**Best use cases:** Web applications, SaaS dashboards, admin panels, and any site where persistent access to utility functions (user profile, notifications, search) is essential.

**Pros:** Instant access to navigation at all times; strong branding consistency.
**Cons:** Overlaps page content without body padding compensation; particularly intrusive on small mobile screens where it eats a large percentage of viewport height.

---

### 4. Smart Sticky / Scroll-Aware Header

A refinement of the sticky header: the header hides when the user scrolls down (maximizing content space) and slides back into view when the user scrolls up (interpreting upward scroll as an intent to navigate). This behavior is driven by JavaScript tracking the `scrollY` position and comparing it to the previous frame [1].

**Best use cases:** Long-form editorial sites, news publications, blogs with rich article content.

**Pros:** Balances navigation access with maximum content immersion.
**Cons:** Requires JavaScript; can feel jarring if the animation isn't smooth.

---

### 5. Transparent / Overlay Header

The transparent header has no background color on page load, allowing the hero image or video beneath it to "bleed through" visually. The logo and navigation links float over the imagery. Typically, a scroll listener transitions the background to a solid or frosted color once the user moves past the hero section, restoring legibility [3].

**Best use cases:** High-impact landing pages, photography portfolios, luxury brands, travel sites.

**Pros:** Dramatically modern and sleek; maximizes the impact of hero visuals; makes the above-the-fold area feel larger.
**Cons:** Serious readability risk if the underlying image is busy; requires deliberate contrast planning (white logo on dark imagery, or vice versa); WCAG contrast compliance is challenging.

---

## Part II — Layout & Geometry Types

These header types are defined by their visual dimensions, proportions, and container behavior.

---

### 6. Full-Width Header

A header that stretches edge-to-edge across the entire browser window (`width: 100%` with no max-width container). This is the dominant style on modern websites and is associated with immersive, contemporary design [1].

**Best use cases:** Creative agencies, portfolio sites, media platforms, and eCommerce sites seeking visual impact.

**Pros:** Modern aesthetic; fully utilizes available screen space; works excellently with hero imagery.
**Cons:** On ultra-wide monitors (2560px+), elements can feel overly spread apart unless internal padding is generous.

---

### 7. Boxed / Contained Header

Navigation and logo elements are wrapped within a centered container with a fixed `max-width` (typically 1200–1440px), while the header background may or may not extend full-width. Common in corporate and content sites that want a structured, "newspaper-style" hierarchy [1].

**Best use cases:** Corporate websites, news portals, government sites, content-heavy blogs.

**Pros:** Predictable, organized layout; easy to read across monitor sizes; classic and professional.
**Cons:** Can appear dated or cramped; wastes real estate on large screens.

---

### 8. Tall / Extended Header

A header with significantly more vertical height than the standard ~60–80px. It typically features a large logo, possibly a tagline or announcement, and may include a utility bar above the main navigation row.

**Best use cases:** News/media sites (the New York Times style), government portals, university websites.

**Pros:** Accommodates extra information (utility navigation, language selector, contact); strong visual brand presence.
**Cons:** Takes up significant viewport space above the fold.

---

### 9. Dual-Row / Multi-Bar Header

A header split into two or more horizontal rows. A common pattern has a thin "utility bar" on top (contact info, social links, login) and a main navigation row below. Some add a third row for secondary navigation or a search bar.

**Best use cases:** Large retailers, news organizations, B2B enterprise sites.

**Pros:** Organizes many navigation options into a clear hierarchy; separates utility from primary nav.
**Cons:** Heavy visual weight; can feel overwhelming; consumes too much vertical space on mobile.

---

### 10. Mini / Slim Header

An intentionally compact header, typically under 50px tall, containing only essential elements — logo and minimal navigation. Often seen in web apps where UI real estate is precious.

**Best use cases:** Web applications, SaaS dashboards, admin interfaces.

**Pros:** Maximizes content area; clean and unobtrusive.
**Cons:** Limited space for branding or rich navigation.

---

## Part III — Navigation Pattern Types

These header types are defined by how menus and links are structured within the header.

---

### 11. Standard Horizontal Navigation Header

The classic pattern: logo on the left, horizontal nav links in the center or right. Every link is a single level, typically linking directly to top-level pages. This is the most universally recognized and cognitively effortless pattern for desktop users.

**Best use cases:** Small-to-medium sites with 4–7 top-level pages.

**Pros:** Instantly familiar to all users; low cognitive load; highly accessible.
**Cons:** Doesn't scale to sites with deep content hierarchies.

---

### 12. Dropdown Navigation Header

The horizontal nav links expand into a dropdown panel when hovered or clicked, revealing secondary navigation items. This is the most common pattern for sites with moderate content depth.

**Best use cases:** SMB websites, service companies, eCommerce with a moderate number of categories.

**Pros:** Scalable to two levels of navigation; familiar interaction model.
**Cons:** Hover-triggered dropdowns are inaccessible (keyboard/touch unfriendly) if not implemented carefully; nested dropdowns (3+ levels) become confusing.

---

### 13. Mega Menu Header

Mega menus expand the navigation dropdown into a large, multi-column panel — often covering a significant portion of the screen — featuring organized categories, subcategories, and sometimes promotional imagery or featured links. Pioneered by large retailers, they are trending toward more streamlined designs in 2024–2025 that integrate promotional visuals directly [1].

**Best use cases:** Large eCommerce sites, enterprise software, news publishers with many sections.

**Pros:** Exposes full content depth without requiring page visits; reduces navigation friction for complex sites; can include imagery, badges, and featured content.
**Cons:** Can overwhelm users with too many choices; heavy implementation; must be carefully designed for keyboard and screen reader accessibility.

---

### 14. Hamburger Menu Header (Mobile)

The hamburger menu (☰ icon) is the de-facto standard for mobile navigation. Tapping the icon reveals a full or slide-in navigation panel. On desktop, it is increasingly used by minimalist sites that want to hide navigation until requested.

**Best use cases:** Mobile web (nearly universal); minimalist portfolio/creative sites on desktop.

**Pros:** Conserves viewport space; familiar mobile pattern; clean aesthetic.
**Cons:** Navigation is hidden by default — reduces discoverability; users must actively seek out navigation, which can lower page depth metrics.

---

### 15. Centered Navigation Header (Symmetric)

The logo is centered horizontally in the header, with navigation links split symmetrically on either side (e.g., 3 links on the left, 3 on the right). Creates a highly elegant, balanced, and fashion-forward aesthetic.

**Best use cases:** Luxury brands, high-end restaurants, fashion boutiques, hospitality.

**Pros:** Visually striking and memorable; conveys premium positioning.
**Cons:** Difficult to implement responsively; awkward on mobile; not ideal for utility-heavy sites.

---

### 16. Split / Dual Navigation Header

Similar to the centered logo variant but the navigation is intentionally divided into two distinct groups — primary navigation on one side, utility actions (search, cart, login) on the other — with the logo mediating between them.

**Best use cases:** eCommerce, SaaS platforms, portals.

**Pros:** Cleanly separates editorial navigation from utility functions; efficient use of header real estate.
**Cons:** Requires careful visual balance so neither side feels heavier.

---

### 17. Sidebar Navigation Header (Vertical Nav)

Rather than a horizontal header, navigation is placed in a persistent vertical sidebar. The "header" concept is dissolved into a left or right panel that contains the logo at the top and nav items below it.

**Best use cases:** Web applications, dashboards, content management tools, documentation sites.

**Pros:** Scales to unlimited navigation items; always visible without taking vertical space; natural for power users.
**Cons:** Not suitable for public-facing marketing sites; unfamiliar to general web audiences in marketing contexts.

---

### 18. Fullscreen / Overlay Navigation Header

Clicking the hamburger or menu icon causes the navigation to expand into a full-screen takeover — an overlay that covers the entire viewport with large, bold navigation links. Common on creative and luxury sites.

**Best use cases:** Photography portfolios, creative agencies, luxury brands, art installations.

**Pros:** Highly dramatic and impactful; works on all screen sizes; gives a cinematic feel.
**Cons:** Disrupts the browsing flow; not suitable for high-frequency navigation sites.

---

## Part IV — Visual & Aesthetic Treatment Types

These header types are defined primarily by their visual style and aesthetic character.

---

### 19. Hero Image Header (Full-Screen)

The header zone fills the entire viewport with a high-resolution, full-bleed photograph or illustration, overlaid with the navigation and a headline/CTA. Standard resolution is 1920×1080px for desktop, with Retina displays requiring 2560×1440px or higher [5].

**Best use cases:** Photography, travel, real estate, hospitality, agencies.

**Pros:** Immediate emotional impact; maximizes brand storytelling; sets a powerful first impression.
**Cons:** Requires excellent photography; performance-intensive; text contrast management is critical.

---

### 20. Video Background Header

A silently looping video replaces the static hero image. The `<video>` element with `autoplay`, `muted`, and `loop` attributes is standard implementation, typically overlaid with a semi-transparent dark layer to ensure text readability [2].

Video headers have been associated with increased engagement and conversion rates [2], though exact figures vary widely by industry and implementation quality.

**Best use cases:** Experiential brands, SaaS products showing the software in use, event companies, hospitality.

**Pros:** Dynamic and immersive; conveys complex product stories instantly; highly memorable.
**Cons:** Large file sizes (can be 5–15MB even when compressed); can distract; prefers-reduced-motion users should see a static fallback.

---

### 21. Parallax Scrolling Header

Background and foreground elements scroll at different speeds, creating a perceived sense of depth and 3D space [3]. Pure CSS parallax uses `background-attachment: fixed`; JavaScript-based parallax adjusts `transform: translateY()` based on `window.scrollY`.

**Best use cases:** Storytelling landing pages, creative agencies, entertainment sites.

**Pros:** Immersive and visually impressive; adds perceived depth.
**Cons:** `background-attachment: fixed` is unreliable on iOS Safari; JS parallax can cause performance jank (dropped frames); accessibility concern — must respect `prefers-reduced-motion` [4].

---

### 22. Split-Screen Header

The viewport is divided into two equal vertical halves, each with its own visual and content — typically one side is an image/video and the other is text with a CTA.

**Best use cases:** Sites serving two distinct audiences or offering two primary products/services (e.g., a brand with separate men's and women's lines).

**Pros:** Clear dual-path UX; visually modern; eliminates the need to choose a single hero message.
**Cons:** Challenging to collapse gracefully onto mobile; can feel indecisive if not executed boldly.

---

### 23. Carousel / Slider Header

Multiple hero slides rotate automatically or via manual controls. Each slide typically represents a different product, promotion, or message.

**Best use cases:** eCommerce homepages (seasonal promotions), news sites.

**Pros:** Showcases multiple messages without additional page space.
**Cons:** User engagement with slides beyond the first is very low; auto-advancing carousels are a well-documented UX anti-pattern; accessibility concerns around motion and keyboard control.

---

### 24. Illustrated / Artistic Header

The hero area uses custom illustrations, animations, or graphic art instead of photography, reinforcing a unique brand identity and creative voice.

**Best use cases:** Startups, tech companies, children's products, creative tools, gaming.

**Pros:** Highly distinctive and ownable visual identity; doesn't require expensive photography.
**Cons:** Illustration style must align with brand; production cost is high.

---

### 25. Glassmorphism / Frosted Glass Header

A modern aesthetic treatment where the header has a semi-transparent, blurred background (`backdrop-filter: blur()`) that lets the content beneath "show through" in a frosted-glass effect. Popularized by Apple's macOS and iOS design language and heavily adopted in 2023–2025.

**Best use cases:** Modern SaaS products, tech startups, productivity apps.

**Pros:** Elegant and contemporary; lightweight feel; works beautifully over rich backgrounds.
**Cons:** `backdrop-filter` has browser compatibility gaps; can reduce text contrast; overuse makes it feel trendy rather than timeless.

---

### 26. Dark / Dark Mode Header

A header with a dark (black, near-black, or deep charcoal) background. Some sites offer a toggle between light and dark modes; others are exclusively dark for aesthetic or functional reasons.

**Best use cases:** Developer tools, entertainment platforms, gaming, creative software, tech brands.

**Pros:** Reduced eye strain in low-light environments; premium and sophisticated aesthetic; strong contrast for UI elements.
**Cons:** Requires separate color system planning; accessibility contrast ratios must be recalculated for light text on dark backgrounds.

---

### 27. Floating / Detached Header

A header that appears to "float" above the page, visually separated from both the viewport edge and the page content with rounded corners and visible margins on all sides. Creates the illusion that the header is a UI card hovering over the page.

**Best use cases:** Modern SaaS, fintech dashboards, product-led growth sites, portfolios.

**Pros:** Very contemporary and distinctive; creates a layered, dimensional feel.
**Cons:** Less established pattern — users may not immediately identify it as navigation; requires careful attention to mobile adaptation.

---

### 28. Bento Grid Header

Popularized by Apple's product launch pages, the hero section uses a grid of varying-size cards ("bento boxes") to simultaneously highlight multiple features or use cases. Each cell is independently designed but contributes to a coherent whole [2].

**Best use cases:** App feature showcases, tech landing pages, portfolios of complex products.

**Pros:** Information-dense without feeling overwhelming; highly visual; communicates breadth of a product.
**Cons:** Complex to design and implement; difficult to prioritize information hierarchy; can feel cluttered on mobile.

---

## Part V — Industry-Specific & Purpose-Built Types

These header types are optimized for the specific functional needs of a site category.

---

### 29. eCommerce Header

Optimized for shopping: includes a prominent search bar (often spanning the full width), shopping cart icon with item count, user account access, and often a secondary navigation bar for categories. Large retailers typically combine a Mega Menu with a Dual-Row layout.

**Key elements:** Logo | Search bar | Cart icon | Account | Wishlist | Category nav

**Best use cases:** Online retail of all scales.

**Special considerations:** Persistent cart count badge, guest vs. logged-in state management, and mobile accessibility for touch targets.

---

### 30. Blog / Editorial Header

Clean and content-focused. Typically includes the publication name/logo, a minimal set of category links, a search icon, and sometimes a "Subscribe" CTA. Often uses the Static or Sticky pattern without heavy visual treatment.

**Best use cases:** Personal blogs, online magazines, newsletters, journalism.

**Key elements:** Masthead logo | Section categories | Search | Subscribe CTA

---

### 31. SaaS / Product Marketing Header

Conversion-optimized for acquiring trial or demo sign-ups. Typically minimal — a logo, 4–6 nav links (Product, Pricing, Blog, Customers), and a prominent CTA button (e.g., "Start Free Trial" or "Book a Demo") in a contrasting color.

**Best use cases:** B2B and B2C software products, API tools, productivity apps.

**Key elements:** Logo | Product nav | Pricing | CTA button (high contrast)

---

### 32. Portfolio Header

Minimal and personal, featuring the creator's name or logo and very few navigation links (Work, About, Contact). Often uses creative typography, a transparent overlay, or fullscreen navigation to express personality.

**Best use cases:** Freelancers, designers, photographers, developers.

**Key elements:** Name/logo | Work | About | Contact | Optional: resume download

---

### 33. News / Media Header

Often a Tall or Dual-Row header with a publication masthead at the top and a multi-section category navigation below. May include breaking news tickers, section tags, and multiple utility links (subscribe, login, newsletters).

**Best use cases:** Newspapers, broadcast media sites, aggregators.

**Key elements:** Masthead | Section nav | Breaking news bar | Subscribe | Search | Social links

---

### 34. Landing Page Header (Minimal CTA)

Landing pages, especially for paid ad traffic, often use an extremely stripped-down header — just the logo (non-linked, to prevent escape) and possibly a phone number. This is an intentional conversion optimization technique to eliminate distractions and focus user attention on the CTA.

**Best use cases:** PPC ad landing pages, email campaign destinations.

**Key elements:** Logo only (non-clickable) | Phone/trust signal

---

### 35. Documentation / Developer Site Header

Designed for power users navigating large content repositories. Typically features a persistent search (often keyboard-shortcut-accessible, e.g., Cmd+K), a version selector, and links to API reference, guides, and changelogs.

**Best use cases:** API documentation, developer portals, open source projects.

**Key elements:** Logo | Search (prominent) | Version selector | GitHub link | Navigation tabs

---

## Analysis

A clear pattern emerges from this research: **header complexity scales with content complexity, not brand ambition.** The most effective headers for large enterprises (mega menus, dual-row, eCommerce-optimized) reflect genuine navigational need — not a desire for visual sophistication. Conversely, the most memorable headers on premium creative sites are often the simplest structurally (fullscreen nav, minimal links) while being the most visually distinctive.

The major axis of evolution from 2023–2026 is the shift from **heavy to light**. Solid-color, thick, multi-row headers are giving way to floating headers, glassmorphism, and scroll-aware smart-sticky patterns. This reflects both aesthetic preference (less visual noise, more content immersion) and technical maturity (browsers now natively support `position: sticky`, `backdrop-filter`, and scroll-driven animations without JavaScript).

**Accessibility is the critical unresolved tension.** Transparent headers create WCAG contrast compliance challenges [1][3]. Parallax and animation-heavy headers need `prefers-reduced-motion` handling [4]. Mega menus require meticulous ARIA implementation. The sites that execute headers best are those that solve the aesthetic challenge within accessibility constraints — not by ignoring them.

**Mobile is not an afterthought — it's a different header altogether.** For most sites, the mobile header is functionally a separate design: hamburger menu, brand logo, and possibly a cart/search icon. The visual richness of desktop headers (video backgrounds, mega menus, split-screen layouts) almost never translates directly to mobile. The best practice is to design the mobile header as a first-class experience, not a collapsed version of desktop.

---

## Limitations

This report draws from publicly available web design resources, UX blogs, and CSS documentation. Conversion statistics (such as the video background engagement claim) vary significantly by industry and implementation quality and should be treated as directional rather than definitive. Some emerging patterns (AI-generated dynamic backgrounds, personalized headers) are early-stage and lack substantial documented evidence. Research was conducted on June 7, 2026 — design trends evolve rapidly.

---

## Recommendations

**For most commercial websites:** Start with a Sticky header, Full-Width layout, Horizontal Navigation, and a transparent-to-solid scroll transition on the homepage. Add a high-contrast CTA button. This combination is proven, accessible, and expectation-matching.

**For eCommerce:** Invest in a Dual-Row header with a full-width search bar and a Mega Menu for categories. Persistent cart count is non-negotiable. Optimize the mobile header independently.

**For SaaS products:** Keep it minimal — 5 links maximum, one high-contrast CTA button. Use a Smart Sticky pattern. Avoid carousels.

**For creative/portfolio sites:** Earn the right to be distinctive. A Fullscreen Nav or Centered Logo header with generous whitespace and bold typography signals confidence. Avoid complex navigation — projects should speak for themselves.

**For all sites:** Audit against WCAG 2.2 — contrast ratios, keyboard navigability, focus states, and `prefers-reduced-motion` support. Accessibility is not optional; it is foundational.

---

## Quick Reference Table

| # | Header Type | Category | Best For |
|---|---|---|---|
| 1 | Static | Structural | Minimal/short-page sites |
| 2 | Sticky | Structural | Most modern sites |
| 3 | Fixed | Structural | Web apps/dashboards |
| 4 | Smart Sticky | Structural | Long editorial content |
| 5 | Transparent/Overlay | Structural | Luxury/portfolio |
| 6 | Full-Width | Layout | Creative/immersive sites |
| 7 | Boxed/Contained | Layout | Corporate/news |
| 8 | Tall/Extended | Layout | News, government, university |
| 9 | Dual-Row/Multi-Bar | Layout | Large retail, enterprise |
| 10 | Mini/Slim | Layout | Web apps |
| 11 | Horizontal Nav | Navigation | Small-medium sites |
| 12 | Dropdown Nav | Navigation | Mid-size sites |
| 13 | Mega Menu | Navigation | Large eCommerce, enterprise |
| 14 | Hamburger Menu | Navigation | Mobile, minimalist desktop |
| 15 | Centered Navigation | Navigation | Luxury, fashion, hospitality |
| 16 | Split/Dual Nav | Navigation | eCommerce, SaaS |
| 17 | Sidebar Navigation | Navigation | Dashboards, documentation |
| 18 | Fullscreen Overlay Nav | Navigation | Creative agencies, portfolios |
| 19 | Hero Image | Visual | Photography, travel, agencies |
| 20 | Video Background | Visual | Experiential brands, SaaS |
| 21 | Parallax Scrolling | Visual | Storytelling, creative |
| 22 | Split-Screen | Visual | Dual-audience sites |
| 23 | Carousel/Slider | Visual | eCommerce (use sparingly) |
| 24 | Illustrated/Artistic | Visual | Startups, gaming, kids |
| 25 | Glassmorphism | Visual | Modern SaaS, tech startups |
| 26 | Dark/Dark Mode | Visual | Dev tools, entertainment |
| 27 | Floating/Detached | Visual | Modern SaaS, fintech |
| 28 | Bento Grid | Visual | App feature showcases |
| 29 | eCommerce Header | Industry | Online retail |
| 30 | Blog/Editorial Header | Industry | Publications, blogs |
| 31 | SaaS/Product Header | Industry | Software products |
| 32 | Portfolio Header | Industry | Freelancers, creatives |
| 33 | News/Media Header | Industry | Newspapers, broadcasters |
| 34 | Landing Page Header | Industry | PPC/ad landing pages |
| 35 | Documentation Header | Industry | Dev portals, API docs |

---

## Sources

1. **Website Header Design in 2024: Examples & Best Practices** — Elementor Blog, https://elementor.com/blog/website-header-design/, 2024, Tier 2
2. **2024 Design Trends | 5 Must Try Hero Layouts** — DesignerUp, https://designerup.co/blog/2024-design-trends-5-must-try-hero-layouts/, 2024, Tier 2
3. **How to Make a Transparent Header in WordPress** — Creative Themes / Blocksy, https://creativethemes.com/blocksy/blog/create-transparent-header-wordpress/, 2024, Tier 2
4. **Parallax Scrolling — Accessibility & CSS Implementation** — CSS Animation Rocks, https://cssanimation.rocks/parallax/, Tier 2
5. **Bringing Back Parallax With Scroll-Driven CSS Animations** — CSS-Tricks, https://css-tricks.com/bringing-back-parallax-with-scroll-driven-css-animations/, 2023, Tier 1
6. **Hero Images: Best Practices and Examples** — HubSpot, https://blog.hubspot.com/marketing/hero-image, 2024, Tier 1
7. **Introduction to Hero Headers on Your Website** — Artlogic, https://support.artlogic.net/hc/en-gb/articles/360013723760-Introduction-to-hero-headers-on-your-website, 2023, Tier 3
8. **Sticky Vs. Static Headers: Which Is Right For Your Website?** — McStarters, https://mcstarters.com/blog/sticky-vs-static-headers/, 2024, Tier 3
9. **Best Practices for Website Header Design** — Tubik Studio, https://blog.tubikstudio.com/best-practices-for-website-header-design/, 2023, Tier 2
10. **What Is Transparent Header in WordPress** — 10Web, https://10web.io/wordpress-glossary/what-is-transparent-header-in-wordpress/, Tier 3
11. **How To Create a Parallax Scrolling Effect** — W3Schools, https://www.w3schools.com/howto/howto_css_parallax.asp, 2024, Tier 2
12. **WCAG 2.2 — Understanding Success Criterion 1.4.3 (Contrast)** — W3C/WAI, https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html, Tier 1
13. **Navigation Design Best Practices** — Nielsen Norman Group, https://www.nngroup.com/articles/navigation-cognitive-strain/, Tier 1
14. **UX Patterns: Mega Menus** — Smashing Magazine, https://www.smashingmagazine.com/2009/03/mega-drop-down-menus-work-well/, Tier 2
15. **CSS Backdrop-Filter** — MDN Web Docs, https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter, Tier 1
