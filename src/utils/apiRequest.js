import { API_BASE_URL } from "../config/api";
import { getFetchErrorMessage } from "./fetchErrorMessage";

export async function apiRequest(path, options) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error(getFetchErrorMessage());
  }
  if (!res.ok) throw new Error(getFetchErrorMessage(res.status));
  if (res.status === 204) return null;
  return res.json();
}
