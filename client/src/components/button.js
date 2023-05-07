import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 20,
      color: "white",
    }}
    spin
  />
);

export default function Button({ text, className, onClick, isLoading }) {
  return (
    <button
      type="button"
      className={`${className} ${
        isLoading && "cursor-not-allowed !bg-gray-500"
      } flex h-12 items-center  justify-center gap-5 rounded-[10px] text-white shadow hover:opacity-80`}
      onClick={onClick}
    >
      {isLoading && <Spin indicator={antIcon} />}
      {text}
    </button>
  );
}
