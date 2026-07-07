interface ShopifyMarkProps {
  className?: string;
  title?: string;
}

/** Officieel Shopify bag-mark met S. */
export function ShopifyMark({ className, title = "Shopify" }: ShopifyMarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="#95BF47"
        d="M15.6 3.1c.1 0 .2.1.2.2l-1 3.1-2.2-.7c.1-.6.3-1.2.7-1.6.7-.8 1.8-1 2.3-1Zm3.4 2.5-1.5-.5c-.2-2.2-1.5-3-2.8-3-.6 0-2 .4-3 2.3l-3.4.8c-1 .3-1.1.3-1.2 1.3L6 20.5l12 1.5 1.8-14.8a.8.8 0 0 0-.8-.8Z"
      />
      <path
        fill="#5E8E3E"
        d="M19 5.6 17.5 20l-12-1.5L17 3.8c.9 0 1.3.6 1.6 1.8l.4 0Z"
      />
      <path
        fill="#fff"
        d="M13.5 9.9c-.7-.1-1.4.2-1.8.8-.4.7-.2 1.5.6 1.9.5.2 1 .4 1.2.6.2.2.3.4.2.6s-.3.3-.6.3c-.5 0-1-.2-1.4-.5l-.4 1.1c.5.4 1.2.6 1.9.6 1.2 0 2-.7 2-1.9 0-.8-.4-1.3-1.1-1.6-.6-.2-1-.4-1-.7 0-.3.2-.4.5-.4.5 0 1 .2 1.3.3l.4-1a3 3 0 0 0-1.8-.1Z"
      />
    </svg>
  );
}
