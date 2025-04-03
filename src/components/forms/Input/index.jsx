import { forwardRef } from "react";
import styles from "./style.module.scss";

export const Input = forwardRef(({ error, label, ...props }, ref) => {
  return (
    <div className={styles.inputBox}>
      <label className="title label">{label}</label>
      <input className={styles.input} ref={ref} {...props} />
      {error ? <p className="text medium red">{error.message}</p> : null}
    </div>
  );
});
