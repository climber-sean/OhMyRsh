import { useState, useMemo } from "react";
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



export const useTerminal = (terminalCommands: TerminalCommandConfig[]) => {
  const [prompts, setPrompts] = useState<TerminalOutput[]>([]);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  const commands: Record<string, any> = useMemo(() =>
    [...defaultCommands, ...terminalCommands].reduce((acc, command) => {
      acc[command.name] = {
        helpMessage: command.helpMessage,
        commandFunc: command.commandFunc,
      }

      return acc
    }, {} as TerminalCommand), [terminalCommands])

  const handlePromptSubmit = (command: string) => {
    const commandInput = command.split(' ')[0] || '';
    const commandArgs = command.split(' ');
    commandArgs.shift();
    
    const output: TerminalOutput = {
      command: '',
    }

    if (commands[commandInput]) {
      const returnedOutput = commands[commandInput].commandFunc(commandInput, commandArgs, setPrompts);
      if (returnedOutput) {
        output.output = returnedOutput;
      }
      output.command = command;
      setPrompts((prev) => [...prev, output]);
      setPromptHistory((prev) => [...prev, command])
    } else {
      output.command = command;
      output.output = `rsh: command not found: ${commandInput}`;
      setPrompts((prev) => [...prev, output]);
      setPromptHistory((prev) => [...prev, command])
    }
  }

  return { commands, prompts, handlePromptSubmit, promptHistory }
}
