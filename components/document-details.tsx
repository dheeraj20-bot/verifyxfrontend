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
  status: string;
  type: string;
  issuerCountry: string;
}

interface DocumentDetailsProps {
  document: Document;
  onBack: () => void;
}

export default function DocumentDetails({
  document,
  onBack,
}: DocumentDetailsProps) {

  const googleViewerUrl = "https://drive.google.com/viewerng/viewer?embedded=true&url=https://www.drishtiias.com/images/pdf/NCERT-Class-10-History.pdf";

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "PASSED":
        return 100;
      case "PENDING":
        return 70;
      default:
        return 0;
    }
  };
  const progress = document ? getProgressPercentage(document.status) : 0;

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
            <h4 className=" text-3xl font-bold">
              {" "}
              {`${progress}%`}{" "}
              <span className="text-yellow-400">-Neutral 😐</span>{" "}
            </h4>
            <div className="  px-2 mt-5 py-3 rounded-lg">
              <div className="flex mb-5 justify-between">
                <p>Verified</p>
                <p>{`${progress}%`}</p>
              </div>
              <div className="flex justify-between">
                <p>Risks</p>
                <p>{`${100- progress}%`}</p>
              </div>
            </div>
            <p className="mt-5 w-full">
              This score represents the overall favorability of the document
              based on the identified risks and opportunities.
            </p>
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
          <h3 className="font-semibold mb-2">Classification Details</h3>
          <div className="bg-muted p-4 rounded-md">
            <p>Document Type: {document.type}</p>
            <p>Issuer: {document.issuerCountry}</p>
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="font-semibold mb-2">Document Preview</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Resolution",
              "Blur Level",
              "Quality Status",
              "Document Type",
              "Issuer",
              "Country of Origin",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between bg-muted p-2 rounded-md"
              >
                <span>{item}</span>
                <Check className="h-4 w-4 text-green-500" />
              </div>
            ))}
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
         
        <iframe
      src={googleViewerUrl}
      width="100%"
      height="600"
      style={{ border: 'none' }}
      allowFullScreen
    />
        
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        <Button variant="destructive">Decline</Button>
        <Button variant="default">Approve</Button>
      </CardFooter>
    </>
  );
}
