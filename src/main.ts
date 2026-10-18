import { renderPlain } from "./plain.ts";
import { runTui } from "./tui.tsx";

const help = `heyq02

永琪（Ari），全栈研发。

  npx heyq02           在终端里看介绍，回车退出
  npx heyq02 --plain   只打印文本
  npx heyq02 --help    显示这段说明
`;

export async function main(argv = process.argv.slice(2)): Promise<void> {
  if (argv.includes("--help") || argv.includes("-h")) {
    process.stdout.write(help);
    return;
  }

  const interactive =
    !argv.includes("--plain") && Boolean(process.stdout.isTTY && process.stdin.isTTY);

  if (!interactive) {
    process.stdout.write(`${renderPlain()}\n`);
    return;
  }

  await runTui();
}
