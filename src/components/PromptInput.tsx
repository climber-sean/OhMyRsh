import { forwardRef } from 'react';
import styles from '../styles/promptinput.module.css';

export const PromptInput = forwardRef<HTMLInputElement>((_props, ref) => {
  return (
    <input type="text" name="terminal-prompt" ref={ref} className={styles.promptInput} />
  )
});

