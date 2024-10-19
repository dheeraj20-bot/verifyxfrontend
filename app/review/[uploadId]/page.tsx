import DocumentDashboard from "@/components/document-dashboard";
import DocumentStats from "@/components/DocumentStats";



interface ReviewPageProps {
  params:{
      uploadId:string;
  }
}

export default function ReviewPage({params}:ReviewPageProps) {
  console.log(params.uploadId);
  
  return (
    <main className="py-5">
        <DocumentStats uploadId={params.uploadId} />
        <DocumentDashboard   uploadId={params.uploadId} />
    </main>
  )
}