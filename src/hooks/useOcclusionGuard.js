import { useEffect, useState } from 'react';

// Returns true when a fixed overlay at `ref` is sitting on top of something the user could
// otherwise click.
//
// A fixed bottom-right affordance permanently owns that corner, so anything the page puts
// there becomes unclickable. On this site that was not theoretical: at 375x812 the feedback
// pill swallowed every CTA on /capital-access-and-grant-services — both cal.com booking
// buttons, two mailto CTAs and nine FAQ rows — and at 1440x900 it swallowed the Inquiry
// form's Send message button and three of its inputs.
//
// Rather than guess safe offsets per page, ask the DOM directly: hit-test under the
// overlay's own corners and see what is beneath it. When an interactive element is there,
// the caller drops pointer-events so the click reaches the real control, and dims the
// overlay so the state is visible rather than mysterious.
const INTERACTIVE = 'a[href], button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])';

export function useOcclusionGuard(ref) {
  const [occluding, setOccluding] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let frame = 0;

    const check = () => {
      frame = 0;
      const r = node.getBoundingClientRect();
      if (!r.width) return;

      // Corners inset by 4px, plus the centre. Inset avoids sampling the antialiased edge,
      // where elementsFromPoint can report the element behind even with no real overlap.
      const points = [
        [r.left + 4, r.top + 4],
        [r.right - 4, r.top + 4],
        [r.left + 4, r.bottom - 4],
        [r.right - 4, r.bottom - 4],
        [r.left + r.width / 2, r.top + r.height / 2],
      ];

      const blocked = points.some(([x, y]) => {
        if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return false;
        // elementsFromPoint (plural) returns the whole stack, so we can look past our own
        // node to whatever it is covering.
        return document
          .elementsFromPoint(x, y)
          .filter((el) => !node.contains(el))
          .some((el) => el.matches?.(INTERACTIVE) || el.closest?.(INTERACTIVE));
      });

      setOccluding(blocked);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref]);

  return occluding;
}
