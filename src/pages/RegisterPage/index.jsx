import styles from "./style.module.scss";
import registerImg from "../../assets/register.jpg";
import { RegisterForm } from "../../components/forms/RegisterForm";

export const RegisterPage = () => {
  return (
    <main>
      <div className="container">
        <div className={styles.mainBox}>
          <RegisterForm />
          <div className={styles.infosBox}>
            <h1 className="title big bold primary-focus">DocExpress</h1>
            <p className="title big bold primary">Bem Vindo!</p>
            <p className="text gray300">
              Cadastre-se e simplifique sua rotina!
            </p>
            <div className={styles.imgBox}>
              <img src={registerImg} alt="Cadastro" />
              <a
                className="text gray300 info"
                target="_blank"
                href="https://br.freepik.com/vetores-gratis/ilustracao-do-conceito-de-login-movel_4957136.htm"
              >
                Imagem de storyset no Freepik
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
