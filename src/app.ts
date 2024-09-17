import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createGoalRoute } from "./http/routes/create-goal-route";
import { pendingGoalsRoute } from "./http/routes/pending-goals-route";
import { createGoalCompletionRoute } from "./http/routes/create-goal-completion-route";
import { summaryRoute } from "./http/routes/summary-route";

export const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createGoalRoute);
app.register(pendingGoalsRoute);
app.register(createGoalCompletionRoute);
app.register(summaryRoute);
