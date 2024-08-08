import Image from "next/image"
import Link from "next/link"
import { v4 as uuidv4 } from 'uuid'
import mypng from '@/app/public/gorsel1.png'
import styles from '@/app/page.module.css'
import { Flex} from "antd"
import Title from "antd/es/typography/Title"
import StartButton from './components/Atoms/StartButton';

const page = () => {

  const id = uuidv4()
  const flexBoxStyle: React.CSSProperties = {
    gap: '100px',
    marginTop: '100px'
  };

  return (
    <section className={styles.main}>
      <div className={styles.container}>
       <Title style={{color: "white"}}>Welcome RetroTool4</Title>
      <Flex style={flexBoxStyle} >
        <div>
          <Title style={{color: "white"}}>Let's Start</Title>
          <StartButton>
          <Link href={`/room/${id}`} >Get Start</Link>
          </StartButton>
        </div>
        <Image src={mypng} alt="" width={500} height={500}></Image>
      </Flex>
      </div>
    </section>
  )
}

export default page