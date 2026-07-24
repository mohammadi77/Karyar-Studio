import { useCallback } from "react";
import { apiRequest } from "../utils/apiRequest";
import { useAppData } from "./useAppData";
import { useToast } from "./useToast";
import { getFetchErrorMessage } from "../utils/fetchErrorMessage";

export function useResourceApi() {
  const { refreshKey } = useAppData();
  const { showToast } = useToast();

  const updateResource = useCallback(
    async (key, patch) => {
      try {
        const resource = await apiRequest(`/${key}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        await refreshKey(key);
        return resource;
      } catch (err) {
        showToast(err.message || getFetchErrorMessage(), "error");
        return null;
      }
    },
    [refreshKey, showToast],
  );

  return { updateResource };
}
