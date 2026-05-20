import { useRef, useState, useEffect } from "react";
import styles from "../styles/window.module.css"
import { PromptInput } from "./PromptInput"
import { TerminalHeader } from "./TerminalHeader"
import { PromptHeader } from "./PromptHeader";

type TerminalOutput = {
  output?: string,
  command: string,
}

type TerminalCommand = {
  helpMessage: string,
  commandFunc: (arg: string) => string | void
}

type TerminalCommands = {
  [key:string]: TerminalCommand
}

export const Window = () => {
  const [prompts, setPrompts] = useState<TerminalOutput[]>([])
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  const handlePromptSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commandInput = inputRef.current?.value.split(' ')[0] || '';
    console.log(commandInput);
    console.log(inputRef.current?.value);
    const output: TerminalOutput = {
      command: '',
    }
    if (inputRef.current && commands[commandInput]) {
        setPrompts((prev) => [...prev, output]);
        const returnedOutput = commands[commandInput].commandFunc(inputRef.current.value);
        if (returnedOutput) {
          output.output = returnedOutput
        }
        output.command = inputRef.current.value
    } else if (inputRef.current) {
      output.command = inputRef.current.value;
      output.output = `rsh: command not found: ${inputRef.current.value}`;
      setPrompts((prev) => [...prev, output])
    }
  }

  const commands: TerminalCommands = {
    "clear": {
      helpMessage: "the clear command will empty your terminal screen, removing all previous output",
      commandFunc: () => {
        setPrompts([]);
      }
    },
    "greet": {
      helpMessage: "the greet command provides you with a nice friendly message",
      commandFunc: () => {
        return "Hello from OhMyRsh!";
      }
    },
    "echo": {
      helpMessage: "The echo command allows you to print text to the terminal screen",
      commandFunc: (arg: string) => {
        const command = arg.split(' ');
        command.shift();
        console.log(command);
        return command.join(' ');
      }
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      console.log(typeof containerRef.current.scrollTop);
    }
  }, [prompts])

  return (
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
  )
}
