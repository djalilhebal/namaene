import NaForm from './NaForm';

export default async function Home() {
  return (
    <main className='text-center flex flex-col justify-between min-h-screen bg-gray-100'>
      <header className='bg-orange-100'>
        <h1 className='bg-orange-600 text-2xl font-bold font-sans'>
          Namaene
        </h1>
        <p className="k-subtitle">
          IPA vocalizer. Pronouncing names and stuff.
        </p>
      </header>

      <div className='max-w-xl m-auto'>
        <NaForm />
      </div>

      <footer className='text-small'>
        Abdeldjalil Hebal
        {" | "}
        <a
          href="https://github.com/djalilhebal/namaene"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
        {" | "}
        <a
          href="https://dev.to/djalilhebal/pronouncing-names-and-stuff-using-tts-5a81"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          DEV
        </a>
      </footer>
    </main>
  )
}
