import styles from "./Input.module.scss";

const Input = ({ label, ...props }) => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} {...props} />
    </div>
  );
};

export default Input;
