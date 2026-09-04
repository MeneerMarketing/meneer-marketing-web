import type { StoryBlock } from "../types";

/**
 * Dark narrative moment. Uses a photographic asset when one is available;
 * otherwise it stays purely typographic instead of forcing a marketing
 * graphic behind the headline.
 */
export function ImmersiveStorySection({
  story,
  meta,
}: {
  story: StoryBlock | null;
  meta?: string[];
}) {
  if (!story) return null;
  const hasMedia = Boolean(story.backgroundImage);

  return (
    <section
      className={`pdtc-immersive${hasMedia ? " has-media" : " is-type"}`}
      data-source={story.source}
    >
      {hasMedia ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pdtc-immersive-media" src={story.backgroundImage!} alt="" loading="lazy" />
          <span className="pdtc-immersive-veil" aria-hidden="true" />
        </>
      ) : null}

      <div className="pdtc-container pdtc-immersive-inner">
        <div className="pdtc-immersive-copy">
          {story.kicker ? (
            <span className="pdtc-eyebrow pdtc-eyebrow--brand">{story.kicker}</span>
          ) : null}
          <h2 className="pdtc-display pdtc-display--xl">{story.title}</h2>
        </div>

        <div className="pdtc-immersive-side">
          <p className="pdtc-immersive-body">{story.body}</p>
          {meta && meta.length > 0 ? (
            <ul className="pdtc-immersive-meta" role="list">
              {meta.slice(0, 3).map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
