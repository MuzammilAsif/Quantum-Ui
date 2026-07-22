import type { Asset } from '../types';

export const FORM_ASSETS: Asset[] = [
  {
    id: 'form-login',
    title: 'Login Form',
    category: 'forms',
    framework: 'react',
    tags: ['form', 'login', 'signin', 'auth', 'email', 'password'],
    description: 'A complete login form with email, password, and submit button',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-18',
    preview: null,
    code: {
      react: `<form className="flex flex-col gap-4 p-6 rounded-xl border border-gray-700 bg-gray-800/50 w-80">
  <div>
    <h2 className="text-lg font-bold text-white">Welcome back</h2>
    <p className="text-xs text-gray-500 mt-1">Sign in to your account</p>
  </div>
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-400">Email</label>
    <input type="email" placeholder="you@example.com" className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500" />
  </div>
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-400">Password</label>
    <input type="password" placeholder="••••••••" className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500" />
  </div>
  <button type="submit" className="w-full py-2 rounded-md bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors">
    Sign In
  </button>
</form>`,
    },
  },
  {
    id: 'form-signup',
    title: 'Signup Form',
    category: 'forms',
    framework: 'react',
    tags: ['form', 'signup', 'register', 'auth', 'account'],
    description: 'A complete signup form with name, email, and password fields',
    difficulty: 'Intermediate',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-18',
    preview: null,
    code: {
      react: `<form className="flex flex-col gap-3 p-6 rounded-xl border border-gray-700 bg-gray-800/50 w-80">
  <h2 className="text-lg font-bold text-white">Create account</h2>
  <input type="text" placeholder="Full name" className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500" />
  <input type="email" placeholder="Email" className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500" />
  <input type="password" placeholder="Password" className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500" />
  <button type="submit" className="w-full py-2 mt-1 rounded-md bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors">
    Create Account
  </button>
</form>`,
    },
  },
  {
    id: 'form-contact',
    title: 'Contact Form',
    category: 'forms',
    framework: 'react',
    tags: ['form', 'contact', 'message', 'textarea', 'support'],
    description: 'A contact form with name, email, and message fields',
    difficulty: 'Intermediate',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-18',
    preview: null,
    code: {
      react: `<form className="flex flex-col gap-3 p-6 rounded-xl border border-gray-700 bg-gray-800/50 w-80">
  <h2 className="text-lg font-bold text-white">Get in touch</h2>
  <input type="text" placeholder="Your name" className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500" />
  <input type="email" placeholder="Your email" className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500" />
  <textarea placeholder="Your message" rows={4} className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 resize-none" />
  <button type="submit" className="w-full py-2 rounded-md bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors">
    Send Message
  </button>
</form>`,
    },
  },
  {
    id: 'form-newsletter',
    title: 'Newsletter Signup',
    category: 'forms',
    framework: 'react',
    tags: ['form', 'newsletter', 'email', 'subscribe', 'inline'],
    description: 'A compact inline newsletter subscription form',
    difficulty: 'Beginner',
    styleTag: 'Minimal',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-18',
    preview: null,
    code: {
      react: `<form className="flex gap-2 p-1.5 rounded-full border border-gray-700 bg-gray-800/50 w-80">
  <input
    type="email"
    placeholder="Enter your email"
    className="flex-1 px-3 py-1.5 bg-transparent text-gray-300 text-sm outline-none placeholder:text-gray-500"
  />
  <button type="submit" className="px-4 py-1.5 rounded-full bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors">
    Subscribe
  </button>
</form>`,
    },
  },
  {
    id: 'form-search',
    title: 'Search Form',
    category: 'forms',
    framework: 'react',
    tags: ['form', 'search', 'query', 'input', 'icon'],
    description: 'A search form with icon and submit button',
    difficulty: 'Beginner',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-18',
    preview: null,
    code: {
      react: `<form className="relative w-80">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <input
    type="search"
    placeholder="Search anything..."
    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500 transition-colors"
  />
</form>`,
    },
  },
  {
    id: 'form-checkout',
    title: 'Checkout Form',
    category: 'forms',
    framework: 'react',
    tags: ['form', 'checkout', 'payment', 'card', 'billing', 'ecommerce'],
    description: 'A payment card checkout form with card number and expiry fields',
    difficulty: 'Advanced',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-18',
    preview: null,
    code: {
      react: `<form className="flex flex-col gap-3 p-6 rounded-xl border border-gray-700 bg-gray-800/50 w-80">
  <h2 className="text-sm font-bold text-white">Payment Details</h2>
  <input type="text" placeholder="Card number" className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500" />
  <div className="flex gap-2">
    <input type="text" placeholder="MM/YY" className="w-1/2 px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500" />
    <input type="text" placeholder="CVC" className="w-1/2 px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 text-sm outline-none focus:border-violet-500" />
  </div>
  <button type="submit" className="w-full py-2 mt-1 rounded-md bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors">
    Pay $29.00
  </button>
</form>`,
    },
  },
  {
    id: 'form-multi-step',
    title: 'Multi-Step Form Header',
    category: 'forms',
    framework: 'react',
    tags: ['form', 'multi-step', 'wizard', 'progress', 'steps'],
    description: 'A progress indicator header for a multi-step form flow',
    difficulty: 'Advanced',
    styleTag: 'Modern',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-18',
    preview: null,
    code: {
      react: `const step = 2;
const steps = ['Account', 'Profile', 'Confirm'];

<div className="flex items-center w-80">
  {steps.map((label, i) => (
    <div key={label} className="flex items-center flex-1 last:flex-none">
      <div className="flex flex-col items-center gap-1">
        <div className={\`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold \${i + 1 <= step ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-400'}\`}>
          {i + 1}
        </div>
        <span className="text-2xs text-gray-500">{label}</span>
      </div>
      {i < steps.length - 1 && <div className={\`flex-1 h-0.5 mx-2 \${i + 1 < step ? 'bg-violet-500' : 'bg-gray-700'}\`} />}
    </div>
  ))}
</div>`,
    },
  },
  {
    id: 'form-glass',
    title: 'Glass Form Panel',
    category: 'forms',
    framework: 'react',
    tags: ['form', 'glass', 'glassmorphism', 'blur', 'login'],
    description: 'A glassmorphism-styled login form panel',
    difficulty: 'Advanced',
    styleTag: 'Glassmorphism',
    version: '1.0.0',
    author: 'Quantum UI',
    dateAdded: '2024-01-18',
    preview: null,
    code: {
      react: `<form className="flex flex-col gap-3 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 w-80">
  <h2 className="text-lg font-bold text-white">Sign in</h2>
  <input type="email" placeholder="Email" className="px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm outline-none" />
  <input type="password" placeholder="Password" className="px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm outline-none" />
  <button type="submit" className="w-full py-2 mt-1 rounded-md bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors">
    Continue
  </button>
</form>`,
    },
  },
];