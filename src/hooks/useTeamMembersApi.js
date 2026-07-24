import { useCallback } from "react";
import { apiRequest } from "../utils/apiRequest";
import { useAppData } from "./useAppData";
import { useToast } from "./useToast";
import { getFetchErrorMessage } from "../utils/fetchErrorMessage";

export function useTeamMembersApi() {
  const { refreshKey } = useAppData();
  const { showToast } = useToast();

  const createTeamMember = useCallback(
    async ({ name, role, image, active }) => {
      try {
        const member = await apiRequest("/teamMembers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, role, image, active: active !== false }),
        });
        await refreshKey("teamMembers");
        return member;
      } catch (err) {
        showToast(err.message || getFetchErrorMessage(), "error");
        return null;
      }
    },
    [refreshKey, showToast],
  );

  const updateTeamMember = useCallback(
    async (id, patch) => {
      try {
        const member = await apiRequest(`/teamMembers/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        await refreshKey("teamMembers");
        return member;
      } catch (err) {
        showToast(err.message || getFetchErrorMessage(), "error");
        return null;
      }
    },
    [refreshKey, showToast],
  );

  const deleteTeamMember = useCallback(
    async (id) => {
      try {
        await apiRequest(`/teamMembers/${id}`, { method: "DELETE" });
        await refreshKey("teamMembers");
        return true;
      } catch (err) {
        showToast(err.message || getFetchErrorMessage(), "error");
        return false;
      }
    },
    [refreshKey, showToast],
  );

  return { createTeamMember, updateTeamMember, deleteTeamMember };
}
