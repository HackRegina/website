import type { NextPage } from 'next'
import { Benefits } from '../components/Benefits/Benefits'
import { CallToAction } from '../components/CallToAction/CallToAction'
import { Footer } from '../components/Footer/Footer'
import { Navbar } from '../components/Navbar/Navbar'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <CallToAction />
      <Benefits />
      <Footer />
    </div>
  )
}

export default Home
