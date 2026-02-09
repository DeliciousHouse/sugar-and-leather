"use client";

import { useState } from "react";

type FormState = {
  name: string;
  business: string;
  email: string;
  phone: string;
  help: string;
  budget: string;
  timeline: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  business: "",
  email: "",
  phone: "",
  help: "",
  budget: "",
  timeline: "",
};

const budgets = [
  "Under $1k / month",
  "$1k–$3k / month",
  "$3k–$7k / month",
  "$7k+ / month",
  "Not sure yet",
];

const timelines = ["ASAP", "2–4 weeks", "1–2 months", "3+ months"];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (data: FormState) => {
    const nextErrors: FormErrors = {};
    if (!data.name.trim()) nextErrors.name = "Please share your name.";
    if (!data.business.trim()) nextErrors.business = "Please share your business name.";
    if (!data.email.trim()) {
      nextErrors.email = "Please share a work email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      nextErrors.email = "Please enter a valid email.";
    }
    if (!data.help.trim())
      nextErrors.help = "Tell us what you want help with.";
    if (!data.budget) nextErrors.budget = "Select a budget range.";
    if (!data.timeline) nextErrors.timeline = "Select a timeline.";
    return nextErrors;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Request failed");
      setIsSubmitted(true);
      setFormData(initialState);
    } catch (error) {
      setErrors({ email: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-zinc-900">Thanks — we got it.</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          We will review your details and reply within two business days. If it is
          urgent, include that in your message and we will prioritize it.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
          onClick={() => setIsSubmitted(false)}
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-8"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-zinc-600">
          Name *
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            required
          />
          {errors.name && (
            <span id="name-error" className="text-xs text-rose-600" role="alert">
              {errors.name}
            </span>
          )}
        </label>
        <label className="grid gap-2 text-sm text-zinc-600">
          Business *
          <input
            name="business"
            value={formData.business}
            onChange={handleChange}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            aria-invalid={Boolean(errors.business)}
            aria-describedby={errors.business ? "business-error" : undefined}
            required
          />
          {errors.business && (
            <span id="business-error" className="text-xs text-rose-600" role="alert">
              {errors.business}
            </span>
          )}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-zinc-600">
          Email *
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          {errors.email && (
            <span id="email-error" className="text-xs text-rose-600" role="alert">
              {errors.email}
            </span>
          )}
        </label>
        <label className="grid gap-2 text-sm text-zinc-600">
          Phone (optional)
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-zinc-600">
        What do you want help with? *
        <textarea
          name="help"
          value={formData.help}
          onChange={handleChange}
          rows={4}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
          aria-invalid={Boolean(errors.help)}
          aria-describedby={errors.help ? "help-error" : undefined}
          required
        />
        {errors.help && (
          <span id="help-error" className="text-xs text-rose-600" role="alert">
            {errors.help}
          </span>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-zinc-600">
          Budget range *
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? "budget-error" : undefined}
            required
          >
            <option value="">Select a range</option>
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
          {errors.budget && (
            <span id="budget-error" className="text-xs text-rose-600" role="alert">
              {errors.budget}
            </span>
          )}
        </label>
        <label className="grid gap-2 text-sm text-zinc-600">
          Timeline *
          <select
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            aria-invalid={Boolean(errors.timeline)}
            aria-describedby={errors.timeline ? "timeline-error" : undefined}
            required
          >
            <option value="">Select a timeline</option>
            {timelines.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
          {errors.timeline && (
            <span id="timeline-error" className="text-xs text-rose-600" role="alert">
              {errors.timeline}
            </span>
          )}
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}
