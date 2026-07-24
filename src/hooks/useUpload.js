import { useCallback } from "react";
import { UPLOAD_BASE_URL } from "../config/api";
import { useToast } from "./useToast";

export function useUpload() {
  const { showToast } = useToast();

  const uploadFile = useCallback(
    async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      let res;
      try {
        res = await fetch(`${UPLOAD_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });
      } catch {
        showToast("ارتباط با سرور آپلود برقرار نشد", "error");
        return null;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        showToast(body?.error || "خطا در آپلود فایل", "error");
        return null;
      }

      const { url } = await res.json();
      return url;
    },
    [showToast],
  );

  return { uploadFile };
}
