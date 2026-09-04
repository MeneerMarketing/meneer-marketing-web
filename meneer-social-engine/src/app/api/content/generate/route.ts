import { NextResponse } from "next/server";
import { ContentIdea } from "@/services/types";
import { writePost } from "@/services/contentWriter";
import { critiquePost } from "@/services/contentCritic";

export async function POST(request: Request) {
  try {
    const idea = ContentIdea.parse(await request.json());
    const post = await writePost(idea);
    const scores = await critiquePost(post);

    return NextResponse.json({
      post,
      scores,
      approved: scores.verdict === "APPROVED",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
