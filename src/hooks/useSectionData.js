import { useAppData } from "./useAppData";

export function useSectionData(key, fallback = null) {
  const { data, loading, errors } = useAppData();
  return {
    data: data[key] ?? fallback,
    loading,
    error: errors[key] ?? null,
  };
}
