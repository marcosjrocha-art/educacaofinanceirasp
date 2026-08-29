import { PrismaClient } from "@prisma/client";
import { allArticles } from "./articles";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.post.count();
  if (count > 0) {
    console.log(`Database already has ${count} posts. Skipping seed.`);
    return;
  }

  for (const article of allArticles) {
    const { publishedAt, ...rest } = article;
    await prisma.post.create({
      data: {
        ...rest,
        content: JSON.stringify(article.content),
        publishedAt: new Date(publishedAt),
      },
    });
    console.log(`Seeded: ${article.slug}`);
  }

  console.log(`Done. Seeded ${allArticles.length} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
