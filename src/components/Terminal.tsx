import { useRef, useEffect, createContext } from "react";
import styles from "../styles/window.module.css";
import { PromptInput } from "./PromptInput";
import { TerminalHeader } from "./TerminalHeader";
import { PromptHeader } from "./PromptHeader";
import { useTerminal } from "../hooks/useTerminal";
import type { TerminalCommandConfig } from "../types/terminalcommand.type.ts";
import { themes } from "../themes/index";
import "@fontsource/noto-mono";

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
      theme: themes.catppuccin
    }}>
    <div className={styles.window} style={{ fontFamily: 'Noto Mono', fontSize: '14px' }} onClick={handleClick} >
      <TerminalHeader />
      <div ref={containerRef} className={styles.promptContainer} style={{ background: themes.catppuccin.terminalBackground, height: '100%' }}>
        {prompts.map((value: TerminalOutput, i: number) => (
          <div key={i}>
            <PromptHeader />
            <div style={{ color: themes.catppuccin.promptText, padding: '0 0 10px', marginLeft: '30px' }}>{value.command}</div>
            {value.output && (
              <div style={{ color: themes.catppuccin.promptText }}>{value.output}</div> 
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
