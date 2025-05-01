import errorImg from "../../assets/error.jpg";
import styles from "./style.module.scss";

export const ErrorPage = () => {
  return (
    <main>
      <div className="container">
        <div className={styles.contentBox}>
          <h1 className="title big bold">DocExpress</h1>
          <div className={styles.imgBox}>
            <img src={errorImg} alt="Error image" />
          </div>
          <a
            className="text gray300 info"
            href="https://www.freepik.com/free-vector/404-error-with-portals-concept-illustration_20824302.htm"
          >
            Imagem de storyset no Freepik
          </a>{" "}
          <p className="text">Página não encontrada</p>
        </div>
      </div>
    </main>
  );
};
