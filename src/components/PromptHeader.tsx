import styles from "../styles/promptheader.module.css";

export const PromptHeader = () => {
  return (
    <div className={styles.promptHeader} >
      <span>git</span>
      <span>~/documents/ohMyRsh</span>
      <span>branch-name</span>
    </div>
  )
}
