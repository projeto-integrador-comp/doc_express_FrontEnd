import { createContext, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";
import { api } from "../../services/api";

export const DocumentContext = createContext({});

const DocumentProvider = ({ children }) => {
  const [hiddenCreateDocument, setHiddenCreateDocument] = useState(true);
  const [editingDocument, setEditingDocument] = useState(null);

  const { documentsList, setDocumentsList } = useContext(UserContext);

  const documentRegister = async (formData, setLoading, reset) => {
    const token = localStorage.getItem("@tokenDocExpress");
    try {
      setLoading(true);
      const { data } = await api.post("/documents", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { id, documentName, note, submissionDate, delivered } = data;

      const newDocumentsList = [
        ...documentsList,
        { id, documentName, note, submissionDate, delivered },
      ];
      setDocumentsList(newDocumentsList);

      reset();
      toast.success("Contato cadastrado");
      setHiddenCreateDocument(true);
    } catch (error) {
      toast.error("Erro ao cadastrar,tente novamente!");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        hiddenCreateDocument,
        setHiddenCreateDocument,
        editingDocument,
        setEditingDocument,
        documentsList,
        setDocumentsList,
        documentRegister,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentProvider;
