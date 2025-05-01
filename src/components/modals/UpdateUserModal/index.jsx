import { useContext } from "react";
import { UpdateUserForm } from "../../forms/UpdateUserForm";
import styles from "./style.module.scss";
import { UserContext } from "../../../providers/UserContext";

export const UpdateUserModal = () => {
  const { setHiddenUpdateUser } = useContext(UserContext);
  return (
    <div role="dialog" className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <UpdateUserForm />
        <button
          className={styles.closeButton}
          onClick={() => setHiddenUpdateUser(true)}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
