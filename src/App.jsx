import './App.css'
import PokemonList from "./pages/PokemonList";
import PokemonDetail from"./pages/PokemonDetail";
import { Pokemon } from './Pokemon';
import Battle from "./combat"
import { Route, Routes } from 'react-router-dom';

function App(){
  return(
    <Routes>
      <Route path="/" element={<PokemonList />}></Route>
      <Route path="/pokemon/:pokemonName" element={<PokemonDetail />}></Route>
      <Route path="/combat" element={<Battle />}></Route>
    </Routes>
  )
};


export default App;