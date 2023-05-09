import { useState, useEffect } from "react";
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
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      defaultPageSize: 10,
      pageSizeOptions: [10, 50],
      position: ["bottomCenter"],
      itemRender: (_, type, originalElement) => {
        if (type === "prev") {
          return <a>Previous</a>;
        }
        if (type === "next") {
          return <a>Next</a>;
        }
        return originalElement;
      },
    },
  });

  const fetchData = () => {
    setLoading(true);
    fetch(`http://192.168.50.104:3000/api/v1/admin/record?amount=999`)
      .then((res) => res.json())
      .then((results) => {
        let recordData = [];
        for (let i = 0; i < results.data.length; i++) {
          let row = {
            獎品序號: 1,
            折價券名稱: results.data[i].discount_name,
            折扣: results.data[i].discount_value,
            會員ID: results.data[i].member_id,
            會員名稱: results.data[i].member_name,
            活動ID: results.data[i].event_id,
            兌換號碼: results.data[i].coupon,
            獲得時間: results.data[i].get_coupon_time,
          };

          recordData.push(row);
        }
        setData(recordData);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            itemRender: (_, type, originalElement) => {
              if (type === "prev") {
                return <a>Previous</a>;
              }
              if (type === "next") {
                return <a>Next</a>;
              }
              return originalElement;
            },
          },
        });
      });
  };

  const originalData = async () => {
    try {
      const res = await fetch(
        `http://192.168.50.104:3000/api/v1/admin/record?amount=999`
      );
      const results = await res.json();

      let recordData = [];
      for (let i = 0; i < results.data.length; i++) {
        let row = {
          獎品序號: 1,
          折價券名稱: results.data[i].discount_name,
          折扣: results.data[i].discount_value,
          會員ID: results.data[i].member_id,
          會員名稱: results.data[i].member_name,
          活動ID: results.data[i].event_id,
          兌換號碼: results.data[i].coupon,
          獲得時間: results.data[i].get_coupon_time,
        };

        recordData.push(row);
      }
      return recordData;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters) => {
    setTableParams({
      pagination,
      filters,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const handleSearch = async (value) => {
    const recordData = await originalData();
    if (value === "") {
      setData(recordData);
    } else {
      setSearchValue(value);
      let filteredData = [];
      for (let i = 0; i < recordData.length; i++) {
        if (recordData[i].會員ID === parseInt(value)) {
          filteredData.push(recordData[i]);
        }
      }

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
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        responsive={true}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}
Record.Layout = "Admin";
