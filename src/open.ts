import { spawn } from "node:child_process";

export function openUrl(url: string): void {
  const child =
    process.platform === "darwin"
      ? spawn("open", [url], { detached: true, stdio: "ignore" })
      : process.platform === "win32"
        ? spawn("cmd", ["/c", "start", "", url], {
            detached: true,
            stdio: "ignore",
            windowsHide: true,
          })
        : spawn("xdg-open", [url], { detached: true, stdio: "ignore" });

  child.unref();
}
