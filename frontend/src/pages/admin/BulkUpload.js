import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Button,
  message,
  Typography,
  Card,
  Modal,
  List,
} from "antd";
import {
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/admin/AdminLayout";
import { API_BASE_URL } from "../../utils/api";

const { Title } = Typography;

export default function BulkUpload() {
  const [fileList, setFileList] = useState([]);
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  /* Keep only the most‑recent file */
  const handleChange = ({ fileList: newFileList }) =>
    setFileList(newFileList.slice(-1));

  /* Upload to server */
  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error("❌ Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("csv", fileList[0].originFileObj);

    try {
      const res = await fetch(
        `${API_BASE_URL}/products.bulk_upload.php`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      /* Successful inserts */
      if (data.success && data.inserted > 0) {
        message.success(
          `✅ ${data.inserted} products uploaded successfully.`
        );
        if (data.errors?.length) {
          setErrors(data.errors);
          setShowModal(true);
        } else {
          /* Everything perfect – go back to Products */
          setTimeout(() => navigate("/admin/products"), 1200);
        }
        return;
      }

      /* Hard failure */
      const allErr =
        data.errors?.length
          ? data.errors
          : [data.error || "Unknown server error."];
      setErrors(allErr);
      setShowModal(true);
      message.error("❌ Upload failed. See details.");

    } catch (err) {
      console.error(err);
      message.error("❌ Network / server error while uploading.");
    }
  };

  /* Save errors as a text file */
  const downloadErrors = () => {
    const blob = new Blob([errors.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-upload-errors.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Title level={3} className="text-center mb-4">
          📦 Bulk Product Upload
        </Title>

        <Card
          bordered={false}
          style={{
            maxWidth: 500,
            margin: "0 auto",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <Upload
            accept=".csv"
            beforeUpload={() => false}
            onChange={handleChange}
            fileList={fileList}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select CSV File</Button>
          </Upload>

          <div className="text-center mt-4">
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={fileList.length === 0}
            >
              ⬆️ Upload
            </Button>
          </div>
        </Card>

        {/* Error / warning modal */}
        <Modal
          title={
            <>
              <ExclamationCircleOutlined style={{ color: "#faad14" }} />{" "}
              Upload Issues
            </>
          }
          width={720}
          open={showModal}
          onCancel={() => setShowModal(false)}
          okText="Download log"
          cancelText="Close"
          onOk={downloadErrors}
        >
          <p>
            Some rows could not be processed. Review the list and fix the CSV,
            then re‑upload.
          </p>
          <List
            bordered
            size="small"
            dataSource={errors}
            style={{ maxHeight: 320, overflowY: "auto" }}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}
