import type { Asset } from '../types';

export const RADIO_BUTTON_ASSETS: Asset[] = [
  {
    id: 'radio-basic',
    title: 'Basic Radio Group',
    category: 'radio-buttons',
    framework: 'react',
    tags: ['radio', 'form', 'select', 'basic', 'group'],
    description: 'A simple radio button group with native styling',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-16',
    preview: null,
    code: {
      react: `<div className="flex flex-col gap-2">
  {['Option A', 'Option B', 'Option C'].map((option) => (
    <label key={option} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
      <input type="radio" name="options" className="w-4 h-4 accent-violet-500" />
      {option}
    </label>
  ))}
</div>`,
    },
  },
  {
    id: 'radio-custom-circle',
    title: 'Custom Circle Radio',
    category: 'radio-buttons',
    framework: 'react',
    tags: ['radio', 'custom', 'circle', 'styled', 'form'],
    description: 'A custom-styled radio button with animated fill indicator',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-16',
    preview: null,
    code: {
      react: `const [selected, setSelected] = useState('a');

<div className="flex flex-col gap-2">
  {[{ id: 'a', label: 'Option A' }, { id: 'b', label: 'Option B' }].map((opt) => (
    <button
      key={opt.id}
      onClick={() => setSelected(opt.id)}
      className="flex items-center gap-2.5 text-sm text-gray-300"
    >
      <span className={\`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors \${selected === opt.id ? 'border-violet-500' : 'border-gray-600'}\`}>
        {selected === opt.id && <span className="w-2 h-2 rounded-full bg-violet-500" />}
      </span>
      {opt.label}
    </button>
  ))}
</div>`,
    },
  },
  {
    id: 'radio-card-select',
    title: 'Radio Card Selector',
    category: 'radio-buttons',
    framework: 'react',
    tags: ['radio', 'card', 'select', 'plan', 'pricing', 'selector'],
    description: 'Card-style radio options commonly used for plan or tier selection',
    difficulty: 'Advanced',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-16',
    preview: null,
    code: {
      react: `const [plan, setPlan] = useState('pro');
const plans = [
  { id: 'free', name: 'Free', price: '$0' },
  { id: 'pro', name: 'Pro', price: '$29' },
];

<div className="grid grid-cols-2 gap-2">
  {plans.map((p) => (
    <button
      key={p.id}
      onClick={() => setPlan(p.id)}
      className={\`p-3 rounded-lg border text-left transition-colors \${plan === p.id ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 bg-gray-800/50'}\`}
    >
      <p className="text-sm font-semibold text-white">{p.name}</p>
      <p className="text-xs text-gray-400 mt-1">{p.price}/mo</p>
    </button>
  ))}
</div>`,
    },
  },
  {
    id: 'radio-horizontal',
    title: 'Horizontal Radio Group',
    category: 'radio-buttons',
    framework: 'react',
    tags: ['radio', 'horizontal', 'inline', 'form', 'group'],
    description: 'A horizontally aligned radio button group',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-16',
    preview: null,
    code: {
      react: `<div className="flex gap-4">
  {['Small', 'Medium', 'Large'].map((size) => (
    <label key={size} className="flex items-center gap-1.5 text-sm text-gray-300 cursor-pointer">
      <input type="radio" name="size" className="w-4 h-4 accent-violet-500" />
      {size}
    </label>
  ))}
</div>`,
    },
  },
  {
    id: 'radio-color-swatch',
    title: 'Color Swatch Radio',
    category: 'radio-buttons',
    framework: 'react',
    tags: ['radio', 'color', 'swatch', 'picker', 'selector'],
    description: 'Radio-style color swatches used for theme or variant selection',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-16',
    preview: null,
    code: {
      react: `const [color, setColor] = useState('violet');
const colors = [
  { id: 'violet', hex: '#8b5cf6' },
  { id: 'blue', hex: '#3b82f6' },
  { id: 'emerald', hex: '#10b981' },
  { id: 'red', hex: '#ef4444' },
];

<div className="flex gap-2">
  {colors.map((c) => (
    <button
      key={c.id}
      onClick={() => setColor(c.id)}
      style={{ backgroundColor: c.hex }}
      className={\`w-7 h-7 rounded-full transition-all \${color === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}\`}
    />
  ))}
</div>`,
    },
  },
  {
    id: 'radio-toggle-pills',
    title: 'Radio Toggle Pills',
    category: 'radio-buttons',
    framework: 'react',
    tags: ['radio', 'pills', 'toggle', 'segmented', 'selector'],
    description: 'A segmented pill-style radio selector, like a tab switcher',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-16',
    preview: null,
    code: {
      react: `const [tab, setTab] = useState('monthly');

<div className="flex bg-gray-800 rounded-full p-1 w-fit">
  {['monthly', 'yearly'].map((t) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      className={\`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors \${tab === t ? 'bg-violet-500 text-white' : 'text-gray-400'}\`}
    >
      {t}
    </button>
  ))}
</div>`,
    },
  },
  {
    id: 'radio-icon-select',
    title: 'Icon Radio Selector',
    category: 'radio-buttons',
    framework: 'react',
    tags: ['radio', 'icon', 'select', 'visual', 'grid'],
    description: 'Radio selection using icons instead of text labels',
    difficulty: 'Advanced',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-16',
    preview: null,
    code: {
      react: `const [layout, setLayout] = useState('grid');

<div className="flex gap-2">
  {[
    { id: 'grid', icon: LayoutGrid },
    { id: 'list', icon: List },
  ].map(({ id, icon: Icon }) => (
    <button
      key={id}
      onClick={() => setLayout(id)}
      className={\`w-9 h-9 rounded-md flex items-center justify-center border transition-colors \${layout === id ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-gray-700 text-gray-500'}\`}
    >
      <Icon className="w-4 h-4" />
    </button>
  ))}
</div>`,
    },
  },
  {
    id: 'radio-with-description',
    title: 'Radio with Description',
    category: 'radio-buttons',
    framework: 'react',
    tags: ['radio', 'description', 'detailed', 'form', 'settings'],
    description: 'Radio options with a title and supporting description text',
    difficulty: 'Intermediate',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-16',
    preview: null,
    code: {
      react: `const options = [
  { id: 'public', title: 'Public', desc: 'Anyone can view this' },
  { id: 'private', title: 'Private', desc: 'Only you can view this' },
];

<div className="flex flex-col gap-2">
  {options.map((opt) => (
    <label key={opt.id} className="flex items-start gap-2.5 p-3 rounded-lg border border-gray-700 cursor-pointer">
      <input type="radio" name="visibility" className="w-4 h-4 mt-0.5 accent-violet-500" />
      <div>
        <p className="text-sm font-medium text-white">{opt.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
      </div>
    </label>
  ))}
</div>`,
    },
  },
];