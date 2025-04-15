"use client";
import { createContext, ReactNode, useContext, useState } from "react";

type FilterContextType = {
  filter: string;
  setFilter: (f: string) => void;
};

const FilterContext = createContext<FilterContextType>({
  filter: "BodegaDay",
  setFilter: () => {},
});

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState("BodegaDay");

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}
