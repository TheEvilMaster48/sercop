export const dynamic = "force-dynamic";

import { getUser, saveTokenIfMissing } from "@/lib/query";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await getUser(username.trim());
    if (!user) {
      return Response.json(
        { message: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    if (!user.email_verificado) {
      return Response.json(
        { message: "Debes verificar tu correo antes de iniciar sesión" },
        { status: 403 }
      );
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return Response.json(
        { message: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // ⚠️ token permanente. Si no tiene, se crea uno.
    const token = await saveTokenIfMissing(user.id, user.token_sesion);

    return Response.json({
      token,
      username: user.username,
      email: user.email,
      message: "Sesión iniciada correctamente",
    });
  } catch (e) {
    return Response.json({ message: "Error interno" }, { status: 500 });
  }
}
