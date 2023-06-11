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
  const [voiceDegree, setVoiceDegree]=useState('');
  const [voiceAutor, setVoiceAutor]= useState('');

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
      texto: respostatxt,
      vozAutor: voiceAutor,
      vozVelocidade: voiceSpeed,
      vozTom: voiceDegree,
    };

    axios
      .post('http://localhost:3030/restotext', audioData, {
        responseType: 'arraybuffer'
      })
      .then(async (res) => {
        const audioBlob = new Blob([res.data], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        setVoiceSound(audioElement);
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
<div id='background' className=" min-h-screen bg-orange-400 grid justify-items-center mx-auto" >

      <h1 className="text-3xl font-bold underline">WAFLOW</h1>


<div className='w-10/12'>
        <h5 className=" font-bold underline">Faça sua pergunta.</h5>
        <div className="mt-2">
          <textarea
          placeholder='Digite sua pergunta aqui.'
            onChange={(e) => setPerguntatxt(e.target.value)}
            id="pergunta"
            name="pergunta"
            rows={3}
            className=" p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={''}
          />
        </div>
        <div>
          <button onClick={AskService} className='bg-slate-300 rounded px-2 mt-1'>Enviar</button>
        </div>
</div>

<div className='bg-slate-200 h-fit m-1 p-5 w-10/12 rounded-md border-0 '>
      <div className=' grid justify-items-center'>

        
        <div className='flex'>
            
            <div>
            <select onChange={(e)=>{setAudioGerado(false); setVoiceAutor(e.target.value)}}>
              <option value={`pt-BR-AntonioNeural`}>Antonio</option>
              <option value={`pt-BR-BrendaNeural`}>Brenda</option>
              <option value={`pt-BR-DonatoNeural`}>Donato</option>
              <option value={`pt-BR-ElzaNeural`}>Elza</option>
              <option value={`pt-BR-FabioNeural`}>Fabio</option>
              <option value={`pt-BR-FranciscaNeural`}>Francisca</option>
              <option value={`pt-BR-GiovannaNeural`}>Giovanna</option>
              <option value={`pt-BR-HumbertoNeural`}>Humberto</option>
              <option value={`pt-BR-JulioNeural`}>Julio</option>
              <option value={`pt-BR-LeilaNeura`}>Leila</option>
              <option value={`pt-BR-LeticiaNeural`}>Leticia</option>
              <option value={`pt-BR-ManuelaNeural`}>Manuela</option>
              <option value={`pt-BR-NicolauNeural`}>Nicolau</option>
              <option value={`pt-BR-ValerioNeural`}>Valerio</option>
              <option value={`pt-BR-YaraNeural`}>Yara</option>
            </select>
            </div>


            <div className='grid justify-items-center px-3 mx-10'>
            <label>Velocidade da voz: {voiceSpeed}</label>
            <input type="range" min="1" max="100" onChange={(e)=>{setVoiceSpeed(e.target.value);setAudioGerado(false)}} ></input>
            </div>

            <div className='grid justify-items-center px-3 mx-10'>
            <label>Tom da voz: {voiceDegree}</label>
            <input type="range" min="1" max="100" onChange={(e)=>{setVoiceDegree(e.target.value);setAudioGerado(false)}} ></input>
            </div>
            


              <button id='geraAudio' disabled={audioGerado ? true : false} onClick={GeraAudio} className='bg-blue-500 m-1 disabled:opacity-50'><Megaphone size={32} weight="bold" alt="Gerar audio"/></button>
              
              {isPlaying 
              ?
              <button onClick={()=>{voicePause()}} className='bg-blue-500 m-1'><Pause size={32} weight="bold"/></button> 
              :
              <button onClick={()=>{voiceResume()}} className='bg-blue-500 m-1'><Play size={32} weight="bold"/></button>
              }
              
        </div>
      </div>


      <div className=' bg-slate-300 rounded-md text-center w-19/10 mx-auto mt-7 pb-2'>
      <span className="text-2xl font-bold ">
        {respostatxt.length === 0 ? 'Aguardando Pergunta' : respostatxt}
      </span>
      </div>
</div>
</div>
    </>
  );
}

export default App;
