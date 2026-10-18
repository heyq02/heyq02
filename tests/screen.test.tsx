import { cleanup, render } from 'ink-testing-library';
import { afterEach, expect, test } from '@rstest/core';
import { IntroScreen } from '../src/screen.tsx';
import { fullName, profile } from '../src/profile.ts';

afterEach(() => {
  cleanup();
});

test('keeps the introduction on screen until a key is pressed', () => {
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
  expect(frame).toContain('北京京东世纪贸易有限公司');
  expect(frame).toContain('负责京东外卖跨端小程序&H5、管理后台需求迭代');
  expect(frame).toContain('Vue');
  expect(frame).toContain('jd-opensource/taro-ui');
  expect(frame).toContain('★ 4.7k');
  expect(frame).toContain('hello@heyq02.com');
  expect(frame).toContain('任意键退出');
  expect(frame).toContain(profile.quote);
  expect(frame).not.toContain('tel:');

  view.stdin.write('x');
  expect(exited).toBe(true);
  view.unmount();
});

test('still shows the name on a short screen', () => {
  const view = render(<IntroScreen columns={80} rows={24} />);
  const frame = view.lastFrame() ?? '';

  expect(frame).toContain(fullName());
  expect(frame).toContain(profile.phone);
  expect(frame).toContain(profile.email);
  expect(frame).toContain('任意键退出');
  view.unmount();
});
