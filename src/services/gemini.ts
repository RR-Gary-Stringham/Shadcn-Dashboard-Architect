import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateDashboardComponent(description: string, imageBase64?: string) {
  const contents: any[] = [
    {
      role: "user",
      parts: [
        {
          text: `
You are a master React developer specializing in shadcn/ui and Recharts.
Your task is to generate a high-quality, professional, and fully functional React component for a dashboard based on the user's description and optional reference image.

I am following the "shadcn-ui" skill guidelines for this environment.

AVAILABLE COMPONENTS (Do NOT import or export):
- UI: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge, Input, Textarea, Tabs, TabsList, TabsTrigger, TabsContent, Skeleton, ScrollArea, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption, Progress, Avatar, AvatarImage, AvatarFallback, Separator, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, Calendar, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Checkbox, Collapsible, CollapsibleTrigger, CollapsibleContent, Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup, Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup, HoverCard, HoverCardTrigger, HoverCardContent, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, Label, Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut, MenubarGroup, MenubarPortal, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarRadioGroup, MenubarCheckboxItem, MenubarRadioItem, MenubarLabel, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, Popover, PopoverTrigger, PopoverContent, RadioGroup, RadioGroupItem, ResizablePanelGroup, ResizablePanel, ResizableHandle, Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, Slider, Switch, Toggle, ToggleGroup, ToggleGroupItem, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, Alert, AlertTitle, AlertDescription, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AspectRatio, toast, cn
- Charts: ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle
- Recharts: BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, Legend
- Icons: All Lucide icons (Search, Home, TrendingUp, TrendingDown, ArrowUp, ArrowDown, etc.)

Rules:
1. Name it 'DashboardComponent'. ABSOLUTELY NO 'import' or 'export' keywords. The result must be a single self-contained function.
2. ALL components and icons listed below are ALREADY in the global scope. You MUST use them directly by name (e.g., <Card />, <Separator />) instead of raw <div>s where possible.
3. Visual Fidelity (CRITICAL): Replicate the reference image EXACTLY. 
   - Vertical Dividers: Use the <Separator orientation="vertical" /> component with 'h-full' and 'border-dashed'.
   - Column Balance: For the 3-column visitor breakdown, use 'flex-1' or 'grid-cols-3' to ensure equal width distribution.
   - Typography: Use 'font-bold tracking-tighter' for large metric numbers. Use 'font-mono' for secondary technical values.
   - Icons: If the image shows arrows (like in the bottom row), use Lucide icons like <TrendingUp />, <TrendingDown />, or <MoveUpRight />.
4. Craftsmanship: 
   - Use 'text-muted-foreground' for subtext.
   - Use 'border-opacity' or light background colors (e.g., 'bg-emerald-500/10') for highlighting.
   - Match the color palette of the image: if it's dark navy/emerald, use those specific Tailwind colors.
5. Charts: Use 'ChartContainer' with a 'config' object. Use Recharts components (BarChart, Bar, etc.) if a chart is visible.
6. Responsive: Always use 'w-full' and ensure layout stacks on mobile if it's too wide.

User Description: "${description}"
${imageBase64 ? "CRITICAL: A reference image has been provided. Match the layout, visual balance, and component positioning perfectly. Pay special attention to vertical lines, alignment of labels, and the visual weight of different elements." : ""}

Output Format:
\`\`\`tsx
// Define chartData and chartConfig constants here
const chartData = [ ... ];
const chartConfig = { ... };

const DashboardComponent = () => {
  // Component logic here
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Title</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Chart or Data view here */}
        </CardContent>
      </Card>
    </div>
  );
};
\`\`\`

\`\`\`json
{
  "name": "dashboard-component",
  "type": "registry:ui",
  "dependencies": ["recharts", "lucide-react"],
  "files": [
    {
      "path": "components/dashboard-component.tsx",
      "type": "registry:ui"
    }
  ]
}
\`\`\`
`
        }
      ]
    }
  ];

  if (imageBase64) {
    contents[0].parts.push({
      inlineData: {
        data: imageBase64.split(',')[1], // Remove prefix like "data:image/png;base64,"
        mimeType: imageBase64.match(/data:(.*?);/)?.[1] || "image/png"
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash", // Use a multimodal model
    contents: contents,
  });

  return response.text;
}
