export default defineEventHandler(async (event) => {
    console.log("Logout event triggered")
  await clearUserSession(event)
  return { message: 'Sesión cerrada correctamente' }
})