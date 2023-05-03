import Image from "next/image";
import { useState } from "react";
import { Modal, Form, Input } from "antd";
import CustomButton from "@/components/button";
import { Playfair_Display } from "next/font/google";
const playfairDisplay = Playfair_Display({ subsets: ["latin"] });

export default function Header() {
  const [openLogin, setLoginOpen] = useState(false);
  const [form] = Form.useForm();

  const showLoginModal = () => setLoginOpen(true);
  const handleLoginCancel = () => setLoginOpen(false);
  const handleOk = () => setLoginOpen(false);

  const onFinish = async (values) => {
    console.log("Success:", values);
    form.resetFields();
    setLoginOpen(false);
    // let result = await axios.post("/api/user/login", values);
  };

  const CustomFormItem = ({ rules = [], label, ...restProps }) => {
    if (rules.some((rule) => rule.required)) {
      label = (
        <>
          {label}
          <span className="ml-1 text-[#D8749C]">*</span>
        </>
      );
    }
    return <Form.Item rules={rules} label={label} {...restProps} />;
  };

  return (
    <div className="sticky top-0 flex items-center justify-center bg-black px-6 pb-1 pt-[60px]">
      <h1
        className={`${playfairDisplay.className} ml-auto font-bold text-white`}
      >
        StyLish
      </h1>
      <Image
        alt="login"
        src="/profile_circle.svg"
        width={0}
        height={0}
        sizes="100vw"
        className="ml-auto h-auto w-auto cursor-pointer"
        onClick={showLoginModal}
      />
      <Modal
        open={openLogin}
        onOk={handleOk}
        onCancel={handleLoginCancel}
        centered={true}
        bodyStyle={{ borderRadius: "0px" }}
        footer={[]}
        className="login"
      >
        <div className="px-7 py-14">
          <div className="mb-4 text-2xl">
            <span className={playfairDisplay.className}>Stylish </span>登入
          </div>
          <Form
            layout={"vertical"}
            form={form}
            requiredMark={false}
            onFinish={onFinish}
            autoComplete="off"
          >
            <CustomFormItem
              name="username"
              label="使用者名稱"
              rules={[
                {
                  required: true,
                  message: "請輸入你的使用者名稱",
                },
              ]}
            >
              <Input placeholder="請輸入使用者名稱" />
            </CustomFormItem>
            <CustomFormItem
              name="password"
              label="密碼"
              rules={[
                {
                  required: true,
                  message: "請輸入密碼",
                },
              ]}
            >
              <Input.Password placeholder="請輸入密碼" />
            </CustomFormItem>
            <Form.Item className="ml-auto w-[140px] pt-10">
              <CustomButton
                key="submit"
                text="登入"
                className="w-full bg-purple"
                onClick={() => {
                  form.submit();
                }}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
