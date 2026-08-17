import type { Asset } from '../types';

export const SHADCN_ASSETS: Asset[] = [
  {
    id: 'shadcn-btn-default',
    title: 'Default Button',
    category: 'buttons',
    framework: 'react',
    library: 'shadcn',
    tags: ['button', 'shadcn', 'default', 'primary', 'radix'],
    description: 'The signature shadcn/ui button — solid, high-contrast, minimal. Requires: npx shadcn@latest add button',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '2.0.0',
    author: 'shadcn',
    dateAdded: '2024-02-01',
    preview: null,
    code: {
      react: `import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return <Button>Button</Button>
}`,
      html: `<button class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 h-9 px-4 py-2 transition-colors">
  Button
</button>`,
    },
  },
  {
    id: 'shadcn-btn-secondary',
    title: 'Secondary Button',
    category: 'buttons',
    framework: 'react',
    library: 'shadcn',
    tags: ['button', 'shadcn', 'secondary', 'variant'],
    description: 'The secondary variant of the shadcn/ui button component',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '2.0.0',
    author: 'shadcn',
    dateAdded: '2024-02-01',
    preview: null,
    code: {
      react: `import { Button } from "@/components/ui/button"

export function ButtonSecondary() {
  return <Button variant="secondary">Secondary</Button>
}`,
      html: `<button class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 h-9 px-4 py-2 transition-colors">
  Secondary
</button>`,
    },
  },
  {
    id: 'shadcn-btn-destructive',
    title: 'Destructive Button',
    category: 'buttons',
    framework: 'react',
    library: 'shadcn',
    tags: ['button', 'shadcn', 'destructive', 'danger', 'delete'],
    description: 'The destructive variant, used for dangerous or irreversible actions',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '2.0.0',
    author: 'shadcn',
    dateAdded: '2024-02-01',
    preview: null,
    code: {
      react: `import { Button } from "@/components/ui/button"

export function ButtonDestructive() {
  return <Button variant="destructive">Delete Account</Button>
}`,
      html: `<button class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-red-500 text-zinc-50 hover:bg-red-500/90 h-9 px-4 py-2 transition-colors">
  Delete Account
</button>`,
    },
  },
  {
    id: 'shadcn-btn-outline',
    title: 'Outline Button',
    category: 'buttons',
    framework: 'react',
    library: 'shadcn',
    tags: ['button', 'shadcn', 'outline', 'border', 'variant'],
    description: 'The outline variant with a bordered, transparent background',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '2.0.0',
    author: 'shadcn',
    dateAdded: '2024-02-01',
    preview: null,
    code: {
      react: `import { Button } from "@/components/ui/button"

export function ButtonOutline() {
  return <Button variant="outline">Outline</Button>
}`,
      html: `<button class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-zinc-200 bg-white hover:bg-zinc-100 h-9 px-4 py-2 transition-colors">
  Outline
</button>`,
    },
  },
  {
    id: 'shadcn-card-basic',
    title: 'Card',
    category: 'cards',
    framework: 'react',
    library: 'shadcn',
    tags: ['card', 'shadcn', 'container', 'layout'],
    description: 'The base shadcn/ui card with header, content, and footer sections. Requires: npx shadcn@latest add card',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '2.0.0',
    author: 'shadcn',
    dateAdded: '2024-02-01',
    preview: null,
    code: {
      react: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Your project will be created instantly.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Deploy</Button>
      </CardFooter>
    </Card>
  )
}`,
      html: `<div style="width:280px;" class="rounded-xl border border-zinc-200 bg-white p-6">
  <div class="mb-4">
    <h3 class="text-base font-semibold text-zinc-950">Create project</h3>
    <p class="text-sm text-zinc-500 mt-1">Deploy your new project in one-click.</p>
  </div>
  <p class="text-sm text-zinc-500 mb-4">Your project will be created instantly.</p>
  <button class="w-full py-2 rounded-md bg-zinc-900 text-zinc-50 text-sm font-medium">Deploy</button>
</div>`,
    },
  },
  {
    id: 'shadcn-card-stat',
    title: 'Stat Card',
    category: 'cards',
    framework: 'react',
    library: 'shadcn',
    tags: ['card', 'shadcn', 'stat', 'metric', 'dashboard'],
    description: 'A metric display card built on top of shadcn/ui Card primitives',
    difficulty: 'Intermediate',
    styleTag: 'Minimal',
    version: '2.0.0',
    author: 'shadcn',
    dateAdded: '2024-02-01',
    preview: null,
    code: {
      react: `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function StatCard() {
  return (
    <Card className="w-64">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Revenue
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$45,231.89</div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  )
}`,
      html: `<div style="width:250px;" class="rounded-xl border border-zinc-200 bg-white p-5">
  <div class="flex items-center justify-between mb-2">
    <span class="text-sm font-medium text-zinc-500">Total Revenue</span>
    <span style="width:16px;height:16px;" class="text-zinc-400">↗</span>
  </div>
  <div class="text-2xl font-bold text-zinc-950">$45,231.89</div>
  <p class="text-xs text-zinc-500 mt-1">+20.1% from last month</p>
</div>`,
    },
  },
  {
    id: 'shadcn-card-notification',
    title: 'Notification Card',
    category: 'cards',
    framework: 'react',
    library: 'shadcn',
    tags: ['card', 'shadcn', 'notification', 'toggle', 'settings'],
    description: 'A notification preferences card with toggle switches',
    difficulty: 'Intermediate',
    styleTag: 'Minimal',
    version: '2.0.0',
    author: 'shadcn',
    dateAdded: '2024-02-01',
    preview: null,
    code: {
      react: `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function NotificationCard() {
  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle className="text-base">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-sm">Push notifications</span>
        <Switch />
      </CardContent>
    </Card>
  )
}`,
      html: `<div style="width:260px;" class="rounded-xl border border-zinc-200 bg-white p-5">
  <h3 class="text-base font-semibold text-zinc-950 mb-3">Notifications</h3>
  <div class="flex items-center justify-between">
    <span class="text-sm text-zinc-700">Push notifications</span>
    <div class="w-9 h-5 rounded-full bg-zinc-900 relative">
      <div class="w-4 h-4 rounded-full bg-white absolute top-0.5 right-0.5"></div>
    </div>
  </div>
</div>`,
    },
  },
  {
    id: 'shadcn-card-image',
    title: 'Card with Image',
    category: 'cards',
    framework: 'react',
    library: 'shadcn',
    tags: ['card', 'shadcn', 'image', 'media', 'thumbnail'],
    description: 'A media card with an image header, commonly used for blog or product previews',
    difficulty: 'Intermediate',
    styleTag: 'Minimal',
    version: '2.0.0',
    author: 'shadcn',
    dateAdded: '2024-02-01',
    preview: null,
    code: {
      react: `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ImageCard() {
  return (
    <Card className="w-72 overflow-hidden">
      <div className="h-32 bg-gradient-to-br from-zinc-200 to-zinc-300" />
      <CardHeader>
        <CardTitle className="text-base">Article Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          A short excerpt describing the article content.
        </p>
      </CardContent>
    </Card>
  )
}`,
      html: `<div style="width:260px;" class="rounded-xl border border-zinc-200 bg-white overflow-hidden">
  <div class="h-28" style="background: linear-gradient(135deg, #e4e4e7, #d4d4d8);"></div>
  <div class="p-5">
    <h3 class="text-base font-semibold text-zinc-950 mb-1">Article Title</h3>
    <p class="text-sm text-zinc-500">A short excerpt describing the article content.</p>
  </div>
</div>`,
    },
  },
];