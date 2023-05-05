import React from "react";
import { Button, Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const { Header } = Layout;

function PrizeHeader(props) {
  const { toggleCollapsed } = props;

  return (
    <Header className="bg-black">
      <Button type="primary" onClick={toggleCollapsed}>
        <MenuOutlined />
      </Button>
    </Header>
  );
}

export default PrizeHeader;
