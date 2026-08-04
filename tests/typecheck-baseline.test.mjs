// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { diffDiagnostics } from '../scripts/typecheck-baseline.mjs';

describe('typecheck diagnostic baseline', () => {
  it('accepts an exact full-program diagnostic match', () => {
    expect(diffDiagnostics(['src/a.js(1,1): TS1: broken'], [
      'src/a.js(1,1): TS1: broken',
    ])).toEqual({ added: [], removed: [] });
  });

  it('fails closed on added, removed, or duplicate diagnostics', () => {
    expect(diffDiagnostics(
      ['src/a.js(1,1): TS1: broken', 'src/a.js(1,1): TS1: broken', 'src/b.js(2,2): TS2: old'],
      ['src/a.js(1,1): TS1: broken', 'src/c.js(3,3): TS3: new'],
    )).toEqual({
      added: ['src/c.js(3,3): TS3: new'],
      removed: ['src/a.js(1,1): TS1: broken', 'src/b.js(2,2): TS2: old'],
    });
  });
});
