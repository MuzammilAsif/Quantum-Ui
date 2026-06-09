import type { Asset } from '../types';

export const CARD_ASSETS: Asset[] = [
    {
        id: 'card-basic',
        title: 'Basic Card',
        category: 'cards',
        framework: 'react',
        tags: ['card', 'container', 'box', 'surface', 'basic'],
        description: 'A simple content card with title and description',
        difficulty: 'Beginner',
        styleTag: 'Minimal',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
  <h3 className="text-sm font-semibold text-gray-200">Card Title</h3>
  <p className="text-xs text-gray-500 mt-1">
    Card description text goes here.
  </p>
</div>`,
        },
    },
    {
        id: 'card-stats',
        title: 'Stats Card',
        category: 'cards',
        framework: 'react',
        tags: ['card', 'stats', 'metric', 'number', 'dashboard', 'data'],
        description: 'A data metric card with icon and value',
        difficulty: 'Beginner',
        styleTag: 'Modern',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 flex items-center gap-3">
  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
    <DollarSign className="w-5 h-5 text-violet-400" />
  </div>
  <div>
    <p className="text-lg font-bold text-gray-100">$12,450</p>
    <p className="text-sm text-gray-500">Total Revenue</p>
  </div>
</div>`,
        },
    },
    {
        id: 'card-pricing',
        title: 'Pricing Card',
        category: 'cards',
        framework: 'react',
        tags: ['card', 'pricing', 'plan', 'subscription', 'saas'],
        description: 'A pricing plan card with feature list and CTA button',
        difficulty: 'Intermediate',
        styleTag: 'Modern',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<div className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 flex flex-col gap-4 w-64">
  <div>
    <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Pro</p>
    <p className="text-3xl font-bold text-white mt-1">$29<span className="text-sm font-normal text-gray-400">/mo</span></p>
  </div>
  <ul className="flex flex-col gap-2">
    {['Unlimited projects', 'Priority support', 'Custom domain'].map((feature) => (
      <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
        <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
        {feature}
      </li>
    ))}
  </ul>
  <button className="w-full py-2 rounded-md bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors">
    Get Started
  </button>
</div>`,
        },
    },
    {
        id: 'card-profile',
        title: 'Profile Card',
        category: 'cards',
        framework: 'react',
        tags: ['card', 'profile', 'user', 'avatar', 'social'],
        description: 'A user profile card with avatar and social stats',
        difficulty: 'Beginner',
        styleTag: 'Modern',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<div className="p-5 rounded-xl border border-gray-700 bg-gray-800/50 flex flex-col items-center gap-3 w-52">
  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500" />
  <div className="text-center">
    <p className="text-sm font-semibold text-white">John Doe</p>
    <p className="text-xs text-gray-400 mt-0.5">Frontend Developer</p>
  </div>
  <div className="flex gap-4 text-center">
    <div>
      <p className="text-sm font-bold text-white">128</p>
      <p className="text-2xs text-gray-500">Posts</p>
    </div>
    <div>
      <p className="text-sm font-bold text-white">4.2k</p>
      <p className="text-2xs text-gray-500">Followers</p>
    </div>
    <div>
      <p className="text-sm font-bold text-white">312</p>
      <p className="text-2xs text-gray-500">Following</p>
    </div>
  </div>
</div>`,
        },
    },
    {
        id: 'card-glass',
        title: 'Glass Card',
        category: 'cards',
        framework: 'react',
        tags: ['card', 'glass', 'glassmorphism', 'blur', 'transparent', 'modern'],
        description: 'A glassmorphism card with backdrop blur effect',
        difficulty: 'Intermediate',
        styleTag: 'Glassmorphism',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<div className="p-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
  <h3 className="text-sm font-semibold text-white">Glass Card</h3>
  <p className="text-xs text-white/60 mt-1">
    A frosted glass effect card component.
  </p>
</div>`,
        },
    },
    {
        id: 'card-gradient',
        title: 'Gradient Card',
        category: 'cards',
        framework: 'react',
        tags: ['card', 'gradient', 'colorful', 'vibrant', 'modern'],
        description: 'A card with a vibrant gradient background',
        difficulty: 'Beginner',
        styleTag: 'Gradient',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<div className="p-5 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/25">
  <h3 className="text-sm font-semibold text-white">Gradient Card</h3>
  <p className="text-xs text-white/70 mt-1">
    A vibrant gradient card component.
  </p>
</div>`,
        },
    },
];