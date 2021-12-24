import { useState, useEffect } from "react";
import stuff from "./stuff";

// Three ways of optimizing without memoization:
// [1] Render children coming from parent
// [2] Pass [component + props] as a prop
// [3] Create const that has [component + props] outside of the component

// Use this hook to be able to rerender a component when the component has no state.
// Usage: Call the hook, and then call the function returned by the hook when you want to rerender.
// const rerender = useForceRerender();
function useForceRerender() {
  const [, setState] = useState();
  useEffect(() => console.log("render..."));
  return () => setState((prevState) => !prevState);
}

function getStuff() {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(stuff);
    }, 500);
  });
}

function useStuff() {
  const [stuff, setStuff] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    (async () => {
      setStatus("loading");
      try {
        const stuff = await getStuff();
        setStatus("success");
        setStuff(stuff);
      } catch (error) {
        setStatus("error");
      }
    })();
  }, []);

  return { stuff, status };
}

export default function App() {
  const rerender = useForceRerender();
  const { stuff, status } = useStuff();

  return (
    <div>
      <button onClick={rerender}>Click to rerender</button>

      {status === "loading" ? (
        <div>loading...</div>
      ) : status === "error" ? (
        <div>An error occurred...</div>
      ) : (
        <div>
          {stuff.map((s) => (
            <div key={s.id}>{s.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
