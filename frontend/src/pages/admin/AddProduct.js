import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Upload, message, Row, Col, Typography } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { API_BASE_URL } from "../../utils/api";

const { Title } = Typography;
const { TextArea } = Input;

export default function AddProduct() {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/products.create.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        message.success("✅ Product added successfully!");
        form.resetFields();
        navigate("/admin/products");
      } else {
        message.error(`❌ Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      message.error("❌ Error occurred during submission.");
    }
  };

  const handleImageUpload = (file) => {
    setImageFile(file);
    return false; // Prevent auto upload
  };

  return (
    <AdminLayout>
      <div style={{ padding: "24px" }}>
        <Title level={3} className="text-center mb-4">📦 Add New Product</Title>

    <Form
  form={form}
  layout="vertical"
  onFinish={onFinish}
  initialValues={{
    name: "Sample Mobile",
    brand: "MassMobiles",
    category: "Smartphones",
    price: 9999,
    offer_price: 8999,
    quantity: 20,
    imei: 1234567899,
    color: "Black",
    warranty: "6 Months Seller Warranty",
    storage: "128GB",
    ram: "6GB",
    battery: "5000mAh",
    processor:"2.5GHZ CLOCK SPEED",
    rear_camera: "50MP",
    front_camera: "16MP",
    condition: "Refurbished",
    discount_percentage: "10",
    display: "6.5 inch AMOLED",
    network_type: "4G VoLTE",
    full_kit: "Charger, USB Cable, Box",
    sim_type: "Dual SIM (Nano)",
    video: "https://www.youtube.com/watch?v=sample",
    description: "High-quality refurbished mobile with 6 months seller warranty. Fully tested and certified.",
  }}
>


          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="📱 Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="🏷 Brand" name="brand" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="📂 Category" name="category" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="💰 Price" name="price" rules={[{ required: true }]}>
                <InputNumber className="w-100" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="💸 Offer Price" name="offer_price">
                <InputNumber className="w-100" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="🔢 Quantity" name="quantity" rules={[{ required: true }]}>
                <InputNumber className="w-100" min={0} />
              </Form.Item>
            </Col>
             <Col span={12}>
              <Form.Item label="IMEI Number" name="imei" rules={[{ required: true }]}>
                <InputNumber className="w-100" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="🎨 Color" name="color">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="🛡 Warranty" name="warranty">
                <Input />
              </Form.Item>
            </Col>

            {/* Details */}
            <Col span={12}><Form.Item label="💾 Storage" name="storage"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="⚡ RAM" name="ram"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="🔋 Battery" name="battery"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="🔋 Processor" name="processor"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="📸 Rear Camera" name="rear_camera"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="🤳 Front Camera" name="front_camera"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="🧾 Condition" name="condition"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="🎯 Discount %" name="discount_percentage"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="🖥 Display" name="display"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="📶 Network Type" name="network_type"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="📦 Full Kit" name="full_kit"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="💳 SIM Type" name="sim_type"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="🎥 Video URL" name="video"><Input /></Form.Item></Col>

            <Col span={24}>
              <Form.Item label="📝 Description" name="description">
                <TextArea rows={3} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="🖼 Upload Image"
                name="image"
                rules={[{ required: true, message: "Please upload an image." }]}
              >
                <Upload
                  beforeUpload={handleImageUpload}
                  maxCount={1}
                  accept="image/*"
                  showUploadList={{ showRemoveIcon: true }}
                >
                  <Button icon={<UploadOutlined />}>Select Image</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
              Add Product
            </Button>
          </div>
        </Form>
      </div>
    </AdminLayout>
  );
}
