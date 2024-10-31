"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { DownloadIcon, FilterIcon, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

export default function RiskDashboard() {
  const [uploads, setUploads] = useState([]); // state to store fetched data
  console.log(uploads);

  const router = useRouter();

  // Fetch the data from the API
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const response = await axios.get(
          "http://18.144.125.218:5000/api/documents/dashboard"
        );
        setUploads(response.data); // Set the data from the API
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUploads();
  }, []);

  // Function to export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(uploads);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Documents");
    XLSX.writeFile(wb, "document_risk_assessment.xlsx");
  };

  // Function to export data to CSV
  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(uploads);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "document_risk_assessment.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col space-y-3">
          <h2 className="text-4xl font-bold">Hi John 👋</h2>
          <h1 className="text-2xl text-primary font-bold">
            Welcome to Fraud Fabric Dashboard
          </h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Example of dynamic data rendering */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uploads.length}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Risk Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-500 font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Warning Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Normal Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        {/* Add more cards here if needed */}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Document Risk Assessment
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Select
              onValueChange={(value) =>
                value === "excel" ? exportToExcel() : exportToCSV()
              }
            >
              <SelectTrigger className="w-[140px]">
                <DownloadIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Export Excel</SelectItem>
                <SelectItem value="csv">Export CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="font-semibold ">Upload ID</TableHead>
              <TableHead>Assigned to</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Status</TableHead>

              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploads.map((upload: any) => (
              <TableRow key={upload.uploadId}>
                <TableCell>UPID{upload.uploadId}</TableCell>
                <TableCell>{upload.assignedTo}</TableCell>
                <TableCell>{upload.documentCount}</TableCell>
                <TableCell>
                  <span
                    className={`${
                      upload.overallStatus === "HIGH RISK"
                        ? " bg-red-100 text-red-500"
                        : "text-green-500 bg-green-100"
                    } px-3 py-1 font-semibold rounded-2xl`}
                  >
                    {upload.overallStatus}
                  </span>
                </TableCell>

                <TableCell>
                  {new Date(upload.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <SquareArrowOutUpRight
                    className="h-5 text-primary cursor-pointer w-5"
                    onClick={() => router.push(`/review/${upload.uploadId}`)}
                  >
                    View More
                  </SquareArrowOutUpRight>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
