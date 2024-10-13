"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DocumentDetails from "@/components/document-details";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for documents
const DocumentStatus = {
  PASSED: "PASSED",
  FAILED: "FAILED",
  PENDING: "PENDING",
};

const documents = [
  
  {
    id: "123456789",
    status: DocumentStatus.PASSED,
    type: "Driving License",
    issuerCountry: "CAN",
    score: "HIGH_RISK",
    fileType: "image/jpeg",
    analysis: {
      time: "2024-10-05T12:24:05.009247+00:00",
      deploymentVersion: "f6b19e0d",
      indicators: [
        {
          indicatorId: "gen_char_pixel_inconsistency",
          type: "RISK",
          category: "modifications",
          title: "Image contains digitally modified characters",
          description:
            "Some of the characters in the image do not comply with the statistics prevalent in the image.",
          origin: "fraud",
        },
        {
          indicatorId: "has_trained_copy_move_regions",
          type: "RISK",
          category: "modifications",
          title: "Copy move or digital insertion",
          description:
            "This image contains regions that are visually identical, indicating potential tampering.",
          origin: "fraud",
        },
        {
          indicatorId: "is_double_saved_jpeg",
          type: "RISK",
          category: "modifications",
          title: "Re-saved JPEG image",
          description:
            "The image was re-saved after creation, potentially indicating modification.",
          origin: "fraud",
        },
        {
          indicatorId: "has_inserted_face_nn",
          type: "RISK",
          category: "modifications",
          title: "Fake document",
          description:
            "The document may have been fabricated using AI-based algorithms, potentially replacing human faces or signatures.",
          origin: "fraud",
        },
      ],
    },
  },
  {
    id: "987654321",
    status: DocumentStatus.FAILED,
    type: "Passport",
    issuerCountry: "USA",
    score: "LOW_RISK",
    fileType: "application/pdf",
    analysis: {
      time: "2024-10-05T12:30:12.103847+00:00",
      deploymentVersion: "f6b19e0d",
      indicators: [],
    },
  },
  {
    id: "456789123",
    status: DocumentStatus.PENDING,
    type: "Credit Card Statement",
    issuerCountry: "IND",
    score: "MEDIUM_RISK",
    fileType: "application/pdf",
    analysis: {
      time: "2024-10-05T13:15:42.239347+00:00",
      deploymentVersion: "f6b19e0d",
      indicators: [
        {
          indicatorId: "gen_char_pixel_inconsistency",
          type: "RISK",
          category: "modifications",
          title: "Image contains digitally modified characters",
          description:
            "Certain characters may have been altered in the document.",
          origin: "fraud",
        },
      ],
    },
  },
];

export default function DocumentDashboard() {
  const [selectedDoc, setSelectedDoc] = useState<(typeof documents)[0] | null>(
    null
  );

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
                  <TableHead >Issuer Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, index) => (
                  <TableRow
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`cursor-pointer hover:bg-slate-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <TableCell className="font-medium w-[10rem] items-center
                     justify-center flex  gap-3">
                      <img src="/pdf.png" alt="" width={50} height={50}/>
                      {doc.id}


                    </TableCell>
                    <TableCell>{doc.status}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell >
                      {doc.issuerCountry}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex-1 m-4 overflow-hidden">
        {selectedDoc ? (
          <DocumentDetails document={selectedDoc} onBack={() => setSelectedDoc(null)} />
        ) : (
          <CardContent className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Select a document to view details</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
