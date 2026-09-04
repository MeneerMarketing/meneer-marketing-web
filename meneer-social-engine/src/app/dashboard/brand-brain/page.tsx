import { readFileSync } from "node:fs";
import { join } from "node:path";

export default function BrandBrainPage() {
  const content = readFileSync(
    join(process.cwd(), "src/brand/BRAND-BRAIN.md"),
    "utf-8"
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold">Brand Brain</h1>
        <p className="mt-2 text-mm-muted">
          Dit document gaat als system prompt naar Claude bij elke generatie.
        </p>
      </header>
      <article className="prose prose-slate max-w-none rounded-2xl border border-mm-surface bg-white p-8 shadow-sm">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {content}
        </pre>
      </article>
    </div>
  );
}
