import { GoalAlreadyCompleted } from "@/exceptions/goal-already-completed";
import { GoalAlreadyCompletedPerDay } from "@/exceptions/goal-already-completed-per-day";
import { createGoalCompletion } from "@/use-cases/create-goal-completion";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function createGoalCompletionRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/completions",
    {
      schema: {
        body: z.object({
          goalId: z.string().cuid2(),
        }),
        response: 201,
      },
    },
    async (request, reply) => {
      try {
        const goalId = request.body;
        const { goalCompletion } = await createGoalCompletion(goalId);

        reply.status(201).send();
        return { goalCompletion };
      } catch (error) {
        if (error instanceof GoalAlreadyCompleted) {
          return reply.status(400).send({ message: error.message });
        }

        if (error instanceof GoalAlreadyCompletedPerDay) {
          return reply.status(400).send({ message: error.message });
        }

        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
}
