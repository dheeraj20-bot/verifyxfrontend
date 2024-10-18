"use client";

import { useState } from 'react'
import { CalendarIcon, DownloadIcon, FilterIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as XLSX from 'xlsx'

export default function RiskDashboard() {
  const [dateRange, setDateRange] = useState('This Month')

  const documents = [
    { id: 'DOC001', score: 'HIGH RISK', assignedTo: 'John Doe', summary: 'Suspicious financial activity detected' },
    { id: 'DOC002', score: 'NORMAL', assignedTo: 'Jane Smith', summary: 'Regular quarterly report' },
    { id: 'DOC003', score: 'WARNING', assignedTo: 'Mike Johnson', summary: 'Potential compliance issue identified' },
    { id: 'DOC004', score: 'HIGH RISK', assignedTo: 'Emily Brown', summary: 'Unauthorized access attempt logged' },
    { id: 'DOC005', score: 'NORMAL', assignedTo: 'Chris Lee', summary: 'Standard operational review' },
  ]

  const getScoreColor = (score:string) => {
    switch (score) {
      case 'HIGH RISK':
        return 'bg-red-100 text-red-800'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800'
      case 'NORMAL':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(documents)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Documents")
    XLSX.writeFile(wb, "document_risk_assessment.xlsx")
  }

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(documents)
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "document_risk_assessment.csv")
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className='flex flex-col space-y-3'> 
        <h2 className="text-4xl  font-bold">Hi John 👋</h2>
        <h1 className="text-3xl text-primary font-bold">Risk Management Dashboard</h1>
        </div>
       
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="This Year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm   font-medium">High Risk Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-500 font-bold">42</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Normal Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,103</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Document Risk Assessment</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Select onValueChange={(value) => value === 'excel' ? exportToExcel() : exportToCSV()}>
              <SelectTrigger className="w-[140px]">
                <DownloadIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Export</SelectItem>
                <SelectItem value="excel">Export Excel</SelectItem>
                <SelectItem value="csv">Export CSV</SelectItem>
               
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document ID</TableHead>
              <TableHead>Document Score</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Document Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.id}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(doc.score)}`}>
                    {doc.score}
                  </span>
                </TableCell>
                <TableCell>{doc.assignedTo}</TableCell>
                <TableCell>{doc.summary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}