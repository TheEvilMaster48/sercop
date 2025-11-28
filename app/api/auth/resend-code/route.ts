import nodemailer from "nodemailer";
import { getUserByEmail, updateVerificationCode } from "@/lib/query";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_GMAIL_HOST,
  port: Number(process.env.SMTP_GMAIL_PORT),
  secure: process.env.SMTP_GMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  const { email } = await request.json();

  const user = await getUserByEmail(email);
  if (!user) return Response.json({ message: "Usuario no encontrado" }, { status: 404 });

  const newCode = Math.floor(100000 + Math.random() * 900000).toString();
  await updateVerificationCode(email, newCode);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Nuevo Código de Verificación",
    html: `<h1>Código: ${newCode}</h1>`,
  });

  return Response.json({ message: "Código reenviado correctamente" });
}
