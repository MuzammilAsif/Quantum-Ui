import type { Asset } from '../types';

export const INPUT_ASSETS: Asset[] = [
    {
        id: 'input-basic',
        title: 'Basic Text Input',
        category: 'inputs',
        framework: 'react',
        tags: ['input', 'text', 'form', 'field', 'basic'],
        description: 'A clean basic text input field',
        difficulty: 'Beginner',
        styleTag: 'Minimal',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
/>`,
        },
    },
    {
        id: 'input-with-label',
        title: 'Input with Label',
        category: 'inputs',
        framework: 'react',
        tags: ['input', 'label', 'form', 'field', 'email'],
        description: 'A text input with a label above it',
        difficulty: 'Beginner',
        styleTag: 'Minimal',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-gray-400">Email</label>
  <input
    type="email"
    placeholder="you@example.com"
    className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
  />
</div>`,
        },
    },
    {
        id: 'input-with-icon',
        title: 'Input with Icon',
        category: 'inputs',
        framework: 'react',
        tags: ['input', 'icon', 'search', 'form', 'field'],
        description: 'A text input with a left-side icon',
        difficulty: 'Beginner',
        styleTag: 'Modern',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <input
    type="text"
    placeholder="Search..."
    className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
  />
</div>`,
        },
    },
    {
        id: 'input-error-state',
        title: 'Input Error State',
        category: 'inputs',
        framework: 'react',
        tags: ['input', 'error', 'validation', 'form', 'state'],
        description: 'A text input showing an error validation state',
        difficulty: 'Beginner',
        styleTag: 'Modern',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-gray-400">Email</label>
  <input
    type="email"
    placeholder="you@example.com"
    className="px-3 py-2 rounded-md border border-red-500 bg-gray-800 text-gray-300 text-sm outline-none focus:border-red-400 transition-colors"
  />
  <p className="text-xs text-red-400">Please enter a valid email address</p>
</div>`,
        },
    },
    {
        id: 'input-glass',
        title: 'Glass Input',
        category: 'inputs',
        framework: 'react',
        tags: ['input', 'glass', 'glassmorphism', 'blur', 'transparent'],
        description: 'A glassmorphism style input field',
        difficulty: 'Intermediate',
        styleTag: 'Glassmorphism',
        version: '1.0.0',
        author: 'Quantum UI',
        dateAdded: '2024-01-01',
        preview: null,
        code: {
            react: `<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-3 py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 text-sm outline-none focus:border-white/40 transition-colors"
/>`,
        },
    },
];