import styles from "./style.module.scss";

/*
  Este é um modal de confirmação genérico.
  Ele não sabe o que está confirmando, apenas exibe a mensagem
  e chama as funções que recebe via props.

  Props que ele espera receber:
  - isOpen: (boolean) Se for true, o modal aparece. Se for false, ele não renderiza.
  - onClose: (função) Chamada quando o usuário clica no "X" ou no botão "Cancelar".
  - onConfirm: (função) Chamada quando o usuário clica no botão principal de confirmação (ex: "Excluir").
  - title: (string) O texto que aparece no cabeçalho do modal.
  - message: (string) A pergunta ou mensagem de confirmação no corpo do modal.
*/
export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  // Se a prop 'isOpen' for false, o componente não renderiza nada.
  if (!isOpen) {
    return null;
  }

  return (
    <div role="dialog" aria-modal="true" className={styles.modalOverlay}>
      <div className={styles.modalContent} aria-labelledby="modal-title">
        <header className={styles.modalHeader}>
          {/* O título agora vem de uma prop */}
          <h2 id="modal-title">{title}</h2>
          {/* O botão de fechar agora usa a função 'onClose' da prop */}
          <button onClick={onClose} className={styles.closeButton} aria-label="Fechar modal">
            &times;
          </button>
        </header>

        <main className={styles.modalBody}>
          {/* A mensagem de confirmação agora vem de uma prop */}
          <p>{message}</p>
        </main>

        <footer className={styles.modalFooter}>
          {/* Botão de Cancelar: executa a função onClose */}
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          {/* Botão de Confirmar: executa a função onConfirm e tem um estilo diferente para indicar perigo */}
          <button onClick={onConfirm} className={styles.confirmButton}>
            Confirmar Exclusão
          </button>
        </footer>
      </div>
    </div>
  );
};