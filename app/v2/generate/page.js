'use client';

import * as fal from '@fal-ai/serverless-client';
import ReactPlayer from 'react-player'
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from 'react';
// import { Poppins} from "next/font/google";
// const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });
import { getCookie } from 'cookies-next';
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

const DEFAULT_NEG_PROMPT = '(((double head))), (((double face))), (((duplicate))), (((cloned face))), (((boobs))), (((sexy))), (((cleavage))), extra head, extra face, (((((ugly)))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), blurry, low resolution, low quality, pixelated, interpolated, compression artifacts, noisey, grainy';
let URL_RESULT = ''
let FACE_URL_RESULT = ''
let FIXSEEDPILIH = 0
let seedGenerate = [
    {number : 13290},
    {number : 13294},
    {number : 13084},
    {number : 13229}
];
let seedGenerate2 = [
    {number : 1690},
    {number : 1878},
    {number : 187811}
];
let seedGenerate2Woman = [
    {number : 16222},
    {number : 17416}
];
let seedGenerate3 = [
    {number : 18742},
    {number : 168742},
    {number : 16874224}
];
let seedGenerate3Woman = [
    {number : 34122},
    {number : 16222}
];
let seedGenerate4 = [
    {number : 241364},
    {number : 281366},
    {number : 281366}
];
let seedGenerate4Woman = [
    {number : 241364},
    {number : 281362}
];
export default function GenerateAmero() {
    const router = useRouter();

    const [imageFile, setImageFile] = useState(null);
    const [styleGender, setStyleGender] = useState(null);
    const [character, setCharacter] = useState(null);
    const [playVideo, setPlayVideo] = useState(false);
    
    const [numProses, setNumProses] = useState(0);
    const [numProses1, setNumProses1] = useState(null);

    const [payload, setPayload] = useState({
      stasiun: getCookie('stasiun'),
      stasiunName: getCookie('stasiunName'),
    });

    const [prompt1, setPrompt1] = useState(null);
    const [prompt2, setPrompt2] = useState(null);
    let promptCombine, promptCombine2, promptSteps;
    const negative_prompt = DEFAULT_NEG_PROMPT;
    const [fixSeed, setFixSeed] = useState(null);
    const [CGF, setCGF] = useState(12);
    const [numSteps, setNumSteps] = useState(75);

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
        if(prompt1 == 'Woman, '){
            gtag('event', 'ClickButton', {
                event_category: 'Button',
                event_label: 'Female - '+payload.stasiunName,
                event_action: 'SupriseMe'
            })
        }else{
            gtag('event', 'ClickButton', {
                event_category: 'Button',
                event_label: 'Male - '+payload.stasiunName,
                event_action: 'SupriseMe'
            })
        }

        setNumProses1(true)

        let styleRandom = getRandomInt(1,5);
        // let styleRandom = 4
        if(styleRandom == 1){
            if(prompt1 == 'Woman, '){
                promptCombine2 = 'A Woman Samurai Ninja Full Body with cyborg ninja boots and sword blade and futuristic machine guns. Matrix Red light, Cyberpunk Neon Red Light, Conceptual artwork of the human mind, studio portrait style, intricate neural network details at the center, popular on ArtStation, digital painting, sharp focus, highly detailed, enigmatic atmosphere, dramatic lighting, evoking a sense of mystery, atmospheric chiaroscuro, trend-centric composition, digital rendering.'
            }else{
                promptCombine2 = 'A Man Samurai Ninja Full Body with cyborg ninja boots and sword blade and futuristic machine guns. Matrix Red light, Cyberpunk Neon Red Light, Conceptual artwork of the human mind, studio portrait style, intricate neural network details at the center, popular on ArtStation, digital painting, sharp focus, highly detailed, enigmatic atmosphere, dramatic lighting, evoking a sense of mystery, atmospheric chiaroscuro, trend-centric composition, digital rendering.'
            }
            promptSteps = 75
            FIXSEEDPILIH = seedGenerate[getRandomInt(0,3)].number
        }else if(styleRandom == 2){
            if(prompt1 == 'Woman, '){
                promptCombine2 = 'An artistic depiction of a businesswoman in a modest dress, sitting in a private jet with her face towards the camera. The background features a large, clear window with visible clouds and sky. The ambient lighting creates a sophisticated atmosphere, emphasizing the elegance of the woman and the luxurious details of the jet interior. The artwork highlights the serene and luxurious setting. Art Style: Realistic Illustration, Lighting: Soft and Ambient, evoking a sense of luxury and sophistication.'
                FIXSEEDPILIH = seedGenerate2Woman[getRandomInt(0,1)].number
            }else{
                promptCombine2 = 'A photorealistic scene featuring a businessman in a black tuxedo with a bow tie, wearing red Ray-Ban frame glasses, sitting with legs crossed inside a spacecraft, looking directly at the camera. The background includes a large, clear window showcasing a view of clouds and the sky at sunset. The interior of the spacecraft is futuristic and luxurious, with advanced controls and ambient lighting that highlights the sophisticated atmosphere. Realistic Photograph, Medium Shot, capturing the detailed essence of the businessman with red Ray-Ban glasses, the spacecraft interior, and the stunning sunset sky view.'
                FIXSEEDPILIH = seedGenerate2[getRandomInt(0,2)].number
            }
            promptSteps = 50
        }else if(styleRandom == 3){
            if(prompt1 == 'Woman, '){
                promptCombine2 = 'A photorealistic scene featuring a woman in a (((red modest dress))), sitting in the back seat of a luxuraious Rolls Royce, revealing the opulent interior seats. She is wearing an expensive watch, and the scene is set at night. The ambient lighting highlights the elegance of the woman, the luxurious details of the Rolls Royce, and the sophisticated atmosphere. Realistic Photograph, Medium Shot, capturing the detailed essence of the woman, the Rolls Royce interior, and the luxurious night setting.'
                FIXSEEDPILIH = seedGenerate3Woman[getRandomInt(0,1)].number
            }else{
                promptCombine2 = 'A photorealistic scene featuring a businessman in a black tuxedo with a bow tie, sitting in the back seat of a luxurious Rolls Royce, revealing the opulent interior seats. He is wearing an expensive watch, and the scene is set at night. The ambient lighting highlights the elegance of the man, the luxurious details of the Rolls Royce, and the sophisticated atmosphere. Realistic Photograph, Medium Shot, capturing the detailed essence of the businessman, the Rolls Royce interior, and the luxurious night setting.'
                FIXSEEDPILIH = seedGenerate3[getRandomInt(0,2)].number
            }
            promptSteps = 50
        }else if(styleRandom == 4){
            if(prompt1 == 'Woman, '){
                promptCombine2 = "In a realm where quantum mysteries unfold, there stands the Supercomputer Woman. His face, a fusion of human and machine, glows with circuit (((red patterns))) and microchips. Over his features dances a quantum display: entangled particles, wave functions, and holographic grids in (((vibrant red))). The interplay of soft and stark lighting adds depth, emphasizing his profound intelligence and the seamless union of human and quantum power."
                // FIXSEEDPILIH = 13364
                FIXSEEDPILIH = seedGenerate4Woman[getRandomInt(0,1)].number
            }else{
                promptCombine2 = "In a realm where quantum mysteries unfold, there stands the Supercomputer Man. His face, a fusion of human and machine, glows with circuit (((red patterns))) and microchips. Over his features dances a quantum display: entangled particles, wave functions, and holographic grids in (((vibrant red))). The interplay of soft and stark lighting adds depth, emphasizing his profound intelligence and the seamless union of human and quantum power."
                // FIXSEEDPILIH = 13364
                FIXSEEDPILIH = seedGenerate4[getRandomInt(0,2)].number
            }
            promptSteps = 50
        }
        
        // else if(styleRandom == 5){
        //     if(prompt1 == 'Woman, '){
        //         promptCombine2 = "In a realm where quantum mysteries unfold, there stands the Supercomputer Woman. His face, a fusion of human and machine, glows with circuit (((red patterns))) and microchips. Over his features dances a quantum display: entangled particles, wave functions, and holographic grids in (((vibrant red))). The interplay of soft and stark lighting adds depth, emphasizing his profound intelligence and the seamless union of human and quantum power."
        //     }else{
        //         promptCombine2 = "In a realm where quantum mysteries unfold, there stands the Supercomputer Man. His face, a fusion of human and machine, glows with circuit (((red patterns))) and microchips. Over his features dances a quantum display: entangled particles, wave functions, and holographic grids in (((vibrant red))). The interplay of soft and stark lighting adds depth, emphasizing his profound intelligence and the seamless union of human and quantum power."
        //     }
        //     FIXSEEDPILIH = seedGenerate5[getRandomInt(0,1)].number
        //     promptSteps = 50
        // }
        setPlayVideo(true)
        console.log(styleRandom)
        console.log(promptSteps)
        console.log(FIXSEEDPILIH)
        promptCombine = promptCombine2
        console.log(promptCombine)

        setTimeout(() => {
            generateImage()
        }, 500);

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

    // WIDTH FIX : 624x664 | 624x744 | 624x784 | 624x792 | 624x832 | 624x864 | 624x872
    const generateImage = async () => {
        setNumProses(1)
      reset();
      // @snippet:start("client.queue.subscribe")
      setLoading(true);
      const start = Date.now();
      try {
        const result = await fal.subscribe(
          'fal-ai/ip-adapter-face-id',
          {
            input: {
                // model_type: '1_5-v1-plus',
              prompt: promptCombine,
              face_image_url: imageFile,
              negative_prompt,
              guidance_scale: CGF,
              num_inference_steps: promptSteps,
            //   seed: seedGenerate[getRandomInt(0,1)].number,
              seed: FIXSEEDPILIH,
              width: 624,
              height: 792
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
        URL_RESULT = result.image.url
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
                router.push('/v2/result');
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
            event_label: 'IdentifyYourself - '+payload.stasiunName,
            event_action: 'BackToHome'
        })
    }

    return (
        <main className="flex fixed h-full w-full bg-kai2 overflow-auto flex-col justify-center items-center py-16 px-20" onContextMenu={(e)=> e.preventDefault()}>
            {numProses1 && 
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col'>
                    <div className='relative w-[80%] overflow-hidden'>
                        <div className='relative w-full'>
                            <Image src='/explore.png' width={773} height={158} alt='Zirolu' className='w-full' priority />
                        </div>
                    </div>
                    <div className='animate-upDownCepet relative p-8 mt-8 mb-10 text-4xl border-2 border-[#b1454a] text-center bg-[#CF1F29] text-[#fff] font-bold rounded-lg'>
                        <p>{`Please wait, loading...`}</p>
                        <p>{`Process : ${(elapsedTime / 1000).toFixed(2)} seconds (${numProses} of 2)`}</p>
                        {error}
                    </div>

                    <pre className='relative p-5 mt-14 border-2 border-[#b1454a] text-left bg-[#CF1F29] text-[#fff] text-3xl overflow-auto no-scrollbar h-[250px] w-[60%] mx-auto rounded-lg hidden'>
                        <code>
                        {logs.filter(Boolean).join('\n')}
                        </code>
                        AI generate face... <br></br>
                        Loading model..<br></br>
                    </pre>

                    <div className='w-full flex items-center justify-center'>
                        <ReactPlayer url={['/videoLoading.mp4']}  playing={playVideo} loop width={555} height={1174} />
                    </div>
                </div>
            }
            {/* LOADING */}
            {/* PILIH STYLE */}
            <div className={`fixed top-14 w-[70%] ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
                <Image src='/title-select.png' width={686} height={112} alt='Zirolu' className='w-full' priority />
            </div>
            <div className={`relative w-full ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
                <div className='relative mt-[-12vh] w-full'>
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
                                    value="Man, "
                                    onChange={(e) => setPrompt1(e.target.value)}
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
                                    value="Woman, "
                                    onChange={(e) => setPrompt1(e.target.value)}
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
                    </div>
                </div>
                <div className={`fixed left-0 bottom-14 w-full`}>
                    <div className="relative w-[80%] mx-auto flex justify-center items-center flex-col">
                        <button className={`w-full relative mx-auto flex justify-center items-center ${!prompt1 ? 'hidden' : ''}`} onClick={generateAI}>
                            <Image src='/btn-suprise.png' width={830} height={192} alt='Zirolu' className='w-full' priority />
                        </button>
                        <Link href='/v2/home' className="relative w-full mx-auto flex justify-center items-center" onClick={backHome}>
                            <Image src='/btn-back.png' width={772} height={135} alt='Zirolu' className='w-full' priority />
                        </Link>
                    </div>
                </div>
            </div>
            {/* !PILIH STYLE */}
        </main>
    );
}
