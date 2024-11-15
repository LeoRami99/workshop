import { useState } from 'react'
import './App.css'
import ConnectButton from './components/ConnectWallet'
import { ADDRESS_CONTRACT, ABI } from './contracts/erc20';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
// import { waitForTransactionReceipt } from 'viem/actions'
// Se importo desde viem y no desde wagmi
import { waitForTransactionReceipt } from 'wagmi/actions';
import { wagmiAdapter } from './WalletContext'
import toast from 'react-hot-toast';

function App() {
  const [amount, setAmount] = useState(0);
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending: mintPending, isSuccess: mintSuccess, isError: mintError } = useWriteContract()


  const { data: nameContract } = useReadContract({
    abi: ABI,
    address: ADDRESS_CONTRACT,
    functionName: 'name',
  })
  const { data: balanceOf, refetch } = useReadContract({
    abi: ABI,
    address: ADDRESS_CONTRACT,
    functionName: 'balanceOf',
    args: [address],
  }) as { data: number, refetch: () => void }

  const mintF = async () => {
    if (amount == 0) {
      toast.error('Amount is 0')
      return;
    }
    toast.loading('Minting...')
    const txHash = await writeContractAsync({
      abi: ABI,
      address: ADDRESS_CONTRACT,
      functionName: 'mint',
      args: [address, amount]
    })

    await waitForTransactionReceipt(
      wagmiAdapter.wagmiConfig,
      {
        hash: txHash,
        confirmations: 1,
      }
    )

    refetch()
    setAmount(0)
    toast.remove()

    if (mintSuccess) {
      toast.success('Minted')

    }
    if (mintError) {
      toast.error('Error Minted')
    }

  }


  return (
    <>
      <div>
        <img src="https://assets.zyrosite.com/YbNyWrOBrphVaBBy/2404logoeducatethl-Aq2BxgEpv9IpR1l4.svg" alt="EducaEth" />
      </div>
      <h1 className="titulo">Workshop</h1>
      <div className="flex justify-center">
        <ConnectButton />
      </div>
      {isConnected ? (
        <>
          <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body items-center text-center space-y-4">
              <p>
                {nameContract as string}
                <br />
                {balanceOf && balanceOf.toString() || 0}
              </p>
              <input type="number" onChange={(e) => setAmount(Number(e.target.value))} value={amount} name='amount' title='amount' className='input input-bordered rounded-md' />
              <button onClick={mintF} disabled={mintPending} className='w-full btn btn-primary rounded-badge'>
                Mint
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>
          Aún no estas conectado
        </p>
      )}



    </>
  )
}

export default App
