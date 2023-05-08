import Image from "next/image";
import { useEffect, useState } from "react";
import { Modal, Form, Input, message } from "antd";
import CustomButton from "@/components/button";
import profile_circle from "/public/profile_circle.svg";
import logoutImg from "/public/logout.png";
import { Playfair_Display } from "next/font/google";
import axios from "axios";
const playfairDisplay = Playfair_Display({ subsets: ["latin"] });

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [openLogin, setLoginOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        form.submit();
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => document.removeEventListener("keydown", handleEnter);
  }, [form]);

  const logout = () => {
    localStorage.removeItem("token");
    messageApi.open({
      type: "success",
      content: "登出成功",
    });
    setIsLogin(false);
  };

  const showLoginModal = () => setLoginOpen(true);
  const handleLoginCancel = () => setLoginOpen(false);
  const handleOk = () => setLoginOpen(false);

  const onFinish = async (values) => {
    setConfirmLoading(true);
    axios
      .post("http://member-api.appworks.local/api/v1/client/login", values)
      .then((result) => {
        if (result.data.data.access_token) {
          localStorage.setItem("token", result.data.data.access_token);
          messageApi.open({
            type: "success",
            content: "登入成功",
          });
          setIsLogin(true);
        }
        form.resetFields();
        setLoginOpen(false);
      })
      .catch((e) => {
        messageApi.open({
          type: "error",
          content: "使用者名稱或密碼錯誤",
        });
      })
      .finally(() => {
        setConfirmLoading(false);
      });
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
        alt={isLogin ? "logout" : "login"}
        src={isLogin ? logoutImg : profile_circle}
        width={0}
        height={0}
        sizes="100vw"
        className="ml-auto h-auto w-auto cursor-pointer"
        onClick={isLogin ? logout : showLoginModal}
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
                isLoading={confirmLoading}
                onClick={() => {
                  form.submit();
                }}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      {contextHolder}
    </div>
  );
}
