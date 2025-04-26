import { useContext } from "react";
import styles from "./Header.module.scss";
import { DocumentContext } from "../../providers/DocumentContext";

const Header = () => {
  const { setHiddenCreateDocument } = useContext(DocumentContext);
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.logo}>DocExpress</h1>
        <button
          className={styles.addButton}
          onClick={() => setHiddenCreateDocument(false)}
        >
          Cadastrar Documento
        </button>
      </div>
    </header>
  );
};

export default Header;
