import { readBody } from "h3";
import { useDb } from "../../utils";
import { tasks } from "../../db/schema";
import { getUserSession } from "#imports";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = useDb();

  // ✅ Obtener sesión del usuario
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, statusMessage: "No estás logueado" });
  }

  const method = event.node.req.method;

  if (method === "GET") {
    let allTasks;
    if (session.role === "admin") {
      allTasks = await db.select().from(tasks); 
    } else {
      allTasks = await db.select().from(tasks).where(eq(tasks.userId, Number(session.user.id)));
    }
    return allTasks;
  }

   // ✅ POST → crear task
  if (method === "POST") {
   
    try {
      const body = await readBody(event);

      // Validación básica
      if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
        throw createError({ statusCode: 400, statusMessage: "Título obligatorio" });
      }

      // Crear task asociada al usuario logueado
      const newTask = await db
        .insert(tasks)
        .values({
          title: body.title.trim(),
          description: body.description ? String(body.description) : "",
          finalDate: body.finalDate ? String(body.finalDate) : "",
          userId: Number(session.user.id), 
        })
        .returning();

      return newTask.at(0);

    } catch (err: any) {
      console.error("POST /api/tasks error:", err);
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.message || "Error al crear task",
      });
    }
  }

  throw createError({ statusCode: 405, statusMessage: "Método no permitido" });
});