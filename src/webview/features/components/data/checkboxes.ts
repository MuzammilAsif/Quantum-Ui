import type { Asset } from '../types';

export const CHECKBOX_ASSETS: Asset[] = [
  {
    id: 'checkbox-basic',
    title: 'Basic Checkbox',
    category: 'checkboxes',
    framework: 'react',
    tags: ['checkbox', 'form', 'basic', 'input'],
    description: 'A simple checkbox with native styling and a label',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-17',
    preview: null,
    code: {
      react: `<label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
  <input type="checkbox" className="w-4 h-4 rounded accent-violet-500" />
  Remember me
</label>`,
    },
  },
  {
    id: 'checkbox-custom',
    title: 'Custom Styled Checkbox',
    category: 'checkboxes',
    framework: 'react',
    tags: ['checkbox', 'custom', 'styled', 'animated'],
    description: 'A custom checkbox with a smooth checkmark animation',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-17',
    preview: null,
    code: {
      react: `const [checked, setChecked] = useState(false);

<button
  onClick={() => setChecked(!checked)}
  className={\`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors \${checked ? 'bg-violet-500 border-violet-500' : 'border-gray-600'}\`}
>
  {checked && <Check className="w-3.5 h-3.5 text-white" />}
</button>`,
    },
  },
  {
    id: 'checkbox-list',
    title: 'Checkbox List Group',
    category: 'checkboxes',
    framework: 'react',
    tags: ['checkbox', 'list', 'group', 'multiple', 'form'],
    description: 'A group of checkboxes for multi-select options',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-17',
    preview: null,
    code: {
      react: `<div className="flex flex-col gap-2">
  {['Email notifications', 'SMS notifications', 'Push notifications'].map((item) => (
    <label key={item} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 rounded accent-violet-500" />
      {item}
    </label>
  ))}
</div>`,
    },
  },
  {
    id: 'checkbox-card',
    title: 'Checkbox Card Selector',
    category: 'checkboxes',
    framework: 'react',
    tags: ['checkbox', 'card', 'select', 'multiple', 'feature'],
    description: 'Card-style checkboxes for selecting multiple feature options',
    difficulty: 'Advanced',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-17',
    preview: null,
    code: {
      react: `const [selected, setSelected] = useState(['analytics']);
const toggle = (id) => setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
const features = [{ id: 'analytics', name: 'Analytics' }, { id: 'reports', name: 'Reports' }];

<div className="grid grid-cols-2 gap-2">
  {features.map((f) => (
    <button
      key={f.id}
      onClick={() => toggle(f.id)}
      className={\`p-3 rounded-lg border text-left transition-colors \${selected.includes(f.id) ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700'}\`}
    >
      <p className="text-sm font-medium text-white">{f.name}</p>
    </button>
  ))}
</div>`,
    },
  },
  {
    id: 'checkbox-indeterminate',
    title: 'Indeterminate Checkbox',
    category: 'checkboxes',
    framework: 'react',
    tags: ['checkbox', 'indeterminate', 'parent', 'select-all', 'tree'],
    description: 'A parent checkbox showing an indeterminate state for partial selection',
    difficulty: 'Advanced',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-17',
    preview: null,
    code: {
      react: `<div className="flex flex-col gap-2">
  <label className="flex items-center gap-2 text-sm font-semibold text-white cursor-pointer">
    <input type="checkbox" ref={(el) => el && (el.indeterminate = true)} className="w-4 h-4 rounded accent-violet-500" />
    Select All
  </label>
  <div className="pl-6 flex flex-col gap-1.5">
    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
      <input type="checkbox" checked className="w-4 h-4 rounded accent-violet-500" readOnly />
      Item 1
    </label>
    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 rounded accent-violet-500" />
      Item 2
    </label>
  </div>
</div>`,
    },
  },
  {
    id: 'checkbox-toggle-switch',
    title: 'Toggle Switch Checkbox',
    category: 'checkboxes',
    framework: 'react',
    tags: ['checkbox', 'toggle', 'switch', 'boolean', 'settings'],
    description: 'A checkbox styled as an iOS-style toggle switch',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-17',
    preview: null,
    code: {
      react: `const [enabled, setEnabled] = useState(false);

<button
  onClick={() => setEnabled(!enabled)}
  className={\`relative w-11 h-6 rounded-full transition-colors \${enabled ? 'bg-violet-500' : 'bg-gray-700'}\`}
>
  <span className={\`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform \${enabled ? 'translate-x-5' : 'translate-x-0.5'}\`} />
</button>`,
    },
  },
  {
    id: 'checkbox-terms',
    title: 'Terms Agreement Checkbox',
    category: 'checkboxes',
    framework: 'react',
    tags: ['checkbox', 'terms', 'agreement', 'signup', 'legal'],
    description: 'A checkbox with linked terms and conditions text, common in signup forms',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-17',
    preview: null,
    code: {
      react: `<label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer">
  <input type="checkbox" className="w-4 h-4 mt-0.5 rounded accent-violet-500" />
  <span>
    I agree to the <a href="#" className="text-violet-400 hover:underline">Terms of Service</a> and <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>
  </span>
</label>`,
    },
  },
  {
    id: 'checkbox-glass',
    title: 'Glass Checkbox',
    category: 'checkboxes',
    framework: 'react',
    tags: ['checkbox', 'glass', 'glassmorphism', 'blur'],
    description: 'A glassmorphism style checkbox with backdrop blur',
    difficulty: 'Intermediate',
    styleTag: 'Glassmorphism',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-17',
    preview: null,
    code: {
      react: `const [checked, setChecked] = useState(false);

<button
  onClick={() => setChecked(!checked)}
  className={\`w-5 h-5 rounded flex items-center justify-center backdrop-blur-md border transition-colors \${checked ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/20'}\`}
>
  {checked && <Check className="w-3.5 h-3.5 text-white" />}
</button>`,
    },
  },
];