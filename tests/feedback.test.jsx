import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FeedbackButton from '../src/components/FeedbackButton';
import FeedbackDialog from '../src/components/FeedbackDialog';

const originalFetch = globalThis.fetch;

const response = (status, body) => ({
  json: vi.fn().mockResolvedValue(body),
  ok: status >= 200 && status < 300,
  status,
});

function renderDialog(path = '/about') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FeedbackDialog open onClose={vi.fn()} />
    </MemoryRouter>,
  );
}

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText('How much does it affect you?'), {
    target: { value: 'p2_feature_degraded' },
  });
  fireEvent.change(screen.getByLabelText('Summary'), {
    target: { value: 'Booking button is broken' },
  });
  fireEvent.change(screen.getByLabelText('What happened?'), {
    target: { value: 'The booking button did not open.' },
  });
  fireEvent.change(screen.getByLabelText(/Email/), {
    target: { value: 'reporter@example.com' },
  });
}

afterEach(() => {
  cleanup();
  delete document.body.dataset.hiddenPageData;
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('privacy-safe feedback submission', () => {
  it('sends only explicit reporter fields and pathname context', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(201, { key: 'SLW-55' }));
    document.body.dataset.hiddenPageData = 'HIDDEN-PAGE-SECRET';
    renderDialog('/about?token=QUERY-SECRET#HASH-SECRET');
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: 'Send report' }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    const [endpoint, options] = globalThis.fetch.mock.calls[0];
    const payload = JSON.parse(options.body);

    expect(endpoint).toBe('/api/feedback/submit');
    expect(options.referrerPolicy).toBe('no-referrer');
    expect(options.credentials).toBe('omit');
    expect(payload).toStrictEqual({
      category: 'bug',
      impact: 'p2_feature_degraded',
      title: 'Booking button is broken',
      description: 'The booking button did not open.',
      email: 'reporter@example.com',
      path: '/about',
    });
    expect(JSON.stringify(payload)).not.toMatch(
      /HIDDEN-PAGE-SECRET|QUERY-SECRET|HASH-SECRET|consoleErrors|screenshot|project|userAgent|viewport/,
    );
    expect(screen.queryByText(/^Screenshot/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Capture page|Attach image/ })).not.toBeInTheDocument();
  });

  it('bounds pathname context before sending the request', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(response(201, { key: 'SLW-55' }));
    renderDialog(`/${'a'.repeat(250)}`);
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: 'Send report' }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    expect(JSON.parse(globalThis.fetch.mock.calls[0][1].body).path).toHaveLength(200);
  });

  it('allows only one request while a rapid submission is in flight', async () => {
    let resolveRequest;
    globalThis.fetch = vi.fn(() => new Promise((resolve) => {
      resolveRequest = resolve;
    }));
    renderDialog();
    fillRequiredFields();
    const form = screen.getByRole('button', { name: 'Send report' }).closest('form');

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    screen.getByLabelText(/Email/).focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('button', { name: 'Close feedback' })).toHaveFocus();
    await act(async () => resolveRequest(response(201, { key: 'SLW-55' })));
    expect(await screen.findByText('Thank you.')).toBeInTheDocument();
  });

  it('keeps the in-flight lock across close and reopen', async () => {
    let resolveRequest;
    globalThis.fetch = vi.fn(() => new Promise((resolve) => {
      resolveRequest = resolve;
    }));
    const onClose = vi.fn();
    const dialog = (open) => (
      <MemoryRouter>
        <FeedbackDialog open={open} onClose={onClose} />
      </MemoryRouter>
    );
    const view = render(dialog(true));
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: 'Send report' }));

    view.rerender(dialog(false));
    view.rerender(dialog(true));
    const sending = await screen.findByRole('button', { name: 'Sending…' });
    sending.closest('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    await act(async () => resolveRequest(response(201, { key: 'SLW-55' })));
    expect(await screen.findByText('Thank you.')).toBeInTheDocument();
  });

  it('surfaces a failure and permits an intentional retry', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(response(502, { message: 'Temporary failure.' }))
      .mockResolvedValueOnce(response(201, { key: 'SLW-55' }));
    renderDialog();
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: 'Send report' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Temporary failure.');

    const retry = screen.getByRole('button', { name: 'Send report' });
    expect(retry).toBeEnabled();
    fireEvent.click(retry);

    expect(await screen.findByText('Thank you.')).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});

describe('feedback accessibility and occlusion behavior', () => {
  it('traps keyboard focus, closes on Escape, and restores trigger focus', async () => {
    render(
      <MemoryRouter>
        <FeedbackButton />
      </MemoryRouter>,
    );
    const trigger = screen.getByRole('button', { name: 'Send feedback' });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Report an issue' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    await waitFor(() => expect(screen.getByLabelText('Type')).toHaveFocus());

    const close = screen.getByRole('button', { name: 'Close feedback' });
    const submit = screen.getByRole('button', { name: 'Send report' });
    close.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(submit).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('removes an occluding feedback trigger from pointer and keyboard interaction', async () => {
    const zero = { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0, toJSON() {} };
    const overlap = { bottom: 160, height: 60, left: 100, right: 220, top: 100, width: 120, x: 100, y: 100, toJSON() {} };
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect() {
      return this.id === 'covered-control' || this.dataset.testid === 'feedback-button' ? overlap : zero;
    });

    render(
      <MemoryRouter>
        <button id="covered-control" type="button">Covered control</button>
        <FeedbackButton />
      </MemoryRouter>,
    );

    const trigger = screen.getByTestId('feedback-button');
    await waitFor(() => expect(trigger).toHaveClass('feedback-btn--tucked'));
    expect(trigger).toHaveAttribute('aria-hidden', 'true');
    expect(trigger).toHaveAttribute('tabindex', '-1');
  });
});
