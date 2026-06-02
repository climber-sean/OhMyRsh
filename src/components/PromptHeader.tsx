import { useContext } from "react";
import styles from "../styles/promptheader.module.css";
import { ThemeContext } from "./Terminal.tsx";


export const PromptHeader = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div>
      <span className={styles.promptHeaderLeft} style={{ background: theme.promptIconBackground, color: theme.promptFilePathColor }}>git</span>
      <span className={styles.promptHeaderRight} style={{ background: theme.promptFilePathBackground, color: theme.promptFilePathColor }}>~/documents/ohMyRsh</span>
    </div>
  )
}
