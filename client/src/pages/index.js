import Image from "next/image";
import { useState } from "react";
import { Modal } from "antd";
import CustomButton from "@/components/button";
import Coupon from "@/components/card";

export default function Home() {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <main>
      <>
        <CustomButton
          text="已獲得"
          className="w-[180px] bg-gray"
          onClick={showModal}
        />
        <Modal
          title="已獲得獎項"
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          centered={true}
          footer={[
            <CustomButton
              key="submit"
              text="確認"
              className="w-full bg-purple"
              onClick={handleOk}
            />,
          ]}
        >
          <div className="h-[315px] overflow-y-auto">
            <Coupon
              className="bg-red"
              discount="9"
              title="恭喜你"
              description="獲得夏日9折券"
            />
            <Coupon className="bg-green" discount="8" title="全站8折券" />
            <Coupon className="bg-blue" discount="5" title="爆殺5折券" />
            <Coupon className="bg-yellow" discount="1" title="痛哭1折券" />
            <Coupon
              className="bg-gray"
              title="很抱歉"
              description="沒抽中任何獎項"
            />
            <Coupon
              className="bg-green"
              discount="8"
              title="可愛的狗狗"
              description="獲得全站8折券"
              textAlign="left"
            />
          </div>
        </Modal>
      </>
    </main>
  );
}
