import { EditorialFigure } from "@/components/templates/editorial/EditorialFigure";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import type { EditorialImage } from "@/components/templates/editorial/editorialModel";

interface Props {
  images: EditorialImage[];
  studioName: string;
}

/** Horizontale snap-rail. Native scroll, dus geen JS en geen scroll-listener. */
export function EditorialGallery({ images, studioName }: Props) {
  if (images.length < 3) return null;

  return (
    <section
      aria-label={`Beelden van ${studioName}`}
      className="border-b border-[var(--ed-line)] py-14 md:py-16"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 pb-7 md:px-10 lg:px-16">
        <p className="ed-label text-[var(--ed-accent)]">In de studio</p>
        <p className="ed-label flex items-center gap-2.5 text-[var(--ed-fg-52)]">
          Sleep
          <EditorialIcon name="arrow" className="h-3.5 w-3.5" />
        </p>
      </div>

      <div className="ed-rail flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:gap-4 md:px-10 lg:px-16">
        {images.map((image, index) => (
          <EditorialFigure
            key={image.url}
            image={image}
            hoverZoom
            sizes="(max-width: 768px) 84vw, 40vw"
            className={`shrink-0 snap-start ${
              index % 3 === 0
                ? "aspect-[4/5] w-[76vw] md:w-[38vw] lg:w-[26vw]"
                : "aspect-[4/3] w-[84vw] md:w-[46vw] lg:w-[34vw]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
