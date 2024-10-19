"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Upload } from "lucide-react";
import { redirect } from "next/navigation";
// import Image from "next/image";

// Custom Zod schema for File type
const FileSchema = z.custom<File>((v) => v instanceof File, {
  message: "Must be a File object",
});

const schema = z.object({
  documents: z
    .array(FileSchema)
    .min(1, { message: "At least one file is required" }),
});

type FormData = z.infer<typeof schema>;

export default function DocumentUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [analysisResponse, setAnalysisResponse] = useState<any | null>(null); // State to store the response

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      documents: [],
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...acceptedFiles];
      setValue("documents", newFiles);
      return newFiles;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: true,
  });

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file !== fileToRemove);
      setValue("documents", newFiles);
      return newFiles;
    });
  };

  const onSubmit = async (data: FormData) => {
    setUploadProgress(0);
    setUploadStatus(null);

    const formData = new FormData();
    data.documents.forEach((document, index) => {
      formData.append("documents", document); // Field name must match backend (documents)
    });

    try {
      setLoading(true);
      const response = await axios.post(
        "https://verifybackend.onrender.com/api/documents/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setLoading(false);
      setAnalysisResponse(response.data);
      redirect(`/review/${response.data.uploadId}`);
       // Store the response in the state
    } catch (error) {
        setError("Something Went Wrong!")
      console.error("Upload error:", error);
    }finally{
      setLoading(false);
    }

    setFiles([]);
    setValue("documents", []);
  };

  return (
    <Card className="w-full bg-white rounded-lg max-w-md h-full px-2 mx-auto">
      <CardHeader>
        <CardTitle>Upload Documents for Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer"
            role="button"
            aria-label="Drag and drop files or click to select files"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag and drop files here, or click to select files</p>
            )}
            <Upload className="mx-auto mt-2" aria-hidden="true" />
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: PDF, JPEG, PNG
            </p>
          </div>

          {errors.documents && (
            <p className="text-red-500 text-sm" role="alert">
              {errors.documents.message}
            </p>
          )}

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="space-y-2">
              <Progress
                value={uploadProgress}
                className="w-full"
                aria-label={`Upload progress: ${uploadProgress}%`}
              />
              <p className="text-sm text-center">{uploadProgress}% uploaded</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={files.length === 0 || loading}
          >
            {loading ? (
              <p>Scanning Documents...</p>
            ) : (
              <p>Submit for Verification</p>
            )}
          </Button>

          {
            error && (
              <p>{error}</p>
            )
          }

          {/* Display the analysis response if available */}
            <div>
              {analysisResponse && (
                <div>
                  <h2>Analysis Response</h2>
                   <div> 
                    {analysisResponse.map((data:any)=>(
                       <div key={data.id}>
                        {data.score}
                        {/* <img src={data.imageUrl} alt="" width={1000} height={1000} className="rounded-md" /> */}
                       </div>
                    ))}
                     
                   </div>
                </div>
              )}
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
