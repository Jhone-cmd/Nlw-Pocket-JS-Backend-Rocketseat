import { createGoal } from "@/use-cases/create-goal";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function createGoalRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/goals",
    {
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number(),
        }),
        response: 201,
      },
    },
    async (request, reply) => {
      const { title, desiredWeeklyFrequency } = request.body;
      await createGoal({ title, desiredWeeklyFrequency });

      return reply.status(201).send();
    }
  );
}
