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
      const p = node.getBoundingClientRect();
      if (!p.width) return;

      // Exact rectangle intersection against every interactive element, NOT point sampling.
      //
      // The first version of this sampled the overlay's four corners plus its centre, and
      // that missed real overlaps: at the footer the pill covers "Privacy" and "Terms",
      // but two probes landed above the links, two below, and the centre fell in the 26px
      // gap between them — so the guard saw nothing while both links were unclickable.
      // Any fixed sample grid has gaps like that; comparing rects does not.
      const blocked = Array.from(document.querySelectorAll(INTERACTIVE)).some((el) => {
        if (node.contains(el)) return false;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return false;
        // Skip anything off-screen before the intersection test — cheap rejection first.
        if (r.bottom <= 0 || r.top >= window.innerHeight) return false;
        return !(r.right <= p.left || r.left >= p.right || r.bottom <= p.top || r.top >= p.bottom);
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
