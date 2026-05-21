import { useRef, useEffect, createContext } from "react";
import styles from "../styles/window.module.css";
import { PromptInput } from "./PromptInput";
import { TerminalHeader } from "./TerminalHeader";
import { PromptHeader } from "./PromptHeader";
import { useTerminal } from "../hooks/useTerminal";
import type { TerminalCommandConfig } from "../types/terminalcommand.type.ts";

type TerminalOutput = {
  output?: string,
  command: string,
}

type TerminalProps = {
  terminalCommands: TerminalCommandConfig[]
}

export const ThemeContext = createContext<any>(null);

export const Terminal = ({ terminalCommands }: TerminalProps) => {
  const { prompts, handlePromptSubmit: promptSubmit } = useTerminal(terminalCommands);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  }

  const handlePromptSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      promptSubmit(inputRef.current.value)
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [prompts])

  return (
    <ThemeContext value={{
      terminalBackground: '#1e1e1e'
    }}>
    <div className={styles.window} onClick={handleClick} >
      <TerminalHeader />
      <div ref={containerRef} className={styles.promptContainer}>
        {prompts.map((value: TerminalOutput, i: number) => (
          <div key={i}>
            <PromptHeader />
            <div style={{ color: 'white', padding: '0 0 10px', marginLeft: '30px' }}>{value.command}</div>
            {value.output && (
              <div style={{ color: 'white' }}>{value.output}</div> 
            )}
          </div>
        ))}
        <div>
          <PromptHeader />
          <PromptInput ref={inputRef} onPromptSubmit={handlePromptSubmit} />
        </div>
      </div>
    </div>
    </ThemeContext>
  )
}
