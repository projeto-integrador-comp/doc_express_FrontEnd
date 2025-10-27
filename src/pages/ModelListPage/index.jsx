import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { ModelList } from "../../components/ModelList";
import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../providers/UserContext";
import { api } from "../../services/api";

// Tipos para os botões
const TIPOS_FILTRO = ["todos", "DOCX", "XLSX", "PDF"];

export const ModelListPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("todos");

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchModels = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("@tokenDocExpress");

        const response = await api.get("/templates", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setModels(response.data);
      } catch (error) {
        console.error("❌ Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [user, navigate]);

  // 🔹 FILTRO 1: Busca (por título/descrição)
  const modelsFilteredBySearch = models.filter((model) => {
    const term = searchTerm.toLowerCase();
    const name = model.name?.toLowerCase() || "";
    const description = model.description?.toLowerCase() || "";
    return name.includes(term) || description.includes(term);
  });

  // 🔹 FILTRO 2: Tipo (DOCX, PDF, XLSX)
  const modelsFilteredByType =
    selectedType === "todos"
      ? modelsFilteredBySearch
      : modelsFilteredBySearch.filter((model) => {
          const fileType = model.fileName
            ? model.fileName.split(".").pop().toLowerCase()
            : "";
          return fileType === selectedType.toLowerCase();
        });

  if (loading) return <div>Carregando modelos...</div>;

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1>Modelos de Documentos</h1>

        {/* 🔸 Campo de busca (independente do tipo) */}
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          {/* 🔸 Botões de tipo */}
          <div className={styles.filterButtons}>
            {TIPOS_FILTRO.map((tipo) => (
              <button
                key={tipo}
                className={`${styles.filterButton} ${
                  selectedType === tipo ? styles.active : ""
                }`}
                onClick={() => setSelectedType(tipo)}
              >
                {tipo === "todos" ? "Todos" : tipo}
              </button>
            ))}
          </div>
        </div>

        {/* 🔸 Exibe a lista filtrada por tipo */}
        <ModelList models={modelsFilteredByType} />
      </div>
    </div>
  );
};
