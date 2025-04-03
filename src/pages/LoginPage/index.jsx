import loginImg from "../../assets/login.jpg";
import { LoginForm } from "../../components/forms/LoginForm";
import styles from "./style.module.scss";

export const LoginPage = () => {
  return (
    <main>
      <div className="container">
        <div className={styles.mainBox}>
          <div className={styles.infosBox}>
            <h1 className="title big bold primary-focus">DocExpress</h1>
            <p className="title big bold">
              <span className="title big bold primary">Gestão</span> de
              <span> </span>
              <span className="title big bold primary">envios</span> sem
              estresse
            </p>
            <p className="text gray300">Seu fluxo de documentos agilizado</p>
            <div className={styles.imgBox}>
              <img src={loginImg} alt="My contacts" />

              <a
                className="text gray300 info"
                target="_blank"
                href="https://br.freepik.com/vetores-gratis/ilustracao-do-conceito-de-login_6183517.htm"
              >
                Imagem de storyset no Freepik
              </a>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
};
