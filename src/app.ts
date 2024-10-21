import fastify from "fastify";
import type { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createGoalRoute } from "./http/routes/create-goal-route";
import { pendingGoalsRoute } from "./http/routes/pending-goals-route";
import { createGoalCompletionRoute } from "./http/routes/create-goal-completion-route";
import { summaryRoute } from "./http/routes/summary-route";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export const app: FastifyInstance = fastify();

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "App In.Orbit",
      description:
        "Especificações da API para o back-end da aplicação In.Orbit construída durante o NLW Pocket JS da RocketSeat",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

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
