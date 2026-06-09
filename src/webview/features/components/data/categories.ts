import type { Category } from '../types';

export const CATEGORIES: Category[] = [
    {
        id: 'buttons',
        name: 'Buttons',
        icon: 'MousePointerClick',
        description: 'Interactive button components in all styles and sizes',
    },
    {
        id: 'cards',
        name: 'Cards',
        icon: 'LayoutDashboard',
        description: 'Content containers including pricing, stats, and profile cards',
    },
    {
        id: 'inputs',
        name: 'Input Fields',
        icon: 'TextCursorInput',
        description: 'Text inputs, textareas, and search fields',
    },
    {
        id: 'password-fields',
        name: 'Password Fields',
        icon: 'KeyRound',
        description: 'Secure password inputs with visibility toggles',
    },
    {
        id: 'radio-buttons',
        name: 'Radio Buttons',
        icon: 'CircleDot',
        description: 'Single-select radio button groups and custom styles',
    },
    {
        id: 'checkboxes',
        name: 'Checkboxes',
        icon: 'CheckSquare',
        description: 'Checkbox components with various styles and states',
    },
    {
        id: 'forms',
        name: 'Forms',
        icon: 'ClipboardList',
        description: 'Complete form layouts for login, signup, and contact',
    },
    {
        id: 'modals',
        name: 'Modals',
        icon: 'AppWindow',
        description: 'Dialog boxes, popups, and overlay panels',
    },
    {
        id: 'navigation',
        name: 'Navigation',
        icon: 'Navigation',
        description: 'Navbars, sidebars, breadcrumbs, and tab bars',
    },
    {
        id: 'tables',
        name: 'Tables',
        icon: 'Table',
        description: 'Data tables with sorting, pagination, and filters',
    },
    {
        id: 'alerts',
        name: 'Alerts',
        icon: 'BellRing',
        description: 'Notification banners, toasts, and alert messages',
    },
    {
        id: 'backgrounds',
        name: 'Backgrounds',
        icon: 'Layers',
        description: 'Gradient, mesh, and animated background patterns',
    },
];

// ─── Helper: get category by id ───────────────────────────────────────────────

export function getCategoryById(id: string): Category | undefined {
    return CATEGORIES.find((c) => c.id === id);
}

// ─── Helper: get category name by id ─────────────────────────────────────────

export function getCategoryName(id: string): string {
    return getCategoryById(id)?.name ?? id;
}