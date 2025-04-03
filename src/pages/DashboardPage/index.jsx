import styles from "./style.module.scss";
import { useState } from "react";
import DocumentForm from "../../components/DocumentForm/DocumentForm";
import DocumentList from "../../components/DocumentList/DocumentList";

export const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  // Estado para o filtro selecionado (null inicialmente)
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleAddDocument = (newDocument) => {
    setDocuments([...documents, newDocument]);
  };

  // Função para lidar com mudanças nos radio buttons
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  // Filtrar documentos - versão temporária que mostra todos
  const filteredDocuments = [...documents];

  // // Filtrar documentos baseado no radio button selecionado
  // const filteredDocuments = documents.filter(doc => {
  //   // Se nenhum filtro está selecionado, mostra todos
  //   if (!selectedFilter) return true;

  //   // Adicione suas condições de filtro específicas
  //   return doc.tipo === selectedFilter;
  // });

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Cadastrar Documento</h2>
        <DocumentForm onAddDocument={handleAddDocument} />
      </div>

      {/* Div de filtros */}
      <div className={styles.filterContainer}>
        <h3 className={styles.filterTitle}>Filtrar por:</h3>
        <div className={styles.filterOptions}>
          <label>
            <input
              type="radio"
              name="documentFilter"
              value="tipo1"
              checked={selectedFilter === "tipo1"}
              onChange={handleFilterChange}
            />
            Todos
          </label>
          <label>
            <input
              type="radio"
              name="documentFilter"
              value="tipo2"
              checked={selectedFilter === "tipo2"}
              onChange={handleFilterChange}
            />
            Proximos do vencimento
          </label>
          <label>
            <input
              type="radio"
              name="documentFilter"
              value="tipo3"
              checked={selectedFilter === "tipo3"}
              onChange={handleFilterChange}
            />
            Entregues
          </label>
        </div>
      </div>

      <div className={styles.listContainer}>
        <h3 className={styles.subTitle}>Documentos</h3>
        <DocumentList
          documents={filteredDocuments}
          setDocuments={setDocuments}
        />
      </div>
    </div>
  );
};
