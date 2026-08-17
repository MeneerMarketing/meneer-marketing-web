"use client";

import { Mail, MapPin, Phone } from "lucide-react";

import {
  verticalInputClass,
  verticalSectionCompactClass,
} from "@/components/verticals/form/vertical-form-styles";

interface VerticalContactFieldsProps {
  heading: string;
  nameLabel: string;
  namePlaceholder: string;
  name: string;
  onNameChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  onFocusStart?: () => void;
  compact?: boolean;
}

export function VerticalContactFields({
  heading,
  nameLabel,
  namePlaceholder,
  name,
  onNameChange,
  city,
  onCityChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  onFocusStart,
  compact = false,
}: VerticalContactFieldsProps) {
  return (
    <div className={`${verticalSectionCompactClass} bg-slate-50/50`}>
      <p className="text-sm font-extrabold tracking-tight text-slate-900">
        {heading}
      </p>
      {!compact ? (
        <p className="mt-0.5 text-xs text-slate-500">
          Ik reageer rechtstreeks. Meestal binnen één werkdag.
        </p>
      ) : null}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <MapPin className="size-3 text-slate-400" aria-hidden />
            {nameLabel}
          </span>
          <input
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onFocus={onFocusStart}
            placeholder={namePlaceholder}
            className={verticalInputClass}
            autoComplete="organization"
          />
        </label>
        <label className="block text-sm">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <MapPin className="size-3 text-slate-400" aria-hidden />
            Plaats
          </span>
          <input
            required
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            onFocus={onFocusStart}
            placeholder="Stad"
            className={verticalInputClass}
            autoComplete="address-level2"
          />
        </label>
        <label className="block text-sm">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <Mail className="size-3 text-slate-400" aria-hidden />
            E-mail
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onFocus={onFocusStart}
            placeholder="jij@…"
            className={verticalInputClass}
            autoComplete="email"
          />
        </label>
        <label className="block text-sm">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <Phone className="size-3 text-slate-400" aria-hidden />
            Tel <span className="font-normal text-slate-400">opt.</span>
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            onFocus={onFocusStart}
            placeholder="06…"
            className={verticalInputClass}
            autoComplete="tel"
          />
        </label>
      </div>
    </div>
  );
}
