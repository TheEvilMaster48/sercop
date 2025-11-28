import { clearUserToken } from "@/lib/query";

export async function POST(request: Request) {
  const { token } = await request.json();
  if (!token) return Response.json({ message: "Token requerido" }, { status: 400 });

  await clearUserToken(token);
  return Response.json({ message: "Sesión cerrada correctamente" });
}
