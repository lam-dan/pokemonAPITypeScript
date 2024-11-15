import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0/');
        if(!response.ok){
          throw new Error("Failed to fetch Pokemon List.")
        }
        const jsonData = await response.json();
        const results = jsonData.results;

        const pokemonDetails = results.map(async(pokemon) => {
          try {
            const pokemonResponse = await fetch(pokemon.url);
            if(!pokemonResponse.ok) throw new Error(`Failed to fetch ${pokemon.name}`);
            const pokemonStats = await pokemonResponse.json();
            return pokemonStats; 
          } catch(error) {
            console.log(error);
            return null;
          }
        })
        const stats = await Promise.all(pokemonDetails);
        const sortedData = stats.filter(pokemon => pokemon !== null).sort((a,b) => b.weight - a.weight);
        setData(sortedData);
      } catch (error) {
        setError(error);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if(loading){
    return <div>Loading...</div>
  }
  if(error){
    return <div>{error}</div>
  }

  return (
    <div>
      <h1>API Data</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name} - {item.weight}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
