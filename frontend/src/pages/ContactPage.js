import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Alert,
  Space,
  Card,
} from "antd";
import { MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const onFinish = (values) => {
    console.log("Form submitted:", values);
    // ✅ Replace this with real API/email submission logic
    setSubmitted(true);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "auto" }}>
      <Title level={2}>📞 Contact Us</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card bordered>
            <Space direction="vertical" size="middle">
              <Text strong>
                <HomeOutlined /> Address:
              </Text>
              <Text>Mass Mobile Store,
36, South New Street,
Near Pillaiyar Kovil,
Thoothukudi - 628002, Tamil Nadu</Text>

              <Text strong>
                <PhoneOutlined /> Phone:
              </Text>
              <Text>
                <a href="tel:+919944298448">+91 9944298448</a>
              </Text>

              <Text strong>
                <MailOutlined /> Email:
              </Text>
              <Text>
                <a href="mailto:massmobiletn69@gmail.com">
                  massmobiletn69@gmail.com
                </a>
              </Text>

              <Text strong>Business Hours:</Text>
              <Text>Mon - Sat (10AM - 10PM)</Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Send us a message" bordered>
            {submitted && (
              <Alert
                message="Thank you for contacting us!"
                type="success"
                showIcon
                closable
                style={{ marginBottom: 16 }}
              />
            )}
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="name"
                label="Your Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Your Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: "Please enter a message" }]}
              >
                <Input.TextArea rows={4} placeholder="Your message here" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage;
