export default function Card({
  discount,
  title,
  description,
  textAlign = "text-center",
}) {
  if (textAlign === "left") {
    textAlign = "text-left ml-[22px] mr-auto";
  }
  const convertDiscount = {
    1: "bg-yellow",
    5: "bg-blue",
    8: "bg-green",
    9: "bg-red",
    undefined: "bg-gray",
  };

  return (
    <div className="m-4 flex items-center justify-between  rounded-[20px] bg-white p-4 shadow-2">
      <div
        className={`${convertDiscount[discount]} flex h-20 w-20 items-center justify-center rounded-[10px] text-2xl font-black text-white`}
      >
        {discount && `${discount} 折`}
      </div>
      <p className={`${textAlign} mx-auto text-xl`}>
        {title} <br />
        {description && <span className="text-base">{description}</span>}
      </p>
    </div>
  );
}
