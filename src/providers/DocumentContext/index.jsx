import { createContext, useState, useContext } from "react";
import { UserContext } from "../UserContext";

export const DocumentContext = createContext({});

const DocumentProvider = ({ children }) => {
  const [hiddenCreateDocument, setHiddenCreateDocument] = useState(true);
  const [editingDocument, setEditingDocument] = useState(null);

  const { documentsList, setDocumentsList } = useContext(UserContext);

  return (
    <DocumentContext.Provider
      value={{
        hiddenCreateDocument,
        setHiddenCreateDocument,
        editingDocument,
        setEditingDocument,
        documentsList,
        setDocumentsList,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentProvider;
