import { useState } from "react";
import { Table, Input } from "antd";

const { Search } = Input;

const columnStyle =
  "font-montserrat font-bold text-base leading-4 text-center text-black";
const dataStyle =
  "font-montserrat font-normal text-center text-black text-base leading-5";

const columns = [
  {
    title: <div className={columnStyle}>獎品序號</div>,
    dataIndex: "獎品序號",
    key: "獎品序號",
    render: (text) => <div className={dataStyle}>{text}</div>,
  },
  {
    title: <div className={columnStyle}>折價券名稱</div>,
    dataIndex: "折價券名稱",
    key: "折價券名稱",
    render: (text) => <div className={dataStyle}>{text}</div>,
  },
  {
    title: <div className={columnStyle}>折扣</div>,
    dataIndex: "折扣",
    key: "折扣",
    render: (text) => <div className={dataStyle}>{text}</div>,
  },
  {
    title: <div className={columnStyle}>會員ID</div>,
    key: "會員ID",
    dataIndex: "會員ID",
    render: (text) => <div className={dataStyle}>{text}</div>,
  },
  {
    title: <div className={columnStyle}>會員名稱</div>,
    dataIndex: "會員名稱",
    key: "會員名稱",
    render: (text) => <div className={dataStyle}>{text}</div>,
  },
  {
    title: <div className={columnStyle}>活動ID</div>,
    dataIndex: "活動ID",
    key: "活動ID",
    render: (text) => <div className={dataStyle}>{text}</div>,
  },
  {
    title: <div className={columnStyle}>兌換號碼</div>,
    dataIndex: "兌換號碼",
    key: "兌換號碼",
    render: (text) => <div className={dataStyle}>{text}</div>,
  },
  {
    title: <div className={columnStyle}>獲得時間</div>,
    dataIndex: "獲得時間",
    key: "獲得時間",
    render: (text) => <div className={dataStyle}>{text}</div>,
  },
];

export default function Record() {
  const prizeData = [
    {
      key: "1",
      獎品序號: 1,
      折價券名稱: "夏日9折券",
      折扣: 0.9,
      會員ID: "M800002",
      會員名稱: "可愛的貓貓",
      活動ID: 1,
      兌換號碼: "Nym2eK3q",
      獲得時間: "2023-04-01 00:00:00",
    },
    {
      key: "2",
      獎品序號: 1,
      折價券名稱: "全站8折券",
      折扣: 0.8,
      會員ID: "M800012",
      會員名稱: "可愛的狗狗",
      活動ID: 1,
      兌換號碼: "Nym2eK3q",
      獲得時間: "2023-04-01 00:00:00",
    },
    {
      key: "3",
      獎品序號: 1,
      折價券名稱: "爆殺5折券",
      折扣: 0.5,
      會員ID: "M800004",
      會員名稱: "不可愛的貓貓",
      活動ID: 2,
      兌換號碼: "Nym2eK3q",
      獲得時間: "2023-04-01 00:00:00",
    },
  ];
  const [data, setData] = useState(prizeData);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value) => {
    if (value === "") {
      setData(prizeData);
    } else {
      setSearchValue(value);
      const filteredData = prizeData.filter((item) =>
        item.會員ID.includes(value)
      );
      setData(filteredData);
    }
  };

  return (
    <div className="ml-[34px] mt-[30px]">
      <p className="text-sm">StyLish 後台 {">"} 獲獎記錄</p>
      <h2 className="mb-6 mt-6 border-b border-[#AAAAAA] pb-[6px] text-xl">
        獲獎記錄
      </h2>
      <Search
        placeholder="搜尋會員ID..."
        allowClear
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={handleSearch}
        style={{
          width: 200,
        }}
      />
      <Table
        className="mt-4"
        pagination={{ position: ["bottomCenter"] }}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}
Record.Layout = "Admin";
