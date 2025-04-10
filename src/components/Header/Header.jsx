import styles from "./Header.module.scss";

const Header = ({ onOpenModal }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.logo}>DocExpress</h1>
        <button className={styles.addButton} onClick={onOpenModal}>
          Cadastrar Documento
        </button>
      </div>
    </header>
  );
};

export default Header;
