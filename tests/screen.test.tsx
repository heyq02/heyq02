import { cleanup, render } from 'ink-testing-library';
import { afterEach, expect, test } from '@rstest/core';
import { fullName, profile } from '../src/profile.ts';

// Node 26 links static imports in parallel. ink-testing-library imports Ink,
// so the screen is loaded after that import finishes. A static import reads
// `measureElement` before the binding is initialized.
async function loadIntroScreen() {
  const { IntroScreen } = await import('../src/screen.tsx');
  return IntroScreen;
}

afterEach(() => {
  cleanup();
});

test('keeps the introduction on screen until a key is pressed', async () => {
  const IntroScreen = await loadIntroScreen();
  let exited = false;
  const view = render(
    <IntroScreen
      columns={100}
      rows={46}
      onExit={() => {
        exited = true;
      }}
    />,
  );
  const frame = view.lastFrame() ?? '';

  expect(frame).toContain(fullName());
  expect(frame).toContain('JD.com, Inc.');
  expect(frame).toContain(
    'Owned iterations for JD Takeout across the mini program, H5, and admin console',
  );
  expect(frame).toContain('Vue');
  expect(frame).toContain('jd-opensource/taro-ui');
  expect(frame).toContain('★ 4.7k');
  expect(frame).toContain('hello@heyq02.com');
  expect(frame).toContain('any key to exit');
  expect(frame).not.toContain('tel:');

  view.stdin.write('x');
  expect(exited).toBe(true);
  view.unmount();
});

test('still shows the name on a short screen', async () => {
  const IntroScreen = await loadIntroScreen();
  const view = render(<IntroScreen columns={80} rows={24} />);
  const frame = view.lastFrame() ?? '';

  expect(frame).toContain(fullName());
  expect(frame).toContain(profile.phone);
  expect(frame).toContain(profile.email);
  expect(frame).toContain('any key to exit');
  view.unmount();
});
