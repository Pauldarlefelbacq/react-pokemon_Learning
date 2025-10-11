import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Pokemon({select}){
    // const [pokeURL, setPokeURL] = useState("https://pokeapi.co/api/v2/pokemon?limit=20");

//récupérer les pokemons
    const [pokemonData, setPokemonData] = useState([]);
        useEffect(() => {
            const fetchAllPokemonData = async () => {
                
                const listResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
                const listData = await listResponse.json();

                const detailPromises = listData.results.map(pokemon =>
                fetch(pokemon.url).then(res => res.json())
                );

                const detailedPokemons = await Promise.all(detailPromises);

                setPokemonData(detailedPokemons);
            };
            fetchAllPokemonData();
        }, []);
    console.log(pokemonData)



//filtre du type
    const [typeF, setTypeF] = useState('all');
    function setTypeFilter(e){
        setTypeF(e.target.value)
    }
    const allTypes = [...new Set(pokemonData.flatMap(p => p.types.map(t => t.type.name)))];

//filtre
    const pokemonDataFiltered= pokemonData
    .filter((pkm) => pkm.name.toLowerCase().includes(select.toLowerCase()))
    .filter((pkm) => {if(typeF === "all"){
        return true;
    }
        return pkm.types.map(t => t.type.name).includes(typeF)
    });

//affichage
    if (pokemonData.length === 0) {
        return <h2>Chargement...</h2>;
    }

    return (
        <div>
            <select 
            value={typeF}
            onChange={setTypeFilter}
            name="type" 
            id="type">
                <option value="all">Tous les types</option>
                {allTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            
            <ul className="flex flex-wrap mx-11 p-5 my-5 *:m-5 *:bg-gray-200 *:p-2 *:text-center *:rounded-xl">
                {pokemonDataFiltered.map(pokemon => (
                <li key={pokemon.name}>
                    <Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}<img src={pokemon.sprites.front_default} alt={pokemon.name}></img></Link>
                </li>
                ))}
            </ul>
        </div>
    );
}