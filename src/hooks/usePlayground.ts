import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Point } from "framer-motion";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { LayoutTemplate, PostData } from "@/app/Components/Ui/PostCard"; // Adjust path as needed
import { FormData } from "@/app/Components/layout/Playground";

interface UsePlaygroundProps {
  generatedPost: PostData | null;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return { width: size[0], height: size[1] };
};

export const usePlayground = ({ generatedPost }: UsePlaygroundProps) => {
  const [formData, setFormData] = useState<FormData>({
    brandTone: "💼 Friendly & Professional",
    postText: "",
    logoFile: null,
    imageFile: null,
  });
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] =
    useState<LayoutTemplate>("default");
  const [displayContent, setDisplayContent] = useState<PostData>({
    headline: "",
    body: "",
    hashtags: [],
  });
  const [logoPosition, setLogoPosition] = useState<Point>({ x: 5, y: 5 });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const finalCanvasRef = useRef<HTMLDivElement>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null!);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (generatedPost) {
      setDisplayContent(generatedPost);
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [generatedPost]);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "logo" | "image"
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      [type === "logo" ? "logoFile" : "imageFile"]: file,
    }));
    if (file) {
      const base64 = await fileToBase64(file);
      if (type === "logo") {
        setLogoBase64(base64);
        setLogoPosition({ x: 5, y: 5 }); // Reset position on new logo
      } else {
        setImageBase64(base64);
      }
    } else {
      if (type === "logo") setLogoBase64(null);
      else setImageBase64(null);
    }
  };

  const handleRemoveFile = (type: "logo" | "image") => {
    setFormData((prev) => ({
      ...prev,
      [type === "logo" ? "logoFile" : "imageFile"]: null,
    }));
    if (type === "logo") setLogoBase64(null);
    else setImageBase64(null);
  };

  const handleDownload = async () => {
    if (!finalCanvasRef.current)
      return toast.error("Final output canvas not found.");
    const toastId = toast.loading("Generating your high-res image...");
    try {
      const dataUrl = await toPng(finalCanvasRef.current, {
        cacheBust: true,
        pixelRatio: 1,
      });
      const link = document.createElement("a");
      link.download = `partyhub-post-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Download started!", { id: toastId });
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to create image. Please try again.", { id: toastId });
    }
  };

  const isFormComplete = !!(formData.imageFile && formData.postText.trim());

  return {
    formData,
    setFormData,
    imageBase64,
    logoBase64,
    activeTemplate,
    setActiveTemplate,
    displayContent,
    logoPosition,
    setLogoPosition,
    isPreviewModalOpen,
    setIsPreviewModalOpen,
    showConfetti,
    width,
    height,
    finalCanvasRef,
    dragConstraintsRef,
    handleFileChange,
    handleRemoveFile,
    handleDownload,
    isFormComplete,
  };
};
