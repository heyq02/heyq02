import { expect, test } from "vite-plus/test";
import { fullName } from "../src/index.ts";

test("exports the introduction", () => {
  expect(fullName()).toBe("永琪（Ari），全栈研发");
});
