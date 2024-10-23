import React, { useState, useEffect } from "react";
import { initialCountries, WEATHER_API_KEY } from "../../core/utils/constant";
import axios from "axios";
import ResultCard from "../ResultCard";
import "./style.css";

const App = () => {
  const [country, setCountry] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [userGuess, setUserGuess] = useState("");
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [gameStatus, setGameStatus] = useState("");
  const [remainingCountries, setRemainingCountries] = useState([]);

  useEffect(() => {
    setRemainingCountries(initialCountries);
    getWeatherData(initialCountries);
  }, []);

  const getWeatherData = async (countryList) => {
    if (countryList.length === 0) {
      setGameStatus("No more countries available!");
      return;
    }

    try {
      const randomCountry =
        countryList[Math.floor(Math.random() * countryList.length)];
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${randomCountry}&units=metric&appid=${WEATHER_API_KEY}`
      );

      setCountry(randomCountry);
      setTemperature(response.data.main.temp);
      setUserGuess("");
      setRemainingCountries(countryList.filter((c) => c !== randomCountry));
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  const handleGuess = () => {
    if (userGuess) {
      const tempDifference = Math.abs(userGuess - temperature);
      const isCorrect = tempDifference <= 5;

      const newGuess = {
        country: country,
        isTrue: isCorrect,
      };

      setGuessedCountries([...guessedCountries, newGuess]);

      const totalAttempts = guessedCountries.length + 1;
      const correctGuesses =
        guessedCountries.filter((guess) => guess.isTrue).length +
        (isCorrect ? 1 : 0);

      if (totalAttempts === 5) {
        if (correctGuesses >= 3) {
          setGameStatus("You Win!");
        } else {
          setGameStatus("You Lose!");
        }
      } else {
        getWeatherData(remainingCountries);
      }
    }
  };

  const handlePlayAgain = () => {
    setGuessedCountries([]);
    setGameStatus("");
    setRemainingCountries(initialCountries);
    getWeatherData(initialCountries);
  };

  return (
    <div className="main-container">
      <h1>Weather Guessing Game</h1>
      {gameStatus ? (
        <>
          <h2>{gameStatus}</h2>
          <button onClick={handlePlayAgain}>Play Again</button>
        </>
      ) : (
        <>
          <p>Guess the temperature of {country}:</p>
          <input
            className="input-guess"
            type="number"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGuess();
            }}
          />
          <button className="submit-guess" onClick={handleGuess}>
            Submit Guess
          </button>

          <div className="guessed-countries">
            {guessedCountries.map((guess, index) => (
              <ResultCard
                key={index}
                country={guess.country}
                isTrue={guess.isTrue}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
