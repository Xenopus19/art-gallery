import { trpc } from "../trpc";

const useUploadImage = () => {
  const getUrlMutation = trpc.image.getImageUploadUrl.useMutation();

  const uploadImage = async (image: File) => {
    try {
      const { key, url } = await getUrlMutation.mutateAsync({
        fileName: image.name,
        fileType: image.type,
      });

      const response  = await fetch(url, {
        method: "PUT",
        body: image,
        headers: { "Content-Type": image.type },
      });

      if(!response.ok)
      {
        throw new Error(`Error uploading an image ${response.statusText}`)
      }

      return key;
    } catch (error) {
        console.error(error)
        throw error
    }
  };

  return { uploadImage };
};

export default useUploadImage;
