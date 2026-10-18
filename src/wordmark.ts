/** 5 行实心字，只覆盖开屏用到的 ARI。 */
const glyphs: Record<string, readonly [string, string, string, string, string]> = {
  A: [" ████ ", "██  ██", "██████", "██  ██", "██  ██"],
  R: ["█████ ", "██  ██", "█████ ", "██ ██ ", "██  ██"],
  I: ["██████", "  ██  ", "  ██  ", "  ██  ", "██████"],
};

export function wordmark(text: string): string[] {
  const letters: Array<(typeof glyphs)[string] | undefined> = [];
  for (const char of text) {
    letters.push(glyphs[char]);
  }
  return [0, 1, 2, 3, 4].map((row) => letters.map((glyph) => glyph?.[row] ?? "      ").join(" "));
}
