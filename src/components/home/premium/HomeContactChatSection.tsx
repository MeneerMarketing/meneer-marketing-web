"use client";

import { ContactChatExperience } from "@/components/contact/index/ContactChatExperience";
import { HOME_CONTACT_CHAT } from "@/data/home-premium";

export function HomeContactChatSection() {
  return (
    <ContactChatExperience
      variant="teaser"
      sectionId="contact-preview"
      heading={{
        eyebrow: HOME_CONTACT_CHAT.eyebrow,
        title: HOME_CONTACT_CHAT.title,
        subtitle: HOME_CONTACT_CHAT.subtitle,
      }}
    />
  );
}
