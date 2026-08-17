import type { Asset } from '../types';

export const MAGICUI_ASSETS: Asset[] = [
  {
    id: 'magicui-shimmer-button',
    title: 'Shimmer Button',
    category: 'buttons',
    framework: 'react',
    library: 'magicui',
    tags: ['button', 'magicui', 'shimmer', 'animated', 'effect'],
    description: 'A button with a continuously rotating shimmer light sweeping around its border',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Magic UI',
    dateAdded: '2024-02-02',
    preview: null,
    code: {
      react: `<button
  className="relative flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black px-6 py-3 text-white transition-transform active:translate-y-px"
  style={{
    boxShadow: "inset 0 -8px 10px #fff1f",
  }}
>
  <span className="relative z-10">Shimmer Button</span>
</button>`,
      html: `<button class="relative flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black px-6 py-3 text-white" style="box-shadow: inset 0 -8px 10px rgba(255,255,255,0.12);">
  Shimmer Button
</button>`,
    },
  },
  {
    id: 'magicui-rainbow-button',
    title: 'Rainbow Button',
    category: 'buttons',
    framework: 'react',
    library: 'magicui',
    tags: ['button', 'magicui', 'rainbow', 'gradient', 'colorful', 'animated'],
    description: 'A button with an animated rainbow gradient glow beneath its border',
    difficulty: 'Intermediate',
    styleTag: 'Gradient',
    version: '1.0.0',
    author: 'Magic UI',
    dateAdded: '2024-02-02',
    preview: null,
    code: {
      react: `<button className="relative inline-flex h-11 items-center justify-center rounded-lg px-8 py-2 font-medium text-white transition-colors bg-[linear-gradient(90deg,#8b5cf6,#3b82f6,#06b6d4,#8b5cf6)] bg-[length:200%_100%]">
  Get Started
</button>`,
      html: `<button class="relative inline-flex h-11 items-center justify-center rounded-lg px-8 py-2 font-medium text-white" style="background: linear-gradient(90deg,#8b5cf6,#3b82f6,#06b6d4,#8b5cf6);">
  Get Started
</button>`,
    },
  },
  {
    id: 'magicui-ripple-button',
    title: 'Ripple Button',
    category: 'buttons',
    framework: 'react',
    library: 'magicui',
    tags: ['button', 'magicui', 'ripple', 'click', 'animated', 'effect'],
    description: 'A button that emits expanding ripple rings outward on every click',
    difficulty: 'Advanced',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Magic UI',
    dateAdded: '2024-02-02',
    preview: null,
    code: {
      react: `const [ripples, setRipples] = useState([]);

<button
  onClick={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipples([...ripples, { x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() }]);
  }}
  className="relative overflow-hidden rounded-lg bg-violet-500 px-6 py-2.5 text-sm font-medium text-white"
>
  Click me
  {ripples.map((r) => (
    <span key={r.id} className="absolute rounded-full bg-white/40 animate-ping" style={{ left: r.x, top: r.y, width: 10, height: 10 }} />
  ))}
</button>`,
      html: `<button class="relative overflow-hidden rounded-lg bg-violet-500 px-6 py-2.5 text-sm font-medium text-white">
  Click me
</button>`,
    },
  },

  {
    id: 'magicui-gradient-text',
    title: 'Animated Gradient Text',
    category: 'text',
    framework: 'react',
    library: 'magicui',
    tags: ['text', 'magicui', 'gradient', 'animation', 'heading'],
    description: 'A pill-shaped text badge with a smooth animated gradient border',
    difficulty: 'Beginner',
    styleTag: 'Gradient',
    version: '1.0.0',
    author: 'Magic UI',
    dateAdded: '2024-02-02',
    preview: null,
    code: {
      react: `<div className="group relative mx-auto flex max-w-fit items-center justify-center rounded-2xl bg-black/40 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:300%_100%] p-px [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:xor]" />
  <span className="text-white">✨ Introducing Magic UI</span>
</div>`,
      html: `<div class="mx-auto flex max-w-fit items-center justify-center rounded-2xl px-4 py-1.5 text-sm font-medium" style="background: rgba(0,0,0,0.4); border: 1px solid; border-image: linear-gradient(90deg,#ffaa40,#9c40ff,#ffaa40) 1;">
  <span class="text-white">✨ Introducing Magic UI</span>
</div>`,
    },
  },
];
