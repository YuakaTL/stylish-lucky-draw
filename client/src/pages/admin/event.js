import { useState, useEffect } from "react";
import qs from 'qs';
import { Table } from "antd";
import CustomButton from "@/components/button";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    render: (name) => `${name.first} ${name.last}`,
    width: "20%",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    filters: [
      {
        text: "Male",
        value: "male",
      },
      {
        text: "Female",
        value: "female",
      },
    ],
    width: "20%",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

const getRandomuserParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

export default function Event() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
      defaultPageSize: 5,
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
    fetch(
      `https://randomuser.me/api?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then(({ results }) => {
        setData(results);
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
            total: 200,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const showCreateEventModal = () => {
    console.log("showCreateEventModal");
  };

  return (
    <div className="ml-[34px] mt-[30px] pr-[34px]">
      <p className="text-sm">StyLish 後台 {">"} 活動管理</p>
      <h2 className="mb-6 mt-6 border-b border-[#AAAAAA] pb-[6px] text-xl">
        活動管理
      </h2>
      <CustomButton
        text="+ 新活動"
        className="w-28 bg-black text-white"
        onClick={showCreateEventModal}
      />
      <Table
        columns={columns}
        rowKey={(record) => record.login.uuid}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
}
Event.Layout = "Admin";
