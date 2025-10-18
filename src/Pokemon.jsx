import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Pokemon({select}){
    // const [pokeURL, setPokeURL] = useState("https://pokeapi.co/api/v2/pokemon?limit=20");

//récupérer les pokemons
    const [pokemonData, setPokemonData] = useState([]);
        useEffect(() => {
            const fetchAllPokemonData = async () => {
                
                const listResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
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
            <div className="mb-8 flex justify-center">
                <select 
                value={typeF}
                onChange={setTypeFilter}
                name="type" 
                id="type"
                className="input-field w-56 cursor-pointer">
                    <option value="all">Tous les types</option>
                    {allTypes.map(type => (
                        <option key={type} value={type} className="capitalize">{type}</option>
                    ))}
                </select>
            </div>
            
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {pokemonDataFiltered.map(pokemon => (
                <li key={pokemon.name} className="pokemon-card p-4">
                    <Link to={`/pokemon/${pokemon.name}`} className="flex flex-col items-center">
                        <img 
                            src={pokemon.sprites.front_default} 
                            alt={pokemon.name}
                            className="w-24 h-24 object-contain"
                        />
                        <span className="text-slate-800 font-semibold capitalize mt-2">{pokemon.name}</span>
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    );
}