import { useCallback } from "react";
import { apiRequest } from "../utils/apiRequest";
import { useAppData } from "./useAppData";
import { useToast } from "./useToast";
import { getFetchErrorMessage } from "../utils/fetchErrorMessage";

export function useIconLibraryApi() {
  const { refreshKey } = useAppData();
  const { showToast } = useToast();

  const createIcon = useCallback(
    async ({ name, url }) => {
      try {
        const icon = await apiRequest("/iconLibrary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, url }),
        });
        await refreshKey("iconLibrary");
        return icon;
      } catch (err) {
        showToast(err.message || getFetchErrorMessage(), "error");
        return null;
      }
    },
    [refreshKey, showToast],
  );

  const deleteIcon = useCallback(
    async (id) => {
      try {
        await apiRequest(`/iconLibrary/${id}`, { method: "DELETE" });
        await refreshKey("iconLibrary");
        return true;
      } catch (err) {
        showToast(err.message || getFetchErrorMessage(), "error");
        return false;
      }
    },
    [refreshKey, showToast],
  );

  return { createIcon, deleteIcon };
}
