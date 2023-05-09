import { useState, useEffect } from "react";
import { Form, Input, DatePicker, Switch, Upload, Table,message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CustomButton from "@/components/button";
import dayjs from "dayjs";
import { ExcelRenderer } from "react-excel-renderer";
import axios from "axios";

const { RangePicker } = DatePicker;
const { Dragger } = Upload;
export default function EventCreation() {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const props = {
    name: "file",
    accept: ".xlsx",
    ondrop: (e) => handleDrop(e),
    ondragover: (e) => e.preventDefault(),
    beforeUpload: (file) => {
      handleFile(file);
      return false;
    },
  };

  const columns = [
    { title: "獎項名稱", dataIndex: "discount_name" },
    { title: "折扣", dataIndex: "discount_name" },
    { title: "領取條件（滿額）", dataIndex: "discount_value" },
    { title: "庫存張數", dataIndex: "inventory" },
  ].map((col) => ({
    ...col,
    className: "bg-white text-black w-auto",
    title: <span className="text-[14px]">{col.title}</span>,
  }));

  const handleFile = (file) => {
    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const tableData = resp.rows.slice(1).map((row, index) => {
          return {
            key: index,
            discount_name: row[0],
            discount_value: row[1],
            threshold: row[2],
            inventory: row[3],
          };
        });
        setTableData(tableData);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      handleFile(file);
    }
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

  const switchOnChange = (checked) => {
    setSwitchChecked(checked);
  };

  const onFinish = async (values) => {
    values.event_start_time = dayjs(values.event_time[0]).format(
      "YYYY-MM-DD HH:mm"
    );
    values.event_end_time = dayjs(values.event_time[1]).format(
      "YYYY-MM-DD HH:mm"
    );
    let excelData;
    excelData = tableData.map((row) => {
      return {
        discount_name: row.discount_name,
        discount_value: row.discount_value,
        threshold: row.threshold,
        inventory: row.inventory,
      };
    });

    const data = {
      event_name: values.event_name,
      event_start_time: values.event_start_time,
      event_end_time: values.event_end_time,
      is_visible: switchChecked,
      event_data: excelData
    };

    setConfirmLoading(true);
    axios
      .post(`http://192.168.50.104:3000/api/v1/admin/lottery`, data)
      .then((result) => {
        if(result.data.code==="000"){
          messageApi.open({
            type: "success",
            content: result.data.message,
          });
        }else{
          messageApi.open({
            type: "error",
            content: result.data.message,
          });
        }
        form.resetFields();
        setTableData([]);
      })
      .catch((e) => {
        messageApi.open({
          type: "error",
          content: e.message,
        });
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  return (
    <div className="ml-[34px] mt-[30px] pr-[34px]">
      <p className="text-sm">
        StyLish 後台 {">"} 活動管理 {">"} 新增活動
      </p>
      <h2 className="mb-6 mt-6 border-b border-[#AAAAAA] pb-[6px] text-xl">
        活動設定
      </h2>
      <Form
        layout={"vertical"}
        form={form}
        requiredMark={false}
        onFinish={onFinish}
        autoComplete="off"
      >
        <CustomFormItem
          name="event_name"
          label="活動名稱"
          rules={[
            {
              required: true,
              message: "請輸入活動名稱",
            },
          ]}
        >
          <Input placeholder="輸入活動名稱" />
        </CustomFormItem>

        <CustomFormItem
          name="event_time"
          label="活動時間"
          rules={[
            {
              required: true,
              message: "請輸入活動時間",
            },
          ]}
        >
          <RangePicker
            showTime={{
              format: "HH:mm",
            }}
            format="YYYY-MM-DD HH:mm"
            className="w-full"
          />
        </CustomFormItem>

        <Form.Item label="是否隱藏" valuePropName="is_visible">
          否 <Switch onChange={switchOnChange} /> 是
        </Form.Item>

        {tableData.length === 0 ? (
          <Form.Item label="獎項列表">
            <>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text !text-[#636363]">
                  拖拽上傳或是
                  <span className="text-black underline">選取檔案</span>
                </p>
              </Dragger>
              <p className="mt-3">檔案格式僅支援 XLSX</p>
            </>
          </Form.Item>
        ) : (
          <div
            className="items-left flex items-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
          >
            <Table
              dataSource={tableData}
              columns={columns}
              pagination={false}
              className="w-full"
            />
          </div>
        )}

        <div className="flex justify-end gap-x-3 pt-10">
          <CustomButton
            key="cancel"
            text="取消"
            className="w-[100px] border border-[#1E1E1E] bg-white !text-black"
            onClick={() => {
              form.resetFields();
            }}
          />
          <CustomButton
            key="submit"
            text="確認"
            className="w-[100px] bg-[#1E1E1E]"
            isLoading={confirmLoading}
            onClick={() => {
              form.submit();
            }}
          />
        </div>
      </Form>
      {contextHolder}
    </div>
  );
}
EventCreation.Layout = "Admin";
