import type { TerminalOutput } from "./terminaloutput.type"

export type TerminalCommandOpts = {
  helpMessage: string,
  commandFunc: (cmd: string, args: string[], setPrompts: (prompts: TerminalOutput[]) => void) => string | void,
}

export type TerminalCommand = {
  [key: string]: TerminalCommandOpts
}

export type TerminalCommandConfig = TerminalCommandOpts & {
  name: string,
}

