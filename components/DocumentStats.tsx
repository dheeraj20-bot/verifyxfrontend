"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, X, Check } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

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
  addressentity: {
    documentType: string;
    address: string;
    address_complete: boolean;
    name: string;
  }[];
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
          `http://localhost:5000/api/documents/${uploadId}/stats`
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-4">
      <Card className="w-full rounded-3xl">
        <CardHeader>
          <CardTitle className="text-4xl text-primary font-bold">
            Verification Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-4">
            <div className="space-y-6">
              <div>
                <div className="text-lg font-semibold flex items-center">
                  Upload ID: {uploadId}
                </div>
                <div className="text-lg font-semibold flex items-center">
                  Overall Status: {formatText(stats.overallStatus)}
                </div>
                <div>
                  Based on the analysis of {stats.stats.totalDocuments}{" "}
                  documents
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

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl text-primary font-bold">
            Integrity Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Document Type</TableHead>
                <TableHead className="w-1/4">Name</TableHead>
                <TableHead className="w-1/2">Address</TableHead>
                <TableHead className="w-1/4">Address Validation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.addressentity.map((doc, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <TableCell className="font-medium  capitaliz ">
                    {doc.documentType
                      ? doc.documentType === null
                        ? "Not Found"
                        : doc.documentType
                      : "Not Found"}
                  </TableCell>
                  <TableCell className="font-medium  ">
                    {doc.name
                      ? doc.name === null ||
                        doc.name === "null" ||
                        doc.name === "NULL"
                        ? "Not Found"
                        : doc.name
                      : "Not Found"}
                  </TableCell>
                  <TableCell>
                    {doc.address ? doc.address : "Not Found"}{" "}
                  </TableCell>
                  <TableCell>
                    {doc.address_complete ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <X className="w-6 h-6 text-red-500" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div
            className={`${
              stats.isConsistent.addressConsistent
                ? "bg-green-50"
                : "bg-yellow-50"
            } mt-6 p-4 border rounded-[0.8rem]  flex items-center gap-2`}
          >
            {stats.isConsistent.addressConsistent ? (
              <Check className="text-green-700 w-4 h-4" />
            ) : (
              <AlertTriangle className="text-yellow-700 w-4 h-4" />
            )}

            <span className="font-medium ">
              {stats.isConsistent.addressConsistent
                ? "All addresses are consistent across documents."
                : "Addresses are not consistent across all documents."}
            </span>
          </div>
          <div
            className={`${
              stats.isConsistent.nameConsistent ? "bg-green-50" : "bg-yellow-50"
            } mt-6 p-4 border rounded-[0.8rem]  flex items-center gap-2`}
          >
            {stats.isConsistent.addressConsistent ? (
              <Check className="text-green-700 w-4 h-4" />
            ) : (
              <AlertTriangle className="text-yellow-700 w-4 h-4" />
            )}

            <span className="font-medium ">
              {stats.isConsistent.nameConsistent
                ? "All Names are consistent across documents."
                : "Names are not consistent across all documents."}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
