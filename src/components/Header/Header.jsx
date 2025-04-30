import { useContext, useState, useRef, useEffect } from "react";
import styles from "./Header.module.scss";
import { RxHamburgerMenu, RxChevronDown } from "react-icons/rx";
import { TbLogout, TbUserEdit, TbUserX } from "react-icons/tb";
import { UserContext } from "../../providers/UserContext";

const Header = () => {
  const { user, setDeletingUser, userLogout } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
                <li>
                  <button
                    onClick={() => {
                      userLogout();
                      setMenuOpen(false);
                    }}
                  >
                    <TbLogout /> Sair
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                  >
                    <TbUserEdit /> Atualizar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setDeletingUser(user);
                      setMenuOpen(false);
                    }}
                  >
                    <TbUserX /> Excluir
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
