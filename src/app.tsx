import { Box, Text, useApp, useInput } from "ink";
import { useRef, useState } from "react";
import { actions } from "./actions.ts";
import { openUrl } from "./open.ts";
import { fullName, profile } from "./profile.ts";
import { applySelection, type SelectionEvent } from "./select.ts";

const accent = "#d62d16";

function skillLines(): string[] {
  const lines: string[] = [];
  for (let index = 0; index < profile.skills.length; index += 3) {
    lines.push(
      profile.skills
        .slice(index, index + 3)
        .map((skill) => skill.name)
        .join("  "),
    );
  }
  return lines;
}

function eventFromInput(
  input: string,
  key: { upArrow: boolean; downArrow: boolean; return: boolean; escape: boolean },
): SelectionEvent | null {
  if (key.escape || input === "q" || input === "Q") {
    return "quit";
  }
  if (key.upArrow) {
    return "up";
  }
  if (key.downArrow) {
    return "down";
  }
  if (key.return) {
    return "enter";
  }
  return null;
}

function Row({ label, selected }: { label: string; selected: boolean }) {
  return (
    <Text color={selected ? accent : undefined}>{selected ? `› ${label}` : `  ${label}`}</Text>
  );
}

export function Intro({
  onOpen = openUrl,
  onExit,
}: {
  onOpen?: (href: string) => void;
  onExit?: () => void;
}) {
  const { exit } = useApp();
  const [index, setIndex] = useState<number | null>(null);
  const indexRef = useRef<number | null>(null);
  const current = index === null ? undefined : actions[index];

  const quit = () => {
    onExit?.();
    exit();
  };

  useInput((input, key) => {
    const event = eventFromInput(input, key);
    if (!event) {
      return;
    }

    const effect = applySelection({ index: indexRef.current }, event, actions.length);
    if (effect.type === "exit") {
      quit();
      return;
    }
    if (effect.type === "open") {
      const href = actions[effect.index]?.href;
      if (href) {
        onOpen(href);
      }
      return;
    }
    indexRef.current = effect.index;
    setIndex(effect.index);
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1}>
      <Text bold>{fullName()}</Text>
      <Box marginTop={1}>
        <Text>{profile.bio}</Text>
      </Box>
      <Text dimColor>{profile.quote}</Text>
      <Box marginTop={1}>
        <Row label="intro.heyq02.com" selected={current?.id === "site"} />
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text>经历</Text>
        {profile.experiences.map((job, jobIndex) => (
          <Box key={job.company} flexDirection="column">
            <Row
              label={`${job.company}  ${job.start} – ${job.end}`}
              selected={current?.id === `experience-${jobIndex}`}
            />
            {job.points.map((point) => (
              <Text key={point} dimColor>{`    · ${point}`}</Text>
            ))}
          </Box>
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text>技能</Text>
        {skillLines().map((line) => (
          <Text key={line}>{`  ${line}`}</Text>
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text>开源</Text>
        {profile.projects.map((project) => (
          <Row
            key={project.name}
            label={
              actions.find((action) => action.id === `project-${project.name}`)?.label ??
              project.name
            }
            selected={current?.id === `project-${project.name}`}
          />
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text>联系</Text>
        {profile.places.map((place) => (
          <Row
            key={place.label}
            label={`${place.label}  ${place.detail}`}
            selected={current?.id === `place-${place.label}`}
          />
        ))}
        <Text dimColor>{`  ${profile.phone}`}</Text>
        <Row label={profile.email} selected={current?.id === "email"} />
      </Box>

      <Box marginTop={1} flexDirection="column">
        {current?.detail ? <Text dimColor>{current.detail}</Text> : null}
        <Text dimColor>
          {index === null ? "↑↓ 选择 · 回车退出" : "↑↓ 选择 · 回车打开 · q 退出"}
        </Text>
      </Box>
    </Box>
  );
}
