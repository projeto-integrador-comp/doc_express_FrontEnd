import { ModelContext } from "../../providers/ModelContext";
import { ModelItem } from "./ModelItem";
import styles from "./style.module.scss";
import { useContext } from "react";

export const ModelList = () => {
  const { models } = useContext(ModelContext);

  return (
    <div className={styles.container}>
      <div className={styles.modelGrid}>
        {models.length > 0 ? (
          models.map((model) => <ModelItem key={model.id} model={model} />)
        ) : (
          <div className={styles.empty}>
            <p className="title textCenter">
              Você ainda não possui modelos cadastrados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
