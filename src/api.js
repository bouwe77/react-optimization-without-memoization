const stuff = [
  { id: 1, name: "Miep", kind: "poef" },
  { id: 2, name: "Kees", kind: "bla" },
  { id: 3, name: "Piet", kind: "poef" }
];

export default function getStuff() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stuff);
    }, 500);
  });
}
