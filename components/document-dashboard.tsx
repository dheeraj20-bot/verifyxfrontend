"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DocumentDetails from "@/components/document-details";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for documents

 type DocumentListItem = {
  id: string;
  score: string;
  status: string;
  imageUrl: string;
  createdAt: string;
};


export default function DocumentDashboard() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "https://verifybackend.onrender.com/api/documents/submissions"
      );

      console.log(response.data.data);
      

      setDocuments(response.data.data);
    } catch (err) {
      setError("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col sm:flex-row h-full">
      <Card
        className={`${
          selectedDoc ? "hidden md:block" : ""
        } flex-1 m-4 overflow-hidden`}
      >
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-primary">
            Document List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className=" text-center">Document ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Issuer Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, index) => (
                  <TableRow
                    key={index}
                    
                    className={`cursor-pointer hover:bg-slate-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <TableCell
                      className="font-medium w-[10rem] items-center
                     justify-center flex  gap-3"
                    >
                      <img src={doc.imageUrl} alt="" width={50} height={50} />
                      {doc.id}
                    </TableCell>
                    <TableCell>{doc.score}</TableCell>
                    <TableCell>{doc.status}</TableCell>
                    <TableCell>{doc.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex-1 m-4 overflow-hidden">
        {selectedDoc ? (
          // <DocumentDetails
          //   document={selectedDoc}
          //   onBack={() => setSelectedDoc(null)}
          // />
          <p>hi</p>
        ) : (
          <CardContent className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              Select a document to view details
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
