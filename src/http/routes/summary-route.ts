import { getWeekSummary } from "@/use-cases/get-week-summary";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function summaryRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/summary",
    {
      schema: {
        summary: "Summary",
        tags: ["Goals"],
        response: 200,
      },
    },
    async (request, reply) => {
      const { summary } = await getWeekSummary();
      return {
        summary,
      };
    }
  );
}
