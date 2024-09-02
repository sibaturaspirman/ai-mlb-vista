'use client';

import Link from 'next/link';
import Image from "next/image";
import { getCookie } from 'cookies-next';
import React,{ useEffect, useState, useRef } from 'react';
import { useQRCode } from 'next-qrcode';
// import io from 'socket.io-client';
// import { Poppins} from "next/font/google";
// const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });
// import BtnHexagon2 from "../components/BtnHexagon2";


export default function Result() {
    const [imageResultAI, setImageResultAI] = useState(null);
    const [generateQR, setGenerateQR] = useState(null);
    const [linkQR, setLinkQR] = useState('https://zirolu.id/');
    const [loadingDownload, setLoadingDownload] = useState(null);
    let componentRef = useRef();

    const [payload, setPayload] = useState({
      name: 'MLB',
      phone: '001',
      stasiun: getCookie('stasiun'),
      stasiunName: getCookie('stasiunName'),
    });
    const { Canvas } = useQRCode();

    useEffect(() => {
        // Perform localStorage action
        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem('resulAIBase64')
            const item2 = localStorage.getItem('faceURLResult')
            setImageResultAI(item)
            // setLinkQR(item2)
        }
    }, [imageResultAI, linkQR])

    const downloadImageAI = () => {
        gtag('event', 'ClickButton', {
            event_category: 'Button',
            event_label: 'ResultPage - '+payload.stasiunName,
            event_action: 'CollectYourPhoto'
        })
        import('html2canvas').then(html2canvas => {
            html2canvas.default(document.querySelector("#capture"), {scale:1}).then(canvas => 
                uploadImage(canvas)
            )
        }).catch(e => {console("load failed")})
    }
    const uploadImage = async (canvas) => {
        setLoadingDownload('≈')

        canvas.toBlob(async function(blob) {
            let bodyFormData = new FormData();
            bodyFormData.append("name", getCookie('styleGender'));
            bodyFormData.append("phone", payload.stasiun+' - '+payload.stasiunName);
            bodyFormData.append("totemId", payload.stasiun);
            bodyFormData.append("file", blob, payload.name+'-mlb-ai-zirolu.png');
          
            const options = {
                method: 'POST',
                body: bodyFormData,
                headers: {
                    'Authorization': 'af879432-317d-40b4-88f8-d4c02267112b:VDNwFD1gOp86AKVEqlCIbfVN4evXoBxL',
                    'Accept': 'application/json',
                }
            };
            
            await fetch('https://api.stepintonewsensation.com/v1/photoai', options)
                .then(response => response.json())
                .then(response => {
                    // console.log(response)
                    // console.log(response.file)
                    setLinkQR(response.file)
                    setGenerateQR('true')
                    setLoadingDownload(null)
                })
                .catch(err => {
                    if (typeof localStorage !== 'undefined') {
                        const item = localStorage.getItem('faceURLResult')
                        setLinkQR(item)
                        setGenerateQR('true')
                        setLoadingDownload(null)
                    }
                });
        });
    }
    const backHome = () => {
        gtag('event', 'ClickButton', {
            event_category: 'Button',
            event_label: 'ResultPage - '+payload.stasiunName,
            event_action: 'BackToHome'
        })
    }

    

    return (
        <main className="flex fixed h-full w-full bg-kai2 overflow-auto flex-col justify-center items-center py-16 px-20">
            {/* QR */}
            {generateQR && 
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col z-40 bg-kai2 bg-opacity-0'>
                    <div className='fixed top-0 mx-auto w-[85%] mt-24'>
                        <Image src='/title-scan2.png' width={815} height={195} alt='Zirolu' className='w-full' priority />
                    </div>
                    <div className='relative mt-[-14vh] w-[60%] mx-auto flex items-center justify-center canvas-qr border-4 border-black' onClick={()=>{setGenerateQR(null)}}>
                        <Canvas
                        text={linkQR}
                        options={{
                            errorCorrectionLevel: 'M',
                            margin: 3,
                            scale: 4,
                            width: 500,
                            color: {
                            dark: '#000000',
                            light: '#ffffff',
                            },
                        }}
                        />
                    </div>
                    {/* <p className={`text-center font-semibold text-2xl lg:text-4xl mt-10 ${poppins.className}`}>Scan this QR Code to Download your image.</p> */}

                    {/* <div className={`relative w-full  ${showEmail ? 'hidden' : ''}`}>
                    <div className="relative w-[60%] mx-auto flex justify-center items-center flex-col mt-5">
                        <button className="relative mx-auto flex justify-center items-center" onClick={()=>setSendEmailGak('true')}>
                            <Image src='/btn-send-email.png' width={410} height={96} alt='Zirolu' className='w-full' priority />
                        </button>
                        <a href={linkQR} target='_blank' className="relative mx-auto flex justify-center items-center">
                            <Image src='/btn-download-image.png' width={410} height={96} alt='Zirolu' className='w-full' priority />
                        </a>
                    </div>
                    </div> */}
                    {/* <Link href='/' className='text-center font-semibold text-lg mt-2 p-20' onClick={()=>{setGenerateQR(null)}}>Tap here to close</Link> */}
                    {/* <a href='/home' className='text-center font-semibold text-4xl py-20 pb-36 p-40'>Tap here to close</a> */}

                    <div className={`fixed left-0 bottom-8 w-full`} onClick={backHome}>
                        <div className="relative w-[60%] mx-auto flex justify-center items-center flex-col">
                            <Link href='/home' className="relative w-full mx-auto flex justify-center items-center pb-14">
                                <Image src='/btn-back.png' width={772} height={135} alt='Zirolu' className='w-full' priority />
                            </Link>
                        </div>
                    </div>
                </div>
            }
            {/* QR */}

            <div className={generateQR ? `opacity-0 pointer-events-none` : ''}>
                {/*<div className='relative m-auto w-[65%]'>
                    <Image src='/title-discover.png' width={626} height={160} alt='Zirolu' className='w-full' priority />
                </div>*/}
                {imageResultAI && 
                <div className='relative w-[95%] mt-10 mx-auto flex justify-center items-center' onClick={downloadImageAI}>
                    <div className='relative' id='capture' ref={(el) => (componentRef = el)}>
                        <Image src={imageResultAI}  width={1080} height={1920} alt='Zirolu' className='relative block w-full'></Image> 
                    </div>
                </div>
                }
                {loadingDownload && 
                    <div className='rrelative p-5 mt-14 border-2 border-[#191657] text-center bg-[#191657] text-[#fff] text-4xl overflow-auto no-scrollbar w-[60%] mx-auto rounded-lg'>
                        <p>Please wait, loading...</p>
                    </div>
                }
                <div className={`relative w-full ${loadingDownload ? 'hidden' : ''}`}>
                    <div className={`w-full`}>
                        <div className={`w-full mt-14`}>
                            <div className="relative w-[90%] mx-auto flex justify-center items-center flex-col">
                                <button className="w-full relative mx-auto flex justify-center items-center mb-10" onClick={downloadImageAI}>
                                    <Image src='/btn-collect.png' width={480} height={96} alt='Zirolu' className='w-full' priority />
                                </button>
                                <Link href='/home' className="relative w-[80%] mx-auto flex justify-center items-center" onClick={backHome}>
                                    <Image src='/btn-back.png' width={772} height={135} alt='Zirolu' className='w-full' priority />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
