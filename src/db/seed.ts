import { client, db } from ".";
import { goalCompletions, goals } from "./schema";
import { dayjs } from "@/lib/dayjs-date";

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: "estudar", desiredWeeklyFrequency: 5 },
      { title: "treinar", desiredWeeklyFrequency: 4 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, "day").toDate() },
  ]);
}

seed().finally(() => {
  client.end();
});
