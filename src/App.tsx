import { useState } from "react";
import "./App.css";
import axios from "axios";
import { Megaphone, Pause, Play } from "@phosphor-icons/react";

function App() {
  const urlApi = import.meta.env.VITE_BASE_URL;
  const [perguntatxt, setPerguntatxt] = useState("");
  const [respostatxt, setRespostatxt] = useState("");
  const [voiceSound, setVoiceSound] = useState<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioGerado, setAudioGerado] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isloadingResposta, setIsLoadingResposta] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState("0");
  const [voiceDegree, setVoiceDegree] = useState("0");
  const [voiceAutor, setVoiceAutor] = useState("pt-BR-AntonioNeural");

  const [count, setCount] = useState(0);

  function AskService() {
    setRespostatxt("Gerando resposta...");
    const requestData = {
      pergunta: perguntatxt,
    };

    setIsLoadingResposta(true);
    axios
      .post(urlApi + "/resposta", requestData)
      .then((res) => {
        setRespostatxt(res.data);
        setAudioGerado(false);
        setIsLoadingResposta(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingResposta(false);
        setRespostatxt("Ocorreu um problema. Tente novamente...");
      });
  }

  function GeraAudio() {
    const audioData = {
      texto: respostatxt,
      vozAutor: voiceAutor,
      vozVelocidade: voiceSpeed,
      vozTom: voiceDegree,
    };

    setIsLoadingAudio(true);

    axios
      .post(urlApi + "/restotext", audioData, {
        responseType: "arraybuffer",
      })
      .then(async (res) => {
        const audioBlob = new Blob([res.data], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        setVoiceSound(audioElement);
        setAudioGerado(true);
        setCount(count + 1);
        setIsLoadingAudio(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingAudio(false);
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
          <h1 className="text-5xl font-bold underline text-slate-100">
            WAFLOW
          </h1>
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
                  disabled={isloadingResposta ? true : false}
                  onClick={AskService}
                  className="bg-blue-500 m-1 rounded-md pl-2 pr-2 py-2 mt-3 focus:ring-2 focus:ring-inset focus:ring-indigo-100 disabled:opacity-50"
                >
                  {isloadingResposta ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 animate-spin "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  ) : (
                    <span className=" font-bold">Enviar Pergunta</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {count < 4 ? (
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
                    {isLoadingAudio ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 animate-spin"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                    ) : (
                      <Megaphone
                        size={32}
                        weight="bold"
                        color="#fcfcfc"
                        alt="Gerar audio"
                      />
                    )}
                  </button>

                  {isPlaying ? (
                    <button
                      disabled={audioGerado ? false : true}
                      onClick={() => {
                        voicePause();
                      }}
                      className="bg-blue-600 m-1 rounded-md p-2 disabled:opacity-30"
                    >
                      <Pause size={32} color="#fcfcfc" weight="bold" />
                    </button>
                  ) : (
                    <button
                      disabled={audioGerado ? false : true}
                      onClick={() => {
                        voiceResume();
                      }}
                      className="bg-blue-600 m-1 rounded-md p-2 disabled:opacity-30"
                    >
                      <Play size={32} color="#fcfcfc" weight="bold" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className=" bg-slate-300 rounded-md text-center w-19/10 mx-auto mt-7 pb-2">
              <span className="text-1xl font-bold ">
                {respostatxt.length === 0
                  ? "Aguardando Pergunta."
                  : respostatxt}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-200 h-fit m-1 p-5 w-10/12 rounded-md border-0 ">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdl4dqlNQS7uZnYImwom68NV1UBcRvvkigwpEU3mSsUCMSNGQ/viewform?embedded=true"
              width="100%"
              height="669"
            >
              A carregar…
            </iframe>
            <button
              className="bg-blue-600 m-1 rounded-md p-2 font-bold underline mt-5 text-slate-100"
              onClick={() => {
                setCount(-1000);
              }}
            >
              Já Respondi ao questionário!
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
