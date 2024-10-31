"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import { ScrollArea } from "@/components/ui/scroll-area";
import DocumentDetails from "@/components/document-details";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  name?: string;
  address_complete?: boolean;
  address?: string;
  country_name?: string;
  document_type?: string;
  description_summary?: string;
  indicators?: Indicator[];
};

const formatText = (text: string): string => {
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function DocumentDashboard({ uploadId }: { uploadId: string }) {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [uploadId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://18.144.125.218:5000/api/documents/${uploadId}`
      );
      setDocuments(response?.data?.documentSubmissions || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentDetails = async (documentId: string) => {
    try {
      setDetailsLoading(true);
      const response = await axios.get(
        `http://18.144.125.218:5000/api/documents/${documentId}/details`
      );
      setSelectedDoc(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch document details");
    } finally {
      setDetailsLoading(false);
    }
  };

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <main className="flex flex-col">
      <div className="flex flex-row h-full">
        <Card
          className={`${
            selectedDoc ? "hidden md:block" : ""
          } flex-1 m-4 h-full`}
        >
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-primary">
              Document List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col h-full w-full gap-4 p-4">
                <Skeleton className="h-[12rem] w-full rounded-xl" />
                <Skeleton className="h-[10rem] w-full rounded-xl" />
                <Skeleton className="h-[10rem] w-full rounded-xl" />
              </div>
            ) : documents.length === 0 ? (
              <div className="flex justify-center items-center h-[30rem]">
                <h3 className="text-xl text-primary/90 font-semibold">
                  No Documents Found
                </h3>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-100px)] w-full">
                <div className="flex flex-col h-full w-full gap-4 p-4">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl shadow-lg border border-slate-700/10"
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-5 mb-2">
                          <div className="bg-primary/10 overflow-hidden rounded-[0.60rem]">
                            {doc.fileType === "image" ? (
                              <img
                                src={doc.fileUrl}
                                alt={`Document ${doc.id}`}
                                className="w-60 h-40 object-cover hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <img
                                src="/pdf.webp"
                                alt={`Document ${doc.id}`}
                                className="w-60 h-40"
                              />
                            )}
                          </div>
                          <div className="flex flex-col px-5 flex-1 space-y-10">
                            <div>
                              <p className="text-sm">
                                <strong className="text-slate-800 mr-4">
                                  Document ID:
                                </strong>
                                {doc.id.substring(0, 10)}
                              </p>
                              <p className="text-sm">
                                <strong className="text-slate-800 mr-4">
                                  Uploaded on:
                                </strong>
                                {moment(doc.createdAt).format("MM/DD/YYYY")}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p
                                className={`${
                                  doc.score === "HIGH_RISK"
                                    ? "text-red-700 bg-red-500/40"
                                    : doc.score === "TRUSTED"
                                    ? "text-green-700 bg-green-500/40"
                                    : doc.score === "NORMAL"
                                    ? "text-blue-700 bg-blue-500/40"
                                    : "text-yellow-700 bg-yellow-500/40"
                                } text-xs font-semibold px-2 py-1 rounded-full inline-block`}
                              >
                                {formatText(doc.score)}
                              </p>
                              <Button
                                onClick={() => fetchDocumentDetails(doc.id)}
                                className="rounded-[0.60rem] bg-primary text-white"
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
            )}
          </CardContent>
        </Card>
        <Card className="flex-1 m-4 overflow-hidden">
          {detailsLoading ? (
            <CardContent className="h-full flex items-center justify-center">
              <Skeleton className="h-[80%] w-full rounded-xl" />
            </CardContent>
          ) : selectedDoc ? (
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
    </main>
  );
}
