import type { StoryBlock } from "../types";

/** Full-bleed editorial story: asymmetric media + typography, no card. */
export function ProductStorySection({
  story,
  variant = "EDITORIAL_STORY",
}: {
  story: StoryBlock | null;
  variant?: "EDITORIAL_STORY" | "EDITORIAL_STORY_REVERSE";
}) {
  if (!story) return null;

  return (
    <section
      className={`pdtc-story${variant === "EDITORIAL_STORY_REVERSE" ? " is-reverse" : ""}`}
      data-source={story.source}
    >
      <div className="pdtc-story-grid">
        {story.backgroundImage ? (
          <figure
            className={`pdtc-story-media${story.mediaFit === "contain" ? " is-contain" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={story.backgroundImage} alt="" loading="lazy" />
          </figure>
        ) : null}

        <div className="pdtc-story-copy">
          <div className="pdtc-story-copy-inner">
            {story.kicker ? <span className="pdtc-eyebrow">{story.kicker}</span> : null}
            <h2 className="pdtc-display">{story.title}</h2>
            <p className="pdtc-body-lg">{story.body}</p>
            {story.ctaLabel ? (
              <a href="#pdtc-buy-area" className="pdtc-linkcta">
                {story.ctaLabel}
                <span className="pdtc-cta-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
