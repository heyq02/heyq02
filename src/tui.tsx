import { render } from "ink";
import { Intro } from "./app.tsx";
import { openUrl } from "./open.ts";

export async function runTui(): Promise<void> {
  const app = render(<Intro onOpen={openUrl} />);
  await app.waitUntilExit();
}
