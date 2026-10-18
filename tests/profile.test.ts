import { expect, test } from "vite-plus/test";
import { main } from "../src/main.ts";
import { renderPlain } from "../src/plain.ts";
import { formatCount, fullName, profile } from "../src/profile.ts";

test("keeps the intro site copy", () => {
  expect(fullName()).toBe("永琪（Ari），全栈研发");
  expect(profile.bio).toBe(
    "南京邮电大学生物医学工程本科毕业。专注前端工程化，推动 AI 在业务场景中落地。",
  );
  expect(profile.phone).toBe("+86 135****8086");
  expect(profile.experiences[0]?.points).toEqual([
    "负责京东外卖跨端小程序&H5、管理后台需求迭代",
    "进行管理后台老旧架构升级，TP95性能优化",
    "本地生活产研C3层面 AI Infra 建设，提升研发效能",
  ]);
  expect(profile.skills.map((skill) => skill.name)).toEqual([
    "Vue",
    "React",
    "Next",
    "Rolldown",
    "Vite",
    "Oxc",
    "Spring",
    "Redis",
    "RabbitMQ",
    "Nginx",
    "Docker",
  ]);
});

test("formats star counts the same way as the site", () => {
  expect(formatCount(171)).toBe("171");
  expect(formatCount(1000)).toBe("1k");
  expect(formatCount(1500)).toBe("1.5k");
  expect(formatCount(4730)).toBe("4.7k");
});

test("prints a plain introduction without a phone link", () => {
  const text = renderPlain();

  expect(text).toContain("永琪（Ari），全栈研发");
  expect(text).toContain("北京京东世纪贸易有限公司 · 2024.06 – 至今");
  expect(text).toContain("jd-opensource/taro-ui · TypeScript · ★ 4.7k · 743 forks");
  expect(text).toContain("simpleicons.dev · TypeScript · ★ 171");
  expect(text).toContain("hello@heyq02.com");
  expect(text).not.toContain("tel:");
});

test("routes intro and hw", async () => {
  let written = "";
  let errors = "";
  const stdoutWrite = process.stdout.write.bind(process.stdout);
  const stderrWrite = process.stderr.write.bind(process.stderr);
  process.stdout.write = ((chunk: string | Uint8Array) => {
    written += String(chunk);
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((chunk: string | Uint8Array) => {
    errors += String(chunk);
    return true;
  }) as typeof process.stderr.write;

  try {
    await main(["--help"]);
    expect(written).toContain("intro");
    expect(written).toContain("hw");

    written = "";
    await main(["intro"]);
    expect(written).toContain(fullName());
    expect(written).toContain(profile.bio);

    written = "";
    await main(["hw"]);
    expect(written).toBe("Hello, World!\n");

    process.exitCode = 0;
    await main(["nope"]);
    expect(process.exitCode).toBe(1);
    expect(errors.length).toBeGreaterThan(0);
  } finally {
    process.stdout.write = stdoutWrite;
    process.stderr.write = stderrWrite;
    process.exitCode = 0;
  }
});
