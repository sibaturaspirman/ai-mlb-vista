'use client';

import * as fal from '@fal-ai/serverless-client';
import Image from "next/image";
import { useEffect, useState, useMemo } from 'react';
// import { Poppins} from "next/font/google";
// const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });
import { setCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import io from 'socket.io-client';

// @snippet:start(client.config)
fal.config({
    // credentials: 'FAL_KEY_ID:FAL_KEY_SECRET',
    requestMiddleware: fal.withProxy({
      targetUrl: '/api/fal/proxy', // the built-int nextjs proxy
      // targetUrl: 'http://localhost:3333/api/fal/proxy', // or your own external proxy
    }),
});

// DATA BASE AI
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DEFAULT_NEG_PROMPT = 'bikini, sexy, boobs, flaws in the eyes, flaws in the face, flaws, lowres, non-HDRi, low quality, worst quality,artifacts noise, text, watermark, glitch, deformed, mutated, ugly, disfigured, hands, low resolution, partially rendered objects,  deformed or partially rendered eyes, deformed, deformed eyeballs, cross-eyed,blurry';
let URL_RESULT = ''
let FACE_URL_RESULT = ''
let FIXSEEDPILIH = 0, PROMPTFIX = '';
let promptArea = [
    {
        gender:"male",
        prompt:[
            {
                text:"A photorealistic man 28 years old standing on a beach with a backdrop featuring a caravan, palm trees, and vibrant tropical colors of purple, orange, and yellow. The scene captures the warmth and energy of a tropical paradise, with the colors blending beautifully into the sunset, creating a lively and exotic atmosphere. The man is dressed casually, embodying the relaxed vibe of the beach setting. The camera is positioned at a slight low angle, capturing the vastness of the mountain range and the woman's determined expression. Shot with a wide-angle lens for a dramatic, immersive effect. HDR, 8K resolution, hyper-detailed.",
                seed:13047
            },
            {
                text:"A photorealistic man 28 years old standing on a beach with a backdrop featuring a caravan, palm trees, and vibrant tropical colors of purple, orange, and yellow. The scene captures the warmth and energy of a tropical paradise, with the colors blending beautifully into the sunset, creating a lively and exotic atmosphere. The man is dressed casually, embodying the relaxed vibe of the beach setting. The camera is positioned at a slight low angle, capturing the vastness of the mountain range and the woman's determined expression. Shot with a wide-angle lens for a dramatic, immersive effect. HDR, 8K resolution, hyper-detailed.",
                seed:700847
            },
            {
                text:"A photorealistic man 28 years old standing on a beach with a backdrop featuring a caravan, palm trees, and vibrant tropical colors of purple, orange, and yellow. The scene captures the warmth and energy of a tropical paradise, with the colors blending beautifully into the sunset, creating a lively and exotic atmosphere. The man is dressed casually, embodying the relaxed vibe of the beach setting. The camera is positioned at a slight low angle, capturing the vastness of the mountain range and the woman's determined expression. Shot with a wide-angle lens for a dramatic, immersive effect. HDR, 8K resolution, hyper-detailed.",
                seed:740827
            }
        ]
    },
    {
        gender:"female",
        prompt:[
            {
                text:"A photorealistic female 28 years old standing on a beach with a backdrop featuring a caravan, palm trees, and vibrant tropical colors of purple, orange, and yellow. The scene captures the warmth and energy of a tropical paradise, with the colors blending beautifully into the sunset, creating a lively and exotic atmosphere. The female is dressed casually, embodying the relaxed vibe of the beach setting. The camera is positioned at a slight low angle, capturing the vastness of the mountain range and the woman's determined expression. Shot with a wide-angle lens for a dramatic, immersive effect. HDR, 8K resolution, hyper-detailed.",
                seed:13047
            },
            {
                text:"A photorealistic female 28 years old standing on a beach with a backdrop featuring a caravan, palm trees, and vibrant tropical colors of purple, orange, and yellow. The scene captures the warmth and energy of a tropical paradise, with the colors blending beautifully into the sunset, creating a lively and exotic atmosphere. The female is dressed casually, embodying the relaxed vibe of the beach setting. The camera is positioned at a slight low angle, capturing the vastness of the mountain range and the woman's determined expression. Shot with a wide-angle lens for a dramatic, immersive effect. HDR, 8K resolution, hyper-detailed.",
                seed:700847
            },
            {
                text:"A photorealistic female 28 years old standing on a beach with a backdrop featuring a caravan, palm trees, and vibrant tropical colors of purple, orange, and yellow. The scene captures the warmth and energy of a tropical paradise, with the colors blending beautifully into the sunset, creating a lively and exotic atmosphere. The female is dressed casually, embodying the relaxed vibe of the beach setting. The camera is positioned at a slight low angle, capturing the vastness of the mountain range and the woman's determined expression. Shot with a wide-angle lens for a dramatic, immersive effect. HDR, 8K resolution, hyper-detailed.",
                seed:740827
            }
        ]
    },
    {
        gender:"hijab",
        prompt:[
            {
                text:"A photorealistic hijab female 28 years old standing on a beach with a backdrop featuring a caravan, palm trees, and vibrant tropical colors of purple, orange, and yellow. The scene captures the warmth and energy of a tropical paradise, with the colors blending beautifully into the sunset, creating a lively and exotic atmosphere. The female is dressed casually, embodying the relaxed vibe of the beach setting. The camera is positioned at a slight low angle, capturing the vastness of the mountain range and the woman's determined expression. Shot with a wide-angle lens for a dramatic, immersive effect. HDR, 8K resolution, hyper-detailed.",
                seed:700847
            },
            {
                text:"A photorealistic hijab female 28 years old standing on a beach with a backdrop featuring a caravan, palm trees, and vibrant tropical colors of purple, orange, and yellow. The scene captures the warmth and energy of a tropical paradise, with the colors blending beautifully into the sunset, creating a lively and exotic atmosphere. The female is dressed casually, embodying the relaxed vibe of the beach setting. The camera is positioned at a slight low angle, capturing the vastness of the mountain range and the woman's determined expression. Shot with a wide-angle lens for a dramatic, immersive effect. HDR, 8K resolution, hyper-detailed.",
                seed:740627
            },
            {
                text:"A photorealistic hijab female 28 years old standing on a beach with a backdrop featuring a caravan, palm trees, and vibrant tropical colors of purple, orange, and yellow. The scene captures the warmth and energy of a tropical paradise, with the colors blending beautifully into the sunset, creating a lively and exotic atmosphere. The female is dressed casually, embodying the relaxed vibe of the beach setting. The camera is positioned at a slight low angle, capturing the vastness of the mountain range and the woman's determined expression. Shot with a wide-angle lens for a dramatic, immersive effect. HDR, 8K resolution, hyper-detailed.",
                seed:720027
            }
        ]
    }
]
export default function GenerateAmero() {
    const router = useRouter();

    const [imageFile, setImageFile] = useState(null);
    const [styleGender, setStyleGender] = useState(null);
    const [character, setCharacter] = useState(null);
    const [styleFemale, setStyleFemale] = useState('normal');

    const [promptNegative, setPromptNegative] = useState(DEFAULT_NEG_PROMPT);
    const [CGF, setCGF] = useState(1.2);
    const [IDScale, setIDScale] = useState(0.8);
    const [SEED, setSEED] = useState(13047);
    const [numSteps, setNumSteps] = useState(4);
    
    const [numProses, setNumProses] = useState(0);
    const [numProses1, setNumProses1] = useState(null);

    const [payload, setPayload] = useState({
      stasiun: getCookie('stasiun'),
      stasiunName: getCookie('stasiunName'),
    });

    // Result state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [resultFaceSwap, setResultFaceSwap] = useState(null);
    const [logs, setLogs] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    // @snippet:end
    useEffect(() => {
        // Perform localStorage action
        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem('faceImage')
            setImageFile(item)
        }
    }, [imageFile])

    const generateAI = () => {
        setNumProses1(true)
        
        if(styleGender =='m'){
            gtag('event', 'ClickButton', {
                event_category: 'Button',
                event_label: 'Male - '+payload.stasiunName,
                event_action: 'SurpriseMe'
            })
            setCookie('styleGender', 'Male');

            let randNumb = getRandomInt(0,2)
            // let randNumb = 1
            PROMPTFIX = promptArea[0].prompt[randNumb].text
            FIXSEEDPILIH = promptArea[0].prompt[randNumb].seed
    
            setTimeout(() => {
                generateImage()
            }, 500);
        }else if(styleGender =='f'){
            if(styleFemale == 'normal'){
                gtag('event', 'ClickButton', {
                    event_category: 'Button',
                    event_label: 'Female - '+payload.stasiunName,
                    event_action: 'SurpriseMe'
                })
                setCookie('styleGender', 'Female');

                let randNumb = getRandomInt(0,2)
                // let randNumb = 2
                PROMPTFIX = promptArea[1].prompt[randNumb].text
                FIXSEEDPILIH = promptArea[1].prompt[randNumb].seed
        
                setTimeout(() => {
                    generateImage()
                }, 500);
            }else{
                gtag('event', 'ClickButton', {
                    event_category: 'Button',
                    event_label: 'Hijab - '+payload.stasiunName,
                    event_action: 'SurpriseMe'
                })
                setCookie('styleGender', 'Hijab');

                let randNumb = getRandomInt(0,2)
                // let randNumb = 2
                PROMPTFIX = promptArea[2].prompt[randNumb].text
                FIXSEEDPILIH = promptArea[2].prompt[randNumb].seed
        
                setTimeout(() => {
                    generateImage()
                }, 500);
            }
        }

    }

    const image = useMemo(() => {
      if (!result) {
        return null;
      }
      if (result.image) {
        return result.image;
      }
      
    }, [result]);
    const imageFaceSwap = useMemo(() => {
      if (!resultFaceSwap) {
        return null;
      }
      if (resultFaceSwap.image) {
        return resultFaceSwap.image;
      }
      return null;
    }, [resultFaceSwap]);
    
    const reset = () => {
      setLoading(false);
      setError(null);
      setResult(null);
      setResultFaceSwap(null);
      setLogs([]);
      setElapsedTime(0);
    };
    const reset2 = () => {
      setLoading(false);
      setError(null);
      // setLogs([]);
      setElapsedTime(0);
    };

    const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))

    const generateImage = async () => {
        console.log(PROMPTFIX)
        console.log(FIXSEEDPILIH)
        setNumProses(1)
      reset();
      // @snippet:start("client.queue.subscribe")
      setLoading(true);
      const start = Date.now();
      try {
        const result = await fal.subscribe(
            'fal-ai/pulid',{
            input: {
                reference_images: [{
                        "image_url": imageFile
                    },
                    {
                        "image_url": imageFile
                    },
                    {
                        "image_url": imageFile
                    },
                    {
                        "image_url": imageFile
                    }
                ],
                prompt: PROMPTFIX,
                negative_prompt: promptNegative,
                seed: FIXSEEDPILIH,
                num_images: 1,
                guidance_scale: CGF,
                num_inference_steps: numSteps,
                image_size: {
                    height: 768,
                    width: 768
                },
                id_scale: IDScale,
                mode: "fidelity"
            },
            pollInterval: 5000, // Default is 1000 (every 1s)
            logs: true,
            onQueueUpdate(update) {
              setElapsedTime(Date.now() - start);
              if (
                update.status === 'IN_PROGRESS' ||
                update.status === 'COMPLETED'
              ) {
                setLogs((update.logs || []).map((log) => log.message));
                // console.log(update)
              }
            },
          }
        );
        setResult(result);
        URL_RESULT = result.images[0].url;
        console.log(URL_RESULT)
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem("generateURLResult", URL_RESULT)
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
        setElapsedTime(Date.now() - start);
        generateImageSwap()
      }
      // @snippet:end
    };


    const generateImageSwap = async () => {
        setNumProses(2)
        reset2();
        // @snippet:start("client.queue.subscribe")
        setLoading(true);
        const start = Date.now();
        try {
        const result = await fal.subscribe(
            'fal-ai/face-swap',
            {
            input: {
                // base_image_url: URL_RESULT,
                // swap_image_url: '/amero/base/'+character
                base_image_url: URL_RESULT,
                swap_image_url: imageFile
            },
            pollInterval: 5000, // Default is 1000 (every 1s)
            logs: true,
            onQueueUpdate(update) {
                setElapsedTime(Date.now() - start);
                if (
                update.status === 'IN_PROGRESS' ||
                update.status === 'COMPLETED'
                ) {
                setLogs((update.logs || []).map((log) => log.message));
                }
            },
            }
        );
        setResultFaceSwap(result);
        FACE_URL_RESULT = result.image.url;

        // emitStrsing("sendImage", result.image.url);

        toDataURL(FACE_URL_RESULT)
        .then(dataUrl => {
            // console.log('RESULT:', dataUrl)

            if (typeof localStorage !== 'undefined') {
                localStorage.setItem("resulAIBase64", dataUrl)
                localStorage.setItem("faceURLResult", FACE_URL_RESULT)
            }
        
            setTimeout(() => {
                router.push('/result');
            }, 500);
        })
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
            setElapsedTime(Date.now() - start);
        }
        // @snippet:end
    };
    const backHome = () => {
        gtag('event', 'ClickButton', {
            event_category: 'Button',
            event_label: 'GenderSelection - '+payload.stasiunName,
            event_action: 'BackToHome'
        })
    }

    return (
        <main className="flex fixed h-full w-full bg-kai2 overflow-auto flex-col justify-center items-center py-16 px-20">
            {numProses1 && 
                <div className='absolute top-0 bg-loading left-0 right-0 bottom-0 flex items-center justify-center flex-col'>
                    <div className='relative w-[80%] overflow-hidden'>
                        <div className='relative w-full'>
                            <Image src='/loading.png' width={773} height={158} alt='Zirolu' className='w-full' priority />
                        </div>
                    </div>
                    <div className='animate-upDownCepet relative p-8 mt-24 text-4xl border-2 border-[#191657] text-center bg-[#191657] text-[#fff] font-bold rounded-lg'>
                        <p>{`Please wait, loading...`}</p>
                        <p>{`Process : ${(elapsedTime / 1000).toFixed(2)} seconds (${numProses} of 2)`}</p>
                        {error}


                        {/* <div>PREVIEW SETUP : {SEED} / {CGF} / {numSteps} / {IDScale}</div> */}
                    </div>
                </div>
            }
            {/* LOADING */}
            {/* PILIH STYLE */}
            <div className={`fixed top-14 w-[70%] ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
                <Image src='/title-select.png' width={686} height={112} alt='Zirolu' className='w-full' priority />
            </div>
            <div className={`relative w-full ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
                <div className='relative mt-[-35vh] w-full'>
                    <div className='relative w-full hiddenx'>
                        <div className='relative w-[60%] mb-12 mx-auto'>
                            <Image src='/title-identity.png' width={542} height={119} alt='Zirolu' className='w-full' priority />
                        </div>
                        <div className='w-[72%] mx-auto'>
                            {/* GENDER FIX */}
                            <ul className='choose mod6'>
                                <li className='mb-10'>
                                    <input
                                    id='choose_gender1'
                                    type="radio"
                                    name='choose_gender'
                                    value="m"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender1">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/male.png"
                                            alt="icon"
                                            width={541}
                                            height={178}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li>
                                    <input
                                    id='choose_gender2'
                                    type="radio"
                                    name='choose_gender'
                                    value="f"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender2">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/female.png"
                                            alt="icon"
                                            width={541}
                                            height={178}
                                            priority
                                        />
                                    </label>
                                </li>
                            </ul>
                        </div>
                        {styleGender == 'f' &&
                        <div className="mt-10">
                            <ul className='choose4'>
                                <li>
                                    <input
                                    id='choose_female3'
                                    type="radio"
                                    name='choose_female'
                                    value="normal"
                                    onChange={(e) => setStyleFemale(e.target.value)}
                                    />
                                    <label htmlFor="choose_female3" className='text-5xl'>without Hijab</label>
                                </li>
                                <li>
                                    <input
                                    id='choose_female2'
                                    type="radio"
                                    name='choose_female'
                                    value="hijab"
                                    onChange={(e) => setStyleFemale(e.target.value)}
                                    />
                                    <label htmlFor="choose_female2" className='text-5xl'>with Hijab</label>
                                </li>
                            </ul>
                        </div>
                        }
                    </div>
                </div>
                <div className={`fixed left-0 bottom-[5rem] w-full`}>
                    <div className="relative w-[70%] mx-auto flex justify-center items-center flex-col">
                        <button className={`w-full relative mx-auto flex justify-center items-center ${!styleGender ? 'hidden' : ''}`} onClick={generateAI}>
                            <Image src='/btn-suprise.png' width={830} height={192} alt='Zirolu' className='w-full' priority />
                        </button>
                        <Link href='/home' className="relative w-[60%] mx-auto flex justify-center items-center mt-10" onClick={backHome}>
                            <Image src='/btn-back.png' width={772} height={135} alt='Zirolu' className='w-full' priority />
                        </Link>
                    </div>
                </div>
            </div>
            {/* !PILIH STYLE */}
        </main>
    );
}
