import { useState, useEffect } from "react";
import getStuff from "./api";

export default function useStuff(filter) {
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
