import { expect, test } from '@rstest/core';
import { fullName } from '../src/index.ts';

test('exports the introduction', () => {
  expect(fullName()).toBe('Ari He');
});
