"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SeoLandingSceneBreak as SceneBreakData } from "@/data/seo-landings/types";
import type { EnrichedSeoLandingPage } from "@/data/seo-landings/enriched-types";
import { Reveal } from "@/components/effects/Reveal";
import { SeoLandingVisualPanel } from "@/components/seo-landing/SeoLandingVisualPanel";

interface SeoLandingSceneBreakProps {
  scene: SceneBreakData;
  page: EnrichedSeoLandingPage;
  flip?: boolean;
}

/**
 * Illustratieve pauze midden op de pagina: visual + korte uitleg.
 */
export function SeoLandingSceneBreak({
  scene,
  page,
  flip = false,
}: SeoLandingSceneBreakProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white py-14 lg:py-18"
      aria-labelledby={`scene-${scene.placement}`}
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <Reveal>
          <div
            className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-14 ${
              flip ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
              className="flex justify-center lg:justify-start"
            >
              <SeoLandingVisualPanel
                visual={scene.visual}
                keyword={page.primaryKeyword}
              />
            </motion.div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
                {scene.eyebrow}
              </p>
              <h2
                id={`scene-${scene.placement}`}
                className="mt-3 text-pretty text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl"
              >
                {scene.title}
              </h2>
              {scene.caption ? (
                <p className="mt-4 text-pretty text-base leading-relaxed text-slate-600 lg:text-lg">
                  {scene.caption}
                </p>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
