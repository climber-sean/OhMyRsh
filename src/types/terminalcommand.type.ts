export type TerminalCommand = {
  name: string,
  helpMessage: string,
  commandFunc: (arg: string, setPrompts: (prompts: string[]) => void) => string | void,
}
