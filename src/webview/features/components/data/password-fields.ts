import type { Asset } from '../types';

export const PASSWORD_FIELD_ASSETS: Asset[] = [
  {
    id: 'password-basic',
    title: 'Basic Password Input',
    category: 'password-fields',
    framework: 'react',
    tags: ['password', 'input', 'form', 'field', 'security'],
    description: 'A clean password input field with masked characters',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-15',
    preview: null,
    code: {
      react: `<input
  type="password"
  placeholder="Enter password"
  className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
/>`,
    },
  },
  {
    id: 'password-toggle',
    title: 'Password with Toggle Visibility',
    category: 'password-fields',
    framework: 'react',
    tags: ['password', 'toggle', 'visibility', 'eye', 'input', 'security'],
    description: 'A password field with a show/hide visibility toggle button',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-15',
    preview: null,
    code: {
      react: `const [visible, setVisible] = useState(false);

<div className="relative">
  <input
    type={visible ? 'text' : 'password'}
    placeholder="Enter password"
    className="w-full pl-3 pr-10 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
  />
  <button
    type="button"
    onClick={() => setVisible(!visible)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
  >
    {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
  </button>
</div>`,
    },
  },
  {
    id: 'password-strength',
    title: 'Password Strength Meter',
    category: 'password-fields',
    framework: 'react',
    tags: ['password', 'strength', 'meter', 'validation', 'security', 'indicator'],
    description: 'A password input with a live strength indicator bar',
    difficulty: 'Advanced',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-15',
    preview: null,
    code: {
      react: `const [password, setPassword] = useState('');
const strength = password.length > 10 ? 3 : password.length > 6 ? 2 : password.length > 0 ? 1 : 0;
const colors = ['bg-gray-700', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
const labels = ['', 'Weak', 'Medium', 'Strong'];

<div className="flex flex-col gap-2">
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter password"
    className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
  />
  <div className="flex gap-1">
    {[1, 2, 3].map((i) => (
      <div key={i} className={\`h-1 flex-1 rounded-full \${i <= strength ? colors[strength] : 'bg-gray-700'}\`} />
    ))}
  </div>
  {strength > 0 && <span className="text-xs text-gray-400">{labels[strength]}</span>}
</div>`,
    },
  },
  {
    id: 'password-with-label',
    title: 'Password Field with Label',
    category: 'password-fields',
    framework: 'react',
    tags: ['password', 'label', 'form', 'field'],
    description: 'A labeled password input following standard form conventions',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-15',
    preview: null,
    code: {
      react: `<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-gray-400">Password</label>
  <input
    type="password"
    placeholder="••••••••"
    className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
  />
</div>`,
    },
  },
  {
    id: 'password-confirm',
    title: 'Confirm Password Pair',
    category: 'password-fields',
    framework: 'react',
    tags: ['password', 'confirm', 'form', 'signup', 'validation'],
    description: 'A password and confirm-password field pair for signup forms',
    difficulty: 'Intermediate',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-15',
    preview: null,
    code: {
      react: `<div className="flex flex-col gap-3">
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-400">Password</label>
    <input
      type="password"
      placeholder="Create a password"
      className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
    />
  </div>
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-400">Confirm Password</label>
    <input
      type="password"
      placeholder="Re-enter your password"
      className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
    />
  </div>
</div>`,
    },
  },
  {
    id: 'password-error-state',
    title: 'Password Error State',
    category: 'password-fields',
    framework: 'react',
    tags: ['password', 'error', 'validation', 'form', 'state'],
    description: 'A password field displaying a validation error state',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-15',
    preview: null,
    code: {
      react: `<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-gray-400">Password</label>
  <input
    type="password"
    placeholder="••••••••"
    className="px-3 py-2 rounded-md border border-red-500 bg-gray-800 text-gray-300 text-sm outline-none focus:border-red-400 transition-colors"
  />
  <p className="text-xs text-red-400">Password must be at least 8 characters</p>
</div>`,
    },
  },
  {
    id: 'password-glass',
    title: 'Glass Password Field',
    category: 'password-fields',
    framework: 'react',
    tags: ['password', 'glass', 'glassmorphism', 'blur', 'transparent'],
    description: 'A glassmorphism style password input with backdrop blur',
    difficulty: 'Intermediate',
    styleTag: 'Glassmorphism',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-15',
    preview: null,
    code: {
      react: `<input
  type="password"
  placeholder="Enter password"
  className="w-full px-3 py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 text-sm outline-none focus:border-white/40 transition-colors"
/>`,
    },
  },
  {
    id: 'password-icon-lock',
    title: 'Password with Lock Icon',
    category: 'password-fields',
    framework: 'react',
    tags: ['password', 'icon', 'lock', 'security', 'input'],
    description: 'A password field with a leading lock icon',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-15',
    preview: null,
    code: {
      react: `<div className="relative">
  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <input
    type="password"
    placeholder="Enter password"
    className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
  />
</div>`,
    },
  },
];