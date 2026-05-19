import { useRef, useState, useEffect } from "react";
import styles from "../styles/window.module.css"
import { PromptInput } from "./PromptInput"
import { TerminalHeader } from "./TerminalHeader"
import { PromptHeader } from "./PromptHeader";

export const Window = () => {
  const [prompts, setPrompts] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  const handlePromptSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPrompts((prev) => [...prev, inputRef.current?.value as string]);  
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      console.log(typeof containerRef.current.scrollTop);
    }
  }, [prompts])

  return (
    <div className={styles.window} onClick={handleClick} >
      <TerminalHeader />
      <div ref={containerRef} className={styles.promptContainer}>
        {prompts.map((value: string, i: number) => (
          <div key={i}>
            <PromptHeader />
            <div>{value}</div>
          </div>
        ))}
        <div>
          <PromptHeader />
          <PromptInput ref={inputRef} onPromptSubmit={handlePromptSubmit} />
        </div>
      </div>
    </div>
  )
}
