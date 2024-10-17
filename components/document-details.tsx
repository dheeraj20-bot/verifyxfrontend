"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  ThumbsUp,
} from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import IndicatorsList from "./IndicatorsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PDFViewer from "./pdf-viewer";

export const description = "Document verification details";

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

interface Indicator {
  id: string;
  indicator_id: string;
  category: string;
  title: string;
  description: string;
}
interface Document {
  id: string;
  score: string;
  fileUrl?: string;
  indicators?: Indicator[];
  fileType?: "image" | "pdf";
  name?: string;
  address?: string;
  address_complete?: boolean;
  country_name?: string;
  document_type?: string;
  description_summary?: string;
  createdAt: string;
  status: string;
}

interface DocumentDetailsProps {
  document: Document;
  onBack: () => void;
}

const formatText = (text: string): string => {
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function DocumentDetails({
  document,
  onBack,
}: DocumentDetailsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "preview">("details");

  const getProgressPercentage = (score: string) => {
    switch (score) {
      case "LOW_RISK":
        return 100;
      case "NORMAL":
        return 70;

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

  const renderFilePreview = () => {
    if (document.fileType === "image") {
      return (
        <img src={document?.fileUrl} alt="" className=" w-full object-cover" />
      );
    }

    if (document.fileType === "pdf") {
      return <PDFViewer pdfUrl={document.fileUrl!} />;
    }
  };

  const getStatusIcon = (score: string) => {
    switch (score) {
      case "LOW_RISK":
        return <ThumbsUp className="text-green-500" />;
      case "NORMAL":
        return <ThumbsUp className="text-blue-500" />;
      case "WARNING":
        return <AlertTriangle className="text-yellow-500" />;
      case "HIGH_RISK":
        return <AlertTriangle className="text-red-500" />;
      default:
        return <AlertTriangle className="text-red-500" />;
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-primary">
            Document Verification
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getStatusIcon(document.score)}
            <span className="font-semibold">{formatText(document.score)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as  "details" | "preview")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="">
            <div className="flex flex-col gap-4  ">
              <div className="w-full items-center justify-center  h-full shadow-sm">
                <ChartContainer
                  config={chartConfig}
                  className=" max-h-[200px] w-full"
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

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Document Information
                </h3>

                <div className="flex">
                  <div className="w-full ">
                    <dl className="space-y-2 w-full">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Name
                        </dt>
                        <dd className="flex items-center tex-sm mt-1">
                          {document.name}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Address:
                        </dt>
                        <dd className="flex items-center mt-1">
                          <p>{document.address}  <span> {document.address_complete? "✅":"❌"}</span>  </p>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Country
                        </dt>
                        <dd className="mt-1">
                          {document.country_name}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Document Type
                        </dt>
                        <dd className="mt-1">
                          {document.document_type}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <dl className="space-y-2 w-full">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Document ID:
                      </dt>
                      <dd className="flex items-center tex-sm mt-1">
                        {document.id}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        File Type
                      </dt>
                      <dd className="flex items-center mt-1">
                        {document.fileType === "image" ? (
                          <ImageIcon className="mr-2 h-4 w-4" />
                        ) : (
                          <FileText className="mr-2 h-4 w-4" />
                        )}

                        <p>{document.fileType?.toUpperCase()}</p>
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Created At
                      </dt>
                      <dd className="mt-1">
                        {new Date(document.createdAt).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <div className="bg-muted w-full h-full  rounded-lg">
              {renderFilePreview()}
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-4">Document Summary</h3>
          <p>{document.description_summary}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            Verification Indicators
          </h3>
          {document.indicators && (
            <IndicatorsList indicators={document.indicators} />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Back to List
        </Button>
        <div className="space-x-2">
          <Button variant="destructive">Decline</Button>
          <Button variant="default">Approve</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
