import { useState, useEffect } from "react";
import { getMovies, getGenres } from "./api";

export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [status, setStatus] = useState("idle");

  // Fetch all movies fom the server initially.
  useEffect(() => {
    const fetchGenres = async () => {
      setStatus("loading");
      try {
        const genres = await getGenres();
        setGenres(["", ...genres]);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };

    fetchGenres();
  }, []);

  return { genres, status };
}

export function useMovies(genreFilter) {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [status, setStatus] = useState("idle");
  const [currentGenreFilter, setCurrentGenreFilter] = useState("");

  // This effect is a nice optimization so the actual filtering
  // only takes place when the genreFilter argument to this hook is
  // different from the current genreFilter state.
  useEffect(() => {
    if (genreFilter === currentGenreFilter) return;
    setCurrentGenreFilter(genreFilter);
  }, [genreFilter, currentGenreFilter]);

  // Because of the currentGenreFilter state, the actual filtering only takes
  // place when the genreFilter really changed.
  useEffect(() => {
    console.log("filtering...");
    const filteredMovies =
      currentGenreFilter.length > 0
        ? allMovies.filter((s) => s.genre === currentGenreFilter)
        : allMovies;
    setFilteredMovies(filteredMovies);
  }, [currentGenreFilter, allMovies]);

  // Fetch all movies fom the server initially.
  useEffect(() => {
    const fetchMovies = async () => {
      setStatus("loading");
      try {
        const movies = await getMovies();
        setAllMovies(movies);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };

    fetchMovies();
  }, []);

  return { movies: filteredMovies, status };
}
