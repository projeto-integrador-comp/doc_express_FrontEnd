import { createContext, useState } from "react";

export const ModelContext = createContext({});

export const ModelProvider = ({ children }) => {
  const [viewingModel, setViewingModel] = useState(null);

  return (
    <ModelContext.Provider
      value={{
        viewingModel,
        setViewingModel,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};
