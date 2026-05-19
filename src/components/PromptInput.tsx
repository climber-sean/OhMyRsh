import { forwardRef } from 'react';
import styles from '../styles/promptinput.module.css';

type PromptInputProps = {
  onPromptSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

export const PromptInput = forwardRef<HTMLInputElement, PromptInputProps>((props, ref) => {
  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onPromptSubmit(event);
  }

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <input type="text" name="terminal-prompt" ref={ref} autoComplete="off" className={styles.promptInput} />
      <button type="submit">Submit</button>
    </form>
  )
});

