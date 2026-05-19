import { useRef } from "react";
import styles from "../styles/window.module.css"
import { PromptInput } from "./PromptInput"
import { TerminalHeader } from "./TerminalHeader"
import { PromptHeader } from "./PromptHeader";

export const Window = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={styles.window} onClick={handleClick} >
      <TerminalHeader />
      <div style={{ padding: '10px' }}>
        <PromptHeader />
        <PromptInput ref={inputRef} />
      </div>
    </div>
  )
}
