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
Your task is to generate a high-quality React component for a dashboard based on the user's description and optional reference image.

Rules:
1. Use functional components and hooks.
2. Use Tailwind CSS for styling.
3. Use icons from 'lucide-react'.
4. If a chart is requested, use the shadcn/ui chart library pattern:
   - Use 'ChartContainer', 'ChartTooltip', 'ChartTooltipContent', 'ChartLegend', 'ChartLegendContent' from '@/components/ui/chart'.
   - Use Recharts primitives (Bar, BarChart, Line, LineChart, Pie, PieChart, Area, AreaChart, XAxis, YAxis, CartesianGrid, etc.).
   - Define 'chartData' as a constant.
   - Define 'chartConfig' which describes the labels and colors for the data.
5. The component MUST be named 'DashboardComponent' explicitly.
6. MANDATORY: Do NOT use the 'export' keyword at all. No 'export default', no 'export const'.
7. MANDATORY: Do NOT use the 'import' keyword at all. Assume dependencies are globally available.
8. MANDATORY: Do NOT use the 'satisfies' keyword or complex TypeScript features.
9. The component should be self-contained with mock data inside the file.
10. Response must be ONLY the TypeScript code in the first block, followed by a separate block for 'registry.json' content.

User Description: "${description}"
${imageBase64 ? "A reference image has been provided. Try to match the visual style, colors, and layout shown in the image while using the technical requirements above." : ""}

Output Format:
\`\`\`tsx
// Component code here
// IMPORTANT: Name it DashboardComponent.
// NO EXPORTS. NO IMPORTS.
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
