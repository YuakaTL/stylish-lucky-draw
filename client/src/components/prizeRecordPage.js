import React, { useState } from "react";
import { Layout, Menu, Input } from "antd";
import PrizeTable from "./prizeTable";
import PrizeHeader from "./prizeHeader";
import PrizeFooter from "./prizeFooter";

const { Sider, Content } = Layout;
const { Search } = Input;

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);

  const onSearch = (value) => console.log(value);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <PrizeHeader toggleCollapsed={toggleCollapsed} />
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={0}
          className="h-screen"
          style={{ backgroundColor: "white", color: "black" }}
        >
          <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
            <div
              className="p-7 text-3xl"
              style={{
                fontFamily: "'Playfair Display'",
                fontStyle: "normal",
                fontWeight: 700,
              }}
            >
              Stylish
            </div>
            <Menu.Item
              key="1"
              style={{
                fontFamily: "'Noto Sans TC'",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "29px",
              }}
            >
              活動管理
            </Menu.Item>
            <Menu.Item
              key="2"
              style={{
                fontFamily: "'Noto Sans TC'",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "29px",
              }}
            >
              獲獎記錄
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content>
            <div className="font-notosanstc font-weight-400 leading-20 ml-7 mt-7 text-xs font-normal">
              Stylish 後台 {">"} 獲獎記錄
            </div>
            <div className="font-notosanstc font-weight-400 leading-29 ml-7 mt-7 text-xl font-normal text-black">
              獲獎記錄
            </div>
            <div
              style={{
                marginLeft: "28px",
                marginRight: "28px",
                height: "0px",
                left: "290px",
                top: "182px",
                border: "1px solid #AAAAAA",
                transform: "rotate(-0.06deg)",
              }}
            ></div>
            <Search
              placeholder="搜尋會員ID..."
              allowClear
              onSearch={onSearch}
              style={{
                width: 200,
                marginLeft: "28px",
                marginTop: "32px",
              }}
            />
            {/* <PrizeTable />
            <PrizeFooter /> */}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default SideBar;
