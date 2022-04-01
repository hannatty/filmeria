import './filme-info.css';
import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import api from '../../services/api';
import {toast} from 'react-toastify';



export default function Filme(){

  const {id}= useParams();
  const history = useHistory();
  const [filme, setFilme] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilme(){
      const response = await api.get(`r-api/?api=filmes/${id}`);

      if (response.data.length === 0){
        // Tentou acessar página que não existe, navego ele para Home
        history.replace('/');
        return;
      }

      setFilme(response.data);
      setLoading(false);
    }

    loadFilme();

  }, [history, id]);

  function salvarFilme(){
    const minhaLista = localStorage.getItem('filmes');
    let filmesSalvos = JSON.parse(minhaLista) || [];
    
    //Se já houver filme salvo com o msm id, programa deve ignorar novo request
    const hasFilme = filmesSalvos.some((filmeSalvo) => filmeSalvo.id === filme.id)
    if (hasFilme){
      toast.warn('Esse filme já foi salvo.');
      return;
      //Para a execução do código aqui
    }

    filmesSalvos.push(filme);
    localStorage.setItem('filmes', JSON.stringify(filmesSalvos));
    toast.success('Filme salvo com sucesso!');
  }
  

  if (loading){
    return(
      <div className='filme-info'>
        <h1> Carregando seu filme... </h1>
      </div>
    )
  }

  return(
    <div className='filme-info'>
      <h1>{filme.nome}</h1>
      <img src={filme.foto} alt={filme.nome}/>
      <h3>Sinopse</h3>
      {filme.sinopse}
    

    <div>
      <button onClick={salvarFilme}>Salvar</button>
      <button><a target="blank" href={`https://www.youtube.com/results?search_query=${filme.nome} Trailer`}> Trailer </a></button>
    </div>

    <div>
      <button> <Link to={"/"}> Voltar </Link> </button>
    </div>
  
  </div>

  )
}