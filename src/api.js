const movies = [
  { id: 1, title: "Star Trek: First Contact", genre: "Science Fiction" },
  { id: 2, title: "O Brother, Where Art Thou?", genre: "Comedy" },
  { id: 3, title: "The Silence of the Lambs", genre: "Thriller" },
  { id: 4, title: "Home Alone", genre: "Comedy" }
];

const genres = [...new Set(movies.map((movie) => movie.genre))];

export function getMovies() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(movies);
    }, 500);
  });
}

export function getGenres() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(genres);
    }, 500);
  });
}
