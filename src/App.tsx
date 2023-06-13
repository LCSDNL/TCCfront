import { useState } from "react";
import "./App.css";
import axios from "axios";
import { Megaphone, Pause, Play } from "@phosphor-icons/react";

function App() {
  const [perguntatxt, setPerguntatxt] = useState("");
  const [respostatxt, setRespostatxt] = useState("");
  const [voiceSound, setVoiceSound] = useState<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioGerado, setAudioGerado] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState("0");
  const [voiceDegree, setVoiceDegree] = useState("0");
  const [voiceAutor, setVoiceAutor] = useState("pt-BR-AntonioNeural");

  const [count, setCount] = useState(0);

  function AskService() {
    setRespostatxt("Gerando resposta...")
    const requestData = {
      pergunta: perguntatxt,
    };

    axios
      .post("http://localhost:3030/resposta", requestData)
      .then((res) => {
        setRespostatxt(res.data);
        setAudioGerado(false);
      })
      .catch((err) => {
        console.log(err);
        setRespostatxt("Ocorreu um problema. Tente novamente...")
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
      .post("http://localhost:3030/restotext", audioData, {
        responseType: "arraybuffer",
      })
      .then(async (res) => {
        const audioBlob = new Blob([res.data], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        setVoiceSound(audioElement);
        setAudioGerado(true);
        setCount(count + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function voicePause() {
    voiceSound?.pause();
    setIsPlaying(false);
  }

  function voiceResume() {
    setIsPlaying(true);
    voiceSound?.play();
  }

  return (
    <>
      <div
        id="background"
        className=" min-h-screen bg-gradient-to-r from-cyan-300 to-blue-700 grid justify-items-center"
      >
        <div className="mt-10">
          <h1 className="text-5xl font-bold underline text-slate-100">WAFLOW</h1>
        </div>
        <div className="w-10/12 text-center text-slate-100">
          
          <div className="mt-2">
          <div className="bg-slate-200 h-fit m-1 p-5 rounded-md border-0 ">
          <div className=" grid justify-items-center grid-cols-1">
            <textarea
              placeholder="Digite sua pergunta aqui."
              onChange={(e) => setPerguntatxt(e.target.value)}
              id="pergunta"
              name="pergunta"
              rows={3}
              className=" bg-slate-100 p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-100 sm:text-sm sm:leading-6"
              defaultValue={""}
            />
          </div>
          <div>
            <button
              onClick={AskService}
              className="bg-blue-500 m-1 rounded-md pl-2 pr-2 py-2 mt-3 focus:ring-2 focus:ring-inset focus:ring-indigo-100"
            >
             <span className=" font-bold">Enviar Pergunta</span>
            </button>
          </div>
          </div></div>
        </div>
        {count<4 
        ?
        <div className="bg-slate-200 h-fit m-1 p-5 w-10/12 rounded-md border-0 ">
          <div className=" grid justify-items-center grid-cols-1">
            <div className="grid justify-items-center md:flex">
              <div className="m-3">
                <span>Voz: </span>
                <select
                className="rounded-md"
                  onChange={(e) => {
                    setAudioGerado(false);
                    setVoiceAutor(e.target.value);
                  }}
                >
                  <option value={`pt-BR-AntonioNeural`}>Antonio</option>
                  <option value={`pt-BR-BrendaNeural`}>Brenda</option>
                  <option value={`pt-BR-DonatoNeural`}>Donato</option>
                  <option value={`pt-BR-ElzaNeural`}>Elza</option>
                  <option value={`pt-BR-FabioNeural`}>Fabio</option>
                  <option value={`pt-BR-FranciscaNeural`}>Francisca</option>
                  <option value={`pt-BR-GiovannaNeural`}>Giovanna</option>
                  <option value={`pt-BR-HumbertoNeural`}>Humberto</option>
                  <option value={`pt-BR-JulioNeural`}>Julio</option>
                  <option value={`pt-BR-LeilaNeural`}>Leila</option>
                  <option value={`pt-BR-LeticiaNeural`}>Leticia</option>
                  <option value={`pt-BR-ManuelaNeural`}>Manuela</option>
                  <option value={`pt-BR-NicolauNeural`}>Nicolau</option>
                  <option value={`pt-BR-ValerioNeural`}>Valerio</option>
                  <option value={`pt-BR-YaraNeural`}>Yara</option>
                </select>
              </div>

              <div className="grid justify-items-center px-3 m-5">
                <label>Velocidade da voz: {voiceSpeed}</label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={voiceSpeed}
                  onChange={(e) => {
                    setVoiceSpeed(e.target.value);
                    setAudioGerado(false);
                  }}
                ></input>
              </div>

              <div className="grid justify-items-center px-3 m-5">
                <label>Tom da voz: {voiceDegree}</label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={voiceDegree}
                  onChange={(e) => {
                    setVoiceDegree(e.target.value);
                    setAudioGerado(false);
                  }}
                ></input>
              </div>
              <div className="">
                <button
                  id="geraAudio"
                  disabled={audioGerado ? true : false}
                  onClick={GeraAudio}
                  className="bg-blue-600 m-1 disabled:opacity-30 rounded-md p-2"
                >
                  <Megaphone size={32} weight="bold" color="#fcfcfc" alt="Gerar audio" />
                </button>

                {isPlaying ? (
                  <button
                    onClick={() => {
                      voicePause();
                    }}
                    className="bg-blue-600 m-1 rounded-md p-2"
                  >
                    <Pause size={32} color="#fcfcfc" weight="bold"/>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      voiceResume();
                    }}
                    className="bg-blue-600 m-1 rounded-md p-2"
                  >
                    <Play size={32} color="#fcfcfc"  weight="bold"/>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className=" bg-slate-300 rounded-md text-center w-19/10 mx-auto mt-7 pb-2">
            <span className="text-1xl font-bold ">
              {respostatxt.length === 0 ? "Aguardando Pergunta." : respostatxt}
            </span>
          </div>
        </div>
        :
        <div className="bg-slate-200 h-fit m-1 p-5 w-10/12 rounded-md border-0 ">
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdl4dqlNQS7uZnYImwom68NV1UBcRvvkigwpEU3mSsUCMSNGQ/viewform?embedded=true" width="100%" height="669">A carregar…</iframe>
          <button  className="bg-blue-600 m-1 rounded-md p-2 font-bold underline mt-5 text-slate-100" onClick={()=>{setCount(-1000)}}>Já Respondi ao questionário!</button>
        </div>
        }
      </div>
    </>
  );
}

export default App;
