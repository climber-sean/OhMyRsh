import { useContext } from "react";
import styles from "../styles/promptheader.module.css";
import { ThemeContext } from "./Terminal.tsx";


export const PromptHeader = () => {
  const theme = useContext(ThemeContext);

  console.log(theme);

  return (
    <div className={styles.promptHeader} >
      <span>git</span>
      <span>~/documents/ohMyRsh</span>
    </div>
  )
}
