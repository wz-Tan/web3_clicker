import { useState } from 'react'
import { ConnectButton, useCurrentAccount, useSuiClientQuery  } from '@mysten/dapp-kit';
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  var accountNumber;

  return (

    <section className='home w-screen h-screen bg-[#292d3e]'>
      <div className="max-w-4/5 mx-auto flex flex-col items-center">
        <h1 className='py-5 text-4xl text-transparent bg-[url(/gradient.jpeg)] bg-clip-text'>Web3 Clicker</h1>
        <div className="w-screen h-0.5 bg-[#c792ea]"></div>

        {/* Button Area */}
        <div className="pt-20 flex flex-col gap-5 items-center">
          <btn onClick={() => {
            setCount(count + 1)
          }}
          ><img className='w-50 h-50 cursor-pointer' src="/smile.png" alt="" /></btn>
          <h1 className='text-white text-3xl'>Times Clicked : {count}</h1>

          {/* Connects to Your Wallet */}
          <ConnectButton/>

          {/* Connected Account Returns Variable */}
          <ConnectedAccount/>
        </div>
      </div>

    </section>


  )
}

function ConnectedAccount() {
	const account = useCurrentAccount();

	if (!account) {
		return null;
	}

	return (
  <>
   <div className='bg-white p-3 rounded-xl'>Connected to {account.address}</div>
   <OwnedObjects address={account.address} />
   </>
  )
}

function OwnedObjects({ address }) {
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: address,
	});
	if (!data) {
		return null;
	}

	return (
		<ul>
			{data.data.map((object) => (
				<li key={object.data?.objectId}>
					<a href={`https://example-explorer.com/object/${object.data?.objectId}`}>
						{object.data?.objectId}
					</a>
				</li>
			))}
		</ul>
	);
}

export default App
