import './App.css'
import PokemonList from "./pages/PokemonList";
import PokemonDetail from"./pages/PokemonDetail";
import { Pokemon } from './Pokemon';
import { Route, Routes } from 'react-router-dom';

function App(){
  return(
    <Routes>
      <Route path="/" element={<PokemonList />}></Route>
      <Route path="/pokemon/:pokemonName" element={<PokemonDetail />}></Route>
    </Routes>
  )
};


export default App;