import { useState, useEffect } from "react";
import { useMovies, useGenres } from "./useMovies";

// Three ways of optimizing without memoization:
// [1] Render children coming from parent
// [2] Pass [component + props] as a prop
// [3] Create const that has [component + props] outside of the component

// Use this hook to be able to rerender a component when the component has no state.
// Usage: Call the hook, and then call the function returned by the hook when you want to rerender.
// const rerender = useForceRerender();
function useForceRerender() {
  const [, setState] = useState();
  return () => setState((prevState) => !prevState);
}

export default function App() {
  const rerender = useForceRerender();
  const [currentFilter, setCurrentFilter] = useState("");
  useEffect(() => console.log(`render App, genre: ${currentFilter}`));

  const { genres, status } = useGenres();

  return (
    <div>
      <button onClick={rerender}>Click to rerender</button>

      {genres.map((genre) => (
        <button
          key={genre}
          style={{ border: genre === currentFilter ? "1px solid blue" : 0 }}
          onClick={() => setCurrentFilter(genre)}
        >
          {genre || "All"}
        </button>
      ))}

      <Movies genre={currentFilter} />
    </div>
  );
}

function Movies({ genre = "" }) {
  const { movies, status } = useMovies(genre);
  useEffect(() => console.log(`render Movies, status: ${status}`));

  if (status === "loading") return <div>loading...</div>;
  if (status === "error") return <div>error...</div>;

  return (
    <div style={{ border: "1px solid darkblue" }}>
      <div>
        {movies.map((s) => (
          <div key={s.id}>{s.title}</div>
        ))}
      </div>
    </div>
  );
}
