import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { getUserByEmail, createUser } from "@/lib/query";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_GMAIL_HOST,
  port: Number(process.env.SMTP_GMAIL_PORT),
  secure: process.env.SMTP_GMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { username, email, telefono, password } = await request.json();

    const exists = await getUserByEmail(email);
    if (exists) return Response.json({ message: "El correo ya está registrado" }, { status: 400 });

    const code = generateCode();
    const hash = await bcrypt.hash(password, 10);

    await createUser(username, email, hash, telefono, code);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de Verificación - SERCOP",
      html: `<h1>Código: ${code}</h1>`,
    });

    return Response.json({ message: "Registro exitoso. Revisa tu correo." });
  } catch (error) {
    return Response.json({ message: "Error interno" }, { status: 500 });
  }
}
