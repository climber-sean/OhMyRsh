import styles from "../styles/window.module.css"
import { TerminalHeader } from "./TerminalHeader"

export const Window = () => {
  return (
    <div className={styles.window}>
      <TerminalHeader /> 
    </div>
  )
}
