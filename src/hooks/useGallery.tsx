import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type GalleryItem = Tables<"gallery">;

export const useGallery = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    const { data } = await supabase.from("gallery").select("*").order("uploaded_at", { ascending: false });
    if (data) setImages(data);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const addImage = async (item: Partial<GalleryItem>) => {
    const { error } = await supabase.from("gallery").insert({ image_url: item.image_url || "", ...item });
    return { error };
  };

  const deleteImage = async (id: string) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    return { error };
  };

  return { images, loading, addImage, deleteImage, refetch: fetchImages };
};
