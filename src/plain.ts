import { formatCount, fullName, profile } from "./profile.ts";

export function renderPlain(): string {
  const lines = [fullName(), "", profile.bio, "", profile.quote, "", profile.site, "", "经历"];

  for (const job of profile.experiences) {
    lines.push(
      `${job.company} · ${job.start} – ${job.end}`,
      job.href,
      ...job.points.map((point) => `- ${point}`),
      "",
    );
  }

  lines.push("技能");
  for (const skill of profile.skills) {
    lines.push(`${skill.name} — ${skill.summary}`, skill.href);
  }

  lines.push("", "开源");
  for (const project of profile.projects) {
    const stats = [`★ ${formatCount(project.stars)}`];
    if (project.forks > 0) {
      stats.push(`${formatCount(project.forks)} forks`);
    }
    lines.push(
      `${project.name} · ${project.language} · ${stats.join(" · ")}`,
      project.summary,
      project.href,
      "",
    );
  }

  lines.push("联系");
  for (const place of profile.places) {
    lines.push(`${place.label} · ${place.detail}`, place.href);
  }
  lines.push(profile.phone, profile.email);

  return lines.join("\n");
}
