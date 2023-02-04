import { devMode } from "#client";
import { ActivityType, Client, ClientPresenceStatus } from "discord.js";

export function randomStatus(client: Client) {
  if (devMode) return;
  const statues: [
    Exclude<ActivityType, ActivityType.Custom>,
    string,
    ClientPresenceStatus
  ][] = [
    [ActivityType.Listening, "! Glitchy", "dnd"],
    [ActivityType.Playing, "with @sern/cli", "idle"],
    [ActivityType.Watching, "sern bots", "dnd"],
    [ActivityType.Listening, "/commands", "online"],
    [
      ActivityType.Watching,
      `${client.users.cache.filter((m) => !m.bot).size} user(s)`,
      "dnd",
    ],
  ];

  setInterval(() => {
    const shuffledStatuses = shuffleArray(statues);
    const [type, name, status] = [...shuffledStatuses].shift()!;
    client.user!.setPresence({ activities: [{ name, type }], status });
  }, 60_000);
}

function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return [...array];
}
