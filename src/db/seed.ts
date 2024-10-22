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
      { title: "programação", desiredWeeklyFrequency: 3 },
      { title: "treinar muay thai / capoeira", desiredWeeklyFrequency: 3 },
      { title: "fazer exercícios", desiredWeeklyFrequency: 2 },
      { title: "meditar", desiredWeeklyFrequency: 2 },
      { title: "não mexer no celular", desiredWeeklyFrequency: 1 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.toDate() },
    { goalId: result[2].id, createdAt: startOfWeek.toDate() },
    { goalId: result[3].id, createdAt: startOfWeek.toDate() },
    { goalId: result[4].id, createdAt: startOfWeek.toDate() },
    { goalId: result[5].id, createdAt: startOfWeek.add(1, "day").toDate() },
  ]);
}

seed().finally(() => {
  client.end();
});
