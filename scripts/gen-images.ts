import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/public/covers';

const STYLE = 'modern financial editorial illustration, clean minimal composition, warm orange (#fe5301) and deep charcoal color palette with soft cream backgrounds, subtle geometric shapes, premium fintech magazine style, soft gradients, no text, no letters, no words, high quality, detailed';

const IMAGES: Array<{ file: string; subject: string }> = [
  { file: 'tesouro-direto.jpg', subject: 'Stylized government bond certificate transforming into a growing plant with coins as leaves, rising arrow in background' },
  { file: 'fundos-imobiliarios.jpg', subject: 'Modern city skyline with apartment and office buildings, miniature buildings on a desk with magnifying glass and coins' },
  { file: 'cdb-lci-lca.jpg', subject: 'Three elegant glass jars filled with golden coins at different fill levels on a clean desk, soft light' },
  { file: 'score-credito.jpg', subject: 'Large speedometer gauge with needle pointing up, person holding smartphone in foreground' },
  { file: 'meios-pagamento.jpg', subject: 'Smartphone floating with contactless payment waves, credit cards and QR code floating around, dynamic diagonal composition' },
  { file: 'sair-dividas.jpg', subject: 'Heavy chain of banknotes breaking apart into flying birds, symbolizing freedom from debt, dramatic light' },
  { file: 'limpar-nome.jpg', subject: 'Person relieved raising arms next to a giant calendar and a clean checklist, bright optimistic atmosphere' },
  { file: 'renda-extra-online.jpg', subject: 'Laptop with multiple floating app icons and currency symbols streaming out of screen, cozy home office at night' },
  { file: 'empreendedorismo.jpg', subject: 'Small paper boat leading a fleet of large ships, symbolizing entrepreneurship, sunrise over ocean' },
  { file: 'planejamento-financeiro.jpg', subject: 'Open planner notebook with pencil, calculator and coffee cup, monthly budget grid softly glowing, top-down view' },
  { file: 'inflacao-juros.jpg', subject: 'Balancing scale with a coin on one side and a burning candle on the other, inflation concept, moody dramatic lighting' },
  { file: 'emprestimo-consignado.jpg', subject: 'Careful hands inspecting a fine print contract with magnifying glass over desk with calculator, warm cautionary tone' },
  { file: 'quem-somos.jpg', subject: 'Diverse team of educators collaborating around a table with charts and laptops, bright modern São Paulo office with big windows' },
  { file: 'og-cover.jpg', subject: 'Abstract premium background with flowing orange gradient waves and subtle grid pattern, deep charcoal edges' },
];

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const failed: string[] = [];
  for (const { file, subject } of IMAGES) {
    const outPath = path.join(OUT_DIR, file);
    if (fs.existsSync(outPath)) {
      console.log(`skip (exists): ${file}`);
      continue;
    }
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
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
        ok = true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`fail ${file} attempt ${attempt}: ${msg}`);
        if (attempt < 3) await new Promise(r => setTimeout(r, 1500 * attempt));
        else failed.push(file);
      }
    }
  }
  console.log('DONE. failed:', JSON.stringify(failed));
}

main();
