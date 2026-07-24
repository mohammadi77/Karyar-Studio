import { useContext } from "react";
import { DataContext } from "../contexts/dataContextObject";

export function useAppData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useAppData باید داخل DataProvider استفاده شود");
  }
  return context;
}
