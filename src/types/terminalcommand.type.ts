export type TerminalCommandOpts = {
  helpMessage: string,
  commandFunc: (cmd: string, args: string[], setPrompts: (prompts: string[]) => void) => string | void,
}

export type TerminalCommand = {
  [key: string]: TerminalCommandOpts
}

export type TerminalCommandConfig = TerminalCommandOpts & {
  name: string,
}

