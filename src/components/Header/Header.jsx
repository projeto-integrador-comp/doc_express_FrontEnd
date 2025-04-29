import { useContext, useState, useRef, useEffect } from "react";
import styles from "./Header.module.scss";
import { DocumentContext } from "../../providers/DocumentContext";
import { RxHamburgerMenu, RxChevronDown } from "react-icons/rx";
import { UserContext } from "../../providers/UserContext";

const Header = () => {
  const { setHiddenCreateDocument } = useContext(DocumentContext);
  const { user, setDeletingUser } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // Referência para o menu

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Fecha o menu se clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.logo}>DocExpress</h1>

        <div className={styles.menuContainer} ref={menuRef}>
          <button className={styles.menuButton} onClick={toggleMenu}>
            {!menuOpen ? <RxHamburgerMenu /> : <RxChevronDown />}
          </button>

          {menuOpen && (
            <nav className={styles.menu}>
              <ul>
                {/* <li>
                  <button onClick={() => {
                    setHiddenCreateDocument(false);
                    setMenuOpen(false);
                  }}>
                    ➕ Cadastrar Documento
                  </button>
                </li> */}
                <li>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                  >
                    Atualizar Conta
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setDeletingUser(user);
                      setMenuOpen(false);
                    }}
                  >
                    Excluir Conta
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setHiddenCreateDocument(false);
                      setMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
