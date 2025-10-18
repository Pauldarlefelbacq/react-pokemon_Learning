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
            <main className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-slate-800">Chargement en cours</h1>
                <Leapfrog
                size="100"
                speed="1.5"
                color="#dc2626" 
                />
                <a
                className="text-lg font-semibold mt-8 text-red-600 hover:text-red-700 transition-colors" 
                href="/">← Retour au pokedex</a>
            </main>
        )
    }
    if(gameStatus !== "en cours"){
        return(
            <main className="flex flex-col items-center justify-center min-h-screen">
                <div className="bg-white rounded-2xl shadow-2xl p-12 border-2 border-slate-200 text-center">
                    <h1 className="text-5xl font-bold mb-8 text-slate-800">
                        {gameStatus === 'gagné' ? 'Victoire!' : 'Perdu'}
                    </h1>
                    <p className="text-xl text-slate-600 mb-8">Vous avez {gameStatus}!</p>
                    <button
                    className="btn-primary text-lg px-8 py-3"
                    onClick={()=> window.location.reload()}>Combattre à nouveau</button>
                </div>
            </main>
        )
    }
    return(
        <main className="min-h-screen flex items-center justify-center px-4 py-8">
            <a
                className="text-slate-600 hover:text-slate-800 font-medium absolute top-6 left-6 transition-colors" 
                href="/">← Retour au pokedex
            </a>
            
            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-6 border-2 border-blue-200">
                    <h2 className="text-center text-xl font-bold text-blue-900 mb-3">Votre pokemon</h2>
                    <div className="bg-white rounded-xl p-4 mb-4">
                        <p className="text-2xl font-bold capitalize text-slate-800 text-center">{pokemonJ.name}</p>
                        <p className="text-center text-slate-600 mb-2">Niveau: <strong className="text-blue-600">{level}</strong></p>
                        <img 
                        className="w-32 h-32 mx-auto object-contain"
                        src={pokemonJ.sprites.front_default} 
                        alt={pokemonJ.name} />
                        <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-slate-700">HP</span>
                                <span className="font-bold text-green-600">{hpJ}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                                <div 
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                                    style={{width: `${Math.max(0, Math.min(100, (hpJ / (Math.floor((pokemonJ.stats.find(stat => stat.stat.name === 'hp').base_stat)/50 * level)) * 100)))}%`}}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {pokemonJ.moves.slice(0, 4).map(move=>(
                            <button 
                            className="bg-white border-2 border-blue-300 rounded-lg p-3 font-semibold text-slate-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 capitalize text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={gameStatus !== 'en cours'}
                            onClick={() =>handlePlayerAttack(move)} 
                            key={move.move.name}>
                                {move.move.name.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-xl p-6 border-2 border-red-200">
                    <h2 className="text-center text-xl font-bold text-red-900 mb-3">Pokemon adverse</h2>
                    <div className="bg-white rounded-xl p-4 mb-4">
                        <p className="text-2xl font-bold capitalize text-slate-800 text-center">{pokemonO.name}</p>
                        <p className="text-center text-slate-600 mb-2">Niveau: <strong className="text-red-600">{level}</strong></p>
                        <img 
                        className="w-32 h-32 mx-auto object-contain"
                        src={pokemonO.sprites.front_default} 
                        alt={pokemonO.name} />
                        <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-slate-700">HP</span>
                                <span className="font-bold text-green-600">{hpO}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                                <div 
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                                    style={{width: `${Math.max(0, Math.min(100, (hpO / (Math.floor((pokemonO.stats.find(stat => stat.stat.name === 'hp').base_stat)/50 * level)) * 100)))}%`}}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {pokemonO.moves.slice(0, 4).map(move=>(
                            <button 
                            key={move.move.name}
                            className="bg-slate-200 rounded-lg p-3 font-semibold text-slate-500 capitalize text-sm cursor-not-allowed"
                            disabled
                            >
                                {move.move.name.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
// juste export ça devrait pas changer
export default Battle;