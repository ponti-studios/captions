import { createElement } from 'react';
import { act, create } from 'react-test-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCaptions } from '../src/useCaptions';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const TEXT = Array.from({ length: 40 }, (_, i) => `w${i}`).join(' ');

function run(props: { id: string; paused?: boolean }) {
  let latest = { count: 0 };
  const Probe = (p: typeof props) => {
    latest = useCaptions({ text: TEXT, ...p });
    return null;
  };
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(createElement(Probe, props));
  });
  return {
    get count() {
      return latest.count;
    },
    update: (next: typeof props) => act(() => renderer.update(createElement(Probe, next))),
  };
}

describe('useCaptions clock', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('keeps up with real time when timers are throttled', () => {
    const view = run({ id: 'a' });
    // The browser held the timer back: 5s pass on the wall clock but only one tick fires.
    act(() => {
      vi.setSystemTime(Date.now() + 5000);
      vi.advanceTimersByTime(100);
    });
    expect(view.count).toBe(Math.floor(5.1 * 2.7) + 1);
  });

  it('stops while paused and picks up where it left off', () => {
    const view = run({ id: 'a' });
    act(() => void vi.advanceTimersByTime(1000));
    const before = view.count;
    view.update({ id: 'a', paused: true });
    act(() => void vi.advanceTimersByTime(5000));
    expect(view.count).toBe(before);
    view.update({ id: 'a', paused: false });
    act(() => void vi.advanceTimersByTime(1000));
    expect(view.count).toBeGreaterThan(before);
  });

  it('restarts from the top on a new id', () => {
    const view = run({ id: 'a' });
    act(() => void vi.advanceTimersByTime(3000));
    view.update({ id: 'b' });
    expect(view.count).toBe(1);
  });
});
