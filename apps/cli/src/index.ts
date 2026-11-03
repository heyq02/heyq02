/**
 * OSC 8 hyperlink, so links are clickable. Skipped when stdout is not a
 * terminal, keeping piped or redirected output plain text.
 */
const link = (label: string, url: string): string =>
  process.stdout.isTTY ? `\u001B]8;;${url}\u001B\\${label}\u001B]8;;\u001B\\` : label

const links = [
  ['www', 'https://heyq02.com'],
  ['GitHub', 'https://github.com/heyq02'],
  ['哔哩哔哩', 'https://space.bilibili.com/3493273159075938'],
  ['X', 'https://x.com/heyq02'],
  ['QQ', 'https://qm.qq.com/q/BcL0zUOaxa']
]

console.log('Token is all your need 💰')
console.log('────────────────────────────────')
console.log(links.map(([label, url]) => link(label, url)).join(' ᐧ '))
