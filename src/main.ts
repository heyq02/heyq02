import {
  command,
  description,
  name,
  parse,
  printErrors,
  printHelp,
  printVersion,
  version,
} from "@bomb.sh/router";
import { renderPlain } from "./plain.ts";

const program = command(
  name("heyq02"),
  description("永琪（Ari），全栈研发。"),
  version("0.1.0"),
  command(name("intro"), description("打印介绍。")),
  command(name("hw"), description("打印 Hello, World!")),
);

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const result = parse(program, { argv });

  if (!result.ok) {
    process.stderr.write(`${printErrors(result)}\n`);
    process.exitCode = 1;
    return;
  }

  switch (result.method) {
    case "help": {
      process.stdout.write(`${printHelp(result)}\n`);
      return;
    }
    case "version": {
      process.stdout.write(`${printVersion(result)}\n`);
      return;
    }
    case "execute": {
      switch (result.route) {
        case "/": {
          const help = parse(program, { argv: ["--help"] });
          if (help.ok && help.method === "help") {
            process.stdout.write(`${printHelp(help)}\n`);
          }
          return;
        }
        case "/intro": {
          process.stdout.write(`${renderPlain()}\n`);
          return;
        }
        case "/hw": {
          process.stdout.write("Hello, World!\n");
          return;
        }
      }
    }
  }
}
