import { useState, useRef } from "react";
import { Upload, File, CheckCircle, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "./button";

interface FileUploadProps {
  folder: "profile-photos" | "government-ids" | "resumes" | "medical-certs";
  accept: string;
  maxSizeMB: number;
  label: string;
  required?: boolean;
  onUploadComplete?: (url: string) => void;
}

const FileUpload = ({
  folder,
  accept,
  maxSizeMB,
  label,
  required = false,
  onUploadComplete,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${folder}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("player-files")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // Bucket is private — create a long-lived signed URL (10 years) for sharing.
      const { data: signed, error: signedError } = await supabase.storage
        .from("player-files")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10);

      if (signedError) throw signedError;

      const url = signed?.signedUrl ?? "";
      setUploadedFile(url);
      onUploadComplete?.(url);

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || !!uploadedFile}
      />

      {!uploadedFile ? (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-input/30"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
          ) : (
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground mb-1">
            {uploading ? "Uploading..." : `Click to upload ${label}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {accept.split(",").join(", ").toUpperCase()} (max {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">{fileName}</p>
                <p className="text-xs text-muted-foreground">Upload successful</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
