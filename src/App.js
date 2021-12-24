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

function getStuff(filter) {
  const filteredStuff =
    filter.length > 0 ? stuff.filter((s) => s.kind === filter) : stuff;
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(filteredStuff);
    }, 500);
  });
}

function useStuff(filter) {
  const [stuff, setStuff] = useState([]);
  const [status, setStatus] = useState("idle");
  const [filter2, setFilter2] = useState("");

  useEffect(() => {
    setFilter2(filter);
  }, [filter]);

  useEffect(() => {
    const fetchStuff = async () => {
      setStatus("loading");
      try {
        const stuff = await getStuff(filter2);
        setStatus("success");
        setStuff(stuff);
      } catch (error) {
        setStatus("error");
      }
    };

    fetchStuff();
  }, [filter2]);

  return { stuff, status };
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
