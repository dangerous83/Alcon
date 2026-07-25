export type QuoteFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  website: string; // honeypot field — must stay empty
};

export type QuoteFormErrors = Partial<Record<keyof QuoteFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateQuoteForm(
  values: Partial<QuoteFormValues>
): QuoteFormErrors {
  const errors: QuoteFormErrors = {};

  if (!values.name || values.name.trim().length < 2) {
    errors.name = "Enter your full name.";
  }
  if (!values.email || !EMAIL_RE.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.service) {
    errors.service = "Select a service.";
  }
  if (!values.message || values.message.trim().length < 20) {
    errors.message = "Tell us a bit more — at least 20 characters.";
  }
  if (values.message && values.message.length > 4000) {
    errors.message = "Keep the message under 4000 characters.";
  }

  return errors;
}
