import styles from "./style.module.scss";
import { useContext, useState } from "react";
import Header from "../../components/Header/Header";
import { DocumentContext } from "../../providers/DocumentContext";
import { RegisterDocumentModal } from "../../components/modals/RegisterDocumentModal";
import { DocumentList } from "../../components/DocumentList/index.jsx";
import { UpdateDocumentModal } from "../../components/modals/UpdateDocumentModal/index.jsx";

export const DashboardPage = () => {
  const {
    hiddenCreateDocument,
    editingDocument,
    documentsList,
    setDocumentsList,
  } = useContext(DocumentContext);

  const [selectedFilter, setSelectedFilter] = useState(null);

  const [docToDelete, setDocToDelete] = useState(null);

  const confirmDelete = () => {
    setDocumentsList((prev) => prev.filter((d) => d !== docToDelete));
    setDocToDelete(null);
  };

  const cancelDelete = () => {
    setDocToDelete(null);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const filteredDocuments =
    selectedFilter === "tipo2"
      ? documentsList.filter((doc) => {
          const docDate = new Date(doc.submissionDate);
          docDate.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const fifteenDaysFromNow = new Date();
          fifteenDaysFromNow.setDate(today.getDate() + 15);
          fifteenDaysFromNow.setHours(0, 0, 0, 0);

          return (
            !doc.delivered && // <-- aqui garante que ele não esteja finalizado
            docDate >= today &&
            docDate <= fifteenDaysFromNow
          );
        })
      : selectedFilter === "tipo3"
      ? documentsList.filter((doc) => doc.delivered)
      : selectedFilter === "tipo4"
      ? documentsList.filter((doc) => {
          const docDate = new Date(doc.submissionDate);
          const today = new Date();

          docDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          return docDate < today && !doc.delivered;
        })
      : documentsList;

  return (
    <div className={styles.container}>
      <Header />
      {!hiddenCreateDocument && <RegisterDocumentModal />}
      {editingDocument && <UpdateDocumentModal />}

      {docToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Deseja realmente excluir "{docToDelete.name}"?</h3>
            <div className={styles.buttonGroup}>
              <button onClick={confirmDelete} className={styles.closeButton}>
                Sim, excluir
              </button>
              <button onClick={cancelDelete} className={styles.openButton}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <fieldset>
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
              Próximos do vencimento (15 dias)
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
            <label>
              <input
                type="radio"
                name="documentFilter"
                value="tipo4"
                checked={selectedFilter === "tipo4"}
                onChange={handleFilterChange}
              />
              Vencidos (não entregues)
            </label>
          </div>
        </div>
      </fieldset>

      <div className={styles.listContainer}>
        <fieldset>
          <legend>
            <h3 className={styles.subTitle}>Documentos Cadastrados</h3>
          </legend>
          <DocumentList documents={filteredDocuments} />
        </fieldset>
      </div>
    </div>
  );
};
