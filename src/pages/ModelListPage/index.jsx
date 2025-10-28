import { useContext, useEffect } from "react";
import Header from "../../components/Header/Header";
import { ModelList } from "../../components/ModelList";
import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../providers/UserContext";
import { ModelContext } from "../../providers/ModelContext";

export const ModelListPage = () => {
  const { models, loading, loadModels } = useContext(ModelContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // Carrega modelos apenas uma vez ao montar a página
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <- vazio garante que só executa uma vez

  if (loading) return <div>Carregando modelos...</div>;

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1>Modelos de Documentos</h1>
        <ModelList models={models} />
      </div>
    </div>
  );
};
