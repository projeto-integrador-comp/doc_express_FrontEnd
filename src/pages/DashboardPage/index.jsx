import styles from "./style.module.scss";
import { useState } from "react";
import DocumentForm from "../../components/DocumentForm/DocumentForm";
import DocumentList from "../../components/DocumentList/DocumentList";
import Header from "../../components/Header/Header";

export const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddDocument = (newDoc) => {
    setDocuments([...documents, newDoc]);
    closeModal();
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const filteredDocuments =
    selectedFilter === "tipo2"
      ? // ? documents.filter((doc) => new Date(doc.date) >= new Date())
        documents.filter((doc) => {
          const docDate = new Date(doc.date);
          docDate.setHours(0, 0, 0, 0); // zera a hora da data do doc

          const today = new Date();
          today.setHours(0, 0, 0, 0); // zera a hora de hoje

          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(today.getDate() + 7);
          sevenDaysFromNow.setHours(0, 0, 0, 0); // zera a hora do futuro

          return docDate >= today && docDate <= sevenDaysFromNow;
        })
      : selectedFilter === "tipo3"
      ? documents.filter((doc) => doc.checked)
      : documents;

  return (
    <div className={styles.container}>
      <Header onOpenModal={openModal} />

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.title}>Cadastrar Documento</h2>
            <DocumentForm onAddDocument={handleAddDocument} />
            <button className={styles.closeButton} onClick={closeModal}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Div de filtros */}
      <fieldset>
        {/* <h3 className={styles.filterTitle}>Filtro</h3> */}
        <div className={styles.filterContainer}>
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
              Próximos do vencimento
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
      </fieldset>

      {/* Lista de documentos */}
      <div className={styles.listContainer}>
        <fieldset>
          <legend>
            <h3 className={styles.subTitle}>Documentos Cadastrados</h3>
          </legend>
          <DocumentList
            documents={filteredDocuments}
            setDocuments={setDocuments}
          />
        </fieldset>
      </div>
    </div>
  );
};
