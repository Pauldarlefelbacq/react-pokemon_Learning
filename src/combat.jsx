import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Leapfrog } from 'ldrs/react'
import 'ldrs/react/Leapfrog.css'

function Battle(){
    const location = useLocation();
    const customPlayerData = location.state?.playerPokemonData;
    let customPlayerLevel = location.state?.playerLevel;

    
// assignation des variables stockant les pokemons
    const [pokemonJ, setPokemonJ] = useState(null);
    const [pokemonO, setPokemonO] = useState(null);
    const [hpJ, setHpJ] = useState(null);
    const [hpO, setHpO] = useState(null);
    const [atkJ, setAtkJ] = useState(null);
    const [atkO, setAtkO] = useState(null);
    const [defenseJ, setDefenseJ] = useState(null);
    const [defenseO, setDefenseO] = useState(null);
    const [level, setLevel] = useState(null);

    const [gameStatus, setGameStatus] = useState('en cours');

    function initializePokemonStats(Data, Level){
        return{
            hp: Math.floor((Data.stats.find(stat => stat.stat.name === 'hp').base_stat)/50 * Level),
            atk: Math.floor((Data.stats.find(stat => stat.stat.name === 'attack').base_stat)/50 * Level),
            defense: Math.floor((Data.stats.find(stat => stat.stat.name === 'defense').base_stat)/50 * Level),
        }
    }

// fetch des pokemons (statiques pour le moment)    
    useEffect(() => {
        const fetchpkmCombat = async () => {
            if(customPlayerData === undefined){
                const randomOps = Math.floor(Math.random()* 1025)+1;
                const randomPlay = Math.floor(Math.random()* 1025)+1;
                const playerPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${randomOps}`).then(res => res.json());
                const opponentPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${randomPlay}`).then(res => res.json());
                const [playerData, opponentData] = await Promise.all([playerPromise, opponentPromise]);

                setPokemonJ(playerData);
                setPokemonO(opponentData);
                const l = (Math.floor(Math.random() * 98) +1);
                setLevel(l);

                const statsJ = initializePokemonStats(playerData, l);
                const statsO = initializePokemonStats(opponentData, l);
//calcul des stats
                setHpJ(statsJ.hp);
                setHpO(statsO.hp);
                setAtkJ(statsJ.atk);
                setAtkO(statsO.atk);
                setDefenseJ(statsJ.defense);
                setDefenseO(statsO.defense);
            }
            else{
                const randomOps = Math.floor(Math.random()* 1025)+1;
                const opponentPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${randomOps}`).then(res => res.json());
                const  opponentData = await (opponentPromise);

                setPokemonJ(customPlayerData);
                setPokemonO(opponentData);

                const statsJ = initializePokemonStats(customPlayerData, customPlayerLevel);
                const statsO = initializePokemonStats(opponentData, customPlayerLevel);
//calcul des stats
                setHpJ(statsJ.hp);
                setHpO(statsO.hp);
                setAtkJ(statsJ.atk);
                setAtkO(statsO.atk);
                setDefenseJ(statsJ.defense);
                setDefenseO(statsO.defense);
            }
            
        };
        

        fetchpkmCombat();
    }, []);

// Gestionnaire des attaques
        async function handlePlayerAttack(move){
            const reponse = await fetch(move.move.url);
            const moveDetails = await reponse.json();
            console.log(moveDetails);
            console.log("Points de vie enlevés", atkJ * (moveDetails.power / 100));
            const DgtJ = Math.round(((atkJ * (moveDetails.power / 100))/defenseJ)+2);
            const newOpponentHP = hpO - DgtJ;
            if (newOpponentHP > 0){
                setHpO(hpO - DgtJ);
            }
            else{
                setHpO(0);
                alert("Vous avez gagné");
                setGameStatus('gagné')
            }

            const opponentMoves = pokemonO.moves.slice(0, 4);
            const randomAtk = Math.floor(Math.random() * 4);
            const randomMove = await fetch(opponentMoves[randomAtk].move.url);
            const randomDetails = await randomMove.json()
            const DgtO = Math.round(((atkO * (randomDetails.power / 100))/defenseO)+2);
            const newPlayerHP = hpJ - DgtO;
            if (newPlayerHP > 0){
                setHpJ(hpJ - DgtO );
            }
            else{
                setHpJ(0);
                console.log("Vous avez perdu");
                setGameStatus('perdu')
            }
        };


// affichage global conditionnel
    if (!pokemonJ || !pokemonO){
        return(
            <main>
                <h1 className="text-4xl font-bold my-12">Chargement du pokemon en cours</h1>
                <Leapfrog
                size="100"
                speed="1.5"
                color="black" 
                />
                <a
                className="text-2xl font-bold my-12 hover:text-blue-400" 
                href="/">Retour à la page d'accueil</a>
            </main>
        )
    }
    if(gameStatus !== "en cours"){
        return(
            <main className="flex flex-col items-center justify-center min-h-screen">
                <div>
                    <h1 className="text-4xl font-bold my-12">Vous avez {gameStatus} !</h1>
                    <button
                    onClick={()=> window.location.reload()}>Recommencer</button>
                </div>
            </main>
        )
    }
    return(
        <main className="flex items-center justify-center min-h-screen place-content-around *:mx-22">
            <a
                className="text-2xl font-bold hover:text-blue-400 absolute top-4 left-4" 
                href="/">Retour à la page d'accueil
            </a>
            <div className="flex flex-col">
                <h2 className="text-center">Votre pokemon</h2>
                <p>{pokemonJ.name}</p>
                <p>Niveau : <strong>{level}</strong></p>
                <img 
                className="max-h-[96px] w-fit m-auto"
                src={pokemonJ.sprites.front_default} 
                alt={pokemonJ.name} />
                <p className="">PV : {hpJ}</p>
                <div className="content-between justify-between">
                    {pokemonJ.moves.slice(0, 4).map(move=>(
                        <button 
                        className = "border rounded-lg  m-2 p-2 hover:scale-125 hover:bg-black hover:text-white hover:duration-300"
                        disabled={gameStatus !== 'en cours'}
                        onClick={() =>handlePlayerAttack(move)} 
                        key={move.move.name}>
                            {move.move.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h2>Pokemon adverse</h2>
                <img src={pokemonO.sprites.front_default} alt={pokemonO.name} />
                <p>{pokemonO.name}</p>
                <p>Niveau : <strong>{level}</strong></p>
                <p>PV : {hpO}</p>
                <div>
                    {pokemonO.moves.slice(0, 4).map(move=>(
                        <button key={move.move.name}>{move.move.name}</button>
                    ))}
                </div>
            </div>
        </main>
    )
}
// juste export ça devrait pas changer
export default Battle;