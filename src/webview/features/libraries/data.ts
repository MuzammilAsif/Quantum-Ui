import type { LibraryDefinition, LibraryCategoryDefinition } from './types';

export const LIBRARIES: LibraryDefinition[] = [
  {
    id: 'quantum',
    name: 'Quantum UI',
    description: 'Our own hand-crafted components',
    icon: 'Zap',
    website: 'https://quantumui.dev',
    color: '#8b5cf6',
    isOfficial: true,
  },
  {
    id: 'shadcn',
    name: 'shadcn/ui',
    description: 'Beautifully designed components built with Radix UI',
    icon: 'Layers',
    website: 'https://ui.shadcn.com',
    color: '#71717a',
    isOfficial: false,
  },
  {
    id: 'magicui',
    name: 'Magic UI',
    description: 'Beautiful animated React components',
    icon: 'Sparkles',
    website: 'https://magicui.design',
    color: '#6366f1',
    isOfficial: false,
  },
  {
    id: 'aceternity',
    name: 'Aceternity UI',
    description: 'Trendy components with stunning effects',
    icon: 'Star',
    website: 'https://ui.aceternity.com',
    color: '#f59e0b',
    isOfficial: false,
  },
  {
    id: 'mantine',
    name: 'Mantine',
    description: 'A fully featured React components library',
    icon: 'LayoutDashboard',
    website: 'https://mantine.dev',
    color: '#339af0',
    isOfficial: false,
  },
];

export const LIBRARY_CATEGORIES: LibraryCategoryDefinition[] = [
  { id: 'quantum-buttons', libraryId: 'quantum', name: 'Buttons', slug: 'buttons', icon: 'MousePointerClick' },
  { id: 'quantum-cards',   libraryId: 'quantum', name: 'Cards',   slug: 'cards',   icon: 'LayoutDashboard' },
  { id: 'quantum-inputs',  libraryId: 'quantum', name: 'Inputs',  slug: 'inputs',  icon: 'TextCursorInput' },

  { id: 'shadcn-buttons', libraryId: 'shadcn', name: 'Buttons', slug: 'buttons', icon: 'MousePointerClick' },
  { id: 'shadcn-cards',   libraryId: 'shadcn', name: 'Cards',   slug: 'cards',   icon: 'LayoutDashboard' },

  { id: 'magicui-buttons', libraryId: 'magicui', name: 'Buttons', slug: 'buttons', icon: 'MousePointerClick' },
  { id: 'magicui-text',    libraryId: 'magicui', name: 'Text',    slug: 'text',    icon: 'Type' },

  { id: 'aceternity-cards',   libraryId: 'aceternity', name: 'Cards',   slug: 'cards',   icon: 'LayoutDashboard' },
  { id: 'aceternity-effects', libraryId: 'aceternity', name: 'Effects', slug: 'effects', icon: 'Sparkles' },

  { id: 'mantine-buttons', libraryId: 'mantine', name: 'Buttons', slug: 'buttons', icon: 'MousePointerClick' },
  { id: 'mantine-cards',   libraryId: 'mantine', name: 'Cards',   slug: 'cards',   icon: 'LayoutDashboard' },
];

export function getLibraryById(id: string): LibraryDefinition | undefined {
  return LIBRARIES.find((l) => l.id === id);
}

export function getCategoriesForLibrary(libraryId: string): LibraryCategoryDefinition[] {
  return LIBRARY_CATEGORIES.filter((c) => c.libraryId === libraryId);
}