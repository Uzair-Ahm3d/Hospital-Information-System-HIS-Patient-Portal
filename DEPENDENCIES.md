# Installed Dependencies & Libraries

## Core UI Framework
- **shadcn/ui** - High-quality, accessible React components built with Radix UI and Tailwind CSS
- **Tailwind CSS v4** - Utility-first CSS framework for styling

## Icon Libraries
- **lucide-react** (v0.555.0) - Beautiful & consistent icon library with 1000+ icons

## Animation Libraries
- **framer-motion** (v12.23.25) - Production-ready motion library for React with smooth animations

## UI Component Libraries

### Radix UI Primitives
- `@radix-ui/react-slot` - Utility for merging props and refs
- `@radix-ui/react-dialog` - Modal dialogs and overlays
- `@radix-ui/react-dropdown-menu` - Dropdown menus
- `@radix-ui/react-select` - Select components
- `@radix-ui/react-toast` - Toast notifications
- `@radix-ui/react-tooltip` - Tooltips
- `@radix-ui/react-popover` - Popovers
- `@radix-ui/react-avatar` - Avatar components
- `@radix-ui/react-tabs` - Tab components
- `@radix-ui/react-accordion` - Accordion components
- `@radix-ui/react-label` - Label components

### Additional UI Libraries
- **sonner** (v2.0.7) - Opinionated toast notifications
- **vaul** (v1.1.2) - Drawer component for mobile-first UIs
- **embla-carousel-react** (v8.6.0) - Lightweight carousel library
- **recharts** (v3.5.1) - Composable charting library built on React components

## Utility Libraries
- **class-variance-authority** (v0.7.1) - CSS-in-TS variant API for component styling
- **clsx** (v2.1.1) - Utility for constructing className strings conditionally
- **tailwind-merge** (v3.4.0) - Merge Tailwind CSS classes without conflicts

## Form & Validation
- **react-hook-form** (v7.67.0) - Performant, flexible forms with easy validation
- **zod** (v4.1.13) - TypeScript-first schema validation
- **@hookform/resolvers** (v5.2.2) - Validation resolvers for react-hook-form

## Date & Time
- **date-fns** (v4.1.0) - Modern JavaScript date utility library

## Theme Management
- **next-themes** (v0.4.6) - Perfect dark mode for Next.js apps

## Created shadcn/ui Components

The following components have been set up and are ready to use:

- **Button** - `@/components/ui/button`
- **Card** - `@/components/ui/card`
- **Input** - `@/components/ui/input`
- **Label** - `@/components/ui/label`
- **Badge** - `@/components/ui/badge`
- **Table** - `@/components/ui/table`
- **Textarea** - `@/components/ui/textarea`
- **Dialog** - `@/components/ui/dialog`
- **Toast** - `@/components/ui/toast` (with `@/hooks/use-toast`)
- **Toaster** - `@/components/ui/toaster`

## Utilities Created

- **cn()** - `@/lib/utils` - Utility function for merging Tailwind classes
- **ThemeProvider** - `@/components/theme-provider` - Theme provider component
- **useToast** - `@/hooks/use-toast` - Hook for toast notifications

## Usage Examples

### Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Icons (Lucide)
```tsx
import { Home, Search, Menu, X } from "lucide-react"

<Home className="w-4 h-4" />
<Search size={20} />
```

### Framer Motion
```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Animated content
</motion.div>
```

### Forms with react-hook-form & zod
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
})
```

### Toast Notifications
```tsx
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

toast({
  title: "Success",
  description: "Your changes have been saved."
})
```

## Configuration Files

- **components.json** - shadcn/ui configuration
- **lib/utils.ts** - Utility functions
- **app/globals.css** - Global styles with CSS variables for theming
- **tsconfig.json** - TypeScript configuration with path aliases

## Path Aliases Configured

```json
{
  "@/*": ["./*"],
  "@/components": ["./components"],
  "@/lib": ["./lib"],
  "@/hooks": ["./hooks"]
}
```

## Next Steps

1. Add more shadcn/ui components as needed using: `npx shadcn@latest add [component-name]`
2. Configure theme colors in `app/globals.css`
3. Use ThemeProvider in your layout for dark mode support
4. Build your application with these powerful tools!
