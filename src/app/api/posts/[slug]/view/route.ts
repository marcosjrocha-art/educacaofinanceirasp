import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await ctx.params;
    const post = await db.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json({ views: post.views });
  } catch (error) {
    console.error("POST /api/posts/[slug]/view error:", error);
    return NextResponse.json(
      { error: "Falha ao registrar visualização" },
      { status: 500 }
    );
  }
}
