/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Code2, 
  Eye, 
  Copy, 
  Download, 
  Sparkles, 
  Check, 
  Terminal,
  FileJson,
  Moon,
  Sun,
  Layout,
  Image as ImageIcon,
  X,
  Upload,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateDashboardComponent } from './services/gemini';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from '@/components/ui/breadcrumb';
import { Calendar } from '@/components/ui/calendar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from '@/components/ui/command';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup } from '@/components/ui/context-menu';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut, MenubarGroup, MenubarPortal, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarRadioGroup, MenubarCheckboxItem, MenubarRadioItem, MenubarLabel } from '@/components/ui/menubar';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Toggle, toggleVariants } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent,
  ChartStyle
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import * as Recharts from 'recharts';
import * as LucideIcons from 'lucide-react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import ReactMarkdown from 'react-markdown';
import { themes } from 'prism-react-renderer';

// Helper to extract code from markdown blocks
function parseAIResponse(text: string) {
  const tsxMatch = text.match(/```tsx\n([\s\S]*?)```/);
  const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
  
  return {
    component: tsxMatch ? tsxMatch[1].trim() : '',
    registry: jsonMatch ? jsonMatch[1].trim() : text // Fallback to raw text if no json block
  };
}

// Scope for React Live
const liveScope = {
  React,
  ...React,
  motion,
  AnimatePresence,
  ...Recharts,
  Recharts,
  ...LucideIcons,
  LucideIcons,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Textarea,
  Button,
  Badge,
  Skeleton,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
  Progress,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert, 
  AlertTitle, 
  AlertDescription,
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger,
  AspectRatio,
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator, 
  BreadcrumbEllipsis,
  Calendar,
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  Checkbox,
  Collapsible, 
  CollapsibleTrigger, 
  CollapsibleContent,
  Command, 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  CommandShortcut, 
  CommandSeparator,
  ContextMenu, 
  ContextMenuTrigger, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuCheckboxItem, 
  ContextMenuRadioItem, 
  ContextMenuLabel, 
  ContextMenuSeparator, 
  ContextMenuShortcut, 
  ContextMenuGroup, 
  ContextMenuPortal, 
  ContextMenuSub, 
  ContextMenuSubContent, 
  ContextMenuSubTrigger, 
  ContextMenuRadioGroup,
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger,
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuCheckboxItem, 
  DropdownMenuRadioItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuShortcut, 
  DropdownMenuGroup, 
  DropdownMenuPortal, 
  DropdownMenuSub, 
  DropdownMenuSubContent, 
  DropdownMenuSubTrigger, 
  DropdownMenuRadioGroup,
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent,
  InputOTP, 
  InputOTPGroup, 
  InputOTPSeparator, 
  InputOTPSlot,
  Label,
  Menubar, 
  MenubarMenu, 
  MenubarTrigger, 
  MenubarContent, 
  MenubarItem, 
  MenubarSeparator, 
  MenubarShortcut, 
  MenubarGroup, 
  MenubarPortal, 
  MenubarSub, 
  MenubarSubContent, 
  MenubarSubTrigger, 
  MenubarRadioGroup, 
  MenubarCheckboxItem, 
  MenubarRadioItem, 
  MenubarLabel,
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuContent, 
  NavigationMenuTrigger, 
  NavigationMenuLink, 
  NavigationMenuIndicator, 
  navigationMenuTriggerStyle,
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  Popover, 
  PopoverTrigger, 
  PopoverContent,
  RadioGroup, 
  RadioGroupItem,
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle,
  Sheet, 
  SheetTrigger, 
  SheetClose, 
  SheetContent, 
  SheetHeader, 
  SheetFooter, 
  SheetTitle, 
  SheetDescription,
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarHeader, 
  SidebarInput, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuAction, 
  SidebarMenuBadge, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSkeleton, 
  SidebarMenuSub, 
  SidebarMenuSubButton, 
  SidebarMenuSubItem, 
  SidebarProvider, 
  SidebarRail, 
  SidebarSeparator, 
  SidebarTrigger, 
  useSidebar,
  Slider,
  Switch,
  Toggle, 
  ToggleGroup, 
  ToggleGroupItem,
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider,
  Toaster,
  toast,
  cn,
};

export default function App() {
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<{ component: string; registry: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [themeCSS, setThemeCSS] = useState('');

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('architect-theme-css');
    if (savedTheme) {
      setThemeCSS(savedTheme);
    }
  }, []);

  const handleSaveTheme = () => {
    localStorage.setItem('architect-theme-css', themeCSS);
    toast.success('Theme saved to local storage');
  };

  // Apply dark mode class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!description.trim() && !imageBase64) return;
    
    setIsGenerating(true);
    try {
      const response = await generateDashboardComponent(description, imageBase64 || undefined);
      const parsed = parseAIResponse(response || '');
      
      // Robust extraction of DashboardComponent
      let mainCode = parsed.component;
      let componentName = 'DashboardComponent';
      
      // Try to find the actual defined component name if DashboardComponent isn't used
      // We look for PascalCase names that are typical for components
      const nameMatch = mainCode.match(/(?:function|const|class)\s+([A-Z][a-zA-Z0-9]+)/);
      if (nameMatch && nameMatch[1] !== 'ChartConfig' && nameMatch[1] !== 'DashboardComponent') {
        componentName = nameMatch[1];
      }
      // If we found 'DashboardComponent' explicitly, prioritize it
      if (mainCode.includes('function DashboardComponent') || mainCode.includes('const DashboardComponent')) {
        componentName = 'DashboardComponent';
      }

      // Clean the code for react-live:
      // 1. Remove all import statements
      // 2. Remove all export keywords
      // 3. Remove 'satisfies' keyword
      // 4. Wrap in a way that handles potential 'exports is not defined'
      
      const cleanCode = `
const exports = {};
${mainCode.trim()
  .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/gm, '') 
  .replace(/import\s+(['"].*?['"]);?/gm, '')
  .replace(/export\s+default\s+/g, '') 
  .replace(/export\s+(const|function|class|type|interface|enum)\s+/g, '$1 ') 
  .replace(/export\s+{[^}]*};?/g, '')
  .replace(/\s+satisfies\s+[A-Z]\w+/g, '')}

render(<DashboardComponent />);`;

      setGeneratedCode({ 
        component: parsed.component, 
        registry: parsed.registry
      });
      
      setPreviewCode(cleanCode);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const [previewCode, setPreviewCode] = useState('');

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode.component);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode.component], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-component.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-bottom border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">
              Architect<span className="text-emerald-500">.ai</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full h-9 w-9"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-none px-3 py-1">
              v2026.1
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[calc(100vh-64px)]">
        {/* Left Panel: Input */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:overflow-y-auto lg:pr-2">
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Generator
              </CardTitle>
              <CardDescription>
                Describe the dashboard component you want to build.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea 
                  placeholder="e.g., A dual-line chart showing monthly revenue vs expenses with tooltips and a sleek legend..."
                  className="min-h-[120px] resize-none border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Image Upload Area */}
              <div className="space-y-2">
                <AnimatePresence mode="wait">
                  {imageBase64 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 group"
                    >
                      <img src={imageBase64} alt="Reference" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => setImageBase64(null)}
                          className="h-8 w-8 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-6 h-6 mb-2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Add reference image (optional)</p>
                        </div>
                        <Input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || (!description.trim() && !imageBase64)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-6 rounded-xl transition-all active:scale-[0.98] group shadow-lg shadow-emerald-500/20"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Architecting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Generate Component
                  </div>
                )}
              </Button>
            </CardContent>
            <CardFooter className="pt-0 text-[10px] text-slate-400 dark:text-slate-500 font-mono flex gap-4 uppercase tracking-widest">
              <span>Next.js Compatible</span>
              <span>Shadcn v4</span>
              <span>Recharts</span>
            </CardFooter>
          </Card>

          {/* Quick Tasks */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Quick Suggestions</span>
            {[
              "Line chart for crypto trends",
              "Bar chart with negative values",
              "Donut chart for budget split",
              "Stacked area for revenue info"
            ].map((suggestion) => (
              <button 
                key={suggestion}
                onClick={() => setDescription(suggestion)}
                className="w-full text-left p-3 text-xs rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-all text-slate-600 dark:text-slate-400 flex items-center justify-between group"
              >
                {suggestion}
                <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Preview & Code */}
        <div className="lg:col-span-8 flex flex-col min-h-0">
          <Tabs defaultValue="preview" className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
                <TabsTrigger value="preview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-500 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-500 flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="registry" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-500 flex items-center gap-2">
                  <FileJson className="w-3.5 h-3.5" />
                  Registry
                </TabsTrigger>
                <TabsTrigger value="inventory" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-500 flex items-center gap-2">
                  <Layout className="w-3.5 h-3.5" />
                  Inventory
                </TabsTrigger>
                <TabsTrigger value="theme" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-500 flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="debug" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-500 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  Logs
                </TabsTrigger>
              </TabsList>

              {generatedCode && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button size="sm" onClick={handleDownload} className="h-8 gap-2 bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </Button>
                </div>
              )}
            </div>

            <Card className="flex-1 overflow-hidden border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 flex flex-col relative min-h-0">
              <TabsContent value="preview" className="flex-1 m-0 focus-visible:outline-none flex flex-col min-h-0">
                <div className="h-full flex flex-col">
                  {!generatedCode && !isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-8 text-center">
                      <div className="w-24 h-24 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-6">
                        <Layout className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-sm max-w-[280px]">Your AI-generated dashboard component will appear here.</p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="flex-1 p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-32 rounded-xl" />
                        <Skeleton className="h-32 rounded-xl" />
                        <Skeleton className="h-32 rounded-xl" />
                      </div>
                      <Skeleton className="h-64 w-full rounded-2xl" />
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 animate-pulse">
                          <Terminal className="w-3 h-3" />
                          ARCHITECT_CORE_EXECUTING...
                        </div>
                      </div>
                    </div>
                  )}

                  {generatedCode && !isGenerating && (
                    <div className="flex-1 p-6 overflow-auto">
                      <style>
                        {themeCSS ? themeCSS.replace(/:root/g, '#preview-theme-container').replace(/\.dark/g, '.dark #preview-theme-container') : ''}
                      </style>
                      <LiveProvider 
                        code={previewCode} 
                        scope={liveScope} 
                        noInline={true}
                        theme={theme === 'dark' ? themes.vsDark : themes.github}
                      >
                        <div id="preview-theme-container" className="p-4 bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 min-h-full flex flex-col">
                          <SidebarProvider>
                            <TooltipProvider>
                              <div className="w-full h-full flex-1">
                                <LivePreview className="w-full h-full" />
                                <Toaster />
                              </div>
                            </TooltipProvider>
                          </SidebarProvider>
                        </div>
                        <div className="mt-4 p-4 bg-red-500/10 text-red-500 font-mono text-xs rounded-xl border border-red-500/20 flex flex-col gap-2">
                           <div className="flex items-center gap-2 font-bold">
                             <AlertCircle className="w-4 h-4" />
                             Preview Error
                           </div>
                           <LiveError className="m-0" />
                        </div>
                      </LiveProvider>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="code" className="flex-1 m-0 focus-visible:outline-none flex flex-col min-h-0">
                {generatedCode ? (
                  <ScrollArea className="h-full bg-[#1e1e1e]">
                    <div className="p-4">
                      <ReactMarkdown
                        components={{
                          code({ children }) {
                            return (
                              <pre className="text-sm font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                {String(children).replace(/\n$/, '')}
                              </pre>
                            );
                          }
                        }}
                      >
                        {`\`\`\`tsx\n${generatedCode.component}\n\`\`\``}
                      </ReactMarkdown>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-600">
                    No code generated yet.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="registry" className="flex-1 m-0 focus-visible:outline-none flex flex-col min-h-0">
                {generatedCode ? (
                  <ScrollArea className="h-full bg-slate-900/50">
                    <div className="p-4">
                       <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                        {generatedCode.registry}
                      </pre>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-600">
                    No registry data available.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="inventory" className="flex-1 m-0 focus-visible:outline-none flex flex-col min-h-0">
                <ScrollArea className="h-full bg-slate-50 dark:bg-slate-950">
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold flex items-center gap-2">
                          <Layout className="w-4 h-4 text-emerald-500" />
                          Shadcn UI Inventory
                        </h3>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          { [
                            'Card', 'Button', 'Badge', 'Input', 'Textarea', 'Tabs', 'Table', 'Progress', 'Avatar', 
                            'Separator', 'Select', 'Dialog', 'Accordion', 'Skeleton', 'ScrollArea', 'Alert', 
                            'AlertDialog', 'AspectRatio', 'Breadcrumb', 'Calendar', 'Carousel', 'Checkbox', 
                            'Collapsible', 'Command', 'ContextMenu', 'Drawer', 'DropdownMenu', 'HoverCard', 
                            'InputOTP', 'Label', 'Menubar', 'NavigationMenu', 'Pagination', 'Popover', 
                            'RadioGroup', 'Resizable', 'Sheet', 'Sidebar', 'Slider', 'Switch', 'Toggle', 
                            'ToggleGroup', 'Tooltip', 'Chart'
                          ].length } Components
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">These primitive components are injected into the generator's global scope. Do not import them.</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          'Accordion', 'Alert', 'AlertDialog', 'AspectRatio', 'Avatar', 'Badge', 
                          'Breadcrumb', 'Button', 'Calendar', 'Card', 'Carousel', 'Chart', 
                          'Checkbox', 'Collapsible', 'Command', 'ContextMenu', 'Dialog', 'Drawer', 
                          'DropdownMenu', 'HoverCard', 'Input', 'InputOTP', 'Label', 'Menubar', 
                          'NavigationMenu', 'Pagination', 'Popover', 'Progress', 'RadioGroup', 
                          'Resizable', 'ScrollArea', 'Select', 'Separator', 'Sheet', 'Sidebar', 
                          'Skeleton', 'Slider', 'Sonner', 'Switch', 'Table', 'Tabs', 'Textarea', 
                          'Toggle', 'ToggleGroup', 'Tooltip'
                        ].map(c => (
                          <div key={c} className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-[10px] font-mono flex items-center justify-center text-center">
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        Libraries
                      </h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">Lucide Icons</Badge>
                        <Badge variant="outline">Recharts</Badge>
                        <Badge variant="outline">Motion</Badge>
                        <Badge variant="outline">Tailwind CSS</Badge>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="theme" className="flex-1 m-0 focus-visible:outline-none flex flex-col min-h-0">
                <ScrollArea className="h-full bg-slate-50 dark:bg-slate-950">
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold flex items-center gap-2">
                          <Sun className="w-4 h-4 text-orange-500" />
                          Live Theme Customization
                        </h3>
                        <Badge variant="outline" className="text-[10px] uppercase border-emerald-500/20 text-emerald-500 bg-emerald-500/5 animate-pulse">
                          Live Preview
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Paste your Shadcn CSS variables here (from themes.shadcn.com). 
                        Changes will be applied instantly to the preview mockup.
                      </p>
                      
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CSS Variables</Label>
                        <Textarea 
                          className="min-h-[300px] font-mono text-[10px] bg-slate-950 text-slate-300 border-slate-800"
                          placeholder=":root {&#10;  --background: 0 0% 100%;&#10;  --primary: 222.2 47.4% 11.2%;&#10;}&#10;&#10;.dark {&#10;  --background: 222.2 84% 4.9%;&#10;}"
                          value={themeCSS}
                          onChange={(e) => setThemeCSS(e.target.value)}
                        />
                      </div>
                      
                      <div className="pt-4 flex gap-4">
                        <Button 
                          size="sm" 
                          className="text-[10px] h-7 bg-emerald-600 hover:bg-emerald-700"
                          onClick={handleSaveTheme}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Save Theme
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-[10px] h-7"
                          onClick={() => {
                            setThemeCSS('');
                            localStorage.removeItem('architect-theme-css');
                            toast.info('Theme reset to default');
                          }}
                        >
                          Reset to Default
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="debug" className="flex-1 m-0 focus-visible:outline-none flex flex-col min-h-0">
                <ScrollArea className="h-full bg-slate-950">
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                       <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Transformed Code (Live Preview)</h4>
                       <pre className="text-[10px] font-mono text-blue-400 leading-relaxed overflow-x-auto whitespace-pre-wrap p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                        {previewCode || 'No code transformed yet.'}
                      </pre>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </main>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
}
