import { useState, useEffect } from "react";

// Pass [component + props] as a prop
// Render children coming from parent
// Create const that has [component + props] outside of the component

// Use this hook to be able to rerender a component when the component has no state.
function useForceRerender() {
  const [, setState] = useState();
  return () => setState((prevState) => !prevState);
}

export default function App() {
  const rerender = useForceRerender();

  useEffect(() => console.log("rendered"));

  return (
    <div>
      <button onClick={rerender}>Click to rerender</button>
    </div>
  );
}
