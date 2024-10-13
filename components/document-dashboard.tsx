"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DocumentDetails from "@/components/document-details";
import axios from "axios";



import { Button } from "./ui/button";

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
  // console.log(documents);

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

      // console.log(response.data.data);
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
          <ScrollArea className="h-[calc(100vh-200px)] w-full">
            <div className="grid grid-cols-2 gap-4 p-4">
              {documents.map((doc, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2  mb-2">
                      <div className="bg-primary/10 py-2 px-2">
                        <img
                          src={doc.imageUrl}
                          alt={`Document ${doc.id}`}
                          className="  w-32 h-32 object-cover"
                        />
                      </div>

                      <span className="text-sm w-full">{doc.id}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-2 ml-24 flex justify-between ">
                    <p>{doc.score}</p>
                    <Button className=" rounded-lg bg-primary text-white">
                      Review
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
