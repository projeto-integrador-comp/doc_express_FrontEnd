import { useContext } from "react";
import { DocumentItem } from "./DocumentItem";
import styles from "./style.module.scss";
import { AnimatePresence } from "framer-motion";
import { DocumentContext } from "../../providers/DocumentContext";

export const DocumentList = ({ documents }) => {
  const sortedDocuments = [...documents].sort((a, b) => {
    if (a.delivered !== b.delivered) {
      return a.delivered ? 1 : -1;
    }

    const dateA = new Date(a.submissionDate);
    const dateB = new Date(b.submissionDate);

    return a.delivered ? dateB - dateA : dateA - dateB;
  });

  const { setHiddenCreateDocument } = useContext(DocumentContext);
  return (
    <div className={styles.listContainer}>
      <AnimatePresence>
        <ul>
          {sortedDocuments.length > 0 ? (
            sortedDocuments.map((doc) => (
              <DocumentItem key={doc.id} doc={doc} />
            ))
          ) : (
            <li
              className={styles.empty}
              onClick={() => setHiddenCreateDocument(false)}
            >
              <p className="title  textCenter">
                Você ainda não possui documentos cadastrados
              </p>
            </li>
          )}
        </ul>
      </AnimatePresence>
    </div>
  );
};
