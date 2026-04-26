import { useContext } from "react";
import { UpdateUserForm } from "../../forms/UpdateUserForm";
import styles from "./style.module.scss";
import { UserContext } from "../../../providers/UserContext";

export const UpdateUserModal = () => {
  // 1. Pegamos o 'updatingUser' e o 'setUpdatingUser' do contexto
  const { updatingUser, setUpdatingUser } = useContext(UserContext);

  // 2. Se não houver um usuário sendo editado, o modal não renderiza
  if (!updatingUser) return null;

  return (
    <div role="dialog" className={styles.modalOverlay}>
      <div className={styles.modalBox}> {/* Mudei para modalBox para bater com seu SCSS */}
        <header className={styles.header}>
          <h2 className="title three">Atualizar Colaborador</h2>
          <button 
            className={styles.closeBtn} 
            onClick={() => setUpdatingUser(null)} // 3. Para fechar, setamos como null
          >
            X
          </button>
        </header>

        <UpdateUserForm />

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => setUpdatingUser(null)} // 4. Aqui também usamos o null
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
};