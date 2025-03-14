"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "../styles/globals.css";

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResponse(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResponse(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-20">
      <CardHeader>
        <CardTitle>Hi Jack, Here's Your API</CardTitle>
        <CardDescription>
          Upload a PDF file and see the API response
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select PDF File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="flex-1"
                disabled={isLoading}
              />
              {file && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={resetForm}
                  disabled={isLoading}>
                  <FileText className="h-4 w-4" />
                </Button>
              )}
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {response && (
            <div className="mt-4">
              <Label>
                API Response from{" "}
                <span className="font-mono">
                  POST: {window.location.href}api/upload
                </span>
              </Label>
              <div className="p-3 bg-muted rounded-md mt-1 overflow-auto max-h-60">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
              <div className="mt-4">
                You're going to have to do the work to actually find interesting
                insights from the document!
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isLoading}>
            Reset
          </Button>
          <Button type="submit" disabled={isLoading || !file}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
