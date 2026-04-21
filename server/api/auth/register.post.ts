import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { name, email, password } = await readBody(event);

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields.",
    });
  }

  console.log("Registering user:", { name, email });

  await throwIfUserExists(email);

  const newUser = await registerUser(email, name, password);

  const { password: stash, ...userWithoutPassword } = newUser;
  await setUserSession(event, {
    user: userWithoutPassword,
    role: "user"
  });
  return userWithoutPassword;
});
