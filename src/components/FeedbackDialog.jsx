import { useEffect, useRef, useState } from 'react';
import { Camera, Paperclip, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_ENDPOINT,
  FEEDBACK_IMPACTS,
  FEEDBACK_LIMITS,
  FEEDBACK_SCREENSHOT_MIMES,
  screenshotPayloadFromDataUrl,
} from '../lib/feedback';
import { CAPTURE_IGNORE_ATTR, capturePageScreenshot, pageCaptureSupported } from '../lib/captureScreenshot';
import { getRecentConsoleErrors } from '../lib/consoleCapture';

// Modal report form behind the global Feedback button.
//
// Anyone can file a bug, request or question without an account; the server turns it into
// a Jira issue in SLW. Deliberately NOT the /inquiry contact form — that is a sales
// channel, and mixing bug reports into it loses both.
//
// Accessibility: a modal has to trap focus, close on Escape, restore focus to whatever
// opened it, and mark the rest of the page inert to screen readers. A dialog that can be
// tabbed out of behind the overlay is worse than no dialog.
const EMPTY = { category: 'bug', impact: '', title: '', description: '', email: '' };

export default function FeedbackDialog({ open, onClose }) {
  const { pathname } = useLocation();
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);
  const openerRef = useRef(null);

  const [values, setValues] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | failed
  const [screenshot, setScreenshot] = useState(null); // { payload, previewUrl, label }
  const [capturing, setCapturing] = useState(false);
  const [screenshotError, setScreenshotError] = useState('');
  const fileRef = useRef(null);
  const [issueKey, setIssueKey] = useState('');
  const [formError, setFormError] = useState('');

  // Remember what had focus so it can be handed back on close, and reset the form each
  // time the dialog opens so a previous submission never bleeds into a new report.
  useEffect(() => {
    if (!open) return undefined;
    openerRef.current = document.activeElement;
    setValues(EMPTY);
    setFieldErrors({});
    setFormError('');
    setStatus('idle');
    setIssueKey('');
    setScreenshot(null);
    setScreenshotError('');
    const t = setTimeout(() => firstFieldRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      // Focus trap. Without this, Tab walks into the page behind the overlay, where the
      // user is interacting with content they cannot see.
      const focusables = panelRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    // Stop the page scrolling underneath the modal.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      openerRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (name) => (e) => setValues((p) => ({ ...p, [name]: e.target.value }));

  const attachDataUrl = (dataUrl, label) => {
    const result = screenshotPayloadFromDataUrl(dataUrl);
    if (!result.ok) {
      setScreenshotError(result.error);
      return;
    }
    setScreenshotError('');
    setScreenshot({ payload: result.payload, previewUrl: dataUrl, label });
  };

  const onCapturePage = async () => {
    setCapturing(true);
    setScreenshotError('');
    // Rasterizing the DOM cannot see through the dialog, so the capture excludes the
    // feedback UI via CAPTURE_IGNORE_ATTR — the shot shows the page behind it.
    const dataUrl = await capturePageScreenshot();
    setCapturing(false);
    if (!dataUrl) {
      // Same contract as Aries: silent degrade to the file picker rather than an error
      // the reporter can do nothing about.
      setScreenshotError('Could not capture the page. You can attach an image instead.');
      return;
    }
    attachDataUrl(dataUrl, 'Captured page');
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!FEEDBACK_SCREENSHOT_MIMES.includes(file.type)) {
      setScreenshotError('Use a PNG, JPEG or WebP image.');
      return;
    }
    if (file.size > FEEDBACK_LIMITS.screenshotBytesMax) {
      setScreenshotError(`Screenshot must be ${Math.floor(FEEDBACK_LIMITS.screenshotBytesMax / 1_000_000)} MB or smaller.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => attachDataUrl(String(reader.result), file.name);
    reader.onerror = () => setScreenshotError('That image could not be read.');
    reader.readAsDataURL(file);
  };

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setFieldErrors({});
    setFormError('');

    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...values,
          path: pathname,
          screenshot: screenshot?.payload ?? null,
          // Errors the page logged before the report was filed — usually the actual
          // stack trace behind "it broke".
          consoleErrors: getRecentConsoleErrors(),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 422 && data.fieldErrors) {
        setFieldErrors(data.fieldErrors);
        setStatus('idle');
        return;
      }
      if (!res.ok) {
        // Surface the server's own message when it has one — 429 explains the wait,
        // 502 points at the fallback address. A generic "something went wrong" would
        // throw that away.
        setFormError(data.message || 'We could not send that. Please email contact@sugarandleather.com.');
        setStatus('failed');
        return;
      }
      setIssueKey(data.key || '');
      setStatus('done');
    } catch {
      setFormError('We could not reach the server. Please email contact@sugarandleather.com.');
      setStatus('failed');
    }
  }

  const err = (name) =>
    fieldErrors[name] ? (
      <p className="feedback-dialog__error" id={`fb-${name}-error`}>
        {fieldErrors[name]}
      </p>
    ) : null;
  const aria = (name) =>
    fieldErrors[name] ? { 'aria-invalid': true, 'aria-describedby': `fb-${name}-error` } : {};

  return (
    <div className="feedback-dialog__scrim" {...{ [CAPTURE_IGNORE_ATTR]: '' }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="feedback-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-dialog-title"
        ref={panelRef}
      >
        <button type="button" className="feedback-dialog__close" onClick={onClose} aria-label="Close feedback">
          <X size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>

        {status === 'done' ? (
          <div role="status" aria-live="polite">
            <h2 className="feedback-dialog__title" id="feedback-dialog-title">
              Thank you.
            </h2>
            <p className="feedback-dialog__intro">
              Your report reached the team{issueKey ? ` as ${issueKey}` : ''}. If you left an email address we
              will follow up there.
            </p>
            <button type="button" className="btn btn-cream" onClick={onClose}>
              <span className="lab">Close</span>
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <h2 className="feedback-dialog__title" id="feedback-dialog-title">
              Report an issue
            </h2>
            <p className="feedback-dialog__intro">
              Found a bug, hit an error, or want to request something? Tell us here. No account needed.
            </p>

            <label className="feedback-dialog__label" htmlFor="fb-category">
              Type
            </label>
            <select id="fb-category" name="category" className="feedback-dialog__control" value={values.category} onChange={set('category')} ref={firstFieldRef}>
              {FEEDBACK_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <label className="feedback-dialog__label" htmlFor="fb-impact">
              How much does it affect you?
            </label>
            <select id="fb-impact" name="impact" className="feedback-dialog__control" value={values.impact} onChange={set('impact')} {...aria('impact')}>
              <option value="">Choose one…</option>
              {FEEDBACK_IMPACTS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
            {err('impact')}

            <label className="feedback-dialog__label" htmlFor="fb-title">
              Summary
            </label>
            <input id="fb-title" name="title" className="feedback-dialog__control" value={values.title} onChange={set('title')} maxLength={255} placeholder="Booking button does nothing on mobile" {...aria('title')} />
            {err('title')}

            <label className="feedback-dialog__label" htmlFor="fb-description">
              What happened?
            </label>
            <textarea id="fb-description" name="description" className="feedback-dialog__control feedback-dialog__control--area" rows={5} value={values.description} onChange={set('description')} maxLength={5000} placeholder="What you did, what you expected, what happened instead." {...aria('description')} />
            {err('description')}

            <label className="feedback-dialog__label" htmlFor="fb-email">
              Email <span className="feedback-dialog__optional">(optional, so we can reply)</span>
            </label>
            <input id="fb-email" name="email" type="email" className="feedback-dialog__control" value={values.email} onChange={set('email')} maxLength={254} placeholder="you@company.com" {...aria('email')} />
            {err('email')}

            <span className="feedback-dialog__label">Screenshot <span className="feedback-dialog__optional">(optional)</span></span>
            {screenshot ? (
              <div className="feedback-dialog__shot">
                <img src={screenshot.previewUrl} alt="" className="feedback-dialog__shot-preview" />
                <div className="feedback-dialog__shot-meta">
                  <span className="feedback-dialog__shot-label">{screenshot.label}</span>
                  <button
                    type="button"
                    className="feedback-dialog__shot-remove"
                    onClick={() => { setScreenshot(null); setScreenshotError(''); }}
                    disabled={status === 'sending'}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="feedback-dialog__shot-actions">
                {pageCaptureSupported() ? (
                  <button
                    type="button"
                    className="feedback-dialog__shot-btn"
                    onClick={onCapturePage}
                    disabled={capturing || status === 'sending'}
                  >
                    <Camera size={15} strokeWidth={1.75} aria-hidden="true" />
                    {capturing ? 'Capturing…' : 'Capture page'}
                  </button>
                ) : null}
                <button
                  type="button"
                  className="feedback-dialog__shot-btn"
                  onClick={() => fileRef.current?.click()}
                  disabled={status === 'sending'}
                >
                  <Paperclip size={15} strokeWidth={1.75} aria-hidden="true" />
                  Attach image
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept={FEEDBACK_SCREENSHOT_MIMES.join(',')}
                  onChange={onPickFile}
                  className="feedback-dialog__file"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>
            )}
            {screenshotError ? <p className="feedback-dialog__error">{screenshotError}</p> : null}

            {formError ? (
              <p className="feedback-dialog__error feedback-dialog__error--form" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="feedback-dialog__actions">
              <button type="submit" className="btn btn-cream" disabled={status === 'sending'}>
                <span className="lab">{status === 'sending' ? 'Sending…' : 'Send report'}</span>
              </button>
            </div>
            <p className="feedback-dialog__meta">Sent from {pathname}</p>
          </form>
        )}
      </div>
    </div>
  );
}
