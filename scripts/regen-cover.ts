import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const STYLE =
  'flat vector editorial illustration, warm orange and deep charcoal palette, cream background, soft gradients, premium fintech magazine style, ABSOLUTELY NO TEXT of any language: no letters, no words, no numbers, no characters, no writing anywhere, no documents with text, use only blank paper, charts drawn as abstract lines and bars only, high quality';

const IMAGES: Array<{ file: string; subject: string }> = [
  {
    file: 'tesouro-direto.jpg',
    subject: 'A sprouting green plant growing from soil with shiny gold coins as leaves, a large blank white certificate card behind it, an upward orange arrow, clean minimal background',
  },
];

async function main() {
  for (const { file, subject } of IMAGES) {
    const outPath = `/home/z/my-project/public/covers/${file}`;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const zai = await ZAI.create();
        const response = await zai.images.generations.create({
          prompt: `${subject}, ${STYLE}`,
          size: '1344x768',
        });
        const base64 = response.data?.[0]?.base64;
        if (!base64) throw new Error('empty base64');
        fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
        console.log(`ok: ${file}`);
        break;
      } catch (e) {
        console.error(`fail attempt ${attempt}:`, e instanceof Error ? e.message : e);
        if (attempt === 3) process.exit(1);
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }
}
main();
