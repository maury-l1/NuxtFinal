import { eq } from "drizzle-orm";

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user, tokens }) {
     console.time('github-login')
    if (!user.email) {
      throw createError({
        statusCode: 500,
        statusMessage: "Github account must have an email address set.",
      });
    }

    const db = useDb();
     console.time('db-query')
    let existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, user.email),
    });
 console.timeEnd('db-query')
    if (!existingUser) {
      const result = await db
        .insert(schema.users)
        .values({
          email: user.email,
          login: user.login,
          name: user.name,
        })
        .returning();
      existingUser = result.at(0);
    }

    if (!existingUser) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error authenticating with Github",
      });
    }

    const { password, ...userWithoutPassword } = existingUser;
    await setUserSession(event, {
      user: userWithoutPassword,
      role: "admin"
    });
     console.timeEnd('github-login')
    return sendRedirect(event, "http://localhost:9000/#/List")
  },
  // Optional, will return a json error and 401 status code by default
 onError(event, error) {
  console.error("GitHub OAuth error:", error)
  console.error("Mensaje:", error.message)
  console.error("Stack:", error.stack)
  return sendRedirect(event, "http://localhost:9000/#/login?error=github")
}
});
