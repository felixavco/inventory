import { useSession, signIn, signOut } from "next-auth/react";
import type { NextPage } from 'next'

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const content = () => {
    if (session) {
      return (
        <>
          <h1>Signed in as {session.user?.email}</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )
    }
    return (
      <>
        <h1>Login</h1>
        <button onClick={() => signIn('google')} type='button'>Google</button>
      </>
    )
  }
  return (
    <div className={styles.container}>
      {content()}
    </div>
  )
}

export default Home;