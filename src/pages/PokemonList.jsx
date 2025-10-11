import { Pokemon } from '../Pokemon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';




function App(){
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    function handleChange(e){
        setSearch(e.target.value);
    }

    const [nb, setNb] = useState(1);
    function handleClick(){
        const randomID= Math.floor(Math.random() * 1025)+1;
        setNb(randomID);
        navigate(`/pokemon/${randomID}`);
    }
    console.log(nb);
    
    

    return(
        <main className="m-2">
            <h1>pokedex</h1>
            <input 
            className="border p-1 mx-5 rounded-md"
            type="text" 
            value={search}
            onChange={handleChange}/>
            
            <button 
            className="border rounded-xl p-2 bg-gray-200"
            onClick={handleClick}>
                Pokemon aléatoire
            </button>
            <Pokemon select={search} />
            <Link to="/Combat">Aller aux combats</Link>
        </main>
    )
    }

export default App;