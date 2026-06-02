import { useRef, useEffect, createContext } from "react";
import { PromptInput } from "./PromptInput";
import { TerminalHeader } from "./TerminalHeader";
import { PromptHeader } from "./PromptHeader";
import { useTerminal } from "../hooks/useTerminal";
import { themes } from "../themes/index";
import type { TerminalCommandConfig } from "../types/terminalcommand.type.ts";
import type { TerminalTheme } from "../types/terminaltheme.type.ts";
import styles from "../styles/window.module.css";
import "@fontsource/noto-mono";

type TerminalOutput = {
  output?: string,
  command: string,
}

type TerminalProps = {
  terminalCommands: TerminalCommandConfig[],
  theme: 'catppuccin' | 'dracula' | TerminalTheme,
}

//TODO: move theme context out of component
export const ThemeContext = createContext<any>(null);

export const Terminal = ({ terminalCommands, theme }: TerminalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    prompts,
    containerRef,
    handlePromptSubmit,
    handleHistory,
    handleClick
  } = useTerminal(terminalCommands, inputRef);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleHistory(e);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prompts, handleHistory])

  return (
    <ThemeContext value={{
      theme: typeof theme === 'string' ? themes[theme] : theme
    }}>
    <div className={styles.window} style={{ fontFamily: 'Noto Mono', fontSize: '14px' }} onClick={handleClick} >
      <TerminalHeader />
      <div ref={containerRef} className={styles.promptContainer} style={{ background: themes.dracula.terminalBackground, height: '100%' }}>
        {prompts.map((value: TerminalOutput, i: number) => (
          <div key={i}>
            <PromptHeader />
            <div style={{ color: themes.catppuccin.promptText, padding: '0 0 10px', marginLeft: '30px', marginTop: '3px' }}>{value.command}</div>
            {value.output && (
              <div style={{ color: themes.dracula.promptText, marginBottom: '5px' }}>{value.output}</div> 
            )}
          </div>
        ))}
        <div>
          <PromptHeader />
          <PromptInput ref={inputRef} onPromptSubmit={handlePromptSubmit} value={inputRef.current?.value || ''} />
        </div>
      </div>
    </div>
    </ThemeContext>
  )
}
