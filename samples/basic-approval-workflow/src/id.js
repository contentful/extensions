export default function id() {
  const arr = new Uint32Array(4);
  window.crypto.getRandomValues(arr);
  return arr.map(x => `${x}`).join('!');
}
