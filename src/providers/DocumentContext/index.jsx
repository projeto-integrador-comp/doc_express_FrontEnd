import { createContext, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";
import { api } from "../../services/api";

export const DocumentContext = createContext({});

const DocumentProvider = ({ children }) => {
  const [hiddenCreateDocument, setHiddenCreateDocument] = useState(true);
  const [editingDocument, setEditingDocument] = useState(null);
  const [deletingDocument, setdeletingDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);

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
      toast.success("Documento cadastrado");
      setHiddenCreateDocument(true);
    } catch (error) {
      toast.error("Erro ao cadastrar,tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  const documentUpdate = async (formData, setLoading, id) => {
    const token = localStorage.getItem("@tokenDocExpress");

    try {
      setLoading(true);

      const { data } = await api.patch(`/documents/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newDocumentsList = documentsList.map((document) =>
        document.id === id ? (document = data) : document
      );
      setDocumentsList(newDocumentsList);

      setEditingDocument(null);
      toast.success("Documento atualizado");
    } catch (error) {
      if (error.response?.data.message === "User does not have this document")
        toast.error("documento não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const documentDelete = async (setLoading, id) => {
    const token = localStorage.getItem("@tokenDocExpress");

    try {
      setLoading(true);
      await api.delete(`/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newDocumentsList = documentsList.filter(
        (document) => document.id != id
      );
      setDocumentsList(newDocumentsList);

      setdeletingDocument(null);
      toast.success("Documento deletado");
    } catch (error) {
      if (error.response?.data.message === "User does not have this document")
        toast.error("documento não encontrado");
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
        deletingDocument,
        setdeletingDocument,
        documentsList,
        setDocumentsList,
        documentRegister,
        documentUpdate,
        documentDelete,
        viewingDocument,
        setViewingDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentProvider;
