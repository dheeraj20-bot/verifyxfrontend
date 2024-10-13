"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Check, TrendingUp } from "lucide-react";

import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";

export const description = "A donut chart with text";

const chartConfig = {
  progress: {
    label: "Verification Progress",
    color: "hsl(var(--chart-1))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;

interface Document {
  id: string;
  score: string;
  imageUrl:string;
  createdAt: string;
  status: string;
}

interface DocumentDetailsProps {
  document: Document;
  onBack: () => void;
}

export default function DocumentDetails({
  document,
  onBack,
}: DocumentDetailsProps) {


  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "NORMAL":
        return 100;
      case "WARNING":
        return 0;
      default:
        return 0;
    }
  };
  const progress = document ? getProgressPercentage(document.score) : 0;

  const chartData = [
    { name: "progress", value: progress, fill: "var(--color-progress)" },
    {
      name: "remaining",
      value: 100 - progress,
      fill: "var(--color-remaining)",
    },
  ];

  return (
    <>
      <CardHeader>
        <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="flex text-4xl font-bold text-primary items-center">
          Overall Document Score
        </CardTitle>
        <p>Based on risks and opportunities analysis</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className=" w-full  p-4 rounded-md">
           
           <img src={document.imageUrl} width={1000}  height={1000} alt="" />
           
          </div>

          <div className="w-full">
            <ChartContainer
              config={chartConfig}
              className="mx-auto  aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {`${progress}%`}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Verified
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </div>


        
     
        <Separator />

        <div>
          <h3 className="font-semibold mb-2">Forgery Analysis</h3>
          <div className="bg-muted p-4 rounded-md">
            <p>
              The forgery analysis panel provides a comprehensive review of the
              document, highlighting any areas of concern. Red flags indicate
              potential modifications or inconsistencies.
            </p>
          </div>
        </div>
         
      
        
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        <Button variant="destructive">Decline</Button>
        <Button variant="default">Approve</Button>
      </CardFooter>
    </>
  );
}
