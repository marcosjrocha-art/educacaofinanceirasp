import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("q");

    const posts = await db.post.findMany({
      where: {
        AND: [
          category && category !== "Todos" ? { category } : {},
          search
            ? {
                OR: [
                  { title: { contains: search } },
                  { excerpt: { contains: search } },
                  { tags: { contains: search } },
                  { category: { contains: search } },
                ],
              }
            : {},
        ],
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Falha ao carregar artigos" },
      { status: 500 }
    );
  }
}
