"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BadgeCheck,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Loader2,
  X,
  Check,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Skeleton } from "./ui/skeleton";

interface DocumentStats {
  stats: {
    highRisk: number;
    warning: number;
    normal: number;
    trusted: number;
    totalDocuments: number;
  };
  overallStatus: string;
  isConsistent: {
    nameConsistent: boolean;
    addressConsistent: boolean;
  };
}

const colorMap = {
  highRisk: "#ef4444",
  warning: "#f59e0b",
  normal: "#3b82f6",
  trusted: "#22c55e",
};

const formatText = (text: string): string => {
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function DocumentStats({ uploadId }: { uploadId: string }) {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  console.log(stats?.stats);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://verifybackend.onrender.com/api/documents/${uploadId}/stats`
        );
        setStats(response.data);
        console.log(response.data);

        setError(null);
      } catch (err) {
        console.error("Error fetching document stats:", err);
        setError("Failed to fetch document statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [uploadId]);

  if (loading) {
    return <Skeleton className="w-full p-6 h-[20rem]  rounded-xl " />;
  }

  if (error || !stats) {
    return (
      <Card className="w-full m-4">
        <CardContent className="p-6">
          something went wrong ! Refresh the Page
        </CardContent>
      </Card>
    );
  }

  const data = [
    {
      name: "High Risk",
      value: stats.stats.highRisk,
      color: colorMap.highRisk,
    },
    { name: "Warning", value: stats.stats.warning, color: colorMap.warning },
    { name: "Normal", value: stats.stats.normal, color: colorMap.normal },
    { name: "Trusted", value: stats.stats.trusted, color: colorMap.trusted },
  ];

  return (
    <Card className="w-full rounded-3xl">
      <CardHeader>
        <CardTitle className="text-4xl text-primary font-bold">
          Documents Verification Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-4">
          <div className="space-y-6">
            <div>
              <div className="text-lg font-semibold flex items-center">
                Overall Status: {formatText(stats.overallStatus)}
              </div>
              <div>
                Based on the analysis of {stats.stats.totalDocuments} documents
              </div>
            </div>

            <div className="space-y-2 w-full">
              {data.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center max-w-sm justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2`}
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col space-y-2">
              {stats.isConsistent.nameConsistent===true ? (
                <p className="text-green-500 flex items-center gap-x-2">
                  {" "}
                  <Check className=" w-4 x-4 inline-block" /> Name field is same
                  in all documents
                </p>
              ) : (
                <p className="text-red-500 flex items-center gap-x-2">
                  {" "}
                  <X className=" w-4 x-4 inline-block" /> Name field is not same
                  in all documents
                </p>
              )}
              {
                stats.isConsistent.addressConsistent===true ? (
                    <p className="text-green-500 flex items-center gap-x-2">
                    {" "}
                    <Check className=" w-4 x-4 inline-block" /> Address field is same
                    in all documents
                  </p>
                ):(
                    <p className="text-red-500 flex items-center gap-x-2">
                    {" "}
                    <X className=" w-4 x-4 inline-block" /> Address field is not same
                    in all documents
                  </p>
                )
              }
            </div>
            <div></div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
