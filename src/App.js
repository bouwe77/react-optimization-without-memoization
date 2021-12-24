import { useState, useEffect } from "react";
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
  useEffect(() => console.log(`render ${name}...`));
  return () => setState((prevState) => !prevState);
}

function getStuff() {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      const stuff2 = stuff.map((s) => ({
        ...s,
        id: Math.floor(Math.random() * (1000 - 1) + 1)
      }));
      resolve(stuff2);
    }, 500);
  });
}

function useStuff() {
  const [stuff, setStuff] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const fetchStuff = async () => {
      setStatus("loading");
      try {
        const stuff = await getStuff();
        setStatus("success");
        setStuff(stuff);
      } catch (error) {
        setStatus("error");
      }
    };

    fetchStuff();
  }, []);

  return { stuff, status };
}

export default function App() {
  const rerender = useForceRerender("App");

  return (
    <div>
      <button onClick={rerender}>Click to rerender</button>

      <div style={{ border: "1px solid darkblue" }}>
        <Stuff />
      </div>
    </div>
  );
}

function Stuff() {
  const { stuff, status } = useStuff();

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
