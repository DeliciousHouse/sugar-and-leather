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

export default function InquiryForm({ form, mailto }) {
  // The global feedback button links here as /inquiry?subject=Website%20feedback, so
  // feedback arrives labelled instead of landing in the pile as an untitled enquiry.
  // Read once via useState's initializer rather than syncing in an effect: the user must
  // stay free to edit the field afterwards, and re-applying the param on every render
  // would fight their typing.
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState(() => ({
    ...INITIAL,
    subject: searchParams.get('subject') ?? '',
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
