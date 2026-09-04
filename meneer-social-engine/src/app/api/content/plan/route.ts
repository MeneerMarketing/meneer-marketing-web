import { NextResponse } from "next/server";
import { z } from "zod";
import { planMonth } from "@/services/contentPlanner";

const bodySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  focusService: z.string().optional(),
  activeProjects: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const plan = await planMonth(body);
    return NextResponse.json(plan);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const plan = await planMonth({ month });
  return NextResponse.json(plan);
}
