import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { FormEvent, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [value, setValue] = useState('')
  const [alert, setAlert] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setValue('')
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        target: value,
      }),
    })
    if (response.status === 200) {
      const { url } = await response.json()
      setAlert(url)
      setSuccess(true)
    } else {
      const { message } = await response.json()
      setAlert(message)
      setSuccess(false)
    }
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>pages/index.tsx</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.next}>
            <Image
              className={styles.logo}
              src="/next.svg"
              alt="Next.js Logo"
              width={180}
              height={37}
              priority
            />
            <div className={styles.thirteen}>
              <Image
                src="/thirteen.svg"
                alt="13"
                width={40}
                height={31}
                priority
              />
            </div>
          </div>
          <div className={styles.form}>
            <form onSubmit={handleSubmit} noValidate>
              <input
                value={value}
                name="url"
                type="url"
                placeholder="https://google.com"
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <input type="submit" hidden />
            </form>
            {alert && success && (
              <span
                onClick={() => navigator.clipboard.writeText(alert)}
                className={`${styles.alert} ${inter.className} ${styles.success}`}
              >
                {alert}
                <Image
                  className={styles.copy}
                  src="/copy.svg"
                  alt="Copy"
                  width={16}
                  height={16}
                  priority
                />
              </span>
            )}
            {alert && !success && (
              <span
                className={`${styles.alert} ${inter.className} ${styles.error}`}
              >
                {alert}
                <Image
                  className={styles.triangle}
                  src="/triangle.svg"
                  alt="Error triangle"
                  width={16}
                  height={16}
                  priority
                />
              </span>
            )}
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Docs <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Templates <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Deploy <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
