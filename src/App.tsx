import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [perguntatxt, setPerguntatxt] = useState('');
  const [respostatxt, setRespostatxt] = useState('');

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

  return (
    <>
      <h1 className="text-3xl font-bold underline">Faça sua pergunta.</h1>
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

      <h1 className="text-3xl font-bold underline">
        {respostatxt.length === 0 ? 'Aguardando Pergunta' : respostatxt}
      </h1>
    </>
  );
}

export default App;
