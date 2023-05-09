import Link from "next/link";
import { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import { EditOutlined, DeleteTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import CustomButton from "@/components/button";

const convertStatus = {
  pending: "尚未開始",
  ongoing: "進行中",
  cancelled: "已取消",
  finished: "已結束",
};

const convertStatusColor = {
  pending: "orange",
  ongoing: "green",
  cancelled: "red",
  finished: "red",
};

const editEvent = (data) => () => {
  console.log("editEvent", data);
};

const deleteEvent = (id) => async () => {
  let result = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/lottery/${id}`,
    {
      status: "cancelled",
    }
  );
};

const columns = [
  {
    title: "活動序號",
    dataIndex: "event_id",
    width: "10%",
    sorter: {
      compare: (a, b) => a.event_id - b.event_id,
    },
    sortDirections: ["descend"],
  },
  {
    title: "活動名稱",
    dataIndex: "event_name",
    width: "15%",
  },
  {
    title: "活動開始時間",
    dataIndex: "event_start_time",
    sorter: true,
    width: "15%",
    render: (event_start_time) => (
      <>{dayjs(event_start_time).format("YYYY-MM-DD HH:mm:ss")}</>
    ),
    sorter: {
      compare: (a, b) =>
        dayjs(a.event_end_time).unix() - dayjs(b.event_end_time).unix(),
    },
  },
  {
    title: "活動結束時間",
    dataIndex: "event_end_time",
    sorter: true,
    width: "15%",
    render: (event_end_time) => (
      <>{dayjs(event_end_time).format("YYYY-MM-DD HH:mm:ss")}</>
    ),
    sorter: {
      compare: (a, b) =>
        dayjs(a.event_end_time).unix() - dayjs(b.event_end_time).unix(),
    },
  },
  {
    title: "狀態",
    dataIndex: "status",
    width: "15%",
    render: (status, data) => (
      <>
        {data.is_visible ? (
          <Tag color={convertStatusColor[status]} key={status}>
            {convertStatus[status]}
          </Tag>
        ) : (
          <Tag color={"red"} key={status}>
            已隱藏
          </Tag>
        )}
      </>
    ),
    filters: [
      {
        text: "尚未開始",
        value: "pending",
      },
      {
        text: "進行中",
        value: "ongoing",
      },
      {
        text: "已取消",
        value: "cancelled",
      },
      {
        text: "已結束",
        value: "finished",
      },
    ],
    onFilter: (value, record) => record.status.indexOf(value) === 0,
  },
  {
    title: "獎品剩餘庫存",
    dataIndex: "total_inventory",
    width: "15%",
  },
  {
    title: "功能",
    dataIndex: "event_id",
    align: "center",
    width: "10%",
    render: (id, data) => (
      <div className="flex justify-around">
        <EditOutlined
          className="cursor-pointer text-xl"
          onClick={editEvent(data)}
        />
        <DeleteTwoTone
          twoToneColor="#A30D11"
          className="cursor-pointer text-xl"
          onClick={deleteEvent(id)}
        />
      </div>
    ),
  },
];

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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/lottery`)
      .then((res) => res.json())
      .then((results) => {
        let data = [];
        results.data.lottery.forEach((item) => {
          if (item.status !== "cancelled") {
            return data.push(item);
          }
        });
        setData(data);
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
            total: results.data.length,
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

  return (
    <div className="ml-[34px] mt-[30px] pr-[34px]">
      <p className="text-sm">StyLish 後台 {">"} 活動管理</p>
      <h2 className="mb-6 mt-6 border-b border-[#AAAAAA] pb-[6px] text-xl">
        活動管理
      </h2>
      <Link href={"event-creation"} className="inline-block float-right mb-4">
        <CustomButton
          text="+ 新活動"
          className=" w-28 bg-black text-white"
        />
      </Link>

      <Table
        columns={columns}
        rowKey={(record) => record.event_id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        responsive={true}
        className="overflow-y-auto"
      />
    </div>
  );
}
Event.Layout = "Admin";
