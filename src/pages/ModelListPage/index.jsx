import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { ModelList } from "../../components/ModelList";
import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../providers/UserContext";
import { api } from "../../services/api";

export const ModelListPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchModels = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("@tokenDocExpress");
        console.log("🔐 Token manual:", token);

        const response = await api.get("/templates", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Sucesso - Models recebidos:", response.data);
        setModels(response.data);
      } catch (error) {
        console.error("❌ Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [user, navigate]);

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
