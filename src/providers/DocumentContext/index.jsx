import { createContext, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";
import { api } from "../../services/api";

export const DocumentContext = createContext({});

export const DocumentProvider = ({ children }) => {
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
