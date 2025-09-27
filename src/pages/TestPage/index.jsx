import { useState, useContext } from "react";
import styles from "./style.module.scss";

// Importe os contextos necessários
import { DocumentContext } from "../../providers/DocumentContext";
import { UserContext } from "../../providers/UserContext";

// Importe TODOS os modais que você quer testar
import { DeleteConfirmationModal } from "../../components/modals/DeleteConfirmationModal";
import { ModelDetailsModal } from "../../components/modals/ModelDetailsModal";
import { RegisterDocumentModal } from "../../components/modals/RegisterDocumentModal";
import { UpdateDocumentModal } from "../../components/modals/UpdateDocumentModal";
// Adicione imports para outros modais se necessário (UpdateUser, DeleteUser, etc.)

export const ModalsTestPage = () => {
  // --- Estado para feedback na tela ---
  const [lastAction, setLastAction] = useState("Nenhuma ação executada.");

  // --- Lógica para o DeleteConfirmationModal (controlado por estado local) ---
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const handleConfirmAction = () => {
    setLastAction("Ação de DELEÇÃO confirmada!");
    console.log("Ação de DELEÇÃO confirmada!");
    setIsConfirmOpen(false);
  };

  // --- Lógica para os Modais controlados por Contexto ---
  const {
    setViewingDocument,
    setHiddenCreateDocument,
    setEditingDocument,
    documentsList, // Pegamos a lista para ter um documento real para editar/ver
  } = useContext(DocumentContext);
  
  // Crie um documento falso para o Modal de Detalhes
  const mockDocument = {
    title: "Documento Falso de Teste",
    description: "Esta é uma descrição para o documento de teste.",
    submissionDate: new Date().toISOString(),
    delivered: Math.random() < 0.5, // Aleatoriamente entregue ou não
    fileUrl: "#",
  };

  const handleOpenDetails = () => {
    setLastAction("Abrindo modal de DETALHES...");
    setViewingDocument(mockDocument);
  };

  const handleOpenRegister = () => {
    setLastAction("Abrindo modal de REGISTRO...");
    setHiddenCreateDocument(false);
  };
  
  const handleOpenUpdate = () => {
    setLastAction(`Abrindo modal de UPDATE para: ${mockDocument.title}`);
    setEditingDocument(mockDocument);
  }

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Oficina de Modais</h1>
          <p>Clique nos botões abaixo para abrir e testar cada modal.</p>
        </header>

        <div className={styles.feedback}>
          <strong>Última Ação:</strong> {lastAction}
        </div>

        <main className={styles.buttonGrid}>
          {/* Botão para o Modal Genérico */}
          <button className={styles.testButton} onClick={() => setIsConfirmOpen(true)}>
            Abrir Confirmação de Exclusão
          </button>

          {/* Botões para os Modais de Contexto */}
          <button className={styles.testButton} onClick={handleOpenDetails}>
            Abrir Detalhes do Documento
          </button>
          
          <button className={styles.testButton} onClick={handleOpenRegister}>
            Abrir Cadastro de Documento
          </button>
          
          <button className={styles.testButton} onClick={handleOpenUpdate}>
            Abrir Edição de Documento
          </button>
          
          {/* Adicione mais botões aqui para outros modais */}
        </main>
      </div>

      {/* --- Renderização de todos os modais --- */}
      {/* Eles ficam aqui "escondidos" esperando o estado ou contexto correto para aparecerem */}
      
      <DeleteConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title="Você está na Página de Teste"
        message="Tem certeza que deseja executar esta ação de confirmação?"
      />
      
      <ModelDetailsModal />
      
      <RegisterDocumentModal />
      
      <UpdateDocumentModal />
      
    </>
  );
};