import type { KennisbankArticle } from "@/data/kennisbank/types";

export interface KennisbankFaqItem {
  question: string;
  answer: string;
}

/** FAQ voor schema + sectie: expliciet, callout, of afgeleid van titel. */
export function getArticleFaqs(article: KennisbankArticle): KennisbankFaqItem[] {
  if (article.faqs?.length) {
    return [...article.faqs];
  }

  const callout = article.sections.find(
    (s): s is Extract<typeof s, { type: "callout" }> =>
      s.type === "callout" && /kort antwoord/i.test(s.text),
  );

  if (callout) {
    const answer = callout.text.replace(/^kort antwoord:\s*/i, "").trim();
    return [
      {
        question: article.title.endsWith("?")
          ? article.title
          : `Wat is de kern van: ${article.title}?`,
        answer,
      },
      {
        question: "Voor wie is dit artikel bedoeld?",
        answer: article.description,
      },
    ];
  }

  return [
    {
      question: article.title.endsWith("?") ? article.title : `${article.title}?`,
      answer: article.description,
    },
  ];
}
