import { useRef } from "react";
import styles from "../styles/window.module.css"
import { PromptInput } from "./PromptInput"
import { TerminalHeader } from "./TerminalHeader"

export const Window = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={styles.window} onClick={handleClick} >
      <TerminalHeader />
      <PromptInput ref={inputRef} />
    </div>
  )
}
