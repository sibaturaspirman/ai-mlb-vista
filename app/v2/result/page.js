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
            bodyFormData.append("name", payload.name);
            bodyFormData.append("phone", payload.phone);
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
            
            await fetch('https://api.discoveryournextjourney.com/v1/photoai', options)
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
        <main className="flex fixed h-full w-full bg-kai2 overflow-auto flex-col justify-center items-center py-16 px-20" onContextMenu={(e)=> e.preventDefault()}>
            {/* QR */}
            {generateQR && 
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col z-40 bg-kai3 text-black bg-opacity-0'>
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

                    <div className={`fixed left-0 bottom-0 w-full`}>
                        <div className="relative w-[80%] mx-auto flex justify-center items-center flex-col" onClick={backHome}>
                            <Link href='/v2/home' className="relative w-full mx-auto flex justify-center items-center pb-14">
                                <Image src='/btn-back2.png' width={772} height={135} alt='Zirolu' className='w-full' priority />
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
                <div className='relative w-[92%] mt-10 mx-auto flex justify-center items-center  border-4 border-[#ffffff] rounded-sm' onClick={downloadImageAI}>
                    <div className='relative w-full' id='capture' ref={(el) => (componentRef = el)}>
                        <Image src={imageResultAI}  width={624} height={792} alt='Zirolu' className='relative block w-full'></Image>

                        <Image width={624} height={792} alt='Zirolu' className='absolute  block left-0 top-0 w-full mx-auto pointer-events-none z-10' src='data:image/png;base64,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EKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAJAAgAoEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhBoAIAABCCQAUAACAEgQoAAEAIAhUAAIAQBCoAAAAhCFQAAABCEKgAAACEIFABAAAIQaACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAgC30la98ZS8FI1ABAAC20Hvvvfe155577nIKRKACAABsofv37/+pu3fvvpICEagAAABb6IMPPii+973v/bXLly9fT0EIVAAAgC10586d9P3vf7+op6jnz59/LgUgUAEAALbU/v5+WT1d3tnZ+Vo1SX3s+1EFKgAAwBb6+Z//+fTFL36x+OQnP5k+/OEP7xVF8bX0mAlUAACALfTss89OH5/4xCfKenj69NNPv/DZz372sR6aJFABAAC2UDU1TfX09GMf+1hRvS4/9KEPlRcvXnxlb2/vK+kxEagAAABb6NKlS6manJYf+chH6ulpqgK1ePLJJ4snnnji9R/5kR/ZS4+BQAUAANhC58+fT0899VRRPerpaR2oqQrUdOHChY8URXGrmqSe+qFJAhUAAGAL7e7uToO0idPi4sWLdZzWy3zrKepe9dmr6ZQJVAAAgC107ty5sgrSeqlvUS/3bQJ1GqlVoJbVhPXaj/3Yj11Pp0igAgAAbKEqUFMVotMwzR5FE6n1FLWsfvPqc88990I6JQIVAABgCxWVeplvHan55LR61HFa71Et6n2qOzs7r/+jj398L50CgQoAALCFqj5NTaCWTaTW09M6Ssvq83qJ7/Qgper13tsf/ejr6RQIVAAAgC1UTUbrJbx1gE6jtHnUwVq0cdoEavndS5d+6O9/5jNp03YTAAAA26hoAnW2nLd9PHz4sCjLMjWPovpt+c8/+cn0g/fupT/93e+mTRGoAAAAW6ieoFaPognUeno63Xv64MGDOlDLyWSS6kcbqrV/8Mwz6bNVpH7m7t20CZb4AgAAbKF6MlpfNVNPUatH0SznnS7pbZ7bCWvRPNLDCxfS37pyJd2rPt8EgQoAALCd3qlP8m0CdXovarvctwnU6aP9rn6uJq7pe5cupb/3uc+lTRCoAAAAW+i99957sXq6XUdnNjEt21BtP+s8T4P133/sY+kbn/50GppABQAA2EIvvvji7clk8lIdqHWUNqE6W87bhmozOS2zSev0cesHfzC9+/TTaUgCFQAAYEv9wi/8wltVpL7cHJY0i9AsUmfvm5Btg3X6/Lc///n03SeeSEMRqAAAAFvsF3/xF1+rnt7Ip6PNxLTI96buZmE6/U1RpAdVnP6dKlKHOjRJoAIAAGy5/f39l4ui+E42MZ07OKkO0536ff3cmaT+8VNPpW9+9rNpCAIVAABgy7388st3qki9WkXqnfbamSZOHy3trZ8f7UmdBWv9+Bef/nT69qc+ldYlUAEAAEi/9Eu/dLt6ejk7EGlu3+ksTNspavu6+fwfPvts+q9PPpnWIVABAACY+uVf/uV6L+pX60htQvXRXtTs0KRprLaPLFT/7he+kL574UI6KYEKAACwhcqULvd9fvPmzXqK+q18eW8+OV31+N6lS9PrZ05KoAIAAGynry374u7duy9WT7f7lvmuWu5bFEUq0skJVAAAgO30QjVFfaXvi9dee60+NOnFeolvu9y3vlZmGqTtc/YoOp+flEAFAADYXjeqSP3LfV9UkfpOWZZ/vQrOIj8Maadngpp/Xk9RT0qgAgAAbLfXqkh9rveLShWdrxXNdDRfynuuG6j18t76d+nkBCoAAMB2qw9L+loVqXt9X1bRebOK1N/r23M6naQ28Vpky31PSqACAACwVz1e7/ui3o/62Xfffeniw4fze07r5+r7nSxSp/tPLfEFAABgTfWhSa/2ffHnvvnNO3/uG9+Y7UPtvQe1WeLrFF8AAACGcL2K1Ot9X3zyj/4o/cnf+73ZHtSd/NEJ1ZMSqAAAAOReXXZo0p9855307B/+4dzJve0VM0V2gNJJCVQAAAC6lh6a9Ge//e309PvvT4O0Pd23yPagOiQJAACAIe2lg0i93P3iiQ8+SH/+H//jlB+atJNNT01QAQAAGFq9zPeVvi8+9N576f//3d9dPNVXoAIAAHBS5ZL3zfP1/SWHJn3+938//b//4T/MLfM955oZAAAAjqvsvC7TQpxOn6vcfPVHHzx4oe/f+IlqivqZ//7f5yapJqgAAAAcS52R5Yrv82j9yP7+6xfL/l//1L/8l9NDkyzxBQAA4ESa6ejS73K71eNPPXiQdnsi9an33ks//Tu/M33tmhkAAABOJF/K213m2/3NhSpOP7+/3/vvfPq//bf0k//6Xx9MUNPJ7SYAAAC2UnnEzyfN8yerQL1bRegfnDu38Df1gUn/8yMfSRP3oAIAAHBc+bSz76CkvsezDx+mH1gySf0z77wz3Y96UgIVAABgSy07yTeP1EnP55+vIvVCz37UJx48SD/+b/5NOimBCgAAsOWOGqrto17g+6NLDk1ah0AFAADYcn33n7aP7gS1/eyJKk5/uJqkDkmgAgAAbLH2AKRunLbT0u70NH88NZmkzy3Zj3oSTvEFAADYUn1Xyqx65L9rD1j6VDVFrY9F+h89J/selwkqAADAliuP+Kinpvs9z89UkfrkAPtRBSoAAMCWWxajR33U09QrDx5M96WuQ6ACAABsoe7BSO3r7sFIy6J0P81PUesTfT+35qFJAhUAAIClJ/guC9Lu5/XjyckkfWqNQ5MckgQAALDlVsVp2fPc/r7Inovm83XuRhWoAAAArDwYqXvdTFeR5iP1pAQqAADAljrKqb35YzZFLYpHU9RqYjqN0+qzIvUH7FEJVAAAAKbKtOSgpCo+96sQrcO0/XymOFjoWx9wVMdqmU5OoAIAANAbp7PJaRWe+evZb+upab3ntAnXnTpk08kJVAAAAGbK1LPMtwnQ/HVX0UxYTVABAAA4sXLJZ9PgrMIzv1Zm+mhjtNl/WiuacDVBBQAAYC1lWj49nS7xrQO0XerbvK4jNTXXytShupMckgQAAMCA2kBN7cFIzdLd9rCkNk4nzf7T+ndF894EFQAAgEG0y33bJbxlFqOTbBnvbAlw/ePmJN9iyf7UoxKoAAAATJX5c3bo0cIS3zR/DU3LPagAAAAMpp2ItmE6d+1MZ5I66fydQAUAAGAt5YrPy2b57twkNfVPUYu0HoEKAACw5eqwzCO13XeaUpqboC6c8JvWm5h2CVQAAAAWp5/ZHtSDt4vT0zxQ29/tpJMTqAAAAMwr5nN1Yalvmp+itu/bSey5dDLrxC0AAABjVpZzz33Le/NHe/3MSZmgAgAAMK8O0npiWj/y62bar9N8rObfWeILAADAcLJrZlLP0t6+g5PavaiumQEAAODYiqN81i7zzUJ19lWaX/Lb/f647EEFAADYcnNRWoVokX1WFosZu+ygpPb5pExQAQAAmJqmaL3nNHtflI+Ssxufc9PUellwdn/qSZigAgAAMGeamG1otoclNcqex6SJ03UnqAIVAABgixXZ89zssz0gqX4ul2dn2Z70m5o4LU+eqAIVAACAmbnpaXaK7+y7zOzamXqC2kxa11niaw8qAAAAC4rmsKRlZnGaTU9nV9OckAkqAAAAi9rQrJ6LVVPRdo9qc3dqMkEFAABgHUXf6zpO2+dl4dmErAkqAAAAw2vDtLViH2pa8ruTEKgAAAD0KvLDkrrfLf54rRN8awIVAACAmb7wbEO16P4mvyu14R5UAAAATqzoe78sSnPdvamHnPx7GIEKAADA1EJcZif59v6mu+fUEl8AAAAGlU9CswOTFqapdZA2UVrUz2sekuSaGQAAAOa10Tn9H/NLfXNzodoekrRGpJqgAgAAMFOkzp2o+ZS087tujE73o64RqCaoAAAATPWmZbPct/ewpGZimkfsOkxQAQAAWDzJN5+EduIzj9WFQ5PWCFWBCgAAsMWWTU1nhyMt2VdapBWn/p6QQAUAAGBe91qZbA9qd2JaNCE7fbgHFQAAgHUsXd6bneDbPSApD9fU8/4kBCoAAADzuqGZLfFd2HOaL/9d8x5UgQoAAMC8dnK64nCkqeb03tnnJqgAAAAcV7HkffdgpPZ93+9ne06zJcH2oAIAAHAs9ayz6LzPFXmkLtmLOjs8KT/xdw0CFQAAYAsVh7w/yn7SlXennoBABQAA2ELLZp3t0t3ZdDR7Pfeb7PW6hyO1BCoAAMAWKlZ9li3dPXjR8+vOPtWisxz4JAQqAAAA87qHHTV7TPPH9DdtwLan+TbPJyVQAQAAmJdHZs8JvrXeK2fsQQUAAGBj6ujMwrOY+6qYTVv79qoel0AFAABguXyC2hOg+SFJ657iu5sAAACgR5HtM50L0fZ938TUIUkAAAAMLj8EKc1fLzP3ebsM2BJfAAAAhpAffHSUOWgeprMJ6xqRaokvAAAAi7LlvEv3nqbmrtQsUtfZhypQAQAAWJQdjjS357RzR2r7+boHJNUs8QUAAGDektgs8qlqo8w/twcVAACAoRy2/7SO0LL72zXDtCVQAQAAttxCkLbBmU1SZ6+aJb7d+0+LZf/WMQhUAAAAFsLyKJPR7pUz6+5DFagAAAD0a6elPXtPp9qDlLKTfNchUAEAAFiUB2f93LxeeldqG6lrEKgAAADMzBKzs2S36NuPmn1XmKACAACwMZ3gLI74u5PaTQAAALDEYQcfzU7zbfejrkGgAgAAsFzPlTPTt53frHuCb80SXwAAABYUnddLD0dq70DNDlI6KYEKAADAcismo9NYzaLUEl8AAAAGNZuWdk7mXRmg7V2payz1NUEFAABgzixJe5bsFqmzzLdZ4lu0S3zXWOYrUAEAAJjTd8/psvAslhyidBICFQAAgKli2Wd1hPYE6Nxy3uYk33UyVaACAACwoOh5v3CSbzM9XTdMWwIVAACAXssmqst2mRaumQEAAOCkiiN+tuz7fJJ68IFTfAEAANiQuVN7ez6b+84pvgAAAJzEYTlZZL+rl/D2zkftQQUAAGBdRw3L4gR/c1wCFQAAgJmV8dnZX1q0n7Wn+abkmhkAAAAej9k+1GL9uapABQAAYOXkc9UBSWnNq2VyAhUAAIDVmkOQlkVse9XMujNUgQoAAMBq2ZQ0n5zWy3pnS3st8QUAAGBTVk5N26tl2nitn9e8bkagAgAAMLVwlUwVnAs7TLt7TpspatH33TEJVAAAgC23dOrZs6907rTe/Ps1p6e13QQAAMBWO2zuOV3q2+w5LVMnaPOp6Zr7UE1QAQAAOFwTn5s8yVegAgAAcHR9e1Dzr9PJCVQAAIAt1z0cadXpvd07Uef+1im+AAAAbMLSUM2nqGue3JsTqAAAACzXHnzU7C8tss9mU9TmqhnXzAAAADCszlUy04+6P8nfDDRFFagAAADM6wRnPjXtfl7kE1bXzAAAAPBYtMt6s0hdx24CAACAI5rtQ21jtAnUdaenNRNUAAAAjq8N0vZqmTpUHZIEAADARrWn9mYBWnSvmlnzDtSaQAUAAGBRfpVMc8XM3EFJzbLe2ScDLPUVqAAAACxasVy36PxmqCtnBCoAAABzikPez33XTlrbE33XIFABAADo1ReqRfe7NaM0J1ABAABYlJ3Su/Qn+VUzKTkkCQAAgA3oxGevPGIHiFSBCgAAwLGsWvq7DoEKAADAgu5e02LZJNUeVAAAADZtbiqa34va83nvd8ckUAEAAOjVzkYXTu5Nj5b1diO2KE6eqQIVAACAY5klaDZVLY5yqNIhBCoAAABTfeE50xee+WfZSb4nJVABAAC2UJWSN3s+O4jSvtDMl+5m388t+xWoAAAAHNe5lG5Ucfn1/LM6No+UmPVe07T6wKSTEKgAAABbqsrJl6rH7SXfLb5fMSF1DyoAAAAnVkXlnSoKr1Yv72SfTfWmaD057YnUIeK0JlABAAC2WDNBffGIv+1fxts9LOmEBCoAAMCWO5/SW6lzaNKxMrM99dchSQAAAKzrQko3qrx8s++77nUz+QFJ09ft1HTNq2YEKgAAAFP3Urpe5eU7+Wfdk32LbAnv7FUTresSqAAAAEx99ODQpBe7J/sWR9lX2kxO1wlVgQoAAMDMpSpOq9R8ae7DFRPS2efN3ajrEKgAAADMeTqltyYpvdz9vOg8Tw0wOW0JVAAAABZ8NKXXqqevLvt+dlDSzs7RlgAfgUAFAACg1w+kdL16emdlftYT1IGmqAIVAACApfZTerF6ut1OTBeumOn83iFJAAAAbMRnqjj9fkov7Tfv+/ah9oXqSQhUAAAAVvrDixdv/69z52bv+6apQxCoAAAAHOpOFajfyyI1N1SwClQAAACO5H9WgXq/c99pd0/qOgQqAAAAR/Y/zp+vD07qPTAprXndjEAFAADgyCbpIFLri2XmTvMtS0t8AQAAOF371aT0/5w7N7/3tF7620TqSQlUAAAAju1eFajv55Ha2Zt6EgIVAACAE6kD9cHOzqMlvmtGqkAFAADgxN7b3U1lE6Y7ZZnWIVABAAA4sTpJv19Fajs9NUEFAADgsZlUcVpPUgUqAAAAj119su/9c+fSOnYTAAAADOCDKlDPTSbppExQAQAAGMz+zskzU6ACAAAQgkAFAAAgBIEKAABACAIVAACAEAQqAAAAIQhUAAAAQhCoAAAAhCBQAQAACEGgAgAAEIJABQAAIASBCgAAQAgCFQAAgBAEKgAAACEIVAAAAEIQqAAAAIQgUAEAAAhh44F66+LFFxIAAAAcYuOBWpblrVvnz7966/LlywkAAICzaC+dglNZ4lvu7Fwv7959+xsXL15LAAAAnBm3nnjilXrwmE5B8c0LF8p0ioqyfCPt7Ny8eu/e7QQAAEBIt86ff64aNr5evXwunZJTPySpLIprdX2bpgIAAMRTb8+cTk13dt5OpxintVOfoM79LzdNBQAACKM+5LYaKNZT0730GDzWa2ZMUwEAAB6/6dT0woVXm72me+kxeawT1JxpKgAAwOl73FPT3GOdoOZMUwEAAE5PlKlpLswENWeaCgAAsDmRpqa5MBPUnGkqAADA8CJOTXMhJ6g501QAAID1RZ2a5kJOUHOmqQAAACcXfWqaCz9B7XirKIqXTFMBAAAOdxamprnwE9SO+v+4b3/jwoXrCQAAgF5naWqaO2sT1JxpKgAAQMc/efLJr+w8fPh6KorL6Yw5axPUXD1NfffWE0+8kgAAALbcdGr6xBNf29nf/9pZjNPaWZ6g5m5X09SrpqkAAMA2OstT09xZnqDm9kxTAQCAbXPr4sW9auh46yxPTXNjmaDmTFMBAIDRu3Xhwl+rBnU3xhCmrbFMUHOmqQAAwGi1U9Nq0vjamOK0NsYJas40FQAAGI0xTk1zY5yg5kxTAQCAM2/MU9Pc2CeoOdNUAADgzBn71DQ39glqzjQVAAA4M7Zlaprbpglq7naxu/vi1ffeeycBAAAEs01T09y2BupUUZZvTHZ2vpMAAACCqDrlZ6unF9IW2upABQAAII5t2oMKAABAYAKV/9t+HQsAAAAADPK3nsaOsggAAGBBUAEAAFgQVAAAABYEFQAAgAVBBQAAYEFQAQAAWBBUAAAAFgQVAACABUEFAABgQVABAABYEFQAAAAWBBUAAIAFQQUAAGBBUAEAAFgQVAAAABYEFQAAgAVBBQAAYEFQAQAAWBBUAAAAFgQVAACABUEFAABgQVABAABYEFQAAAAWBBUAAIAFQQUAAGBBUAEAAFgIF/DC7Ic67ToAAAAASUVORK5CYII=' />
                    </div>
                </div>
                }
                {loadingDownload && 
                    <div className='rrelative p-5 mt-14 border-2 border-[#b1454a] text-center bg-[#CF1F29] text-[#fff] text-4xl overflow-auto no-scrollbar w-[70%] mx-auto rounded-lg'>
                        <p>Please wait, loading...</p>
                    </div>
                }
                <div className={`relative w-full ${loadingDownload ? 'hidden' : ''}`}>
                    <div className={`w-full`}>
                        <div className={`w-full mt-14`}>
                            <div className="relative w-[80%] mx-auto flex justify-center items-center flex-col">
                                <div className="w-full relative mx-auto flex justify-center items-center" onClick={downloadImageAI}>
                                    <Image src='/btn-collect.png' width={480} height={96} alt='Zirolu' className='w-full' priority />
                                </div>
                                <Link href='/v2/home' className="relative w-full mx-auto flex justify-center items-center" onClick={backHome}>
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
