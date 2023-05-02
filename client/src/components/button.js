export default function Button({ text, className, onClick }) {
  return (
    <button
      type="button"
      className={`${className} h-12 rounded-[10px] text-white  shadow hover:opacity-80`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
