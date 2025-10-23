// providers/ModelContext.jsx
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const ModelContext = createContext({});

export const ModelProvider = ({ children }) => {
  const [viewingModel, setViewingModel] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para carregar os modelos (se você ainda não tiver)
  const loadModels = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/templates`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@tokenDocExpress")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar modelos");
      }

      const modelsData = await response.json();
      setModels(modelsData);
    } catch (error) {
      console.error("Erro ao carregar modelos:", error);
      toast.error("Erro ao carregar modelos");
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar um modelo
  const updateModel = (modelId, updatedData) => {
    setModels((prevModels) =>
      prevModels.map((model) =>
        model.id === modelId ? { ...model, ...updatedData } : model
      )
    );

    // Atualiza o modelo sendo visualizado se for o mesmo
    setViewingModel((prev) =>
      prev && prev.id === modelId ? { ...prev, ...updatedData } : prev
    );
  };

  // Função para deletar um modelo
  const deleteModel = (modelId) => {
    setModels((prevModels) =>
      prevModels.filter((model) => model.id !== modelId)
    );

    // Fecha o modal se o modelo sendo visualizado for o mesmo
    if (viewingModel && viewingModel.id === modelId) {
      setViewingModel(null);
    }
  };

  // Carrega os modelos quando o provider é montado (opcional)
  useEffect(() => {
    loadModels();
  }, []);

  return (
    <ModelContext.Provider
      value={{
        viewingModel,
        setViewingModel,
        models,
        setModels,
        updateModel,
        deleteModel,
        loadModels, // Adiciona a função para recarregar
        loading,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};
