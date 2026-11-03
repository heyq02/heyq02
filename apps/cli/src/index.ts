/** OSC 8 hyperlink: clickable in most terminals, plain label elsewhere. */
const link = (label: string, url: string): string =>
  `\u001B]8;;${url}\u001B\\${label}\u001B]8;;\u001B\\`

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
