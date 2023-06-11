import { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Megaphone, Pause, Play } from '@phosphor-icons/react';

function App() {
  const [perguntatxt, setPerguntatxt] = useState('');
  const [respostatxt, setRespostatxt] = useState('');
  const [voiceSound, setVoiceSound] =useState<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] =useState(false);
  const [audioGerado, setAudioGerado]= useState(false);
  const [voiceSpeed, setVoiceSpeed]=useState('');

  function AskService() {
    const requestData = {
      pergunta: perguntatxt
    };

    axios
      .post('http://localhost:3030/resposta', requestData)
      .then((res) => {
        setRespostatxt(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

    function GeraAudio() {
    const audioData = {
      texto: respostatxt
    };

    axios
      .post('http://localhost:3030/restotext', audioData, {
        responseType: 'arraybuffer'
      })
      .then(async (res) => {
        const audioBlob = new Blob([res.data], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        await setVoiceSound(audioElement);
        setAudioGerado(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function voicePause(){
    voiceSound?.pause();
    setIsPlaying(false)
  }
  function voiceResume(){
    setIsPlaying(true);
    voiceSound?.play();
  }

  return (
    <>
<div id='background' className=" min-h-screen bg-orange-400 grid justify-items-center" >

      <h1 className="text-3xl font-bold underline">WAFLOW</h1>


<div>
        <h5 className=" font-bold underline">Faça sua pergunta.</h5>
        <div className="mt-2">
          <textarea
            onChange={(e) => setPerguntatxt(e.target.value)}
            id="pergunta"
            name="pergunta"
            rows={3}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={''}
          />
        </div>
        <div>
          <button onClick={AskService}>Enviar</button>
        </div>
</div>

<div className='bg-slate-200 h-fit m-1 p-5 w-10/12 rounded-md border-0 '>
      <div className=' grid justify-items-center'>

        
        <div>
        <input type="range" min="1" max="100" onChange={(e)=>{setVoiceSpeed(e.target.value);setAudioGerado(false)}} ></input>
        {voiceSpeed}


        <select onChange={(e)=>{setAudioGerado(false)}}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>


          <button id='geraAudio' disabled={audioGerado ? true : false} onClick={GeraAudio} className='bg-blue-500 m-1 disabled:opacity-50'><Megaphone size={32} alt="Gerar audio"/></button>
          
          {isPlaying 
          ?
          <button onClick={()=>{voicePause()}} className='bg-blue-500 m-1'><Pause size={32} /></button> 
          :
          <button onClick={()=>{voiceResume()}} className='bg-blue-500 m-1'><Play size={32} /></button>
          }
          
        </div>
      </div>
      <div className=' bg-red-300'>
      <span className="text-3xl font-bold ">
        {respostatxt.length === 0 ? 'Aguardando Pergunta' : respostatxt}
      </span>
      </div>
</div>
</div>
    </>
  );
}

export default App;
