import Chat from '../Chat'
import styles from './Column.module.css'

const Column = () => {
  return (
    <div className={styles.main}>
      <Chat username={''} roomID={''} socket={undefined}></Chat>
    </div>
  )
}

export default Column