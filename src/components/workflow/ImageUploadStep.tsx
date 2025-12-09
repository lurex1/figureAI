import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadStepProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  isAnalyzing: boolean;
}

export function ImageUploadStep({ onUpload, isUploading, isAnalyzing }: ImageUploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file));
        setSelectedFile(file);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleProceed = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const isLoading = isUploading || isAnalyzing;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Photo</h2>
        <p className="text-muted-foreground">
          Upload a clear photo to transform it into a 3D model
        </p>
      </div>

      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          isLoading && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!preview && (
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
        )}

        <div className="flex flex-col items-center justify-center min-h-[200px]">
          {preview ? (
            <div className="relative w-full">
              {/* Clear button */}
              {!isLoading && (
                <button
                  onClick={handleClear}
                  className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg"
                  title="Usuń zdjęcie"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg object-contain"
              />
              
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      {isUploading ? "Uploading..." : "Analyzing image..."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground font-medium mb-1">
                Drag and drop your image here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse
              </p>
              <Button variant="outline" disabled={isLoading}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Select Image
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Action buttons when image is selected */}
      {preview && !isLoading && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Change Photo
          </Button>
          <Button onClick={handleProceed} className="flex-1">
            Analyze Image
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-2">Supported Model Types:</h3>
        <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Human Heads (front + side)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Buildings & Architecture
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Animals (full body)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Objects & Items
          </li>
        </ul>
      </div>
    </div>
  );
}
