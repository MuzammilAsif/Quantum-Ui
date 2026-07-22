import type { Asset } from '../types';

export const MODAL_ASSETS: Asset[] = [
  {
    id: 'modal-basic',
    title: 'Basic Modal',
    category: 'modals',
    framework: 'react',
    tags: ['modal', 'dialog', 'popup', 'basic', 'overlay'],
    description: 'A simple modal dialog with title, body, and close button',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-19',
    preview: null,
    code: {
      react: `<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
  <div className="w-80 p-5 rounded-xl border border-gray-700 bg-gray-800">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-white">Modal Title</h3>
      <button className="text-gray-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
    <p className="text-xs text-gray-400">This is the modal body content goes here.</p>
  </div>
</div>`,
    },
  },
  {
    id: 'modal-confirm',
    title: 'Confirmation Modal',
    category: 'modals',
    framework: 'react',
    tags: ['modal', 'confirm', 'dialog', 'delete', 'action', 'warning'],
    description: 'A confirmation dialog with cancel and confirm actions',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-19',
    preview: null,
    code: {
      react: `<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
  <div className="w-80 p-5 rounded-xl border border-gray-700 bg-gray-800">
    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
      <AlertTriangle className="w-5 h-5 text-red-400" />
    </div>
    <h3 className="text-sm font-semibold text-white">Delete this item?</h3>
    <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>
    <div className="flex gap-2 mt-4">
      <button className="flex-1 py-2 rounded-md border border-gray-600 text-gray-300 text-xs font-medium">Cancel</button>
      <button className="flex-1 py-2 rounded-md bg-red-500 text-white text-xs font-medium">Delete</button>
    </div>
  </div>
</div>`,
    },
  },
  {
    id: 'modal-fullscreen',
    title: 'Fullscreen Modal',
    category: 'modals',
    framework: 'react',
    tags: ['modal', 'fullscreen', 'immersive', 'overlay', 'dialog'],
    description: 'A fullscreen modal takeover for immersive content',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-19',
    preview: null,
    code: {
      react: `<div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
  <div className="flex items-center justify-between p-4 border-b border-gray-800">
    <h2 className="text-base font-bold text-white">Fullscreen View</h2>
    <button className="text-gray-400 hover:text-white">
      <X className="w-5 h-5" />
    </button>
  </div>
  <div className="flex-1 p-6">
    <p className="text-sm text-gray-400">Fullscreen content goes here.</p>
  </div>
</div>`,
    },
  },
  {
    id: 'modal-form',
    title: 'Form Modal',
    category: 'modals',
    framework: 'react',
    tags: ['modal', 'form', 'dialog', 'input', 'create'],
    description: 'A modal containing a form for quick data entry',
    difficulty: 'Intermediate',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-19',
    preview: null,
    code: {
      react: `<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
  <div className="w-80 p-5 rounded-xl border border-gray-700 bg-gray-800">
    <h3 className="text-sm font-semibold text-white mb-3">New Project</h3>
    <input type="text" placeholder="Project name" className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 mb-3" />
    <div className="flex gap-2">
      <button className="flex-1 py-2 rounded-md border border-gray-600 text-gray-300 text-xs font-medium">Cancel</button>
      <button className="flex-1 py-2 rounded-md bg-violet-500 text-white text-xs font-medium">Create</button>
    </div>
  </div>
</div>`,
    },
  },
  {
    id: 'modal-success',
    title: 'Success Modal',
    category: 'modals',
    framework: 'react',
    tags: ['modal', 'success', 'confirmation', 'checkmark', 'positive'],
    description: 'A success confirmation modal with animated checkmark',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-19',
    preview: null,
    code: {
      react: `<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
  <div className="w-72 p-6 rounded-xl border border-gray-700 bg-gray-800 text-center">
    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
      <Check className="w-6 h-6 text-emerald-400" />
    </div>
    <h3 className="text-sm font-semibold text-white">Payment Successful</h3>
    <p className="text-xs text-gray-400 mt-1">Your order has been confirmed.</p>
    <button className="w-full py-2 mt-4 rounded-md bg-emerald-500 text-white text-xs font-medium">Continue</button>
  </div>
</div>`,
    },
  },
  {
    id: 'modal-image-preview',
    title: 'Image Preview Modal',
    category: 'modals',
    framework: 'react',
    tags: ['modal', 'image', 'preview', 'lightbox', 'gallery'],
    description: 'A lightbox-style modal for previewing images',
    difficulty: 'Intermediate',
    styleTag: 'Dark',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-19',
    preview: null,
    code: {
      react: `<div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
  <button className="absolute top-4 right-4 text-white/70 hover:text-white">
    <X className="w-6 h-6" />
  </button>
  <div className="w-96 h-64 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
    <ImageIcon className="w-10 h-10 text-white/40" />
  </div>
</div>`,
    },
  },
  {
    id: 'modal-bottom-sheet',
    title: 'Bottom Sheet Modal',
    category: 'modals',
    framework: 'react',
    tags: ['modal', 'bottom-sheet', 'mobile', 'drawer', 'slide-up'],
    description: 'A mobile-style bottom sheet that slides up from the bottom',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-19',
    preview: null,
    code: {
      react: `<div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50">
  <div className="w-full max-w-sm p-5 rounded-t-2xl border-t border-gray-700 bg-gray-800">
    <div className="w-10 h-1 rounded-full bg-gray-600 mx-auto mb-4" />
    <h3 className="text-sm font-semibold text-white">Share this</h3>
    <div className="flex gap-3 mt-3">
      {['Copy', 'Email', 'Message'].map((opt) => (
        <button key={opt} className="flex-1 py-2 rounded-md bg-gray-700 text-gray-300 text-xs">{opt}</button>
      ))}
    </div>
  </div>
</div>`,
    },
  },
  {
    id: 'modal-glass',
    title: 'Glass Modal',
    category: 'modals',
    framework: 'react',
    tags: ['modal', 'glass', 'glassmorphism', 'blur', 'dialog'],
    description: 'A glassmorphism style modal dialog with backdrop blur',
    difficulty: 'Advanced',
    styleTag: 'Glassmorphism',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-19',
    preview: null,
    code: {
      react: `<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="w-80 p-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
    <h3 className="text-sm font-semibold text-white">Glass Modal</h3>
    <p className="text-xs text-white/60 mt-1">A frosted glass dialog window.</p>
    <button className="w-full py-2 mt-4 rounded-md bg-white/20 text-white text-xs font-medium hover:bg-white/30">Close</button>
  </div>
</div>`,
    },
  },
];