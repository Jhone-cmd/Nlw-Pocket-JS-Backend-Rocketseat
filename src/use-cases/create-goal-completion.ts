import { db } from "@/db";
import { goalCompletions, goals } from "@/db/schema";
import { GoalAlreadyCompleted } from "@/exceptions/goal-already-completed";
import { GoalAlreadyCompletedPerDay } from "@/exceptions/goal-already-completed-per-day";
import { dayjs } from "@/lib/dayjs-date";
import { and, gte, lte, count, eq, sql, desc } from "drizzle-orm";

interface CreateGoalCompletionRequest {
  goalId: string;
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const firstOfDayWeek = dayjs().startOf("week").toDate();
  const lastOfDayWeek = dayjs().endOf("week").toDate();

  const goalCompletionCounts = db.$with("goal_completion_counts").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as("completionCount"),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstOfDayWeek),
          lte(goalCompletions.createdAt, lastOfDayWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const result = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql/*sql*/ `
            COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1);

  const goalCompletionDate = await db
    .select({
      goalId: goalCompletions.goalId,
      createAt: goalCompletions.createdAt,
    })
    .from(goalCompletions)
    .where(eq(goalCompletions.goalId, goalId))
    .orderBy(desc(goalCompletions.createdAt))
    .limit(1);

  if (goalCompletionDate[0] !== undefined) {
    const { createAt } = goalCompletionDate[0];

    const currentDate = dayjs().date();
    const goalCompletionCreatedAt = dayjs(createAt).date();

    if (goalCompletionCreatedAt === currentDate)
      throw new GoalAlreadyCompletedPerDay();
  }

  const { completionCount, desiredWeeklyFrequency } = result[0];

  if (completionCount >= desiredWeeklyFrequency)
    throw new GoalAlreadyCompleted();

  const insertResult = await db
    .insert(goalCompletions)
    .values({ goalId })
    .returning();
  const goalCompletion = insertResult[0];

  return {
    goalCompletion,
  };
}
