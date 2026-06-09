import type { Asset } from '../types';

export const BUTTON_ASSETS: Asset[] = [
  {
    id: 'btn-primary-sm',
    title: 'Primary Button Small',
    category: 'buttons',
    framework: 'react',
    tags: ['button', 'primary', 'small', 'cta', 'action'],
    description: 'A small primary action button with hover effect',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-01',
    preview: null,
    code: {
      react: `<button className="px-3 py-1.5 rounded-md bg-violet-500 text-white text-xs font-medium hover:bg-violet-600 active:scale-95 transition-all duration-150">
  Button
</button>`,
      html: `<button class="px-3 py-1.5 rounded-md bg-violet-500 text-white text-xs font-medium hover:bg-violet-600 transition-all">
  Button
</button>`,
    },
  },
  {
    id: 'btn-primary-md',
    title: 'Primary Button Medium',
    category: 'buttons',
    framework: 'react',
    tags: ['button', 'primary', 'medium', 'cta', 'action'],
    description: 'A medium primary action button with hover effect',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-01',
    preview: null,
    code: {
      react: `<button className="px-4 py-2 rounded-md bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 active:scale-95 transition-all duration-150">
  Button
</button>`,
      html: `<button class="px-4 py-2 rounded-md bg-violet-500 text-white text-sm font-medium transition-all">
  Button
</button>`,
    },
  },
  {
    id: 'btn-primary-lg',
    title: 'Primary Button Large',
    category: 'buttons',
    framework: 'react',
    tags: ['button', 'primary', 'large', 'cta', 'action'],
    description: 'A large primary action button with hover effect',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-01',
    preview: null,
    code: {
      react: `<button className="px-6 py-3 rounded-lg bg-violet-500 text-white font-semibold hover:bg-violet-600 active:scale-95 transition-all duration-150">
  Button
</button>`,
    },
  },
  {
    id: 'btn-ghost-md',
    title: 'Ghost Button',
    category: 'buttons',
    framework: 'react',
    tags: ['button', 'ghost', 'outline', 'secondary', 'border'],
    description: 'A transparent button with a visible border',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-01',
    preview: null,
    code: {
      react: `<button className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 text-sm font-medium hover:border-gray-400 hover:text-white active:scale-95 transition-all duration-150">
  Button
</button>`,
    },
  },
  {
    id: 'btn-gradient',
    title: 'Gradient Button',
    category: 'buttons',
    framework: 'react',
    tags: ['button', 'gradient', 'colorful', 'primary', 'modern'],
    description: 'A button with a purple to blue gradient background',
    difficulty: 'Beginner',
    styleTag: 'Gradient',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-01',
    preview: null,
    code: {
      react: `<button className="px-4 py-2 rounded-md bg-gradient-to-r from-violet-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 active:scale-95 transition-all duration-150">
  Button
</button>`,
    },
  },
  {
    id: 'btn-glass',
    title: 'Glass Button',
    category: 'buttons',
    framework: 'react',
    tags: ['button', 'glass', 'glassmorphism', 'blur', 'transparent'],
    description: 'A glassmorphism style button with backdrop blur',
    difficulty: 'Intermediate',
    styleTag: 'Glassmorphism',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-01',
    preview: null,
    code: {
      react: `<button className="px-4 py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 active:scale-95 transition-all duration-150">
  Button
</button>`,
    },
  },
  {
    id: 'btn-loading',
    title: 'Loading Button',
    category: 'buttons',
    framework: 'react',
    tags: ['button', 'loading', 'spinner', 'async', 'state', 'animated'],
    description: 'A button with a loading spinner for async actions',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-01',
    preview: null,
    code: {
      react: `const [loading, setLoading] = useState(false);

<button
  disabled={loading}
  onClick={() => setLoading(true)}
  className="flex items-center gap-2 px-4 py-2 rounded-md bg-violet-500 text-white text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-all"
>
  {loading && (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )}
  {loading ? 'Loading...' : 'Submit'}
</button>`,
    },
  },
  {
    id: 'btn-icon-circle',
    title: 'Icon Button Circle',
    category: 'buttons',
    framework: 'react',
    tags: ['button', 'icon', 'circle', 'round', 'action'],
    description: 'A circular icon-only button',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-01',
    preview: null,
    code: {
      react: `<button className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 hover:bg-violet-500/20 active:scale-95 transition-all duration-150">
  <Plus className="w-4 h-4" />
</button>`,
    },
  },
  {
    id: 'btn-danger',
    title: 'Danger Button',
    category: 'buttons',
    framework: 'react',
    tags: ['button', 'danger', 'delete', 'destructive', 'red', 'warning'],
    description: 'A red button used for destructive actions like delete',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-01',
    preview: null,
    code: {
      react: `<button className="px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 active:scale-95 transition-all duration-150">
  Delete
</button>`,
    },
  },
  {
    id: 'btn-success',
    title: 'Success Button',
    category: 'buttons',
    framework: 'react',
    tags: ['button', 'success', 'confirm', 'green', 'positive'],
    description: 'A green button used for confirmation actions',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-01',
    preview: null,
    code: {
      react: `<button className="px-4 py-2 rounded-md bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all duration-150">
  Confirm
</button>`,
    },
  },
];