import { useCallback } from "react";
import { apiRequest } from "../utils/apiRequest";
import { useAppData } from "./useAppData";
import { useToast } from "./useToast";
import { getFetchErrorMessage } from "../utils/fetchErrorMessage";

export function usePagesApi() {
  const { refreshKey } = useAppData();
  const { showToast } = useToast();

  const createPage = useCallback(
    async ({ name, slug }) => {
      try {
        const page = await apiRequest("/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, slug, sections: [], enabled: true }),
        });
        await refreshKey("pages");
        return page;
      } catch (err) {
        showToast(err.message || getFetchErrorMessage(), "error");
        return null;
      }
    },
    [refreshKey, showToast],
  );

  const updatePage = useCallback(
    async (id, patch) => {
      try {
        const page = await apiRequest(`/pages/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        await refreshKey("pages");
        return page;
      } catch (err) {
        showToast(err.message || getFetchErrorMessage(), "error");
        return null;
      }
    },
    [refreshKey, showToast],
  );

  const deletePage = useCallback(
    async (id) => {
      try {
        await apiRequest(`/pages/${id}`, { method: "DELETE" });
        await refreshKey("pages");
        return true;
      } catch (err) {
        showToast(err.message || getFetchErrorMessage(), "error");
        return false;
      }
    },
    [refreshKey, showToast],
  );

  return { createPage, updatePage, deletePage };
}
