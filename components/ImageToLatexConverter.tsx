"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, X, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ImageToLatexConverter() {
  const [isDragging, setIsDragging] = useState(false);
  const [latex, setLatex] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers remain the same
  const processImage = async (file: File) => {
    try {
      setError("");
      setIsLoading(true);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/latex", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert image");
      }

      const data = await response.json();
      setLatex(data.latex);
    } catch (err) {
      setError("Error converting image to LaTeX. Please try again.");
      console.error("Conversion error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await processImage(file);
    } else {
      setError("Please upload an image file.");
    }
  };

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await processImage(file);
    } else {
      setError("Please upload an image file.");
    }
  };

  const handleClearImage = () => {
    setImagePreview("");
    setLatex("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <main className="antialiased min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
        <div className="relative w-full">
          {/* Background gradient effect */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-0 h-96 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 opacity-15"
            style={{
              backgroundImage: "radial-gradient(#A4A4A3, transparent 50%)",
            }}
          />

          {/* Grid pattern background */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full stroke-gray-400/80 opacity-50 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="grid-pattern"
                width="200"
                height="200"
                x="50%"
                y="-1"
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y="-1" className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#grid-pattern)"
            />
          </svg>

          {/* Main content */}
          <div className="mx-auto max-w-7xl pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <p className="font-light rounded-xl bg-gray-200/80 px-4 py-1 text-sm text-gray-800">
                  Powered by{" "}
                  <a
                    className="font-semibold"
                    href="https://www.npmjs.com/package/llama-latex"
                    target="_blank"
                  >
                    llama-latex
                  </a>{" "}
                  &{" "}
                  <a
                    className="font-semibold"
                    href="https://www.together.ai/"
                    target="_blank"
                  >
                    Together AI
                  </a>
                </p>
                <a
                  href="https://github.com/minor/llama-latex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-200/80 px-4 py-1 text-sm text-gray-800 hover:bg-gray-300/80 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
              <h1 className="text-5xl font-medium mb-4 !font-sans">
                Convert{" "}
                <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 text-transparent bg-clip-text">
                  mathematical
                </span>{" "}
                images to{" "}
                <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 text-transparent bg-clip-text">
                  LaTeX
                </span>
                .
              </h1>
              <p className="text-lg sm:text-xl font-normal !font-sans max-w-xl mx-auto text-center text-gray-600">
                Ever want to convert your hand-written images of mathematical
                formulas into LaTeX code? Convert images into LaTeX code with
                just <span className="!font-semibold">one click</span>. Perfect
                for students, researchers, and educators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card className="w-full h-full">
                <CardHeader>
                  <CardTitle className="font-semibold">Image:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className={`relative border-2 border-dotted rounded-lg p-8 text-center transition-colors h-full min-h-64 flex items-center justify-center ${
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-gray-200"
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="relative w-full">
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute -top-2 -right-2 rounded-full"
                          onClick={handleClearImage}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Clear image</span>
                        </Button>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full max-h-64 mx-auto rounded object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4">
                        <Upload className="w-12 h-12 text-gray-400" />
                        <h3 className="font-medium">Upload an image</h3>
                        <p className="text-sm text-gray-500">
                          or drag and drop
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInput}
                          className="hidden"
                          id="file-upload"
                          ref={fileInputRef}
                        />
                        <Button asChild>
                          <label htmlFor="file-upload">Select File</label>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Code snippet */}
                  <div className="border-t-2 border-dotted pt-4">
                    <span className="font-semibold">Code:</span>
                    <pre className="mt-2 bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                      <span className="text-purple-600">import</span> {"{"}{" "}
                      img2latex {"}"}{" "}
                      <span className="text-purple-600">from</span>{" "}
                      <span className="text-green-600">
                        &apos;llama-latex&apos;
                      </span>
                      ;{"\n\n"}
                      <span className="text-purple-600">const</span> latex ={" "}
                      <span className="text-purple-600">await</span> img2latex(
                      {"{\n"} filePath:{" "}
                      <span className="text-green-600">
                        &apos;./markov_chains.jpg&apos;
                      </span>
                      ,{"\n "}apiKey: process.env.TOGETHER_API_KEY {"\n}"});
                    </pre>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm text-center mt-2">
                      {error}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* LaTeX Output Section */}
              <Card className="w-full h-full">
                <CardHeader>
                  <CardTitle className="font-semibold">
                    Generated LaTeX:
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-4rem)]">
                  <div className="min-h-64 p-4 bg-white rounded-lg border border-gray-200 h-full">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      </div>
                    ) : latex ? (
                      <pre className="font-mono text-sm break-all whitespace-pre-wrap h-full">
                        {latex}
                      </pre>
                    ) : (
                      <div className="text-gray-400 text-center h-full flex items-center justify-center">
                        Upload an image to see the LaTeX code here
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="font-light font-sans">
            <span className="font-medium">Note:</span> llama-latex is heavily
            inspired by{" "}
            <a
              href="https://x.com/nutlope"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 underline underline-offset-2"
            >
              @nutlope
            </a>
            &apos;s{" "}
            <a
              href="https://llamaocr.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 underline underline-offset-2"
            >
              llama-ocr
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
