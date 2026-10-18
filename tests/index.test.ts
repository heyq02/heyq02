import { expect, test } from '@rstest/core';
import { fullName } from '../src/index.ts';

test('exports the introduction', () => {
  expect(fullName()).toBe('永琪（Ari），全栈研发');
});
