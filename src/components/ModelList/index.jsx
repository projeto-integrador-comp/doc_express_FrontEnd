import { ModelItem } from "./ModelItem";
import styles from "./style.module.scss";

export const ModelList = ({ models = [] }) => {
  return (
    <div className={styles.container}>
      <div className={styles.modelGrid}>
        {models.length > 0 ? (
          models.map((model) => <ModelItem key={model.id} model={model} />)
        ) : (
          <div className={styles.empty}>
            <p className="title textCenter">
              Nenhum modelo encontrado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
