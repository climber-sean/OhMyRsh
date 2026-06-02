import { useRef, useEffect, createContext, useCallback } from "react";
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
  const { prompts, promptHistory, handlePromptSubmit: promptSubmit } = useTerminal(terminalCommands);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  }

  const handlePromptSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      promptSubmit(inputRef.current.value);
      currentHistoryPosition.current = null;
    }
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current) inputRef.current.value = e.target.value
  }

  const currentHistoryPosition = useRef<number | null>(null);

  const handleHistory = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" && promptHistory.length) {
      e.preventDefault();
      if (currentHistoryPosition.current === null) {
        currentHistoryPosition.current = promptHistory.length;
      } else {
        currentHistoryPosition.current = Math.max(0, currentHistoryPosition.current - 1);
      }

      if (inputRef.current) {
        inputRef.current.value = promptHistory[currentHistoryPosition.current - 1] ?? '';
        const length = inputRef.current.value.length;
        inputRef.current.selectionStart = length;
        inputRef.current.selectionEnd = length;
      }
    } else if (e.key === "ArrowDown" && promptHistory.length) {
      e.preventDefault();
      if (currentHistoryPosition.current === null) return;

      currentHistoryPosition.current = currentHistoryPosition.current + 1;

      if (currentHistoryPosition.current > promptHistory.length) {
        currentHistoryPosition.current = null;
        if (inputRef.current) inputRef.current.value = '';
        return;
      }

      if (inputRef.current) {
        inputRef.current.value = promptHistory[currentHistoryPosition.current - 1] ?? '';
        const length = inputRef.current.value.length;
        inputRef.current.selectionStart = length;
        inputRef.current.selectionEnd = length;
      }
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

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
          <PromptInput ref={inputRef} onPromptSubmit={handlePromptSubmit} onChange={handleOnChange} value={inputRef.current?.value || ''} />
        </div>
      </div>
    </div>
    </ThemeContext>
  )
}
