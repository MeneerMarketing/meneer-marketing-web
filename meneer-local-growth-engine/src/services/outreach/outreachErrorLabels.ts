const REASON_LABELS: Record<string, string> = {
  demo_lead: "Dit is een demo-lead.",
  do_not_contact: "Lead staat op niet benaderen.",
  preview_not_ready: "Preview is nog niet READY.",
  no_website: "Geen website-URL bij deze lead.",
  city_manually_protected: "Deze stad staat handmatig op beschermd.",
  not_website_transformation: "Lead is niet als website-transformatie gemarkeerd.",
  not_preview_eligible: "Lead is niet preview-eligible in de pipeline.",
  not_selected_for_outreach: "Lead is nog niet geselecteerd voor outreach.",
  assigned_template_missing: "Geen template toegewezen in de pipeline.",
  transformation_score_too_low: "Transformatiescore te laag voor automatische outreach.",
  transformation_confidence_too_low: "Transformatie-confidence te laag.",
  seo_record_incomplete: "SEO-analyse ontbreekt of is mislukt.",
  duplicate_assigned_template_in_city: "Dit template is al in gebruik in deze stad.",
  email_confidence_skip: "E-mailadres faalt confidence (geen MX of systeemadres).",
};

export function formatOutreachDraftError(message: string): string {
  const prefix = "Niet klaar voor outreach draft: ";
  if (!message.startsWith(prefix)) return message;

  const codes = message.slice(prefix.length).split(", ").filter(Boolean);
  const lines = codes.map((code) => {
    if (code.startsWith("lead_status_")) {
      return `Leadstatus ${code.replace("lead_status_", "")} is niet toegestaan voor automatische outreach.`;
    }
    return REASON_LABELS[code] ?? code;
  });

  return lines.join(" ");
}
