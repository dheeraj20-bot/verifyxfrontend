import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface PDFViewerProps {
  pdfUrl: string;
}


export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
    console.log(pdfUrl);
    

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6"></CardContent>
      <CardFooter className="flex justify-between items-center">
        <img src={pdfUrl.replace(".pdf",".jpg")} alt="" />
      </CardFooter>
    </Card>
  );
}
