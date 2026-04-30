
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface MoodBoardImage {
  id: string;
  file?: File;
  preview: string;
  storageId?: string;
  uploaded: boolean;
  uploading: boolean;
  error?: string;
  url?: string;
  isFromServer?: boolean;
}

interface StylesFormData {
  images: MoodBoardImage[];
}

export const useMoodBoard = (guideImages: MoodBoardImage[]) => {
  const [dragActive, setDragActive] = useState(false);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const isLocalProject = !projectId || projectId.startsWith("local-");

  const form = useForm<StylesFormData>({
    defaultValues: {
      images: [],
    },
  });

  const { watch, setValue, getValues } = form;
  const images = watch("images");
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const uploadImage = useCallback(async (
    file: File
  ): Promise<{ storageId: string; url?: string }> => {
    return { storageId: `local-${Date.now()}` };
  }, []);

  useEffect(() => {
    if (guideImages && guideImages.length > 0) {
      const serverImages: MoodBoardImage[] = guideImages.map((img) => ({
        id: img.id,
        preview: img.url || img.preview,
        storageId: img.storageId,
        uploaded: true,
        uploading: false,
        url: img.url,
        isFromServer: true,
      }));
      const currentImages = getValues("images");

      if (currentImages.length === 0) {
        setValue("images", serverImages);
      } else {
        const mergedImages = [...currentImages];
        serverImages.forEach((serverImg) => {
          const clientIndex = mergedImages.findIndex(
            (clientImg) => clientImg.storageId === serverImg.storageId
          );

          if (clientIndex !== -1) {
            if (mergedImages[clientIndex].preview.startsWith("blob:")) {
              URL.revokeObjectURL(mergedImages[clientIndex].preview);
            }

            mergedImages[clientIndex] = serverImg;
          }
        });
        setValue("images", mergedImages);
      }
    }
  }, [guideImages, setValue, getValues]);

  const addImage = (file: File) => {
    const newImage: MoodBoardImage = {
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      uploaded: isLocalProject,
      uploading: false,
      isFromServer: false,
    };

    const updatedImages = [...images, newImage];

    setValue("images", updatedImages);

    toast.success("Image added to mood board");
  };

  const removeImage = async (imageId: string) => {
    const imageToRemove = images.find((img) => img.id === imageId);
    if (!imageToRemove) return;

    const updatedImages = images.filter((img) => {
      if (img.id === imageId) {
        if (!img.isFromServer && img.preview.startsWith("blob:")) {
          URL.revokeObjectURL(img.preview);
        }
        return false;
      }
      return true;
    });

    setValue("images", updatedImages);
    toast.success("Image removed from mood board");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("Please upload image files");
      return;
    }

    imageFiles.forEach((file) => {
      if (images.length < 5) {
        addImage(file);
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => addImage(file));

    e.target.value = "";
  };

  useEffect(() => {
    const uploadPendingImages = async () => {
      const currentImages = getValues("images");
      for (let i = 0; i < currentImages.length; i++) {
        const image = currentImages[i];
        if (!image.uploaded && !image.uploading && !image.error) {
          const updatedImages = [...currentImages];
          updatedImages[i] = { ...image, uploading: true };
          setValue("images", updatedImages);
          try {
            const { storageId } = await uploadImage(image.file!);

            const finalImages = getValues("images");
            const finalIndex = finalImages.findIndex(
              (img) => img.id === image.id
            );

            if (finalIndex !== -1) {
              finalImages[finalIndex] = {
                ...finalImages[finalIndex],
                storageId,
                uploaded: true,
                uploading: false,
                isFromServer: true,
              };
              setValue("images", [...finalImages]);
              toast.success("Image uploaded to server");
            }
          } catch (error) {
            console.error(error);
            const errorImages = getValues("images");
            const errorIndex = errorImages.findIndex(
              (img) => img.id === image.id
            );
            if (errorIndex !== -1) {
              errorImages[errorIndex] = {
                ...errorImages[errorIndex],
                uploading: false,
                error: "Upload failed",
              };
              setValue("images", [...errorImages]);
            }
          }
        }
      }
    };

    if (images.length > 0) {
      uploadPendingImages();
    }
  }, [images, setValue, getValues, uploadImage]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);


  return {
    form,
    images,
    dragActive,
    addImage,
    removeImage,
    handleDrag,
    handleDrop,
    handleFileInput,
    canAddMore: true,
  }

};
