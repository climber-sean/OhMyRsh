import { Terminal } from "../src/components/Terminal"
import type { TerminalCommandConfig } from "../src/types/terminalcommand.type"

const terminalCommands: TerminalCommandConfig[] = [
  {
    name: 'greetTwo',
    helpMessage: 'the greet command returns a friendly message to your terminal screen',
    commandFunc: () => 'Welcome from OhMyRsh Two!'
  },
  {
    name: 'clone',
    helpMessage: 'this is just a random test command',
    commandFunc: () => 'random clone command'
  }
]

function App() {

  return (
    <>
      <h1>Going to build my component package here</h1>
      <Terminal terminalCommands={terminalCommands} theme="dracula" />
    </>
  )
}

export default App
