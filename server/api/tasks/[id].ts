import { eq } from "drizzle-orm";
import { useDb } from "../../utils";
import { tasks } from "../../db/schema";
import { getUserSession } from "#imports";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  const db = useDb();

  // 1️⃣ Obtener sesión
  const session = await getUserSession(event);
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "No estás logueado" });
  }

  const id = Number(event.context.params?.id);
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID inválido" });

  const method = event.node.req.method;

  // Buscar la task
  const task = await db.query.tasks.findFirst({ where: eq(tasks.id, id) });
  if (!task) throw createError({ statusCode: 404, statusMessage: "Task no encontrada" });

  // Validación de permisos
  const isOwner = task.userId === Number(session.id);
  const isAdmin = session.role === "admin";

  if (!isOwner && !isAdmin) {
    throw createError({ statusCode: 403, statusMessage: "No tienes permiso" });
  }

  // GET → retornar task
  if (method === "GET") {
    return task;
  }

  // PUT → actualizar task
  if (method === "PUT") {
    const body = await readBody(event);

    const updated = await db
      .update(tasks)
      .set({
        title: body.title ?? task.title,
        description: body.description ?? task.description,
        finalDate: body.finalDate ?? task.finalDate,
      })
      .where(eq(tasks.id, id))
      .returning();

    return updated.at(0);
  }

  // DELETE → eliminar task
  if (method === "DELETE") {
    await db.delete(tasks).where(eq(tasks.id, id));
    return { message: "Task eliminada correctamente" };
  }

  // 7️⃣ Otros métodos no permitidos
  throw createError({ statusCode: 405, statusMessage: "Método no permitido" });
});