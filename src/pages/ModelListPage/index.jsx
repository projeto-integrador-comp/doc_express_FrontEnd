import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { ModelList } from "../../components/ModelList";
import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../providers/UserContext";
import { ModelContext } from "../../providers/ModelContext";

const TIPOS_FILTRO = ["todos", "DOCX", "XLSX", "PDF"];

export const ModelListPage = () => {
  const { models, loading, loadModels } = useContext(ModelContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("todos");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // SEMPRE carrega os modelos quando o usuário acessa a página
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
