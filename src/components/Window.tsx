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
    console.log(inputRef.current?.value);
    setPrompts((prev) => [...prev, inputRef.current?.value as string]);
    console.log(prompts);
    console.log(containerRef);
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [prompts])

  return (
    <div className={styles.window} onClick={handleClick} >
      <TerminalHeader />
      <div ref={containerRef} style={{ padding: '10px' }}>
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
