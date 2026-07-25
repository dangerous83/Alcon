"use client";

import { useId, useState, type FormEvent } from "react";
import { services } from "@/lib/content/services";
import { validateQuoteForm, type QuoteFormErrors } from "@/lib/validation/quote";
import { Button } from "@/components/ui/Button";
import { clsx } from "@/lib/clsx";

type Status = "idle" | "submitting" | "success" | "error";

const budgetOptions = [
  "Under AED 10,000",
  "AED 10,000 – 30,000",
  "AED 30,000 – 75,000",
  "AED 75,000+",
  "Not sure yet",
];

export function QuoteForm() {
  const formId = useId();
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    // Capture the form element now — React nulls out the synthetic event's
    // currentTarget after this handler yields at the first `await`.
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    const clientErrors = validateQuoteForm(values);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      const firstErrorField = Object.keys(clientErrors)[0];
      document
        .getElementById(`${formId}-${firstErrorField}`)
        ?.focus({ preventScroll: false });
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setFormError(
          data.errors?.form ??
            "Something went wrong sending your request. Please try again."
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setFormError(
        "We couldn't reach the server. Check your connection and try again."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-border bg-surface p-8 text-center"
      >
        <h2 className="font-heading text-xl font-medium text-text-primary">
          Thanks — your request is in.
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          We'll follow up at the email address you provided, usually within
          one business day.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot — hidden from sighted users and screen readers, visible to bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Leave this field empty</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={`${formId}-name`}
          name="name"
          label="Full name"
          autoComplete="name"
          error={errors.name}
          required
        />
        <Field
          id={`${formId}-email`}
          name="email"
          type="email"
          inputMode="email"
          label="Email address"
          autoComplete="email"
          error={errors.email}
          required
        />
        <Field
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          label="Phone (optional)"
          autoComplete="tel"
        />
        <Field
          id={`${formId}-company`}
          name="company"
          label="Company (optional)"
          autoComplete="organization"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          id={`${formId}-service`}
          name="service"
          label="Service"
          required
          error={errors.service}
          options={services.map((s) => ({ value: s.slug, label: s.name }))}
        />
        <SelectField
          id={`${formId}-budget`}
          name="budget"
          label="Estimated budget (optional)"
          options={budgetOptions.map((b) => ({ value: b, label: b }))}
        />
      </div>

      <div>
        <label
          htmlFor={`${formId}-message`}
          className="block text-sm font-medium text-text-primary"
        >
          Project details <span aria-hidden>*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          required
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          className={clsx(
            "mt-2 w-full rounded-xl border bg-surface-elevated px-4 py-3 text-text-primary placeholder:text-text-secondary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent",
            errors.message ? "border-magenta" : "border-border"
          )}
          placeholder="What are you looking to build, and by when?"
        />
        {errors.message && (
          <p id={`${formId}-message-error`} className="mt-1 text-sm text-magenta">
            {errors.message}
          </p>
        )}
      </div>

      <p className="text-xs text-text-secondary">
        By submitting this form, you agree to be contacted about your
        project. We don't share your details with third parties.
      </p>

      {formError && (
        <p role="alert" className="text-sm text-magenta">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send request"}
      </Button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  inputMode,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label} {required && <span aria-hidden>*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={clsx(
          "mt-2 w-full min-h-11 rounded-xl border bg-surface-elevated px-4 py-2.5 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent",
          error ? "border-magenta" : "border-border"
        )}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-magenta">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  options,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label} {required && <span aria-hidden>*</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        defaultValue=""
        className={clsx(
          "mt-2 w-full min-h-11 rounded-xl border bg-surface-elevated px-4 py-2.5 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent",
          error ? "border-magenta" : "border-border"
        )}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-magenta">
          {error}
        </p>
      )}
    </div>
  );
}
