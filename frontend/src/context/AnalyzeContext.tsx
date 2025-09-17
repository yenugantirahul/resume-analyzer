import { createContext } from "react";

const AnalyzeContext = createContext(undefined);

export const AnalyzeProvider = ({ children }) => {
  return <AnalyzeContext.Provider value={}></AnalyzeContext.Provider>;
};
