import styles from "../styles/terminalheader.module.css";

export const TerminalHeader = () => {
  return (
    <div className={styles.terminalHeader}>
      <div className={styles.headerButtonContainer}>
        <span className={`${styles.headerButton} ${styles.headerButtonClose}`}></span>
        <span className={`${styles.headerButton} ${styles.headerButtonMinimise}`}></span>
        <span className={`${styles.headerButton} ${styles.headerButtonMaximise}`}></span>
      </div>
    </div>
  )
}
