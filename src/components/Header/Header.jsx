import { useContext, useState, useEffect } from "react";
import styles from "./Header.module.scss";
import { DocumentContext } from "../../providers/DocumentContext";

const Header = () => {
  const { setHiddenCreateDocument } = useContext(DocumentContext);
  const [isMobile, setIsMobile] = useState(false);

  // Função para detectar se a tela é pequena
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  // Verifica quando a página carrega e quando a tela é redimensionada
  useEffect(() => {
    handleResize(); // Checa na primeira vez
    window.addEventListener("resize", handleResize); // Atualiza se mudar o tamanho
    return () => window.removeEventListener("resize", handleResize); // Limpa evento
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.logo}>DocExpress</h1>

        <button
          className={styles.addButton}
          onClick={() => setHiddenCreateDocument(false)}
        >
          {isMobile ? "☰" : "Cadastrar Documento"}
        </button>
      </div>
    </header>
  );
};

export default Header;
