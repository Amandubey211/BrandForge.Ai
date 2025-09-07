import { useState } from "react";
import { fileToJpegBase64 } from "@/utils/fileUtils";
import { PostData } from "@/app/Components/Ui/PostCard";
import { FormData } from "@/app/Components/layout/Playground";

export const usePostGeneration = () => {
  const [generatedPost, setGeneratedPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const generatePost = async (formData: FormData, brandColor: string) => {
    if (!formData.imageFile || !formData.postText.trim()) {
      setError("Please provide an image and a core message.");
      return;
    }
    setError("");
    setIsLoading(true);
    setGeneratedPost(null);

    try {
      const base64Image = await fileToJpegBase64(formData.imageFile);
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postText: formData.postText,
          brandTone: formData.brandTone,
          brandColor: brandColor,
          base64Image: base64Image.split(",")[1], // Send only the base64 part
          mimeType: "image/jpeg",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setGeneratedPost(data.generatedPost);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generatedPost,
    isLoading,
    error,
    generatePost,
  };
};
