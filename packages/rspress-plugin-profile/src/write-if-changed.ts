import { readFile, writeFile } from 'node:fs/promises'

export async function writeIfChanged(path: string, content: string): Promise<boolean> {
  try {
    if ((await readFile(path, 'utf8')) === content) {
      return false
    }
  } catch {
    // Missing file → write.
  }
  await writeFile(path, content)
  return true
}
