'use client';

import React,{ useEffect, useState, useRef } from 'react';
import { getCookie } from 'cookies-next';
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQRCode } from 'next-qrcode';
import io from 'socket.io-client';

// SETUP SOCKET
let SERVER_IP = "https://api.discoveryournextjourney.com";
let NETWORK = null;

function emitNetworkConnection() {
   NETWORK = io(SERVER_IP, {
      withCredentials: false,
      transoirtOptions: {
         pooling: {
            extraHeaders: {
               "my-custom-header": "ag-socket",
            },
         },
      },
   });
}
function emitString(key, payload) {
   NETWORK.emit(key, payload);
}
const socket = io("https://api.discoveryournextjourney.com");

// !SETUP SOCKET

function gfg() { 
  var minm = 10000; 
  var maxm = 99999; 
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
} 
let roomCode = gfg()


export default function MLBHome() {
  const router = useRouter();
  const [generateQR, setGenerateQR] = useState(null);
  const [linkQR, setLinkQR] = useState('https://zirolu.id/');
  const { Canvas } = useQRCode();

  const [payload, setPayload] = useState({
    stasiun: getCookie('stasiun'),
  });

  useEffect(() => {
    let urlContent = 'https://discoveryournextjourney.com/g/'+payload.stasiun+"/"+roomCode.toString()
    setLinkQR(urlContent)
  }, [linkQR])


  socket.on('trigger', (msg) => {
    console.log('trigger: ' + msg);
    if(msg == roomCode) {
      // alert("PINDAH PAGE")
      router.push('/v2/cam');
    }
  })

  return (
    <main className="flex fixed h-full w-full bg-kai overflow-auto flex-col justify-center items-center py-16 px-20 top-0" onContextMenu={(e)=> e.preventDefault()}>
      <div className='fixed top-[10rem] w-[95%]'>
          <Image src='/title-scan.png' width={823} height={221} alt='Zirolu' className='w-full' priority />
      </div>
      <dv className='relative w-[750px] flex justify-center items-center'>
        <div className='absolute w-full top-0 left-0'>
          <Image src='/qr-frame.png' width={717} height={717} alt='Zirolu' className='w-full' priority />
        </div>
        <div className='relative top-[3rem]'>
          <Canvas
              text={linkQR}
              options={{
                  errorCorrectionLevel: 'M',
                  margin: 3,
                  scale: 4,
                  width: 650,
                  color: {
                  dark: '#000000',
                  light: '#ffffff',
                  },
              }}
          />
        </div>
      </dv>
    </main>
  );
}
