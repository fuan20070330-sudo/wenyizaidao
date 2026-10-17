/* 纹以载道 - 交互逻辑与参数化纹样生成 */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

let uidCounter = 0;
const nextId = (prefix) => `${prefix}-${++uidCounter}`;
const STORAGE_KEY = 'wenyizaidao.designs.v1';
const CATEGORY_ORDER = ['天象气象','几何构成','植物花卉','动物瑞兽','神兽与宇宙','人物故事','吉祥文字','器物博古','建筑空间','山水自然'];

const state = {
  selectedPatternId: PATTERNS[0].id,
  paletteId: PALETTES[0].id,
  transform: 'continuous',
  density: 4,
  scale: 0.72,
  searchQuery: '',
  searchTerms: [],
  activeCategory: '全部',
  activeTag: '',
  sortMode: 'common',
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  quizFinished: false,
  activeDialogPatternId: null,
  saved: loadSaved()
};

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.slice(0, 6) : [];
  } catch (error) {
    return [];
  }
}

function persistSaved() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.saved));
  } catch (error) {
    // Local storage can be unavailable in strict browser modes; the app still works.
  }
}

function getPattern(id) {
  return PATTERNS.find((pattern) => pattern.id === id) || PATTERNS[0];
}

function getPalette(id) {
  return PALETTES.find((palette) => palette.id === id) || PALETTES[0];
}

function paletteForPattern(pattern) {
  return {
    ...PALETTES[0],
    bg: '#efe4d2',
    ink: '#211e1a',
    primary: pattern.palette[0],
    accent: pattern.palette[1],
    third: pattern.palette[2]
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function flower(cx, cy, palette, size = 1) {
  const petals = [0, 72, 144, 216, 288]
    .map((angle) => `<ellipse cx="0" cy="-13" rx="6.5" ry="12" transform="rotate(${angle})" />`)
    .join('');
  return `<g transform="translate(${cx} ${cy}) scale(${size})" fill="${palette.bg}" stroke="${palette.primary}" stroke-width="2.8">${petals}<circle r="4.8" fill="${palette.accent}" stroke="none" /></g>`;
}

function motifMarkup(id, palette) {
  const stroke = palette.primary;
  const accent = palette.accent;
  const third = palette.third;

  switch (id) {
    case 'ruyi-cloud':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M34 148c0-20 16-36 36-36 4-24 25-42 50-42 22 0 41 14 48 34 18 1 32 16 32 34 0 19-15 34-34 34H68c-19 0-34-9-34-34Z" />
          <path d="M74 146c0-12 9-21 21-21 3-13 15-23 29-23 12 0 22 7 27 18 10 0 18 8 18 18 0 10-8 18-18 18H91c-10 0-17-4-17-10Z" />
          <path d="M120 148c9-7 12-16 9-26" />
          <path d="M62 110c-8-9-20-12-32-8 8 12 18 19 32 19" />
          <path d="M177 110c8-9 20-12 32-8-8 12-18 19-32 19" />
        </g>
        <g fill="${accent}"><circle cx="120" cy="102" r="5" /><circle cx="80" cy="129" r="3" /><circle cx="160" cy="129" r="3" /></g>`;

    case 'fret':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="4.6" stroke-linecap="square">
          <path d="M36 36h72v72H56V56h32v32h20" />
          <path d="M132 36h72v72h-52V56h32v32h20" />
          <path d="M36 132h72v72H56v-52h32v32h20" />
          <path d="M132 132h72v72h-52v-52h32v32h20" />
        </g>
        <g fill="${accent}"><circle cx="68" cy="68" r="3.5" /><circle cx="164" cy="68" r="3.5" /><circle cx="68" cy="164" r="3.5" /><circle cx="164" cy="164" r="3.5" /></g>`;

    case 'floral':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 146c32-58 62 55 102 0s62-58 102-16" />
          <path d="M22 104c36 22 66-36 100-9" />
          <path d="M52 84c-4-18 7-31 22-39M156 78c15-16 30-17 43-9M84 186c10 17 25 22 39 17" />
        </g>
        <g fill="${third}" opacity=".38">
          <ellipse cx="48" cy="112" rx="10" ry="4" transform="rotate(-27 48 112)" />
          <ellipse cx="74" cy="96" rx="10" ry="4" transform="rotate(35 74 96)" />
          <ellipse cx="176" cy="103" rx="11" ry="4" transform="rotate(-24 176 103)" />
          <ellipse cx="194" cy="83" rx="10" ry="4" transform="rotate(31 194 83)" />
        </g>
        ${flower(88, 70, palette, 1.05)}
        ${flower(164, 130, palette, 1.12)}
        ${flower(76, 164, palette, 0.8)}
        <g fill="${accent}"><circle cx="139" cy="86" r="4" /><circle cx="201" cy="130" r="3" /><circle cx="46" cy="150" r="3" /></g>`;

    case 'baoxiang': {
      const petals = [0, 45, 90, 135]
        .map((angle) => `<path d="M0-104C30-64 30-26 0 0C-30-26-30-64 0-104Z" transform="rotate(${angle})" />`)
        .join('');
      const beads = Array.from({ length: 12 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 12;
        const x = Math.cos(angle) * 57;
        const y = Math.sin(angle) * 57;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="${accent}" stroke="none" />`;
      }).join('');
      return `
        <g transform="translate(120 120)">
          <g fill="none" stroke="${stroke}" stroke-width="4">${petals}<circle r="47" stroke="${accent}" stroke-width="2" stroke-dasharray="3 7" /><circle r="30" /><circle r="12" fill="${accent}" stroke="none" /></g>
          ${beads}
          <g fill="${third}" opacity=".22"><circle r="76" /><circle r="86" fill="none" stroke="${third}" stroke-width="2" stroke-dasharray="2 8" /></g>
        </g>`;
    }

    case 'wave':
      return `
        <g>
          <path d="M0 146c20-18 40-18 60 0s40 18 60 0 40-18 60 0 40 18 60 0v94H0Z" fill="${third}" opacity=".22" />
          <path d="M0 172c20-18 40-18 60 0s40 18 60 0 40-18 60 0 40 18 60 0v68H0Z" fill="${stroke}" opacity=".12" />
          <path d="M0 146c20-18 40-18 60 0s40 18 60 0 40-18 60 0 40 18 60 0" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round" />
          <path d="M48 152l38-72 28 44 18-24 48 52Z" fill="${third}" opacity=".62" stroke="${stroke}" stroke-width="3.2" stroke-linejoin="round" />
          <path d="M78 122l8-42 22 34 12-16 20 24" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M28 196c18-12 34-12 52 0s34 12 52 0 34-12 52 0 34 12 52 0" fill="none" stroke="${accent}" stroke-width="2.6" opacity=".8" />
        </g>
        <g fill="${accent}"><circle cx="64" cy="122" r="3.5" /><circle cx="177" cy="114" r="3" /><circle cx="118" cy="86" r="2.5" /></g>`;

    case 'endless-knot':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="5" stroke-linejoin="round">
          <rect x="64" y="64" width="112" height="112" rx="18" />
          <rect x="64" y="64" width="112" height="112" rx="18" transform="rotate(45 120 120)" />
          <rect x="64" y="64" width="112" height="112" rx="18" transform="rotate(90 120 120)" />
          <circle cx="120" cy="120" r="30" stroke="${accent}" stroke-width="3" stroke-dasharray="4 6" />
        </g>
        <g fill="${accent}"><circle cx="120" cy="46" r="4" /><circle cx="120" cy="194" r="4" /><circle cx="46" cy="120" r="4" /><circle cx="194" cy="120" r="4" /></g>`;

    case 'hex': {
      const hexPoints = (cx, cy, radius) => Array.from({ length: 6 }, (_, index) => {
        const angle = (Math.PI / 3) * index - Math.PI / 6;
        return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`;
      }).join(' ');
      let hexes = '';
      for (let row = 0; row < 5; row += 1) {
        const offset = row % 2 === 0 ? 0 : 29;
        for (let x = 24 + offset; x < 240; x += 58) {
          const y = 30 + row * 42;
          hexes += `<polygon points="${hexPoints(x, y, 27)}" fill="none" stroke="${stroke}" stroke-width="3.2" />`;
        }
      }
      return `<g>${hexes}<g fill="${accent}"><circle cx="82" cy="72" r="4" /><circle cx="140" cy="114" r="4" /><circle cx="198" cy="156" r="4" /></g></g>`;
    }

    case 'bead': {
      const beads = Array.from({ length: 18 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 18;
        const radius = 91;
        const x = 120 + Math.cos(angle) * radius;
        const y = 120 + Math.sin(angle) * radius;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${index % 3 === 0 ? 7 : 4.4}" fill="${index % 3 === 0 ? accent : stroke}" />`;
      }).join('');
      return `
        <g transform="translate(120 120)">
          <circle r="91" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-dasharray="2 8" />
          ${beads}
          <circle r="55" fill="${accent}" opacity=".15" />
          <circle r="42" fill="none" stroke="${stroke}" stroke-width="4" />
          <circle r="12" fill="${stroke}" />
          <g fill="none" stroke="${accent}" stroke-width="2"><circle r="70" stroke-dasharray="3 7" /><path d="M-42 0h84M0-42v84" /></g>
        </g>`;
    }

    default:
      return extraMotifMarkup(id, palette);
  }
}

function extraMotifMarkup(id, palette) {
  const stroke = palette.primary;
  const accent = palette.accent;
  const third = palette.third;
  const bg = palette.bg;

  switch (id) {
    case 'cloud-thunder':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M28 96c0-16 13-29 29-29 3-20 20-35 41-35 18 0 33 11 39 27 15 1 27 13 27 28 0 16-13 29-29 29H55c-15 0-27-8-27-20Z" />
          <path d="M74 146h30v30H74zM104 146v30h30M104 176v30h30M134 176h30v30" />
          <path d="M48 168h28v28H48zM48 196v22h28" />
        </g>
        <g fill="${accent}"><circle cx="120" cy="88" r="4" /><circle cx="78" cy="110" r="3" /><circle cx="160" cy="110" r="3" /></g>`;

    case 'taotie':
      return `
        <g transform="translate(120 120)">
          <path d="M0-70v140" stroke="${accent}" stroke-width="2" stroke-dasharray="3 6" opacity=".7" />
          <g fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M-10-30c-24-18-48-10-60 8 12 5 24 4 36-3-10 12-16 26-14 42 14-8 24-20 30-34" />
            <path d="M10-30c24-18 48-10 60 8-12 5-24 4-36-3 10 12 16 26 14 42-14-8-24-20-30-34" />
            <path d="M-26-8c0-7 6-12 13-12s13 5 13 12-6 12-13 12-13-5-13-12Z" />
            <path d="M0 0c-10 18-6 38 8 50 12-14 14-32 4-50" />
            <path d="M-42 48c-14 10-22 24-24 38M42 48c14 10 22 24 24 38" />
          </g>
          <g fill="${accent}"><circle cx="-13" cy="-8" r="3" /><circle cx="13" cy="-8" r="3" /></g>
        </g>`;

    case 'kui-dragon':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M40 170c40 0 46-52 80-52 26 0 34 22 54 20 18-2 24-18 18-32-6-12-22-14-32-6-8 8-6 22 4 26" />
          <path d="M62 166c-12-5-20-16-20-28 0-30 28-50 58-50 20 0 36 10 46 24" />
          <path d="M144 112c-8-4-16-4-22 2" />
        </g>
        <g fill="${accent}"><circle cx="154" cy="104" r="3.5" /><circle cx="72" cy="128" r="3" /><circle cx="186" cy="118" r="3" /></g>`;

    case 'dragon':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M42 160c18-44 58-56 88-36 22 14 18 40-2 48-22 9-40-8-34-26 6-18 32-22 48-8 18 16 12 44-8 54-24 12-50-2-54-24" />
          <path d="M132 76c-10 2-18 10-20 20M142 72c8 0 16 4 20 10M144 86h-16M156 94l16 10" />
        </g>
        <circle cx="170" cy="56" r="12" fill="${accent}" opacity=".78" />
        <g fill="${accent}"><circle cx="166" cy="52" r="3" /><circle cx="60" cy="128" r="3" /></g>`;

    case 'phoenix':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M96 130c-20-20-18-50 4-66 14-10 32-8 44 4 12-18 34-22 48-8 8 8 8 20 2 28" />
          <path d="M120 122c-8 18-26 30-48 30 12-18 20-30 32-38M128 118c8 20 26 32 46 32-10-18-18-30-30-38" />
          <path d="M132 108c18 10 34 8 46-4M100 96c-14 4-24 14-28 28M84 74c-10-6-16-16-16-28 12 6 20 12 26 20" />
        </g>
        <g fill="${accent}"><circle cx="140" cy="96" r="3.5" /><circle cx="103" cy="84" r="2.5" /></g>`;

    case 'lotus': {
      const petals = [0, 45, 90, 135].map((angle) => `<path d="M0-86C26-52 26-22 0 0C-26-22-26-52 0-86Z" transform="rotate(${angle})" />`).join('');
      return `<g transform="translate(120 128)" fill="${bg}" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="round">${petals}<circle r="24" fill="${accent}" opacity=".3" stroke="none" /><circle r="12" fill="${stroke}" stroke="none" /></g>`;
    }

    case 'peony': {
      const petals = [0, 60, 120, 180, 240, 300].map((angle) => `<ellipse cx="0" cy="-30" rx="16" ry="28" transform="rotate(${angle})" />`).join('');
      return `
        <g transform="translate(120 118)" fill="${bg}" stroke="${stroke}" stroke-width="3">${petals}<circle r="18" fill="${accent}" stroke="none" /></g>
        <g fill="${third}" opacity=".38"><ellipse cx="64" cy="168" rx="25" ry="10" transform="rotate(-25 64 168)" /><ellipse cx="176" cy="160" rx="25" ry="10" transform="rotate(28 176 160)" /></g>`;
    }

    case 'chrysanthemum': {
      const petals = Array.from({ length: 24 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 24;
        const x1 = 120 + Math.cos(angle) * 26;
        const y1 = 120 + Math.sin(angle) * 26;
        const x2 = 120 + Math.cos(angle) * 76;
        const y2 = 120 + Math.sin(angle) * 76;
        return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" />`;
      }).join('');
      return `<g stroke="${stroke}" stroke-width="3" stroke-linecap="round">${petals}<circle cx="120" cy="120" r="21" fill="${accent}" stroke="none" /><circle cx="120" cy="120" r="8" fill="${stroke}" stroke="none" /></g>`;
    }

    case 'plum':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M28 180c42-28 58-64 62-114M88 76c18 18 34 26 56 22M60 126c20 10 34 26 40 46" />
        </g>
        ${flower(70, 92, palette, 0.86)}
        ${flower(124, 72, palette, 1.02)}
        ${flower(92, 142, palette, 0.78)}
        <g fill="${accent}"><circle cx="160" cy="98" r="3" /><circle cx="44" cy="164" r="3" /></g>`;

    case 'fish':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M40 120c22-28 52-32 78-10 0 0 10-18 28-24-2 20-8 34-18 44 10 12 16 26 18 44-18-6-28-24-28-24-26 22-56 18-78-10Z" />
          <path d="M96 116c6 4 6 12 0 16M20 180c20-14 40-14 60 0s40 14 60 0 40-14 60 0" />
          <path d="M58 146c-8 14-6 28 4 40M188 152c8 10 10 24 4 36" />
        </g>
        <g fill="${accent}"><circle cx="114" cy="116" r="3" /><circle cx="66" cy="108" r="2.5" /><circle cx="164" cy="110" r="2.5" /></g>`;

    case 'children':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="90" cy="78" r="18" /><circle cx="150" cy="88" r="16" />
          <path d="M90 96v42M150 104v34M70 118l20 10M110 118l20 10M130 122l20 8M170 122l-20 8M90 138l-16 28M90 138l16 28M150 138l-14 26M150 138l14 26" />
          <path d="M82 66c2-10 8-16 16-18M142 78c2-8 8-13 15-15" />
        </g>
        <g fill="${accent}"><circle cx="84" cy="76" r="2.6" /><circle cx="96" cy="76" r="2.6" /><circle cx="145" cy="86" r="2.4" /><circle cx="155" cy="86" r="2.4" /></g>`;

    case 'eight-immortals': {
      const objects = Array.from({ length: 8 }, (_, index) => `
        <g transform="rotate(${index * 45}) translate(0 -78)">
          <circle r="13" fill="${accent}" opacity=".18" stroke="${stroke}" stroke-width="2.2" />
          <path d="M-6 0h12M0-6v12" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round" />
        </g>`).join('');
      return `<g transform="translate(120 120)">${objects}<circle r="26" fill="none" stroke="${stroke}" stroke-width="3.2" stroke-dasharray="3 7" /><circle r="7" fill="${accent}" /></g>`;
    }

    case 'bat':
      return `
        <g fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M120 96c-14-20-40-24-58-8-8 8-10 20-4 30 14-10 28-10 42 2M120 96c14-20 40-24 58-8 8 8 10 20 4 30-14-10-28-10-42 2" />
          <path d="M120 96v36M104 132c-10 14-8 30 6 38 4-12 8-22 16-30M136 132c10 14 8 30-6 38-4-12-8-22-16-30" />
        </g>
        <g fill="${accent}"><circle cx="92" cy="108" r="3" /><circle cx="148" cy="108" r="3" /></g>`;

    case 'double-happiness':
      return `<text x="120" y="166" text-anchor="middle" font-family="serif" font-size="132" fill="${stroke}">囍</text><circle cx="120" cy="120" r="96" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="3 8" />`;

    case 'coin': {
      const coins = [];
      for (let row = 0; row < 3; row += 1) {
        for (let col = 0; col < 3; col += 1) {
          coins.push(`<g transform="translate(${56 + col * 64} ${56 + row * 64})"><circle r="24" fill="none" stroke="${stroke}" stroke-width="3" /><rect x="-8" y="-8" width="16" height="16" fill="${accent}" /></g>`);
        }
      }
      return `<g>${coins.join('')}</g>`;
    }

    case 'bagua': {
      const trigrams = [[1, 1, 1], [0, 0, 0], [1, 0, 0], [0, 1, 1], [1, 0, 1], [0, 1, 0], [0, 0, 1], [1, 1, 0]];
      const symbols = trigrams.map((bits, index) => {
        const lines = bits.map((solid, line) => {
          const y = -80 + line * 9;
          return solid
            ? `<path d="M-15 ${y}h30" />`
            : `<path d="M-15 ${y}h11M4 ${y}h11" />`;
        }).join('');
        return `<g transform="rotate(${index * 45})" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round">${lines}</g>`;
      }).join('');
      return `<g transform="translate(120 120)">${symbols}<circle r="31" fill="${accent}" opacity=".18" /><path d="M0-26a26 26 0 0 1 0 52a13 13 0 0 1 0-26a13 13 0 0 0 0-26Z" fill="${stroke}" opacity=".78" /><circle cx="0" cy="-13" r="4" fill="${bg}" /><circle cx="0" cy="13" r="4" fill="${accent}" /></g>`;
    }

    default:
      return '';
  }
}

function motifSvg(patternId, palette, size = 240) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="${size}" height="${size}" role="img" aria-label="传统纹样图形">${motifMarkup(patternId, palette)}</svg>`;
}

function patternMotifMarkup(pattern, palette) {
  if (pattern.curated) return motifMarkup(pattern.id, palette);
  return categoryMotifMarkup(pattern.motif, pattern.variant, palette, pattern);
}

function categoryMotifMarkup(motif, variant, palette, pattern) {
  const stroke = palette.primary;
  const accent = palette.accent;
  const third = palette.third;
  const v = Number(variant) || 1;
  const rot = (v % 7) * 3;
  const wrap = (content) => `<g transform="rotate(${rot} 120 120)">${content}</g>`;

  if (motif === 'tianxiang') {
    if (v % 5 === 0) return wrap(motifMarkup('ruyi-cloud', palette));
    if (v % 5 === 1) {
      const rays = Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        const x1 = 120 + Math.cos(a) * 50;
        const y1 = 120 + Math.sin(a) * 50;
        const x2 = 120 + Math.cos(a) * 76;
        const y2 = 120 + Math.sin(a) * 76;
        return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${accent}" stroke-width="3" />`;
      }).join('');
      return wrap(`<circle cx="120" cy="120" r="38" fill="${accent}" opacity=".28" stroke="${stroke}" stroke-width="4" /><circle cx="120" cy="120" r="14" fill="${stroke}" />${rays}`);
    }
    if (v % 5 === 2) {
      const stars = [[70,72],[156,82],[98,154],[176,158],[58,158]].map(([x,y],i) => `<path d="M${x} ${y-12}L${x+4} ${y-4}L${x+12} ${y}L${x+4} ${y+4}L${x} ${y+12}L${x-4} ${y+4}L${x-12} ${y}L${x-4} ${y-4}Z" fill="${i%2?accent:stroke}" opacity=".85" />`).join('');
      return wrap(`<circle cx="120" cy="120" r="86" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="3 8" />${stars}`);
    }
    if (v % 5 === 3) return wrap(`<path d="M126 34L72 112h40l-24 72 72-92h-40l32-58Z" fill="${accent}" opacity=".25" stroke="${stroke}" stroke-width="4" stroke-linejoin="round" />`);
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M28 82c24-26 48 24 72 0s48-26 72 0M22 124c28-26 56 26 84 0s56-26 84 0M34 166c22-22 44 22 66 0s44-22 66 0" /><path d="M54 52c18 12 34 14 52 4M164 184c-18-12-34-14-52-4" stroke="${accent}" /></g>`);
  }

  if (motif === 'jihe') {
    if (v % 5 === 0) return wrap(motifMarkup('fret', palette));
    if (v % 5 === 1) return wrap(motifMarkup('hex', palette));
    if (v % 5 === 2) return wrap(motifMarkup('bead', palette));
    if (v % 5 === 3) {
      const coins = [];
      for (let row = 0; row < 3; row += 1) for (let col = 0; col < 3; col += 1) coins.push(`<g transform="translate(${56+col*64} ${56+row*64})"><circle r="22" fill="none" stroke="${stroke}" stroke-width="3" /><rect x="-7" y="-7" width="14" height="14" fill="${accent}" /></g>`);
      return wrap(coins.join(''));
    }
    const lattice = Array.from({ length: 5 }, (_, i) => `<path d="M${20+i*44} 20L220 ${20+i*44}M${20+i*44} 220L220 ${220-i*44}" />`).join('');
    return wrap(`<g stroke="${stroke}" stroke-width="2.5" opacity=".85">${lattice}<rect x="26" y="26" width="188" height="188" fill="none" stroke="${accent}" stroke-width="3" /></g>`);
  }

  if (motif === 'zhiwu') {
    if (v % 5 === 0) return wrap(motifMarkup('lotus', palette));
    if (v % 5 === 1) return wrap(motifMarkup('peony', palette));
    if (v % 5 === 2) return wrap(motifMarkup('chrysanthemum', palette));
    if (v % 5 === 3) return wrap(motifMarkup('plum', palette));
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M32 178c34-18 48-48 54-88M86 90c18 18 34 22 54 14M64 132c20 8 34 22 40 42" /></g>${flower(78,84,palette,.9)}${flower(130,72,palette,1.05)}${flower(104,148,palette,.76)}<g fill="${accent}"><circle cx="174" cy="108" r="3" /><circle cx="46" cy="160" r="3" /></g>`);
  }

  if (motif === 'dongwu') {
    if (v % 5 === 0) return wrap(motifMarkup('dragon', palette));
    if (v % 5 === 1) return wrap(motifMarkup('phoenix', palette));
    if (v % 5 === 2) return wrap(motifMarkup('fish', palette));
    if (v % 5 === 3) return wrap(motifMarkup('bat', palette));
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M70 148c0-34 24-62 58-62 26 0 44 14 54 34M126 86c-6-14 2-28 16-32M154 98c12-12 28-14 40-4M64 148v30M94 148v30M150 152v26M180 148v30M184 86c18-16 34-14 46-2" /><path d="M118 60c-2-10 6-18 16-18M158 70c8-10 22-12 30-4" stroke="${accent}" /></g><circle cx="196" cy="76" r="8" fill="${accent}" opacity=".8" />`);
  }

  if (motif === 'shenshou') {
    if (v % 4 === 0) return wrap(motifMarkup('taotie', palette));
    if (v % 4 === 1) return wrap(motifMarkup('kui-dragon', palette));
    if (v % 4 === 2) return wrap(motifMarkup('bagua', palette));
    return wrap(`<g transform="translate(120 120)"><g fill="none" stroke="${stroke}" stroke-width="4"><path d="M0-74v148M-54-46c-30-16-46 4-36 28 10 22 38 22 56 6M54-46c30-16 46 4 36 28-10 22-38 22-56 6" /><path d="M-30-16c0-8 7-14 15-14s15 6 15 14-7 14-15 14-15-6-15-14ZM0 0c-10 18-6 38 8 50 12-14 14-32 4-50M-52 56c-16 10-24 24-26 40M52 56c16 10 24 24 26 40" /></g><g fill="${accent}"><circle cx="-15" cy="-16" r="3" /><circle cx="15" cy="-16" r="3" /></g><circle r="96" fill="none" stroke="${third}" stroke-width="2" stroke-dasharray="2 8" /></g>`);
  }

  if (motif === 'renwu') {
    if (v % 4 === 0) return wrap(motifMarkup('children', palette));
    if (v % 4 === 1) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><circle cx="120" cy="68" r="22" /><path d="M120 90v62M120 108l-34 24M120 108l34 24M120 152l-24 42M120 152l24 42M104 54c4-12 12-18 22-18" /><path d="M72 184c18-16 34-16 48 0s30 16 48 0" stroke="${accent}" /></g>`);
    if (v % 4 === 2) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="3.6" stroke-linecap="round"><circle cx="88" cy="86" r="16" /><circle cx="152" cy="78" r="14" /><path d="M88 102v42M152 92v40M72 118l16 10M104 118l16 10M136 112l16 8M168 112l-16 8M88 144l-14 30M88 144l14 30M152 132l-12 28M152 132l12 28" /></g><g fill="${accent}"><circle cx="82" cy="84" r="2.5" /><circle cx="94" cy="84" r="2.5" /><circle cx="147" cy="76" r="2.3" /><circle cx="157" cy="76" r="2.3" /></g>`);
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><circle cx="120" cy="58" r="20" /><path d="M120 78c-8 34-22 60-44 84M120 78c8 34 22 60 44 84M120 108l-46-22M120 108l46-22M76 150c30 14 58 14 88 0" /><path d="M60 58c20-20 44-28 70-22M154 60c18-12 34-8 42 8" stroke="${accent}" /></g>`);
  }

  if (motif === 'wenzi') {
    const chars = pattern.name.replace('纹','');
    const fontSize = chars.length > 1 ? 88 : 142;
    return `<circle cx="120" cy="120" r="92" fill="${accent}" opacity=".12" stroke="${stroke}" stroke-width="3" /><circle cx="120" cy="120" r="82" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="3 7" /><text x="120" y="${chars.length > 1 ? 151 : 168}" text-anchor="middle" font-family="serif" font-size="${fontSize}" fill="${stroke}" transform="rotate(${rot - 3} 120 120)">${escapeHtml(chars)}</text><circle cx="196" cy="52" r="8" fill="${accent}" opacity=".75" />`;
  }

  if (motif === 'qiwu') {
    if (v % 5 === 0) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M62 78h116l-18 54H80Z" /><path d="M84 132l-18 54M156 132l18 54M120 132v54M52 186h136" /><path d="M92 78c8-24 48-24 56 0" stroke="${accent}" /></g>`);
    if (v % 5 === 1) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M102 40h36l8 38c20 18 30 38 30 62 0 34-24 56-56 56s-56-22-56-56c0-24 10-44 30-62Z" /><path d="M94 78h52M82 132c24 10 52 10 76 0" stroke="${accent}" /></g>`);
    if (v % 5 === 2) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M48 104h144c-8 50-36 76-72 76s-64-26-72-76Z" /><path d="M72 180h96M88 104v42M152 104v42" stroke="${accent}" /></g>`);
    if (v % 5 === 3) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"><path d="M70 182L120 38l50 144Z" /><path d="M84 140c24-10 48-10 72 0M98 104c14-6 30-6 44 0" stroke="${accent}" /><path d="M120 182v20" /></g>`);
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4"><circle cx="120" cy="120" r="66" /><circle cx="120" cy="120" r="14" fill="${accent}" /><path d="M120 54v22M120 164v22M54 120h22M164 120h22" stroke="${accent}" /><circle cx="120" cy="120" r="86" stroke="${third}" stroke-dasharray="3 8" /></g>`);
  }

  if (motif === 'jianzhu') {
    if (v % 5 === 0) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="3.6"><rect x="46" y="46" width="148" height="148" rx="6" /><rect x="72" y="72" width="96" height="96" /><path d="M72 120h96M120 72v96M96 46v26M144 46v26M96 168v26M144 168v26" stroke="${accent}" /></g>`);
    if (v % 5 === 1) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M28 142c38-34 70-52 92-80 22 28 54 46 92 80" /><path d="M52 142c28-24 50-36 68-58 18 22 40 34 68 58" stroke="${accent}" /><path d="M48 170h144M68 142v42M172 142v42" /></g>`);
    if (v % 5 === 2) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4"><path d="M60 172h120M78 172v-38h84v38M98 134v-30h44v30M118 104V78" /><path d="M54 172h132M70 184h100" stroke="${accent}" /></g>`);
    if (v % 5 === 3) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="3.5"><circle cx="120" cy="120" r="62" /><circle cx="120" cy="120" r="20" fill="${accent}" /><path d="M120 58v22M120 160v22M58 120h22M160 120h22M76 76l16 16M148 148l16 16M164 76l-16 16M92 148l-16 16" /></g>`);
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4"><path d="M64 178V98h112v80M84 178v-48h72v48M52 98l68-42 68 42" /><path d="M72 184h96" stroke="${accent}" /><circle cx="120" cy="48" r="6" fill="${accent}" /></g>`);
  }

  if (motif === 'shanshui') {
    if (v % 5 === 0) return wrap(motifMarkup('wave', palette));
    if (v % 5 === 1) return wrap(`<g><path d="M18 184l58-104 34 58 24-32 50 78Z" fill="${third}" opacity=".35" stroke="${stroke}" stroke-width="4" /><path d="M42 184l42-70 26 44 18-22 32 48Z" fill="none" stroke="${accent}" stroke-width="3" /><path d="M18 196c28-14 54-14 82 0s54 14 82 0" fill="none" stroke="${stroke}" stroke-width="3" /></g>`);
    if (v % 5 === 2) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"><path d="M24 178c28-18 56 18 84 0s56-18 84 0" /><path d="M78 178c-8-38 4-72 22-98M104 174c-2-44 14-78 32-104M142 176c0-36 12-62 28-84" stroke="${accent}" /><path d="M42 150c18-10 36-10 54 0M148 146c16-8 32-8 48 0" /></g>`);
    if (v % 5 === 3) return wrap(`<g><path d="M24 178l58-104 40 64 30-40 44 80Z" fill="${third}" opacity=".32" /><path d="M24 178l58-104 40 64 30-40 44 80" fill="none" stroke="${stroke}" stroke-width="4" /><path d="M82 158c18-18 36-18 54 0s36 18 54 0" fill="none" stroke="${accent}" stroke-width="3" /></g>`);
    return wrap(`<g><path d="M42 188c28-52 54-74 84-66 22 6 34 30 48 30 10 0 18-8 24-18" fill="none" stroke="${stroke}" stroke-width="4" /><path d="M44 198c30-14 58-14 88 0s58 14 88 0" fill="none" stroke="${accent}" stroke-width="3" /><path d="M84 142c-6-18 2-34 16-44M158 138c8-16 8-30 0-42" stroke="${third}" stroke-width="3" /></g>`);
  }

  return motifMarkup('ruyi-cloud', palette);
}
function patternMotifMarkup(pattern, palette) {
  if (pattern.curated) return motifMarkup(pattern.id, palette);
  return categoryMotifMarkup(pattern.motif, pattern.variant, palette, pattern);
}

function categoryMotifMarkup(motif, variant, palette, pattern) {
  const stroke = palette.primary;
  const accent = palette.accent;
  const third = palette.third;
  const v = Number(variant) || 1;
  const rot = (v % 7) * 3;
  const wrap = (content) => `<g transform="rotate(${rot} 120 120)">${content}</g>`;

  if (motif === 'tianxiang') {
    if (v % 5 === 0) return wrap(motifMarkup('ruyi-cloud', palette));
    if (v % 5 === 1) {
      const rays = Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        const x1 = 120 + Math.cos(a) * 50;
        const y1 = 120 + Math.sin(a) * 50;
        const x2 = 120 + Math.cos(a) * 76;
        const y2 = 120 + Math.sin(a) * 76;
        return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${accent}" stroke-width="3" />`;
      }).join('');
      return wrap(`<circle cx="120" cy="120" r="38" fill="${accent}" opacity=".28" stroke="${stroke}" stroke-width="4" /><circle cx="120" cy="120" r="14" fill="${stroke}" />${rays}`);
    }
    if (v % 5 === 2) {
      const stars = [[70,72],[156,82],[98,154],[176,158],[58,158]].map(([x,y],i) => `<path d="M${x} ${y-12}L${x+4} ${y-4}L${x+12} ${y}L${x+4} ${y+4}L${x} ${y+12}L${x-4} ${y+4}L${x-12} ${y}L${x-4} ${y-4}Z" fill="${i%2?accent:stroke}" opacity=".85" />`).join('');
      return wrap(`<circle cx="120" cy="120" r="86" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="3 8" />${stars}`);
    }
    if (v % 5 === 3) return wrap(`<path d="M126 34L72 112h40l-24 72 72-92h-40l32-58Z" fill="${accent}" opacity=".25" stroke="${stroke}" stroke-width="4" stroke-linejoin="round" />`);
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M28 82c24-26 48 24 72 0s48-26 72 0M22 124c28-26 56 26 84 0s56-26 84 0M34 166c22-22 44 22 66 0s44-22 66 0" /><path d="M54 52c18 12 34 14 52 4M164 184c-18-12-34-14-52-4" stroke="${accent}" /></g>`);
  }

  if (motif === 'jihe') {
    if (v % 5 === 0) return wrap(motifMarkup('fret', palette));
    if (v % 5 === 1) return wrap(motifMarkup('hex', palette));
    if (v % 5 === 2) return wrap(motifMarkup('bead', palette));
    if (v % 5 === 3) {
      const coins = [];
      for (let row = 0; row < 3; row += 1) for (let col = 0; col < 3; col += 1) coins.push(`<g transform="translate(${56+col*64} ${56+row*64})"><circle r="22" fill="none" stroke="${stroke}" stroke-width="3" /><rect x="-7" y="-7" width="14" height="14" fill="${accent}" /></g>`);
      return wrap(coins.join(''));
    }
    const lattice = Array.from({ length: 5 }, (_, i) => `<path d="M${20+i*44} 20L220 ${20+i*44}M${20+i*44} 220L220 ${220-i*44}" />`).join('');
    return wrap(`<g stroke="${stroke}" stroke-width="2.5" opacity=".85">${lattice}<rect x="26" y="26" width="188" height="188" fill="none" stroke="${accent}" stroke-width="3" /></g>`);
  }

  if (motif === 'zhiwu') {
    if (v % 5 === 0) return wrap(motifMarkup('lotus', palette));
    if (v % 5 === 1) return wrap(motifMarkup('peony', palette));
    if (v % 5 === 2) return wrap(motifMarkup('chrysanthemum', palette));
    if (v % 5 === 3) return wrap(motifMarkup('plum', palette));
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M32 178c34-18 48-48 54-88M86 90c18 18 34 22 54 14M64 132c20 8 34 22 40 42" /></g>${flower(78,84,palette,.9)}${flower(130,72,palette,1.05)}${flower(104,148,palette,.76)}<g fill="${accent}"><circle cx="174" cy="108" r="3" /><circle cx="46" cy="160" r="3" /></g>`);
  }

  if (motif === 'dongwu') {
    if (v % 5 === 0) return wrap(motifMarkup('dragon', palette));
    if (v % 5 === 1) return wrap(motifMarkup('phoenix', palette));
    if (v % 5 === 2) return wrap(motifMarkup('fish', palette));
    if (v % 5 === 3) return wrap(motifMarkup('bat', palette));
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M70 148c0-34 24-62 58-62 26 0 44 14 54 34M126 86c-6-14 2-28 16-32M154 98c12-12 28-14 40-4M64 148v30M94 148v30M150 152v26M180 148v30M184 86c18-16 34-14 46-2" /><path d="M118 60c-2-10 6-18 16-18M158 70c8-10 22-12 30-4" stroke="${accent}" /></g><circle cx="196" cy="76" r="8" fill="${accent}" opacity=".8" />`);
  }

  if (motif === 'shenshou') {
    if (v % 4 === 0) return wrap(motifMarkup('taotie', palette));
    if (v % 4 === 1) return wrap(motifMarkup('kui-dragon', palette));
    if (v % 4 === 2) return wrap(motifMarkup('bagua', palette));
    return wrap(`<g transform="translate(120 120)"><g fill="none" stroke="${stroke}" stroke-width="4"><path d="M0-74v148M-54-46c-30-16-46 4-36 28 10 22 38 22 56 6M54-46c30-16 46 4 36 28-10 22-38 22-56 6" /><path d="M-30-16c0-8 7-14 15-14s15 6 15 14-7 14-15 14-15-6-15-14ZM0 0c-10 18-6 38 8 50 12-14 14-32 4-50M-52 56c-16 10-24 24-26 40M52 56c16 10 24 24 26 40" /></g><g fill="${accent}"><circle cx="-15" cy="-16" r="3" /><circle cx="15" cy="-16" r="3" /></g><circle r="96" fill="none" stroke="${third}" stroke-width="2" stroke-dasharray="2 8" /></g>`);
  }

  if (motif === 'renwu') {
    if (v % 4 === 0) return wrap(motifMarkup('children', palette));
    if (v % 4 === 1) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><circle cx="120" cy="68" r="22" /><path d="M120 90v62M120 108l-34 24M120 108l34 24M120 152l-24 42M120 152l24 42M104 54c4-12 12-18 22-18" /><path d="M72 184c18-16 34-16 48 0s30 16 48 0" stroke="${accent}" /></g>`);
    if (v % 4 === 2) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="3.6" stroke-linecap="round"><circle cx="88" cy="86" r="16" /><circle cx="152" cy="78" r="14" /><path d="M88 102v42M152 92v40M72 118l16 10M104 118l16 10M136 112l16 8M168 112l-16 8M88 144l-14 30M88 144l14 30M152 132l-12 28M152 132l12 28" /></g><g fill="${accent}"><circle cx="82" cy="84" r="2.5" /><circle cx="94" cy="84" r="2.5" /><circle cx="147" cy="76" r="2.3" /><circle cx="157" cy="76" r="2.3" /></g>`);
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><circle cx="120" cy="58" r="20" /><path d="M120 78c-8 34-22 60-44 84M120 78c8 34 22 60 44 84M120 108l-46-22M120 108l46-22M76 150c30 14 58 14 88 0" /><path d="M60 58c20-20 44-28 70-22M154 60c18-12 34-8 42 8" stroke="${accent}" /></g>`);
  }

  if (motif === 'wenzi') {
    const chars = pattern.name.replace('纹','');
    const fontSize = chars.length > 1 ? 88 : 142;
    return `<circle cx="120" cy="120" r="92" fill="${accent}" opacity=".12" stroke="${stroke}" stroke-width="3" /><circle cx="120" cy="120" r="82" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="3 7" /><text x="120" y="${chars.length > 1 ? 151 : 168}" text-anchor="middle" font-family="serif" font-size="${fontSize}" fill="${stroke}" transform="rotate(${rot - 3} 120 120)">${escapeHtml(chars)}</text><circle cx="196" cy="52" r="8" fill="${accent}" opacity=".75" />`;
  }

  if (motif === 'qiwu') {
    if (v % 5 === 0) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M62 78h116l-18 54H80Z" /><path d="M84 132l-18 54M156 132l18 54M120 132v54M52 186h136" /><path d="M92 78c8-24 48-24 56 0" stroke="${accent}" /></g>`);
    if (v % 5 === 1) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M102 40h36l8 38c20 18 30 38 30 62 0 34-24 56-56 56s-56-22-56-56c0-24 10-44 30-62Z" /><path d="M94 78h52M82 132c24 10 52 10 76 0" stroke="${accent}" /></g>`);
    if (v % 5 === 2) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M48 104h144c-8 50-36 76-72 76s-64-26-72-76Z" /><path d="M72 180h96M88 104v42M152 104v42" stroke="${accent}" /></g>`);
    if (v % 5 === 3) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"><path d="M70 182L120 38l50 144Z" /><path d="M84 140c24-10 48-10 72 0M98 104c14-6 30-6 44 0" stroke="${accent}" /><path d="M120 182v20" /></g>`);
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4"><circle cx="120" cy="120" r="66" /><circle cx="120" cy="120" r="14" fill="${accent}" /><path d="M120 54v22M120 164v22M54 120h22M164 120h22" stroke="${accent}" /><circle cx="120" cy="120" r="86" stroke="${third}" stroke-dasharray="3 8" /></g>`);
  }

  if (motif === 'jianzhu') {
    if (v % 5 === 0) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="3.6"><rect x="46" y="46" width="148" height="148" rx="6" /><rect x="72" y="72" width="96" height="96" /><path d="M72 120h96M120 72v96M96 46v26M144 46v26M96 168v26M144 168v26" stroke="${accent}" /></g>`);
    if (v % 5 === 1) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"><path d="M28 142c38-34 70-52 92-80 22 28 54 46 92 80" /><path d="M52 142c28-24 50-36 68-58 18 22 40 34 68 58" stroke="${accent}" /><path d="M48 170h144M68 142v42M172 142v42" /></g>`);
    if (v % 5 === 2) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4"><path d="M60 172h120M78 172v-38h84v38M98 134v-30h44v30M118 104V78" /><path d="M54 172h132M70 184h100" stroke="${accent}" /></g>`);
    if (v % 5 === 3) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="3.5"><circle cx="120" cy="120" r="62" /><circle cx="120" cy="120" r="20" fill="${accent}" /><path d="M120 58v22M120 160v22M58 120h22M160 120h22M76 76l16 16M148 148l16 16M164 76l-16 16M92 148l-16 16" /></g>`);
    return wrap(`<g fill="none" stroke="${stroke}" stroke-width="4"><path d="M64 178V98h112v80M84 178v-48h72v48M52 98l68-42 68 42" /><path d="M72 184h96" stroke="${accent}" /><circle cx="120" cy="48" r="6" fill="${accent}" /></g>`);
  }

  if (motif === 'shanshui') {
    if (v % 5 === 0) return wrap(motifMarkup('wave', palette));
    if (v % 5 === 1) return wrap(`<g><path d="M18 184l58-104 34 58 24-32 50 78Z" fill="${third}" opacity=".35" stroke="${stroke}" stroke-width="4" /><path d="M42 184l42-70 26 44 18-22 32 48Z" fill="none" stroke="${accent}" stroke-width="3" /><path d="M18 196c28-14 54-14 82 0s54 14 82 0" fill="none" stroke="${stroke}" stroke-width="3" /></g>`);
    if (v % 5 === 2) return wrap(`<g fill="none" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"><path d="M24 178c28-18 56 18 84 0s56-18 84 0" /><path d="M78 178c-8-38 4-72 22-98M104 174c-2-44 14-78 32-104M142 176c0-36 12-62 28-84" stroke="${accent}" /><path d="M42 150c18-10 36-10 54 0M148 146c16-8 32-8 48 0" /></g>`);
    if (v % 5 === 3) return wrap(`<g><path d="M24 178l58-104 40 64 30-40 44 80Z" fill="${third}" opacity=".32" /><path d="M24 178l58-104 40 64 30-40 44 80" fill="none" stroke="${stroke}" stroke-width="4" /><path d="M82 158c18-18 36-18 54 0s36 18 54 0" fill="none" stroke="${accent}" stroke-width="3" /></g>`);
    return wrap(`<g><path d="M42 188c28-52 54-74 84-66 22 6 34 30 48 30 10 0 18-8 24-18" fill="none" stroke="${stroke}" stroke-width="4" /><path d="M44 198c30-14 58-14 88 0s58 14 88 0" fill="none" stroke="${accent}" stroke-width="3" /><path d="M84 142c-6-18 2-34 16-44M158 138c8-16 8-30 0-42" stroke="${third}" stroke-width="3" /></g>`);
  }

  return motifMarkup('ruyi-cloud', palette);
}

function buildCardArt(pattern) {
  const palette = paletteForPattern(pattern);
  const tileId = nextId('card-tile');
  const tileSize = 138;
  const tileScale = 0.44;
  const tileOffset = (tileSize - 240 * tileScale) / 2;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520" role="img" aria-label="${escapeHtml(pattern.name)}纹样">
      <defs>
        <pattern id="${tileId}" width="${tileSize}" height="${tileSize}" patternUnits="userSpaceOnUse">
          <g transform="translate(${tileOffset} ${tileOffset}) scale(${tileScale})">${patternMotifMarkup(pattern, palette)}</g>
        </pattern>
      </defs>
      <rect width="420" height="520" fill="${palette.bg}" />
      <rect width="420" height="520" fill="url(#${tileId})" opacity=".17" />
      <circle cx="210" cy="220" r="158" fill="${palette.primary}" opacity=".07" />
      <circle cx="210" cy="220" r="166" fill="none" stroke="${palette.accent}" stroke-width="1.5" stroke-dasharray="2 9" opacity=".85" />
      <g transform="translate(210 220) scale(1.32) translate(-120 -120)">${patternMotifMarkup(pattern, palette)}</g>
      <path d="M28 38h74M28 38v74M392 38h-74M392 38v74M28 474h74M28 474v-74M392 474h-74M392 474v-74" fill="none" stroke="${palette.primary}" stroke-width="1.5" opacity=".55" />
      <circle cx="210" cy="220" r="7" fill="${palette.accent}" opacity=".85" />
    </svg>`;
}

function buildArtifactPeek(pattern) {
  const artifact = pattern.artifact;
  if (!artifact) return '';
  return `
    <div class="artifact-peek" aria-hidden="true">
      <div class="artifact-peek-image">
        <img src="${artifact.image}" alt="${escapeHtml(artifact.title)}" loading="lazy" decoding="async">
      </div>
      <div class="artifact-peek-copy">
        <span>${escapeHtml(artifact.label || (artifact.exact ? '馆藏实物' : '同类馆藏参照'))}</span>
        <strong>${escapeHtml(artifact.titleZh)}</strong>
        <small>${escapeHtml(artifact.museum)} · ${escapeHtml(artifact.accession)} · ${escapeHtml(artifact.date)}</small>
      </div>
    </div>
    <span class="artifact-badge">${artifact.exact ? '实物' : '参照'}</span>`;
}
function buildHeroArt() {
  const palette = paletteForPattern(getPattern('baoxiang'));
  const ring = Array.from({ length: 12 }, (_, index) => `
    <g transform="translate(300 300) rotate(${index * 30}) translate(0 -188) scale(.25) translate(-120 -120)">${motifMarkup('ruyi-cloud', palette)}</g>`).join('');
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="中华传统纹样组合">
      <circle cx="300" cy="300" r="278" fill="none" stroke="${palette.accent}" stroke-width="1" stroke-dasharray="3 14" opacity=".75" />
      <circle cx="300" cy="300" r="232" fill="none" stroke="${palette.primary}" stroke-width="1.4" opacity=".25" />
      <circle cx="300" cy="300" r="178" fill="${palette.primary}" opacity=".045" />
      ${ring}
      <g transform="translate(300 300) scale(1.36) translate(-120 -120)">${motifMarkup('baoxiang', palette)}</g>
      <circle cx="300" cy="300" r="94" fill="none" stroke="${palette.accent}" stroke-width="1.5" stroke-dasharray="2 8" />
      <g fill="${palette.primary}" opacity=".75">
        <circle cx="300" cy="50" r="4" /><circle cx="550" cy="300" r="4" /><circle cx="300" cy="550" r="4" /><circle cx="50" cy="300" r="4" />
      </g>
    </svg>`;
}

function buildQuizArt(pattern) {
  const palette = paletteForPattern(pattern);
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" role="img" aria-label="${escapeHtml(pattern.name)}纹样观察图">
      <rect width="360" height="360" fill="${palette.bg}" />
      <circle cx="180" cy="180" r="148" fill="${palette.primary}" opacity=".07" />
      <circle cx="180" cy="180" r="152" fill="none" stroke="${palette.accent}" stroke-width="1.5" stroke-dasharray="2 9" />
      <g transform="translate(180 180) scale(1.22) translate(-120 -120)">${patternMotifMarkup(pattern, palette)}</g>
      <path d="M24 30h52M24 30v52M336 30h-52M336 30v52M24 330h52M24 330v-52M336 330h-52M336 330v-52" fill="none" stroke="${palette.primary}" stroke-width="1.4" opacity=".5" />
    </svg>`;
}

function buildLabSvg(design, options = {}) {
  const pattern = getPattern(design.patternId);
  const palette = getPalette(design.paletteId);
  const width = options.width || 900;
  const height = options.height || 720;
  const captionHeight = options.withCaption ? Math.round(height * 0.2) : 0;
  const artHeight = height - captionHeight;
  const density = Number(design.density) || 4;
  const scale = Number(design.scale) || 0.72;
  const motif = patternMotifMarkup(pattern, palette);
  let content = '';

  if (design.transform === 'continuous') {
    const tile = Math.max(126, 272 - density * 19);
    const offset = tile / 2 - 120 * scale;
    const tileId = nextId('lab-tile');
    content = `
      <defs>
        <pattern id="${tileId}" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse">
          <g transform="translate(${offset} ${offset}) scale(${scale})">${motif}</g>
        </pattern>
      </defs>
      <rect width="${width}" height="${artHeight}" fill="url(#${tileId})" />`;
  } else if (design.transform === 'radial') {
    const count = Math.max(6, Math.round(density * 2.2));
    const radius = Math.min(width, artHeight) * 0.31;
    const cx = width / 2;
    const cy = artHeight / 2;
    const groups = Array.from({ length: count }, (_, index) => {
      const angle = (360 / count) * index;
      return `<g transform="translate(${cx} ${cy}) rotate(${angle}) translate(0 ${-radius}) scale(${scale * 0.78}) translate(-120 -120)">${motif}</g>`;
    }).join('');
    content = `${groups}<g transform="translate(${cx} ${cy}) scale(${scale * 1.16}) translate(-120 -120)">${motif}</g>`;
  } else if (design.transform === 'mirror') {
    const positions = [
      [width * 0.31, artHeight * 0.34, 1],
      [width * 0.69, artHeight * 0.34, -1],
      [width * 0.31, artHeight * 0.7, 1],
      [width * 0.69, artHeight * 0.7, -1]
    ];
    content = positions.map(([x, y, direction]) => `
      <g transform="translate(${x} ${y}) scale(${scale * direction} ${scale}) translate(-120 -120)">${motif}</g>`).join('');
  } else {
    const random = mulberry32(pattern.id.length * 97 + density * 13 + Math.round(scale * 100) + (palette.id.length * 7));
    const count = Math.max(6, Math.round(density * 2.4));
    content = Array.from({ length: count }, () => {
      const x = width * (0.1 + random() * 0.8);
      const y = artHeight * (0.1 + random() * 0.8);
      const rotation = Math.round(random() * 360);
      const s = scale * (0.62 + random() * 0.48);
      return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotation}) scale(${s}) translate(-120 -120)" opacity="${(0.72 + random() * 0.28).toFixed(2)}">${motif}</g>`;
    }).join('');
  }

  let caption = '';
  if (options.withCaption) {
    const sourceLabel = pattern.artifact.exact ? '馆藏实物' : '同类馆藏参照';
    const sourceLine1 = `${sourceLabel} · The Cleveland Museum of Art`;
    const sourceLine2 = `Accession No. ${pattern.artifact.accession} · ${pattern.artifact.date}`;
    const left = Math.round(width * 0.05);
    const titleSize = Math.round(width * 0.028);
    const subtitleSize = Math.round(width * 0.019);
    const sourceSize = Math.round(width * 0.011);
    caption = `
      <g>
        <rect x="0" y="${artHeight}" width="${width}" height="${captionHeight}" fill="${palette.ink}" />
        <rect x="0" y="${artHeight}" width="${width}" height="4" fill="${palette.accent}" />
        <text x="${left}" y="${artHeight + Math.round(captionHeight * 0.34)}" fill="${palette.bg}" font-family="serif" font-size="${titleSize}" letter-spacing="3">纹以载道</text>
        <text x="${left}" y="${artHeight + Math.round(captionHeight * 0.58)}" fill="${palette.accent}" font-family="serif" font-size="${subtitleSize}">${escapeHtml(pattern.name)} · ${escapeHtml(transformLabel(design.transform))} · ${escapeHtml(palette.name)}</text>
        <text x="${left}" y="${artHeight + Math.round(captionHeight * 0.78)}" fill="${palette.bg}" opacity=".78" font-family="sans-serif" font-size="${sourceSize}">${escapeHtml(sourceLine1)}</text>
        <text x="${left}" y="${artHeight + Math.round(captionHeight * 0.9)}" fill="${palette.bg}" opacity=".56" font-family="sans-serif" font-size="${Math.round(sourceSize * 0.9)}">${escapeHtml(sourceLine2)}</text>
        <text x="${width - left}" y="${artHeight + Math.round(captionHeight * 0.5)}" text-anchor="end" fill="${palette.accent}" opacity=".72" font-family="sans-serif" font-size="${Math.round(sourceSize * 0.9)}" letter-spacing="1">PATTERNS AS LANGUAGE</text>
      </g>`;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="纹样实验室生成作品">
      <rect width="${width}" height="${height}" fill="${palette.bg}" />
      <g>${content}</g>
      <rect x="18" y="18" width="${width - 36}" height="${artHeight - 36}" fill="none" stroke="${palette.ink}" stroke-width="1.2" opacity=".35" />
      <rect x="30" y="30" width="${width - 60}" height="${artHeight - 60}" fill="none" stroke="${palette.accent}" stroke-width="1" opacity=".6" />
      <circle cx="${width - 50}" cy="${artHeight - 50}" r="18" fill="none" stroke="${palette.primary}" stroke-width="1.2" opacity=".55" />
      <circle cx="${width - 50}" cy="${artHeight - 50}" r="4" fill="${palette.primary}" opacity=".65" />
      ${caption}
    </svg>`;
}

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function categoryGroup(pattern) {
  if (pattern.group) return pattern.group;
  const category = pattern.category || '';
  if (category.includes('天象')) return '天象';
  if (category.includes('几何')) return '几何';
  if (category.includes('植物')) return '植物';
  if (category.includes('动物')) return '动物';
  if (category.includes('人物')) return '人物';
  if (category.includes('吉祥') || category.includes('结绳')) return '吉祥';
  if (category.includes('水石')) return '山水';
  if (category.includes('宇宙')) return '宇宙';
  return '其他';
}

function patternSearchText(pattern) {
  const artifact = pattern.artifact || {};
  return [
    pattern.name,
    pattern.english,
    pattern.category,
    pattern.era,
    pattern.meaning,
    pattern.summary,
    pattern.description,
    pattern.structure,
    ...(pattern.elements || []),
    ...(pattern.tags || []),
    ...(pattern.pinyin || []),
    artifact.accession,
    artifact.date,
    artifact.museum
  ].filter(Boolean).join(' ').toLowerCase();
}

function renderCardArt(card) {
  const art = card.querySelector('.pattern-card-art');
  if (!art || art.dataset.rendered === 'true') return;
  const pattern = getPattern(card.dataset.patternId);
  art.innerHTML = buildCardArt(pattern);
  art.dataset.rendered = 'true';
}

function renderVisibleCardArt() {
  const track = $('#patternTrack');
  if (!track) return;
  const trackRect = track.getBoundingClientRect();
  $$('.pattern-card', track).forEach((card) => {
    if (card.hidden) return;
    const rect = card.getBoundingClientRect();
    if (rect.bottom >= trackRect.top - 500 && rect.top <= trackRect.bottom + 500) renderCardArt(card);
  });
}

function setupLazyCardArt() {
  const track = $('#patternTrack');
  if (!track) return;
  const cards = $$('.pattern-card', track);
  if (!('IntersectionObserver' in window)) {
    cards.forEach(renderCardArt);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        renderCardArt(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { root: track, rootMargin: '500px 0px' });
  cards.forEach((card) => observer.observe(card));
  requestAnimationFrame(renderVisibleCardArt);
}

function applyPatternSort() {
  const track = $('#patternTrack');
  if (!track) return;
  const cards = $$('.pattern-card', track);
  const sorted = [...cards].sort((a, b) => {
    const original = Number(a.dataset.order) - Number(b.dataset.order);
    if (state.sortMode === 'name') {
      return (a.dataset.pinyin || a.dataset.name || '').localeCompare(b.dataset.pinyin || b.dataset.name || '', 'zh-CN') || original;
    }
    if (state.sortMode === 'exact') {
      return Number(b.dataset.exact) - Number(a.dataset.exact) || original;
    }
    if (state.sortMode === 'category') {
      return Number(a.dataset.groupOrder) - Number(b.dataset.groupOrder) || original;
    }
    return original;
  });
  sorted.forEach((card) => track.appendChild(card));
  requestAnimationFrame(renderVisibleCardArt);
}

function updatePatternProgress() {
  const track = $('#patternTrack');
  const progress = $('#scrollProgress');
  if (!track || !progress) return;
  const max = track.scrollWidth - track.clientWidth;
  progress.style.width = `${max > 0 ? Math.min(100, (track.scrollLeft / max) * 100) : 100}%`;
}

function clearActiveTags() {
  $$('.tag-chip[data-tag]').forEach((button) => {
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
    button.querySelector('.tag-state')?.remove();
  });
  state.activeTag = '';
}

function markActiveTag(tag) {
  clearActiveTags();
  const button = $$('.tag-chip[data-tag]').find((item) => item.dataset.tag === tag);
  if (!button) return;
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
  if (!button.querySelector('.tag-state')) button.insertAdjacentHTML('beforeend', '<span class="tag-state">已选中</span>');
  state.activeTag = tag;
}

function selectTag(tag) {
  const input = $('#patternSearch');
  if (input) input.value = tag;
  state.searchQuery = tag.toLowerCase();
  state.searchTerms = [];
  state.activeTag = tag;
  state.activeCategory = '全部';
  $$('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip.dataset.category === '全部'));
  markActiveTag(tag);
  applyPatternFilter();
}

function clearAllFilters() {
  const input = $('#patternSearch');
  const sort = $('#sortSelect');
  if (input) input.value = '';
  if (sort) sort.value = 'common';
  state.searchQuery = '';
  state.searchTerms = [];
  state.activeTag = '';
  state.activeCategory = '全部';
  state.sortMode = 'common';
  $$('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip.dataset.category === '全部'));
  clearActiveTags();
  applyPatternSort();
  applyPatternFilter();
  showToast('已清除全部筛选');
}

function updateClearAllVisibility() {
  const button = $('#clearAllFilters');
  if (!button) return;
  button.hidden = !(state.searchTerms.length > 0 || state.activeCategory !== '全部' || state.sortMode !== 'common' || state.activeTag);
}

function renderEmptyRecommendations() {
  const container = $('#emptyTags');
  if (!container) return;
  const counts = new Map();
  PATTERNS.forEach((pattern) => (pattern.tags || []).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
  const terms = state.searchTerms;
  const hasOverlap = [...counts.keys()].some((tag) => terms.some((term) => tag.includes(term) || term.includes(tag)));
  const fallback = ['婚庆','长寿','佛教','财富','文人','道教','祥瑞','皇权','多子','云气','龙','凤'];
  const candidates = hasOverlap ? [...counts.keys()] : fallback.filter((tag) => counts.has(tag));
  const scored = candidates.map((tag) => {
    let score = counts.get(tag) || 0;
    if (terms.some((term) => tag.includes(term) || term.includes(tag))) score += 100;
    if (terms.some((term) => term && tag[0] === term[0])) score += 20;
    if (tag === state.activeTag) score -= 50;
    return { tag, score };
  }).sort((a, b) => b.score - a.score).slice(0, 6);
  container.innerHTML = scored.map(({ tag }) => `<button class="tag-chip empty-tag" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join('');
}

function applyPatternFilter() {
  const track = $('#patternTrack');
  if (!track) return;
  const cards = $$('.pattern-card', track);
  let visible = 0;
  cards.forEach((card) => {
    const search = card.dataset.search || '';
    const cardTags = (card.dataset.tags || '').split('|').filter(Boolean);
    const matchesQuery = state.activeTag ? true : (state.searchTerms.length === 0 || state.searchTerms.every((term) => search.includes(term)));
    const matchesTag = state.activeTag ? cardTags.includes(state.activeTag) : true;
    const matchesCategory = state.activeCategory === '全部' || card.dataset.category === state.activeCategory;
    const show = matchesQuery && matchesTag && matchesCategory;
    card.hidden = !show;
    if (show) visible += 1;
  });
  const result = $('#searchResult');
  const empty = $('#patternEmpty');
  const clear = $('#clearSearch');
  if (result) result.textContent = (state.searchTerms.length || state.activeTag || state.activeCategory !== '全部') ? `找到 ${visible} 个纹样` : `共 ${PATTERNS.length} 个纹样`;
  if (empty) empty.hidden = visible > 0;
  if (clear) clear.hidden = !state.searchQuery;
  updateClearAllVisibility();
  if (visible === 0) renderEmptyRecommendations();
  track.scrollTop = 0;
  updatePatternProgress();
  requestAnimationFrame(renderVisibleCardArt);
}

function setupPatternSearch() {
  const input = $('#patternSearch');
  const chips = $('#categoryFilters');
  const clear = $('#clearSearch');
  const sort = $('#sortSelect');
  const tagSuggestions = $('#tagSuggestions');
  if (!input || !chips) return;
  const groups = ['全部', ...new Set(PATTERNS.map(categoryGroup))];
  chips.innerHTML = groups.map((group) => `<button class="filter-chip${group === state.activeCategory ? ' active' : ''}" type="button" data-category="${escapeHtml(group)}">${escapeHtml(group)}</button>`).join('');
  const parseTerms = (value) => value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  input.addEventListener('input', () => {
    state.searchQuery = input.value.trim().toLowerCase();
    state.searchTerms = parseTerms(input.value);
    clearActiveTags();
    applyPatternFilter();
  });
  clear?.addEventListener('click', () => {
    input.value = '';
    state.searchQuery = '';
    state.searchTerms = [];
    clearActiveTags();
    input.focus();
    applyPatternFilter();
  });
  chips.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-chip');
    if (!button) return;
    state.activeCategory = button.dataset.category;
    $$('.filter-chip', chips).forEach((chip) => chip.classList.toggle('active', chip === button));
    applyPatternFilter();
  });
  sort?.addEventListener('change', () => {
    state.sortMode = sort.value;
    applyPatternSort();
    applyPatternFilter();
  });
  if (tagSuggestions) {
    const hotTags = ['云气','龙','凤','佛教','婚庆','长寿','财富','文人','道教','祥瑞','皇权','多子'];
    tagSuggestions.innerHTML = `<span class="tag-label">热门标签</span>${hotTags.map((tag) => `<button class="tag-chip" type="button" data-tag="${escapeHtml(tag)}" aria-pressed="false">${escapeHtml(tag)}</button>`).join('')}<button class="clear-all" id="clearAllFilters" type="button" hidden>清除全部筛选</button>`;
    tagSuggestions.addEventListener('click', (event) => {
      const button = event.target.closest('.tag-chip[data-tag]');
      if (!button) return;
      if (button.classList.contains('active')) {
        clearAllFilters();
        return;
      }
      selectTag(button.dataset.tag);
    });
    $('#clearAllFilters')?.addEventListener('click', clearAllFilters);
  }
  $('#emptyTags')?.addEventListener('click', (event) => {
    const button = event.target.closest('.tag-chip[data-tag]');
    if (!button) return;
    selectTag(button.dataset.tag);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      input.focus();
    }
  });
  applyPatternFilter();
}

function renderHero() {
  const heroArt = $('#heroArt');
  if (heroArt) heroArt.innerHTML = buildHeroArt();
}

function renderPatternCards() {
  const track = $('#patternTrack');
  if (!track) return;
  const groupOrder = (pattern) => {
    const index = CATEGORY_ORDER.indexOf(categoryGroup(pattern));
    return index < 0 ? 99 : index;
  };
  track.innerHTML = PATTERNS.map((pattern, index) => `
    <article class="pattern-card" data-pattern-id="${pattern.id}" data-name="${escapeHtml(pattern.name)}" data-pinyin="${escapeHtml((pattern.pinyin || []).join(' '))}" data-order="${index}" data-group-order="${groupOrder(pattern)}" data-exact="${pattern.artifact && pattern.artifact.exact ? '1' : '0'}" data-category="${escapeHtml(categoryGroup(pattern))}" data-tags="${escapeHtml((pattern.tags || []).join('|'))}" data-search="${escapeHtml(patternSearchText(pattern))}" tabindex="0" role="button" aria-label="查看${escapeHtml(pattern.name)}">
      <div class="pattern-card-art" data-art-id="${pattern.id}" aria-hidden="true"></div>
      ${buildArtifactPeek(pattern)}
      <div class="pattern-card-copy">
        <span class="card-index">${String(index + 1).padStart(2, '0')} / ${String(PATTERNS.length).padStart(2, '0')} · ${escapeHtml(pattern.category)}</span>
        <h3>${escapeHtml(pattern.name)}</h3>
        <p>${escapeHtml(pattern.summary)}</p>
        <div class="pattern-card-tags">${(pattern.tags || pattern.elements).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
      </div>
    </article>`).join('');

  track.addEventListener('click', (event) => {
    const card = event.target.closest('.pattern-card');
    if (card) openPatternDialog(card.dataset.patternId);
  });
  track.addEventListener('keydown', (event) => {
    const card = event.target.closest('.pattern-card');
    if (card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openPatternDialog(card.dataset.patternId);
    }
  });
}

function setupCarousel() {
  const track = $('#patternTrack');
  const prev = $('#prevPattern');
  const next = $('#nextPattern');
  const progress = $('#scrollProgress');
  if (!track || !prev || !next) return;

  const scrollAmount = () => {
    const card = track.querySelector('.pattern-card');
    return card ? card.getBoundingClientRect().width + 18 : track.clientWidth * 0.8;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  track.addEventListener('scroll', updatePatternProgress, { passive: true });
  window.addEventListener('resize', updatePatternProgress);
  updatePatternProgress();
}

function setupQuiz() {
  const nextButton = $('#quizNext');
  if (!nextButton) return;
  nextButton.addEventListener('click', () => {
    if (state.quizFinished) {
      resetQuiz();
      return;
    }
    if (state.quizIndex < QUIZ.length - 1) {
      state.quizIndex += 1;
      state.quizAnswered = false;
      renderQuiz();
    } else {
      state.quizFinished = true;
      renderQuizResult();
    }
  });
  resetQuiz();
}

function resetQuiz() {
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizFinished = false;
  renderQuiz();
}

function renderQuiz() {
  const question = QUIZ[state.quizIndex];
  const pattern = getPattern(question.patternId);
  const step = $('#quizStep');
  const prompt = $('#quizPrompt');
  const options = $('#quizOptions');
  const feedback = $('#quizFeedback');
  const next = $('#quizNext');
  const progress = $('#quizProgress');
  const quizPattern = $('#quizPattern');
  if (!question || !prompt || !options) return;

  step.textContent = `${String(state.quizIndex + 1).padStart(2, '0')} / ${String(QUIZ.length).padStart(2, '0')}`;
  quizPattern.innerHTML = buildQuizArt(pattern);
  prompt.textContent = question.prompt;
  feedback.hidden = true;
  feedback.innerHTML = '';
  next.disabled = true;
  next.innerHTML = state.quizIndex === QUIZ.length - 1 ? '查看结果 <span aria-hidden="true">→</span>' : '下一题 <span aria-hidden="true">→</span>';
  options.innerHTML = question.options.map((option, index) => `
    <button class="quiz-option" type="button" data-option-index="${index}">${escapeHtml(option)}</button>`).join('');
  progress.innerHTML = QUIZ.map((_, index) => `<span class="${index < state.quizIndex ? 'done' : ''}"></span>`).join('');
  options.querySelectorAll('.quiz-option').forEach((button) => {
    button.addEventListener('click', () => answerQuiz(Number(button.dataset.optionIndex), button));
  });
}

function answerQuiz(index, button) {
  if (state.quizAnswered) return;
  const question = QUIZ[state.quizIndex];
  const options = $$('#quizOptions .quiz-option');
  const feedback = $('#quizFeedback');
  const next = $('#quizNext');
  state.quizAnswered = true;
  const correct = index === question.answer;
  if (correct) state.quizScore += 1;
  button.classList.add(correct ? 'correct' : 'wrong');
  options.forEach((option, optionIndex) => {
    option.disabled = true;
    if (optionIndex === question.answer) option.classList.add('correct');
  });
  feedback.hidden = false;
  feedback.innerHTML = `<strong>${correct ? '判断正确' : '再想一步'}</strong>${escapeHtml(question.explanation)}`;
  next.disabled = false;
}

function renderQuizResult() {
  const step = $('#quizStep');
  const prompt = $('#quizPrompt');
  const options = $('#quizOptions');
  const feedback = $('#quizFeedback');
  const next = $('#quizNext');
  const progress = $('#quizProgress');
  const quizPattern = $('#quizPattern');
  step.textContent = '完成';
  quizPattern.innerHTML = buildHeroArt();
  prompt.textContent = `你已完成本轮解码：${state.quizScore} / ${QUIZ.length}`;
  options.innerHTML = '';
  feedback.hidden = false;
  feedback.innerHTML = '<strong>纹样不只是图案</strong>它是有结构、有语义、可以被重新组合的视觉语言。下一站，去实验室写下你的句子。';
  next.disabled = false;
  next.innerHTML = '再玩一次 <span aria-hidden="true">↻</span>';
  progress.innerHTML = QUIZ.map(() => '<span class="done"></span>').join('');
}

function setupLab() {
  const motifSelect = $('#motifSelect');
  const paletteList = $('#paletteList');
  const transformSelect = $('#transformSelect');
  const densityRange = $('#densityRange');
  const scaleRange = $('#scaleRange');
  if (!motifSelect || !paletteList || !transformSelect || !densityRange || !scaleRange) return;

  const motifGroups = [...new Set(PATTERNS.map(categoryGroup))];
  motifSelect.innerHTML = motifGroups.map((group) => `<optgroup label="${escapeHtml(group)}">${PATTERNS.filter((pattern) => categoryGroup(pattern) === group).map((pattern) => `<option value="${pattern.id}">${escapeHtml(pattern.name)}</option>`).join('')}</optgroup>`).join('');
  paletteList.innerHTML = PALETTES.map((palette) => `
    <button class="palette-button" type="button" data-palette-id="${palette.id}" title="${escapeHtml(palette.name)}" aria-label="选择${escapeHtml(palette.name)}配色" style="--swatch:${palette.primary}"></button>`).join('');

  motifSelect.addEventListener('change', () => {
    state.selectedPatternId = motifSelect.value;
    renderLab();
  });
  paletteList.addEventListener('click', (event) => {
    const button = event.target.closest('.palette-button');
    if (!button) return;
    state.paletteId = button.dataset.paletteId;
    renderLab();
  });
  transformSelect.addEventListener('change', () => {
    state.transform = transformSelect.value;
    renderLab();
  });
  densityRange.addEventListener('input', () => {
    state.density = Number(densityRange.value);
    renderLab();
  });
  scaleRange.addEventListener('input', () => {
    state.scale = Number(scaleRange.value);
    renderLab();
  });
  $('#randomizeBtn').addEventListener('click', randomizeDesign);
  $('#resetBtn').addEventListener('click', resetDesign);
  $('#downloadBtn').addEventListener('click', downloadLabArt);
  $('#saveBtn').addEventListener('click', saveLabArt);
  $('#clearGalleryBtn').addEventListener('click', clearGallery);
  $('#gallery').addEventListener('click', (event) => {
    const remove = event.target.closest('.gallery-remove');
    const item = event.target.closest('.gallery-item');
    if (remove) {
      event.stopPropagation();
      removeSaved(remove.dataset.designId);
      return;
    }
    if (item) loadDesign(item.dataset.designId);
  });
  renderLab();
  renderGallery();
}

function syncLabControls() {
  $('#motifSelect').value = state.selectedPatternId;
  $('#transformSelect').value = state.transform;
  $('#densityRange').value = String(state.density);
  $('#scaleRange').value = String(state.scale);
  $('#densityValue').textContent = String(state.density);
  $('#scaleValue').textContent = Number(state.scale).toFixed(2);
  $$('#paletteList .palette-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.paletteId === state.paletteId);
  });
}

function renderLab() {
  syncLabControls();
  const pattern = getPattern(state.selectedPatternId);
  const palette = getPalette(state.paletteId);
  const preview = $('#labPreview');
  const status = $('#stageStatus');
  if (preview) preview.innerHTML = buildLabSvg(state);
  if (status) status.textContent = `${transformLabel(state.transform)} / ${pattern.name} / ${palette.name}`;
}

function transformLabel(value) {
  return ({ continuous: '连续纹样', radial: '中心放射', mirror: '镜像对称', scatter: '自由散点' })[value] || value;
}

function randomizeDesign() {
  const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const transforms = ['continuous', 'radial', 'mirror', 'scatter'];
  state.selectedPatternId = pattern.id;
  state.paletteId = palette.id;
  state.transform = transforms[Math.floor(Math.random() * transforms.length)];
  state.density = 2 + Math.floor(Math.random() * 7);
  state.scale = Number((0.46 + Math.random() * 0.55).toFixed(2));
  renderLab();
  showToast('已生成一组新的纹样语法');
}

function resetDesign() {
  state.selectedPatternId = PATTERNS[0].id;
  state.paletteId = PALETTES[0].id;
  state.transform = 'continuous';
  state.density = 4;
  state.scale = 0.72;
  renderLab();
  showToast('已恢复默认纹样');
}

function downloadLabArt() {
  const svg = buildLabSvg({ ...state, density: state.density, scale: state.scale }, { width: 1800, height: 1440, withCaption: true });
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1800;
    canvas.height = 1440;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pngBlob);
      link.download = `纹以载道_${getPattern(state.selectedPatternId).name}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      showToast('PNG 已导出');
    }, 'image/png');
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    showToast('导出失败，请刷新后重试');
  };
  image.src = url;
}

function saveLabArt() {
  const design = {
    id: String(Date.now()),
    patternId: state.selectedPatternId,
    paletteId: state.paletteId,
    transform: state.transform,
    density: state.density,
    scale: state.scale,
    createdAt: new Date().toISOString()
  };
  state.saved = [design, ...state.saved].slice(0, 6);
  persistSaved();
  renderGallery();
  showToast('已收藏到本地纹样谱');
}

function renderGallery() {
  const gallery = $('#gallery');
  const empty = $('#galleryEmpty');
  if (!gallery || !empty) return;
  gallery.innerHTML = state.saved.map((design) => `
    <div class="gallery-item" data-design-id="${design.id}" tabindex="0" role="button" aria-label="载入收藏的${escapeHtml(getPattern(design.patternId).name)}纹样">
      ${buildLabSvg(design, { width: 300, height: 240 })}
      <button class="gallery-remove" type="button" data-design-id="${design.id}" aria-label="删除这条收藏">×</button>
    </div>`).join('');
  empty.hidden = state.saved.length > 0;
}

function loadDesign(id) {
  const design = state.saved.find((item) => item.id === id);
  if (!design) return;
  state.selectedPatternId = design.patternId;
  state.paletteId = design.paletteId;
  state.transform = design.transform;
  state.density = design.density;
  state.scale = design.scale;
  renderLab();
  showToast('已载入收藏纹样');
}

function removeSaved(id) {
  state.saved = state.saved.filter((item) => item.id !== id);
  persistSaved();
  renderGallery();
  showToast('已删除收藏');
}

function clearGallery() {
  if (!state.saved.length) return;
  state.saved = [];
  persistSaved();
  renderGallery();
  showToast('收藏已清空');
}

function openPatternDialog(patternId) {
  const pattern = getPattern(patternId);
  const dialog = $('#patternDialog');
  if (!dialog) return;
  state.activeDialogPatternId = patternId;
  $('#dialogArt').innerHTML = buildCardArt(pattern);
  $('#dialogCategory').textContent = `${pattern.category} · ${pattern.era}`;
  $('#dialogTitle').textContent = pattern.name;
  $('#dialogMeaning').textContent = pattern.meaning;
  $('#dialogMeta').innerHTML = (pattern.tags || pattern.elements).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  $('#dialogDescription').textContent = pattern.description;
  $('#dialogStructure').textContent = pattern.structure;
  const artifact = pattern.artifact;
  const artifactBox = $('#dialogArtifact');
  if (artifactBox && artifact) {
    artifactBox.hidden = false;
    $('#dialogArtifactImage').src = artifact.image;
    $('#dialogArtifactImage').alt = `${artifact.titleZh}（${artifact.title}）馆藏实物照片`;
    $('#dialogArtifactTitle').textContent = `${artifact.titleZh} · ${artifact.title}`;
    $('#dialogArtifactDetails').textContent = `${artifact.accession} · ${artifact.date} · ${artifact.museum}`;
    $('#dialogArtifactLink').href = artifact.url;
    const kicker = $('#dialogArtifact .artifact-kicker');
    if (kicker) kicker.textContent = artifact.exact ? '馆藏实物对照' : '同类馆藏参照';
  } else if (artifactBox) {
    artifactBox.hidden = true;
  }
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function setupDialog() {
  const dialog = $('#patternDialog');
  if (!dialog) return;
  $('#dialogClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  $('#dialogUse').addEventListener('click', () => {
    const pattern = getPattern(state.activeDialogPatternId);
    state.selectedPatternId = pattern.id;
    state.paletteId = PALETTES.find((palette) => palette.primary === pattern.palette[0])?.id || state.paletteId;
    dialog.close();
    document.querySelector('#lab').scrollIntoView({ behavior: 'smooth' });
    renderLab();
    showToast(`已将${pattern.name}带入实验室`);
  });
}

function setupNav() {
  const toggle = $('#menuToggle');
  const nav = $('#siteNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupReveal() {
  const elements = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

function setupTour() {
  const button = $('#tourBtn');
  if (!button) return;
  let timers = [];
  button.addEventListener('click', () => {
    timers.forEach((timer) => clearTimeout(timer));
    timers = [];
    const sections = ['#scroll', '#decode', '#lab'];
    const labels = ['第一站：沿着数字长卷识纹', '第二站：用解码任务读懂纹样', '第三站：在实验室生成自己的纹样'];
    sections.forEach((selector, index) => {
      const timer = setTimeout(() => {
        document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
        showToast(labels[index]);
      }, index * 2600);
      timers.push(timer);
    });
  });
}

function renderMiniDiagrams() {
  const palette = PALETTES[0];
  const motif = $('#diagramMotif');
  const structure = $('#diagramStructure');
  const composition = $('#diagramComposition');
  if (motif) motif.innerHTML = motifSvg('ruyi-cloud', palette, 180);
  if (structure) structure.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">${Array.from({ length: 8 }, (_, index) => `<g transform="translate(90 90) rotate(${index * 45}) translate(0 -57) scale(.22) translate(-120 -120)">${motifMarkup('ruyi-cloud', palette)}</g>`).join('')}<circle cx="90" cy="90" r="18" fill="none" stroke="${palette.primary}" stroke-width="2" /></svg>`;
  if (composition) composition.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">${Array.from({ length: 4 }, (_, index) => `<g transform="translate(${45 + (index % 2) * 90} ${45 + Math.floor(index / 2) * 90}) scale(.32) translate(-120 -120)">${motifMarkup('fret', palette)}</g>`).join('')}</svg>`;
}

let toastTimer = null;
function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function init() {
  renderHero();
  renderPatternCards();
  setupLazyCardArt();
  setupPatternSearch();
  setupCarousel();
  setupQuiz();
  setupLab();
  setupDialog();
  setupNav();
  setupReveal();
  setupTour();
  renderMiniDiagrams();
}

document.addEventListener('DOMContentLoaded', init);







