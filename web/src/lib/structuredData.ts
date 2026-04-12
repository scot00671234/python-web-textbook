import { SITE_NAME } from "./site";

const CTX = "https://schema.org";

export function organizationJsonLd(base: string): Record<string, unknown> {
  const id = `${base}/#organization`;
  return {
    "@context": CTX,
    "@type": "Organization",
    "@id": id,
    name: SITE_NAME,
    url: base,
    logo: `${base}/favicon.svg`,
  };
}

export function websiteJsonLd(
  base: string,
  description: string,
  searchUrlTemplate: string,
): Record<string, unknown> {
  return {
    "@context": CTX,
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: SITE_NAME,
    description,
    url: base,
    publisher: { "@id": `${base}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchUrlTemplate,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqPageJsonLd(base: string, items: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    "@context": CTX,
    "@type": "FAQPage",
    "@id": `${base}/#faq`,
    url: `${base}/`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  base: string,
  crumbs: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": CTX,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${base}${c.path.startsWith("/") ? c.path : `/${c.path}`}`,
    })),
  };
}

export function learningResourceLessonJsonLd(opts: {
  base: string;
  name: string;
  description: string;
  path: string;
  position?: number;
  moduleName?: string;
}): Record<string, unknown> {
  const url = `${opts.base}${opts.path.startsWith("/") ? opts.path : `/${opts.path}`}`;
  const about: Record<string, unknown>[] = [{ "@type": "Thing", name: "Python (programming language)" }];
  if (opts.moduleName) {
    about.push({ "@type": "Thing", name: opts.moduleName });
  }
  return {
    "@context": CTX,
    "@type": "LearningResource",
    name: opts.name,
    description: opts.description,
    url,
    isAccessibleForFree: true,
    learningResourceType: "Lesson",
    inLanguage: "en",
    isPartOf: {
      "@type": "Course",
      name: SITE_NAME,
      url: `${opts.base}/learn`,
      provider: { "@id": `${opts.base}/#organization` },
    },
    ...(opts.position != null ? { position: opts.position } : {}),
    about,
  };
}
