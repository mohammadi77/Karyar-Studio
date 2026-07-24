import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL, RESOURCE_KEYS } from "../config/api";
import { DataContext } from "./dataContextObject";
import { useToast } from "../hooks/useToast";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import { getFetchErrorMessage } from "../utils/fetchErrorMessage";

const MIN_LOADING_MS = 3000;

async function fetchResource(key) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/${key}`);
  } catch {
    throw new Error(getFetchErrorMessage());
  }
  if (!res.ok) throw new Error(getFetchErrorMessage(res.status));
  return res.json();
}

export function DataProvider({ children }) {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const refreshKey = useCallback(
    async (key) => {
      try {
        const value = await fetchResource(key);
        setData((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      } catch (err) {
        const message = err.message || getFetchErrorMessage();
        setErrors((prev) => ({ ...prev, [key]: message }));
        showToast(message, "error");
      }
    },
    [showToast],
  );

  useEffect(() => {
    let cancelled = false;
    const startTime = Date.now();

    const fetchAll = async () => {
      const results = await Promise.allSettled(
        RESOURCE_KEYS.map((key) => fetchResource(key)),
      );

      if (cancelled) return;

      const nextData = {};
      const nextErrors = {};
      results.forEach((result, index) => {
        const key = RESOURCE_KEYS[index];
        if (result.status === "fulfilled") {
          nextData[key] = result.value;
        } else {
          nextErrors[key] =
            result.reason?.message || getFetchErrorMessage();
        }
      });

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

      setTimeout(() => {
        if (cancelled) return;
        setData(nextData);
        setErrors(nextErrors);
        setLoading(false);
        // یک toast به‌ازای هر پیام خطای یکتا (نه یکی برای هر بخش) تا خطاهای مشابه تکراری نمایش داده نشوند
        const uniqueMessages = [...new Set(Object.values(nextErrors))];
        uniqueMessages.forEach((message) => showToast(message, "error"));
      }, remaining);
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const hasErrors = Object.keys(errors).length > 0;
  if (hasErrors) {
    return <div style={{ minHeight: "100vh", background: "#fff" }} />;
  }

  return (
    <DataContext.Provider value={{ data, loading, errors, refreshKey }}>
      {children}
    </DataContext.Provider>
  );
}
