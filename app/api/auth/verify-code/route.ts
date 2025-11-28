import { getUserByEmail, verifyEmailCode } from "@/lib/query";

export async function POST(request: Request) {
  const { email, code } = await request.json();

  const user = await getUserByEmail(email);
  if (!user) return Response.json({ message: "Usuario no encontrado" }, { status: 404 });

  if (user.codigo_verificacion !== code) {
    return Response.json({ message: "Código incorrecto" }, { status: 400 });
  }

  await verifyEmailCode(email, code);

  return Response.json({ message: "Email verificado correctamente" });
}
