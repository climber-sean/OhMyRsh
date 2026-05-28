import { forwardRef } from "react";
import styles from '../styles/promptinput.module.css';

type PromptInputProps = {
  onPromptSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  value: string
}

export const PromptInput = forwardRef<HTMLInputElement, PromptInputProps>((props, ref) => {
  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onPromptSubmit(event);
  }

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <input 
        type="text"
        name="terminal-prompt"
        ref={ref}
        defaultValue={props.value}
        onChange={(e) => props.onChange(e)}
        autoComplete="off"
        className={styles.promptInput}
        style={{ fontFamily: 'Noto Mono', fontSize: '14px', marginTop: '3px' }}
      />
      <button className={styles.promptButton} style={{ display: 'block' }} type="submit">Submit</button>
    </form>
  )
});

