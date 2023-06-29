import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createImmobile } from "../create-immobiles";
import { deleteImmobile } from "../delete-immobiles";
import { listImmobiles } from "../list-immobiles";
import { upadateImmobile } from "../update-immobiles";
import { uploadImmobile } from "../upload-immobiles";
import {
  schemaCreate,
  schemaDelete,
  schemaListagem,
  schemaUpdate,
} from "./schema-docs";

export async function imovelRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/imovel", { ...schemaCreate }, createImmobile);

  app.post("/imovel/:id/images", uploadImmobile);

  app.put("/imovel/:id", schemaUpdate, upadateImmobile);

  app.get("/list", schemaListagem, listImmobiles);

  app.delete("/imovel/:id", schemaDelete, deleteImmobile);
}
