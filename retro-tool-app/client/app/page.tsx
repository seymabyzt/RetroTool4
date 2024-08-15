import Image from "next/image"
import Link from "next/link"
import { v4 as uuidv4 } from 'uuid'
import mypng from '@/app/public/gorsel1.png'
import styles from '@/app/page.module.css'
import { Flex } from "antd"
import StartButton from './components/Atoms/StartButton'
import logo from "../app/public/logo.png"

const Home = () => {

  function getRandomNumber(min: number, max: number ) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  let id= getRandomNumber(0, 1000000000);

  const pStyle = {
    color: "white",
    padding: "20px 0",
    fontSize: "24px"
  }

  return (
    <section className={styles.main}>
      <Flex justify="center" align="center" wrap>
        <Flex align="flex-start" style={{ padding: '10px' }} vertical>
          <Image width={230} height={150} src={logo} alt="logo" />
          <div>
            <p style={pStyle}>
              &quot;Elevate your team&apos;s performance by launching <br />
              your first retrospective. <br />
              Begin your collaborative session instantly <br />
              no sign-up needed and entirely free.&quot;
            </p>
            <p style={pStyle}>Feel free to tweak it further if needed!</p>
          </div>
          <StartButton>
            <Link href={`/room/${id}`}>Get Start</Link>
          </StartButton>
        </Flex>
        <Image style={{ overflow: "hidden" }} src={mypng} alt="" width={500} height={500}></Image>
      </Flex>
    </section>
  )
}

export default Home
