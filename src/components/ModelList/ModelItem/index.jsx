import { useContext } from "react";
import { ModelContext } from "../../../providers/ModelContext";
import styles from "./style.module.scss";

export const ModelItem = ({ model }) => {
  const { setViewingModel } = useContext(ModelContext);

  const handleViewClick = () => {
    setViewingModel(model); // Define o modelo que será visualizado no modal
  };

  // Extrair o tipo de arquivo do fileName
  const getFileType = () => {
    if (model.fileName) {
      const extension = model.fileName.split(".").pop().toLowerCase();
      return extension;
    }
    return "file";
  };

  const fileType = getFileType();

  // Função para determinar a cor baseada no tipo de arquivo
  const getFileTypeStyle = (type) => {
    const typeColors = {
      pdf: "var(--orange)",
      doc: "var(--color-primary)",
      docx: "var(--color-primary)",
      xlsx: "var(--green)",
      xls: "var(--green)",
      default: "var(--gray700)",
    };

    return {
      backgroundColor: typeColors[type] || typeColors.default,
    };
  };

  // Função para formatar o texto do tipo de arquivo
  const getFileTypeText = (type) => {
    const typeTexts = {
      pdf: "PDF",
      doc: "DOC",
      docx: "DOCX",
      xlsx: "XLSX",
      xls: "XLS",
    };

    return typeTexts[type] || type.toUpperCase();
  };

  return (
    <div className={styles.container}>
      <span style={getFileTypeStyle(fileType)}>
        {getFileTypeText(fileType)}
      </span>
      <h2>{model.name}</h2>
      <p>{model.description}</p>
      <button onClick={handleViewClick}>Visualizar</button>
    </div>
  );
};
