import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

// Only the feedback button's own subject is honoured: the literal prefix, optionally
// followed by ": " and a site path. Anything else yields an empty subject, which is the
// same state as arriving at /inquiry directly.
const FEEDBACK_SUBJECT_RE = /^Website feedback(: (\/[A-Za-z0-9/-]{0,60}|home))?$/;

function sanitizeSubject(raw) {
  if (!raw) return '';
  return FEEDBACK_SUBJECT_RE.test(raw) ? raw : '';
}

export default function InquiryForm({ form, mailto }) {
  // The global feedback button links here as /inquiry?subject=Website feedback: /about,
  // so feedback arrives labelled with its originating route instead of landing in the
  // pile as an untitled enquiry.
  //
  // The value is whitelisted, not passed through. This page is indexable and the subject
  // renders into a branded contact form, so an unvalidated `?subject=` lets anyone put
  // arbitrary text on a sugarandleather.com page via a crafted link. React escapes it and
  // encodeURIComponent bounds the mailto header, so this is not XSS or header injection —
  // it is a content-spoofing surface, and the fix is cheap.
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState(() => ({
    ...INITIAL,
    subject: sanitizeSubject(searchParams.get('subject')),
  }));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');

    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.phone ? `Phone: ${values.phone}` : null,
      '',
      values.message,
    ]
      .filter(Boolean)
      .join('\n');

    const mailtoUrl = `mailto:${mailto}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;

    try {
      window.location.href = mailtoUrl;
      setSubmitted(true);
    } catch {
      setError('Unable to open your email client. Please email us directly.');
    }
  };

  if (submitted) {
    return (
      <div className="inquiry-form-card inquiry-form-card--success" role="status" aria-live="polite">
        <h2 className="inquiry-form-title">{form.successTitle}</h2>
        <p className="inquiry-form-intro">{form.successBody}</p>
        {/* Submitting hands off to the visitor's mail client via window.location. There is
            no way to detect whether that succeeded, so this "success" state also shows on
            a machine with no mail handler configured — where nothing was actually sent.
            Surfacing the address means that visitor still has a way through instead of
            walking away believing the message went. */}
        <p className="inquiry-form-fallback">
          If your email app did not open, send it straight to{' '}
          <a href={`mailto:${mailto}`}>{mailto}</a>.
        </p>
        <button type="button" className="btn btn-outline inquiry-form-reset" onClick={() => setSubmitted(false)}>
          <span className="lab">Send another message</span>
        </button>
      </div>
    );
  }

  const { fields } = form;

  return (
    <form className="inquiry-form-card" onSubmit={onSubmit} noValidate>
      <h2 className="inquiry-form-title">{form.title}</h2>
      <p className="inquiry-form-intro">{form.intro}</p>

      <div className="inquiry-form-grid">
        <div className="inquiry-field inquiry-field--full">
          <label htmlFor="inquiry-name">
            {fields.name.label}
            <span className="inquiry-required" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="inquiry-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={fields.name.placeholder}
            value={values.name}
            onChange={onChange}
          />
        </div>

        <div className="inquiry-field">
          <label htmlFor="inquiry-email">
            {fields.email.label}
            <span className="inquiry-required" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="inquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={fields.email.placeholder}
            value={values.email}
            onChange={onChange}
          />
        </div>

        <div className="inquiry-field">
          <label htmlFor="inquiry-phone">{fields.phone.label}</label>
          <input
            id="inquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={fields.phone.placeholder}
            value={values.phone}
            onChange={onChange}
          />
        </div>

        <div className="inquiry-field inquiry-field--full">
          <label htmlFor="inquiry-subject">
            {fields.subject.label}
            <span className="inquiry-required" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="inquiry-subject"
            name="subject"
            type="text"
            required
            placeholder={fields.subject.placeholder}
            value={values.subject}
            onChange={onChange}
          />
        </div>

        <div className="inquiry-field inquiry-field--full">
          <label htmlFor="inquiry-message">
            {fields.message.label}
            <span className="inquiry-required" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="inquiry-message"
            name="message"
            rows={6}
            required
            placeholder={fields.message.placeholder}
            value={values.message}
            onChange={onChange}
          />
        </div>
      </div>

      {error ? (
        <p className="inquiry-form-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="inquiry-form-actions">
        <button type="submit" className="btn btn-cream inquiry-form-submit">
          <span className="lab">{form.submitLabel}</span>
          <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
