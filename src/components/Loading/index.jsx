import LoadingGif from "../../assets/loading.svg";
import styles from "./style.module.scss";

export const Loading = () => {
  return (
    <main>
      <div className="container dash">
        <div className={styles.loadingBox}>
          <img src={LoadingGif} alt="Carregando..." />
        </div>
      </div>
    </main>
  );
};
