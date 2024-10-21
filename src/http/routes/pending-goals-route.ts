import { getWeekPendingGoals } from "@/use-cases/get-week-pending-goals";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function pendingGoalsRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/pending-goals",
    {
      schema: {
        summary: "Pending Goals",
        tags: ["Goals"],
        response: 200,
      },
    },
    async (request, reply) => {
      const { pendingGoals } = await getWeekPendingGoals();
      return {
        pendingGoals,
      };
    }
  );
}
