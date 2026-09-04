type JsonLdData = Record<string, unknown> | ReadonlyArray<Record<string, unknown>>;

interface JsonLdScriptProps {
  data: JsonLdData;
}

/** Server-side JSON-LD. Escaped zodat `</script>` in content niet breekt. */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload.length === 1 ? payload[0] : payload).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}
