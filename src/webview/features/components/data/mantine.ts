import type { Asset } from '../types';

export const MANTINE_ASSETS: Asset[] = [
  {
    id: 'mantine-btn-filled',
    title: 'Filled Button',
    category: 'buttons',
    framework: 'react',
    library: 'mantine',
    tags: ['button', 'mantine', 'filled', 'primary'],
    description: 'The default filled button variant from Mantine core',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '7.0.0',
    author: 'Mantine',
    dateAdded: '2024-02-04',
    preview: null,
    code: {
      react: `import { Button } from '@mantine/core';

export function FilledButton() {
  return <Button>Filled Button</Button>;
}`,
      html: `<button class="px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
  Filled Button
</button>`,
    },
  },
  {
    id: 'mantine-btn-gradient',
    title: 'Gradient Button',
    category: 'buttons',
    framework: 'react',
    library: 'mantine',
    tags: ['button', 'mantine', 'gradient', 'variant'],
    description: 'A Mantine button using the gradient variant with custom color stops',
    difficulty: 'Beginner',
    styleTag: 'Gradient',
    version: '7.0.0',
    author: 'Mantine',
    dateAdded: '2024-02-04',
    preview: null,
    code: {
      react: `import { Button } from '@mantine/core';

export function GradientButton() {
  return (
    <Button variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
      Gradient Button
    </Button>
  );
}`,
      html: `<button class="px-4 py-2 rounded-md text-white text-sm font-medium" style="background: linear-gradient(90deg, #339af0, #22b8cf);">
  Gradient Button
</button>`,
    },
  },
  {
    id: 'mantine-btn-loading',
    title: 'Loading Button',
    category: 'buttons',
    framework: 'react',
    library: 'mantine',
    tags: ['button', 'mantine', 'loading', 'async', 'state'],
    description: 'A Mantine button with a built-in loading spinner state',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '7.0.0',
    author: 'Mantine',
    dateAdded: '2024-02-04',
    preview: null,
    code: {
      react: `import { Button } from '@mantine/core';
import { useState } from 'react';

export function LoadingButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button loading={loading} onClick={() => setLoading(true)}>
      Submit
    </Button>
  );
}`,
      html: `<button class="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium opacity-80">
  <span style="width:14px;height:14px;border:2px solid white;border-top-color:transparent;border-radius:50%;display:inline-block;"></span>
  Submit
</button>`,
    },
  },
  {
    id: 'mantine-stats-card',
    title: 'Stats Card',
    category: 'cards',
    framework: 'react',
    library: 'mantine',
    tags: ['card', 'mantine', 'stats', 'metric', 'dashboard', 'trend'],
    description: 'A metric card with a trend badge, built using Mantine Card and Badge components',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '7.0.0',
    author: 'Mantine',
    dateAdded: '2024-02-04',
    preview: null,
    code: {
      react: `import { Card, Text, Group, Badge } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';

export function StatsCard() {
  return (
    <Card withBorder p="md" radius="md" w={260}>
      <Group justify="space-between">
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">Monthly Revenue</Text>
        <Badge color="teal" variant="light">+18%</Badge>
      </Group>
      <Text fz="2rem" fw={700} mt={12}>$12,450</Text>
      <Text fz="xs" c="dimmed" mt={4}>Compared to previous month</Text>
    </Card>
  );
}`,
      html: `<div style="width:240px;" class="rounded-lg border border-gray-300 bg-white p-5">
  <div class="flex justify-between items-center mb-3">
    <span class="text-xs font-bold uppercase text-gray-500">Monthly Revenue</span>
    <span class="px-2 py-0.5 rounded text-xs font-semibold bg-teal-100 text-teal-700">+18%</span>
  </div>
  <div class="text-3xl font-bold text-gray-900">$12,450</div>
  <div class="text-xs text-gray-500 mt-1">Compared to previous month</div>
</div>`,
    },
  },
  {
    id: 'mantine-profile-card',
    title: 'Profile Card',
    category: 'cards',
    framework: 'react',
    library: 'mantine',
    tags: ['card', 'mantine', 'profile', 'avatar', 'user'],
    description: 'A user profile card with avatar, name, and role built with Mantine components',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '7.0.0',
    author: 'Mantine',
    dateAdded: '2024-02-04',
    preview: null,
    code: {
      react: `import { Card, Avatar, Text, Group } from '@mantine/core';

export function ProfileCard() {
  return (
    <Card withBorder p="md" radius="md" w={220}>
      <Group>
        <Avatar radius="xl" color="blue">JD</Avatar>
        <div>
          <Text fw={600} fz="sm">Jane Doe</Text>
          <Text fz="xs" c="dimmed">Product Designer</Text>
        </div>
      </Group>
    </Card>
  );
}`,
      html: `<div style="width:200px;" class="rounded-lg border border-gray-300 bg-white p-4 flex items-center gap-3">
  <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">JD</div>
  <div>
    <p class="text-sm font-semibold text-gray-900">Jane Doe</p>
    <p class="text-xs text-gray-500">Product Designer</p>
  </div>
</div>`,
    },
  },
  {
    id: 'mantine-input-basic',
    title: 'Text Input',
    category: 'inputs',
    framework: 'react',
    library: 'mantine',
    tags: ['input', 'mantine', 'text', 'form', 'label'],
    description: 'The standard Mantine TextInput with built-in label support',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '7.0.0',
    author: 'Mantine',
    dateAdded: '2024-02-04',
    preview: null,
    code: {
      react: `import { TextInput } from '@mantine/core';

export function BasicInput() {
  return <TextInput label="Email" placeholder="you@example.com" />;
}`,
      html: `<div style="width:220px;">
  <label class="text-sm font-medium text-gray-700 block mb-1">Email</label>
  <input type="email" placeholder="you@example.com" class="w-full px-3 py-2 rounded-md border border-gray-300 text-sm outline-none focus:border-blue-500" />
</div>`,
    },
  },
  {
    id: 'mantine-input-icon',
    title: 'Input with Icon',
    category: 'inputs',
    framework: 'react',
    library: 'mantine',
    tags: ['input', 'mantine', 'icon', 'search', 'form'],
    description: 'A Mantine TextInput with a leading icon, commonly used for search fields',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '7.0.0',
    author: 'Mantine',
    dateAdded: '2024-02-04',
    preview: null,
    code: {
      react: `import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export function SearchInput() {
  return <TextInput placeholder="Search..." leftSection={<IconSearch size={16} />} />;
}`,
      html: `<div style="width:220px;" class="relative">
  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style="font-size:14px;">🔍</span>
  <input type="text" placeholder="Search..." class="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm outline-none focus:border-blue-500" />
</div>`,
    },
  },
  {
    id: 'mantine-select',
    title: 'Select Dropdown',
    category: 'inputs',
    framework: 'react',
    library: 'mantine',
    tags: ['select', 'mantine', 'dropdown', 'form', 'input'],
    description: 'The Mantine Select dropdown component with searchable options',
    difficulty: 'Intermediate',
    styleTag: 'Minimal',
    version: '7.0.0',
    author: 'Mantine',
    dateAdded: '2024-02-04',
    preview: null,
    code: {
      react: `import { Select } from '@mantine/core';

export function BasicSelect() {
  return (
    <Select
      label="Framework"
      placeholder="Pick one"
      data={['React', 'Vue', 'Angular', 'Svelte']}
    />
  );
}`,
      html: `<div style="width:220px;">
  <label class="text-sm font-medium text-gray-700 block mb-1">Framework</label>
  <div class="flex items-center justify-between px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-500">
    Pick one <span>⌄</span>
  </div>
</div>`,
    },
  },
];