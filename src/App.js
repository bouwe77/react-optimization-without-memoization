import { useState } from "react";
import useStuff from "./useStuff";

// Three ways of optimizing without memoization:
// [1] Render children coming from parent
// [2] Pass [component + props] as a prop
// [3] Create const that has [component + props] outside of the component

// Use this hook to be able to rerender a component when the component has no state.
// Usage: Call the hook, and then call the function returned by the hook when you want to rerender.
// const rerender = useForceRerender();
function useForceRerender(name) {
  const [, setState] = useState();
  // useEffect(() => console.log(`render ${name}...`));
  return () => setState((prevState) => !prevState);
}

export default function App() {
  const rerender = useForceRerender("App");
  const [currentFilter, setCurrentFilter] = useState("");
  const filters = ["", "bla", "poef"];

  return (
    <div>
      <button onClick={rerender}>Click to rerender</button>

      {filters.map((filter) => (
        <button
          style={{ border: filter === currentFilter ? "1px solid blue" : 0 }}
          onClick={() => setCurrentFilter(filter)}
        >
          {filter || "all"}
        </button>
      ))}

      <Stuff filter={currentFilter} />
    </div>
  );
}

function Stuff({ filter = "" }) {
  const { stuff, status } = useStuff(filter);
  const rerender = useForceRerender("Stuff");

  if (status === "loading") return <div>loading...</div>;
  if (status === "error") return <div>error...</div>;

  return (
    <div style={{ border: "1px solid darkblue" }}>
      <button onClick={rerender}>Click to rerender</button>
      <div>
        {stuff.map((s) => (
          <div key={s.id}>{s.name}</div>
        ))}
      </div>
    </div>
  );
}
