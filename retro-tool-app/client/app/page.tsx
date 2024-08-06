import Link from "next/link"
import { v4 as uuidv4 } from 'uuid'

const page = () => {

  const id = uuidv4()

  return (
    <>
      <Link href={`/room/${id}`} >Start a New Retro</Link>
    </>
  )
}

export default page