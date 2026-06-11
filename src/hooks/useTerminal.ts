import { useState, useMemo, useRef } from "react";
import type { TerminalOutput } from "../types/terminaloutput.type.ts";
import type { TerminalCommand, TerminalCommandConfig } from "../types/terminalcommand.type.ts";

  const defaultCommands: TerminalCommandConfig[] = [
    {
      name: "clear",
      helpMessage: "the clear command will empty your terminal screen, removing all previous output",
      commandFunc: (_cmd, _args, setPrompts) => {
        setPrompts([]);
      }
    },
    {
      name: "greet",
      helpMessage: "the greet command provides you with a nice friendly message",
      commandFunc: () => {
        return "Hello from OhMyRsh!";
      }
    },
    {
      name: "echo",
      helpMessage: "The echo command allows you to print text to the terminal screen",
      commandFunc: (_cmd, args) => {
        return args.join(' ');
      }
    }]

export const useTerminal = (terminalCommands: TerminalCommandConfig[] = []) => {
  const [prompts, setPrompts] = useState<TerminalOutput[]>([]);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  let commands: Record<string, any> = {};

  commands = useMemo(() =>
    [...defaultCommands, ...terminalCommands].reduce((acc, command) => {
      acc[command.name] = {
        helpMessage: command.helpMessage,
        commandFunc: command.commandFunc,
      }

    return acc
  }, {} as TerminalCommand), [terminalCommands]);

  let helpPromptMessage: string[] = [];

  [...defaultCommands, ...terminalCommands].forEach((cmd) => {
    helpPromptMessage.push(`<p>${cmd.name} -      ${cmd.helpMessage}</p>`);
  });

  commands.help = {
    helpMessage: 'Display all commands available',
    commandFunc: () => helpPromptMessage.join(''),
  }
 
  const handlePrompt = (command: string) => {
    const commandInput = command.split(' ')[0] || '';
    const commandArgs = command.split(' ');
    commandArgs.shift();

    const output: TerminalOutput = {
      command: '',
    }

    if (commands[commandInput]) {
      let selfSetsPrompts = false

      const selfSetPrompts = (val: TerminalOutput[]) => {
        selfSetsPrompts = true;
        setPrompts(val);
      }

      const returnedOutput = commands[commandInput].commandFunc(commandInput, commandArgs, selfSetPrompts);

      if (!selfSetsPrompts) {
        if (returnedOutput) {
          output.output = returnedOutput;
        }
        output.command = command;
        setPrompts((prev) => [...prev, output]);
      }

      setPromptHistory((prev) => [...prev, command])
    } else {
      output.command = command;
      output.output = `rsh: command not found: ${commandInput}`;
      setPrompts((prev) => [...prev, output]);
      setPromptHistory((prev) => [...prev, command])
    }
  }

  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  }

  const handlePromptSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current && containerRef.current) {
      handlePrompt(inputRef.current.value);
      currentHistoryPosition.current = null;
      inputRef.current.value = '';
      requestAnimationFrame(() => {
        if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
      })
    }
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


  return {
    commands,
    prompts,
    handlePromptSubmit,
    promptHistory,
    handleHistory,
    handleClick,
    containerRef,
    inputRef,
    handlePrompt
  }
}
