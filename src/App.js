import { useState, useEffect, useRef } from "react";
import stuff from "./stuff";

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

function getStuff() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stuff);
    }, 500);
  });
}

function useStuff(filter) {
  const [allStuff, setAllStuff] = useState([]);
  const [filteredStuff, setFilteredStuff] = useState([]);
  const [status, setStatus] = useState("idle");
  const [filter2, setFilter2] = useState("");

  // This effect is a nice optimization so the actual filtering
  // only takes place when the filter argument to this hook is
  // different from the current filter state.
  useEffect(() => {
    if (filter === filter2) return;
    setFilter2(filter);
  }, [filter, filter2]);

  // Because of the filter2 state, the actual filtering only takes
  // place when the filter really changed.
  useEffect(() => {
    const filteredStuff =
      filter2.length > 0
        ? allStuff.filter((s) => s.kind === filter2)
        : allStuff;
    setFilteredStuff(filteredStuff);
  }, [filter2, allStuff]);

  // Fetch all stuff fom the server initially.
  useEffect(() => {
    const fetchStuff = async () => {
      setStatus("loading");
      try {
        const stuff = await getStuff();
        setStatus("success");
        setAllStuff(stuff);
      } catch (error) {
        setStatus("error");
      }
    };

    fetchStuff();
  }, []);

  return { stuff: filteredStuff, status };
}

export default function App() {
  const rerender = useForceRerender("App");
  const [filter, setFilter] = useState("");

  return (
    <div>
      <button onClick={rerender}>Click to rerender</button>

      <button
        style={{ border: filter === "" ? "1px solid blue" : 0 }}
        onClick={() => setFilter("")}
      >
        all
      </button>
      <button
        style={{ border: filter === "bla" ? "1px solid blue" : 0 }}
        onClick={() => setFilter("bla")}
      >
        bla
      </button>
      <button
        style={{ border: filter === "poef" ? "1px solid blue" : 0 }}
        onClick={() => setFilter("poef")}
      >
        poef
      </button>

      <div style={{ border: "1px solid darkblue" }}>
        <Stuff filter={filter} />
      </div>
    </div>
  );
}

function Stuff({ filter = "" }) {
  const { stuff, status } = useStuff(filter);

  const rerender = useForceRerender("Stuff");

  return (
    <>
      <button onClick={rerender}>Click to rerender</button>
      {status === "loading" ? (
        <div>loading...</div>
      ) : status === "error" ? (
        <div>An error occurred...</div>
      ) : (
        <div>
          {stuff.map((s) => (
            <div key={s.id}>
              {s.id} {s.name}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
