'use client';

import Image from "next/image";
// import Link from 'next/link';
import { setCookie } from 'cookies-next';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Poppins} from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });

export default function MLBHome() {
  const router = useRouter();
  const [stasiun, setStasiun] = useState(null);
  const [stasiunName, setStasiunName] = useState(null);
  const [data, setData] = useState(null)
  const [showData, setShowData] = useState(null)
  let displayData

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
          'Authorization': 'af879432-317d-40b4-88f8-d4c02267112b:VDNwFD1gOp86AKVEqlCIbfVN4evXoBxL',
          'Accept': 'application/json',
      }
    };

    const fetchData = async () => {
      const response = await fetch('https://api.discoveryournextjourney.com/v1/totem', options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result)
      displayData = result.data.map(function(todo){
        return (
          <li key={todo.id}><input id={`choose_stasiun${todo.id}`} type="radio" name='choose_stasiun' value={todo.id} onChange={(e) => setupLokasi(e.target.value, todo.name)}/><label htmlFor={`choose_stasiun${todo.id}`} className='text-2xl lg:h-[140px] lg:text-4xl'>{todo.name}</label></li>
        )
      })

      setData(result)
      setShowData(displayData)
    }
 
    fetchData().catch((e) => {
      // handle the error as needed
      console.error('An error occurred while fetching the data: ', e)
    })
  }, [])

  const setupLokasi = (id, name) => {
    setStasiun(id)
    setStasiunName(name)
    // console.log(id)
    // console.log(name)
  }

  const handleSubmit = () => {
    setCookie('stasiun', stasiun);
    setCookie('stasiunName', stasiunName);

    gtag('event', 'ClickButton', {
      event_category: 'Button',
      event_label: stasiunName,
      event_action: 'Continue'
    })

    setTimeout(() => {
        router.push('/v2/home');
    }, 250);
}

  return (
    <main className="flex fixed h-full w-full bg-kai overflow-auto flex-col justify-center items-center  py-16 px-20" onContextMenu={(e)=> e.preventDefault()}>
      <div className="relative w-[90%] mt-5 mb-10 lg:mt-20 lg:mb-14">
        <div className='relative w-full hiddenx'>
            <label htmlFor="choose_stasiun" className={`block mb-5 lg:mb-5 text-2xl lg:text-5xl text-center font-bold text-white ${poppins.className}`}>Pilih Lokasi</label>
            <div>
                <ul className='choose2-amero text-5xl'>
                {data ? showData : 'Loading...'}
                    {/* {showData} */}
                    {/* <li>
                        <input
                        id='choose_stasiun1'
                        type="radio"
                        name='choose_stasiun'
                        value="1"
                        onChange={(e) => setStasiun(e.target.value)}
                        />
                        <label htmlFor="choose_stasiun1" className='text-2xl lg:h-[140px] lg:text-4xl'>Totem 1</label>
                    </li>
                    <li>
                        <input
                        id='choose_stasiun2'
                        type="radio"
                        name='choose_stasiun'
                        value="2"
                        onChange={(e) => setStasiun(e.target.value)}
                        />
                        <label htmlFor="choose_stasiun2" className='text-2xl lg:h-[140px] lg:text-4xl'>Totem 2</label>
                    </li>
                    <li>
                        <input
                        id='choose_stasiun3'
                        type="radio"
                        name='choose_stasiun'
                        value="3"
                        onChange={(e) => setStasiun(e.target.value)}
                        />
                        <label htmlFor="choose_stasiun3" className='text-2xl lg:h-[140px] lg:text-4xl'>Totem 3</label>
                    </li> */}
                </ul>
            </div>
        </div>
      </div>
      {stasiun &&
      <div className="relative w-full flex justify-center items-center lg:mt-20">
        <div className="relative mx-auto flex w-[90%] justify-center items-center" onClick={handleSubmit}>
          <Image src='/btn-continue.png' width={830} height={192} alt='Zirolu' className='w-full' priority />
        </div>
      </div>}
    </main>
  );
}
