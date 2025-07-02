import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <section className='home w-screen h-screen bg-[#292d3e]'>
      <div className="max-w-4/5 mx-auto flex flex-col items-center">
        <h1 className='py-5 text-4xl text-transparent bg-[url(/gradient.jpeg)] bg-clip-text'>Web3 Clicker</h1>
        <div className="w-screen h-0.5 bg-[#c792ea]"></div>

        {/* Button Area */}
        <div className="pt-20 flex flex-col gap-5 items-center">
          <btn onClick={() => {
            setCount(count + 1)
            console.log(`Button has been clicked ${count} times`)
          }}
          ><img className='w-50 h-50 cursor-pointer' src="/smile.png" alt="" /></btn>
          <h1 className='text-white text-3xl'>Times Clicked : {count}</h1>
        </div>
      </div>

    </section>

  )
}

export default App
