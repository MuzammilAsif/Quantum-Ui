import type { Asset } from '../types';

export const ACETERNITY_ASSETS: Asset[] = [
  {
    id: 'aceternity-3d-card',
    title: '3D Card Effect',
    category: 'cards',
    framework: 'react',
    library: 'aceternity',
    tags: ['card', 'aceternity', '3d', 'tilt', 'interactive', 'mouse'],
    description: 'A card that tilts in 3D space following the mouse position, built with CSS perspective',
    difficulty: 'Advanced',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Aceternity UI',
    dateAdded: '2024-02-03',
    preview: null,
    code: {
      react: `<div className="rounded-xl border border-white/10 bg-black p-6 w-72" style={{ transform: 'perspective(1000px) rotateX(4deg) rotateY(-4deg)' }}>
  <h3 className="text-xl font-bold text-white">Make things float</h3>
  <p className="text-sm text-neutral-400 mt-2">Hover to unleash the power of CSS perspective</p>
  <div className="h-32 w-full mt-4 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600" />
</div>`,
      html: `<div class="rounded-xl border border-white/10 bg-black p-6" style="width:280px; transform: perspective(1000px) rotateX(4deg) rotateY(-4deg);">
  <h3 class="text-xl font-bold text-white">Make things float</h3>
  <p class="text-sm text-neutral-400 mt-2">Hover to unleash the power of CSS perspective</p>
  <div class="h-28 w-full mt-4 rounded-lg" style="background: linear-gradient(135deg,#8b5cf6,#3b82f6);"></div>
</div>`,
    },
  },
  {
    id: 'aceternity-card-hover',
    title: 'Card Hover Effect',
    category: 'cards',
    framework: 'react',
    library: 'aceternity',
    tags: ['card', 'aceternity', 'hover', 'grid', 'glow', 'interactive'],
    description: 'A grid of cards where hovering one reveals a soft glowing background behind it',
    difficulty: 'Intermediate',
    styleTag: 'Dark',
    version: '1.0.0',
    author: 'Aceternity UI',
    dateAdded: '2024-02-03',
    preview: null,
    code: {
      react: `<div className="grid grid-cols-2 gap-2">
  {['Projects', 'Team', 'Analytics', 'Settings'].map((item) => (
    <div key={item} className="relative rounded-xl border border-white/10 bg-black p-4 hover:bg-white/5 transition-colors">
      <p className="text-sm font-medium text-white">{item}</p>
    </div>
  ))}
</div>`,
      html: `<div class="grid grid-cols-2 gap-2" style="width:220px;">
  <div class="rounded-xl border border-white/10 bg-black p-4"><p class="text-sm font-medium text-white">Projects</p></div>
  <div class="rounded-xl border border-white/10 bg-black p-4"><p class="text-sm font-medium text-white">Team</p></div>
</div>`,
    },
  },
  {
    id: 'aceternity-card-stack',
    title: 'Card Stack',
    category: 'cards',
    framework: 'react',
    library: 'aceternity',
    tags: ['card', 'aceternity', 'stack', 'testimonial', 'layered'],
    description: 'A layered stack of overlapping cards, commonly used for rotating testimonials',
    difficulty: 'Advanced',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Aceternity UI',
    dateAdded: '2024-02-03',
    preview: null,
    code: {
      react: `<div className="relative h-40 w-64">
  {[0, 1, 2].map((i) => (
    <div
      key={i}
      className="absolute inset-0 rounded-2xl border border-white/10 bg-neutral-900 p-4"
      style={{ top: i * -8, transform: \`scale(\${1 - i * 0.04})\`, zIndex: 3 - i }}
    >
      <p className="text-sm text-white">"This library saved me weeks of design work."</p>
    </div>
  ))}
</div>`,
      html: `<div class="relative" style="height:140px; width:240px;">
  <div class="absolute inset-0 rounded-2xl border border-white/10 bg-neutral-900 p-4" style="top:-8px; transform: scale(0.98); z-index:2;">
    <p class="text-sm text-white">"This library saved me weeks of design work."</p>
  </div>
</div>`,
    },
  },
  {
    id: 'aceternity-spotlight',
    title: 'Spotlight',
    category: 'effects',
    framework: 'react',
    library: 'aceternity',
    tags: ['spotlight', 'aceternity', 'effect', 'cursor', 'dark', 'hero'],
    description: 'A radial spotlight glow effect positioned over a dark hero section',
    difficulty: 'Intermediate',
    styleTag: 'Dark',
    version: '1.0.0',
    author: 'Aceternity UI',
    dateAdded: '2024-02-03',
    preview: null,
    code: {
      react: `<div className="relative h-48 w-full rounded-md overflow-hidden bg-black flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 60%)' }}>
  <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400">
    Spotlight is the new way to shine
  </h1>
</div>`,
      html: `<div class="relative w-full rounded-md overflow-hidden bg-black flex items-center justify-center" style="height:160px; background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 60%);">
  <h1 class="text-xl font-bold text-center text-white px-4">Spotlight is the new way to shine</h1>
</div>`,
    },
  },
  {
    id: 'aceternity-sparkles',
    title: 'Sparkles',
    category: 'effects',
    framework: 'react',
    library: 'aceternity',
    tags: ['sparkles', 'aceternity', 'particles', 'effect', 'animated', 'stars'],
    description: 'A scattered field of animated sparkle particles overlaying a headline',
    difficulty: 'Advanced',
    styleTag: 'Dark',
    version: '1.0.0',
    author: 'Aceternity UI',
    dateAdded: '2024-02-03',
    preview: null,
    code: {
      react: `<div className="relative h-40 w-full rounded-md bg-black flex items-center justify-center overflow-hidden">
  {Array.from({ length: 20 }).map((_, i) => (
    <span key={i} className="absolute h-0.5 w-0.5 rounded-full bg-white" style={{ top: \`\${Math.random() * 100}%\`, left: \`\${Math.random() * 100}%\` }} />
  ))}
  <h2 className="relative z-10 text-2xl font-bold text-white">The Aceternity Effect</h2>
</div>`,
      html: `<div class="relative w-full rounded-md bg-black flex items-center justify-center" style="height:140px;">
  <h2 class="relative z-10 text-xl font-bold text-white">The Aceternity Effect</h2>
</div>`,
    },
  },
  {
    id: 'aceternity-glowing-stars',
    title: 'Glowing Stars Card',
    category: 'effects',
    framework: 'react',
    library: 'aceternity',
    tags: ['card', 'aceternity', 'glow', 'stars', 'effect', 'dark'],
    description: 'A dark card whose background stars glow brighter as the cursor moves near them',
    difficulty: 'Advanced',
    styleTag: 'Dark',
    version: '1.0.0',
    author: 'Aceternity UI',
    dateAdded: '2024-02-03',
    preview: null,
    code: {
      react: `<div className="rounded-xl bg-black border border-white/10 p-5 w-64">
  <div className="grid grid-cols-8 gap-1 mb-4">
    {Array.from({ length: 32 }).map((_, i) => (
      <div key={i} className="h-1 w-1 rounded-full bg-white/20" />
    ))}
  </div>
  <h3 className="text-white text-sm font-semibold">Glowing Stars</h3>
</div>`,
      html: `<div class="rounded-xl bg-black border border-white/10 p-5" style="width:220px;">
  <div class="grid grid-cols-8 gap-1 mb-4">
    <div class="h-1 w-1 rounded-full" style="background: rgba(255,255,255,0.2);"></div>
  </div>
  <h3 class="text-white text-sm font-semibold">Glowing Stars</h3>
</div>`,
    },
  },
  {
    id: 'aceternity-aurora-bg',
    title: 'Aurora Background',
    category: 'backgrounds',
    framework: 'react',
    library: 'aceternity',
    tags: ['background', 'aceternity', 'aurora', 'gradient', 'animated', 'hero'],
    description: 'A soft flowing aurora-borealis-style gradient background used behind hero sections',
    difficulty: 'Intermediate',
    styleTag: 'Gradient',
    version: '1.0.0',
    author: 'Aceternity UI',
    dateAdded: '2024-02-03',
    preview: null,
    code: {
      react: `<div className="relative h-40 w-full rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(120deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2), rgba(6,182,212,0.25))' }}>
  <p className="relative z-10 text-white text-sm font-medium">Aurora background</p>
</div>`,
      html: `<div class="relative w-full rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center" style="height:140px; background-image: linear-gradient(120deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2), rgba(6,182,212,0.25));">
  <p class="relative z-10 text-white text-sm font-medium">Aurora background</p>
</div>`,
    },
  },
  {
    id: 'aceternity-background-beams',
    title: 'Background Beams',
    category: 'backgrounds',
    framework: 'react',
    library: 'aceternity',
    tags: ['background', 'aceternity', 'beams', 'lines', 'animated', 'dark'],
    description: 'Diagonal animated light beams streaking across a dark background',
    difficulty: 'Advanced',
    styleTag: 'Dark',
    version: '1.0.0',
    author: 'Aceternity UI',
    dateAdded: '2024-02-03',
    preview: null,
    code: {
      react: `<div className="relative h-40 w-full rounded-xl bg-neutral-950 overflow-hidden flex items-center justify-center">
  <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(115deg, transparent, transparent 20px, rgba(139,92,246,0.15) 21px, transparent 40px)' }} />
  <p className="relative z-10 text-white text-sm font-medium">Background beams</p>
</div>`,
      html: `<div class="relative w-full rounded-xl bg-neutral-950 flex items-center justify-center" style="height:140px;">
  <p class="relative z-10 text-white text-sm font-medium">Background beams</p>
</div>`,
    },
  },
  {
    id: 'aceternity-wavy-bg',
    title: 'Wavy Background',
    category: 'backgrounds',
    framework: 'react',
    library: 'aceternity',
    tags: ['background', 'aceternity', 'wavy', 'blob', 'animated', 'gradient'],
    description: 'Smooth animated wave shapes flowing across a gradient background',
    difficulty: 'Advanced',
    styleTag: 'Gradient',
    version: '1.0.0',
    author: 'Aceternity UI',
    dateAdded: '2024-02-03',
    preview: null,
    code: {
      react: `<div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 100" preserveAspectRatio="none">
    <path d="M0,50 C100,20 300,80 400,50 L400,100 L0,100 Z" fill="url(#g)" />
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
  </svg>
  <p className="relative z-10 text-white text-sm font-medium">Wavy background</p>
</div>`,
      html: `<div class="relative w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center" style="height:140px;">
  <p class="relative z-10 text-white text-sm font-medium">Wavy background</p>
</div>`,
    },
  },
];