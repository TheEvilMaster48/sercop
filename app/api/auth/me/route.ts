export const dynamic = "force-dynamic";

import { getUserByToken } from "@/lib/query";

export async function GET(request: Request) {
  const header = request.headers.get("authorization");

  if (!header) {
    return Response.json({ valid: false }, { status: 401 });
  }

  const token = header.replace("Bearer ", "").trim();
  const user = await getUserByToken(token);

  if (!user) {
    return Response.json({ valid: false }, { status: 401 });
  }

  return Response.json({
    valid: true,
    user: {
      username: user.username,
      email: user.email,
    },
  });
}
