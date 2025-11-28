import { getUserByToken } from "@/lib/query"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return Response.json({ valid: false, message: "Token no proporcionado" }, { status: 401 })
    }

    const user = await getUserByToken(token)

    if (!user) {
      return Response.json({ valid: false, message: "Token inválido o expirado" }, { status: 401 })
    }

    return Response.json({
      valid: true,
      user: {
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Validate error:", error)
    return Response.json({ valid: false, message: "Error interno" }, { status: 500 })
  }
}
