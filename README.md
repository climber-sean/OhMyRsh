# OhMyRsh

A customisable terminal emulator component for React. Embed a fully interactive terminal in your app with built-in command history, theming, and an easy API for defining your own commands.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [The `Terminal` Component](#the-terminal-component)
  - [Props](#props)
  - [Theming](#theming)
  - [Custom Themes](#custom-themes)
- [The `useTerminal` Hook](#the-useterminal-hook)
  - [Return Values](#return-values)
- [Defining Commands](#defining-commands)
  - [`TerminalCommandConfig`](#terminalcommandconfig)
  - [Returning Output](#returning-output)
  - [Controlling Prompts Directly](#controlling-prompts-directly)
- [Built-in Commands](#built-in-commands)
- [TypeScript](#typescript)
- [Roadmap](#roadmap)
- [License](#license)

---

## Installation

```bash
npm install ohmyrsh
```

OhMyRsh requires React 18 or later as a peer dependency.

```bash
npm install react react-dom
```

---

## Quick Start

```tsx
import { OhMyRshTerminal } from 'ohmyrsh';
import type { TerminalCommandConfig } from 'ohmyrsh';

const commands: TerminalCommandConfig[] = [
  {
    name: 'greet',
    helpMessage: 'Prints a friendly greeting',
    commandFunc: () => 'Hello, world!',
  },
];

export default function App() {
  return <OhMyRshTerminal terminalCommands={commands} theme="dracula" />;
}
```

---

## The `Terminal` Component

The `OhMyRshTerminal` component renders a fully functional terminal window. It manages its own internal state via the `useTerminal` hook and exposes a clean props interface for configuration.

### Props

| Prop               | Type                                   | Required | Description                                                    |
|--------------------|----------------------------------------|----------|----------------------------------------------------------------|
| `terminalCommands` | `TerminalCommandConfig[]`              | Yes      | Array of custom command definitions to register in the terminal |
| `theme`            | `'catppuccin' \| 'dracula' \| TerminalTheme` | Yes | Built-in theme name or a custom theme object                   |

### Theming

Two built-in themes are available:

**`dracula`**

```tsx
<OhMyRshTerminal terminalCommands={commands} theme="dracula" />
```

**`catppuccin`**

```tsx
<OhMyRshTerminal terminalCommands={commands} theme="catppuccin" />
```

### Custom Themes

Pass a `TerminalTheme` object to fully control the colour scheme:

```tsx
import type { TerminalTheme } from 'ohmyrsh';

const myTheme: TerminalTheme = {
  terminalBackground: '#0d1117',
  promptIconBackground: '#58a6ff',
  promptFilePathBackground: '#3fb950',
  promptFilePathColor: '#c9d1d9',
  promptText: '#c9d1d9',
};

<OhMyRshTerminal terminalCommands={commands} theme={myTheme} />
```

#### `TerminalTheme` Properties

| Property                   | Type     | Description                                      |
|----------------------------|----------|--------------------------------------------------|
| `terminalBackground`       | `string` | Background colour of the terminal window         |
| `promptIconBackground`     | `string` | Background colour of the shell icon in the prompt |
| `promptFilePathBackground` | `string` | Background colour of the file path segment       |
| `promptFilePathColor`      | `string` | Text colour of the file path segment             |
| `promptText`               | `string` | Colour of command and output text                |

---

## The `useTerminal` Hook

If you need lower-level control — for example to build a fully custom terminal UI — you can use the `useTerminal` hook directly.

```tsx
import { useTerminal } from 'ohmyrsh';

const { prompts, inputRef, containerRef, handlePromptSubmit, handleHistory, handleClick } =
  useTerminal(terminalCommands);
```

### Return Values

| Property             | Type                                                      | Description                                                     |
|----------------------|-----------------------------------------------------------|-----------------------------------------------------------------|
| `prompts`            | `{ command: string; output?: string }[]`                 | Array of all submitted commands and their outputs               |
| `commands`           | `Record<string, TerminalCommandOpts>`                    | Map of all registered command names to their config             |
| `inputRef`           | `React.RefObject<HTMLInputElement>`                      | Ref to attach to your input element                             |
| `containerRef`       | `React.RefObject<HTMLDivElement>`                        | Ref to attach to the scrollable container (enables auto-scroll) |
| `handlePromptSubmit` | `(e: React.SubmitEvent<HTMLFormElement>) => void`        | Form submit handler — clears input and processes the command    |
| `handleHistory`      | `(e: KeyboardEvent) => void`                             | Keyboard handler for navigating command history (↑ / ↓)        |
| `handleClick`        | `() => void`                                             | Click handler that re-focuses the input                         |
| `handlePrompt`       | `(command: string) => void`                              | Programmatically submit a command string                        |
| `promptHistory`      | `string[]`                                               | List of previously submitted command strings                    |

#### Example: Custom Terminal UI

```tsx
import { useEffect } from 'react';
import { useTerminal } from 'ohmyrsh';
import type { TerminalCommandConfig } from 'ohmyrsh';

const commands: TerminalCommandConfig[] = [
  {
    name: 'ping',
    helpMessage: 'Responds with pong',
    commandFunc: () => 'pong',
  },
];

export default function MyTerminal() {
  const { prompts, inputRef, containerRef, handlePromptSubmit, handleHistory, handleClick } =
    useTerminal(commands);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => handleHistory(e);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleHistory]);

  return (
    <div ref={containerRef} onClick={handleClick} style={{ height: '400px', overflowY: 'auto', background: '#282A36', color: '#F8F8F2', padding: '1rem' }}>
      {prompts.map((p, i) => (
        <div key={i}>
          <div>$ {p.command}</div>
          {p.output && <div dangerouslySetInnerHTML={{ __html: p.output }} />}
        </div>
      ))}
      <form onSubmit={handlePromptSubmit}>
        <span>$ </span>
        <input ref={inputRef} style={{ background: 'transparent', color: 'inherit', border: 'none', outline: 'none' }} />
      </form>
    </div>
  );
}
```

---

## Defining Commands

Commands are defined as an array of `TerminalCommandConfig` objects and passed to either `OhMyRshTerminal` or `useTerminal`.

### `TerminalCommandConfig`

```ts
type TerminalCommandConfig = {
  name: string;
  helpMessage: string;
  commandFunc: (
    cmd: string,
    args: string[],
    setPrompts: (prompts: { command: string; output?: string }[]) => void
  ) => string | void;
};
```

| Property      | Type       | Description                                                                                         |
|---------------|------------|-----------------------------------------------------------------------------------------------------|
| `name`        | `string`   | The command string the user types (e.g. `'deploy'` runs when the user types `deploy`)              |
| `helpMessage` | `string`   | Description shown when the user runs `help`                                                         |
| `commandFunc` | `function` | The function executed when the command is called — see below for signature details                  |

#### `commandFunc` Parameters

| Parameter    | Type                                                               | Description                                                                 |
|--------------|--------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `cmd`        | `string`                                                           | The command name that was invoked                                           |
| `args`       | `string[]`                                                         | Any arguments passed after the command name (e.g. `['foo', 'bar']`)        |
| `setPrompts` | `(prompts: { command: string; output?: string }[]) => void`       | Directly overwrite the full prompts list (useful for commands like `clear`) |

### Returning Output

The simplest way to display output is to return a string from `commandFunc`. The string is rendered as HTML, so you can include tags for formatting.

```tsx
const commands: TerminalCommandConfig[] = [
  {
    name: 'status',
    helpMessage: 'Shows the current app status',
    commandFunc: () => '<span style="color: #50fa7b">● All systems operational</span>',
  },
  {
    name: 'add',
    helpMessage: 'Adds two numbers together: add <a> <b>',
    commandFunc: (_cmd, args) => {
      const result = Number(args[0]) + Number(args[1]);
      return `Result: ${result}`;
    },
  },
];
```

### Controlling Prompts Directly

For commands that need to rewrite the entire prompt history (such as `clear`), use the `setPrompts` argument instead of returning a value.

```tsx
{
  name: 'reset',
  helpMessage: 'Clears the screen and prints a welcome message',
  commandFunc: (_cmd, _args, setPrompts) => {
    setPrompts([{ command: '', output: '<strong>Welcome back!</strong>' }]);
  },
}
```

> **Note:** If `setPrompts` is called, any return value from `commandFunc` is ignored.

---

## Built-in Commands

These commands are available in every terminal instance without any configuration:

| Command  | Description                                          |
|----------|------------------------------------------------------|
| `clear`  | Clears all output from the terminal screen           |
| `greet`  | Prints a friendly greeting from OhMyRsh              |
| `echo`   | Prints the provided arguments to the terminal        |
| `help`   | Lists all available commands with their help messages |

```
$ help
clear -      the clear command will empty your terminal screen...
greet -      the greet command provides you with a nice friendly message
echo -       The echo command allows you to print text to the terminal screen
...your custom commands...
```

---

## TypeScript

OhMyRsh is written in TypeScript. All types are exported from the package entry point:

```ts
import type { TerminalCommandConfig, TerminalTheme } from 'ohmyrsh';
```

| Type                    | Description                                       |
|-------------------------|---------------------------------------------------|
| `TerminalCommandConfig` | Shape of a command definition object              |
| `TerminalTheme`         | Shape of a custom theme object                    |

---

## Roadmap

### 🚧 Coming Soon

**File System Emulation**
An in-memory virtual file system that brings `cd`, `ls`, `mkdir`, `touch`, `cat`, and related commands to the terminal out of the box. The working directory shown in the prompt will update as you navigate, giving users the feel of a real shell environment without any backend required.

### 💡 Planned

- **Tab completion** — auto-complete command names and file paths on `Tab`
- **Pipe support** — chain commands together with `|`
- **Additional built-in themes** — more community-favourite colour schemes
- **Stdin prompts** — allow commands to await further user input mid-execution

---

## License

MIT © [Sean Butlin](https://github.com/climber-sean)
