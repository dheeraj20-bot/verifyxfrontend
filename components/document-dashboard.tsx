"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import moment from "moment"; // Assuming you have moment.js installed

import { ScrollArea } from "@/components/ui/scroll-area";
import DocumentDetails from "@/components/document-details";
import axios from "axios";

import { Button } from "./ui/button";

// Mock data for documents
interface Indicator {
  id: string;
  indicator_id: string;
  category: string;
  title: string;
  description: string;
}

type DocumentListItem = {
  id: string;
  score: string;
  status: string;
  fileUrl: string;
  fileType: "image" | "pdf";
  createdAt: string;
  indicators?: Indicator[];
};

export default function DocumentDashboard() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  // console.log(documents);

  const [selectedDoc, setSelectedDoc] = useState<DocumentListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/documents/submissions"
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
        className={`${selectedDoc ? "hidden md:block" : ""} flex-1 m-4  h-full`}
      >
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-primary">
            Document List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-100px)] w-full">
            <div className="flex flex-col h-full  w-full gap-4 p-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="overflow-hidden  rounded-xl shadow-lg border border-slate-700/10"
                >
                  <div className="p-4">
                    <div className="flex items-center  gap-5  mb-2">
                      <div className="bg-primary/10  overflow-hidden  rounded-[0.60rem] ">
                        {doc.fileType === "image" ? (
                          <img
                            src={doc.fileUrl}
                            alt={`Document ${doc.id}`}
                            className="   w-60 h-40 object-cover hover:scale-110  transition-transform duration-300"
                          />
                        ) : (
                          <img
                            src="/pdf.webp"
                            alt={`Document ${doc.id}`}
                            className="w-60 h-40  "
                          />
                        )}
                      </div>

                      <div className="flex flex-col px-5  flex-1 space-y-10 ">
                        <div>
                          <p className="text-sm">
                            <strong className=" text-slate-800 mr-4">
                              Document ID:
                            </strong>
                            {doc.id.substring(0, 10)}
                          </p>
                          <p className="text-sm">
                            <strong className=" text-slate-800 mr-4">
                              Uploaded on:
                            </strong>
                            {moment(doc.createdAt).format("MM/DD/YYYY")}
                          </p>
                        </div>

                        <div className="flex  justify-between items-center   ">
                          <p
                            className={`${
                              doc.score === "WARNING"
                                ? " text-red-400"
                                : doc.score === "NORMAL"
                                ? " text-green-400"
                                : " text-slate-700"
                            } text-sm `}
                          >
                            <strong className="text-sm text-slate-800 mr-4">
                              Score:
                            </strong>
                            {doc.score}
                          </p>
                          <Button
                            onClick={() => setSelectedDoc(doc)}
                            className=" rounded-[0.60rem] bg-primary text-white"
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex-1 m-4 overflow-hidden">
        {selectedDoc ? (
          <DocumentDetails
            document={selectedDoc}
            onBack={() => setSelectedDoc(null)}
          />
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
