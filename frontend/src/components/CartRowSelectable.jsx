import React from "react";
import { Row, Col, Button, Tag, Typography } from "antd";
import { CheckCircleTwoTone, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { API_BASE_URL } from "../utils/api";

const { Text } = Typography;

export default function CartRowSelectable({ item, qty, onAdd, onChangeQty }) {
  const offer = item.offer_price ? +item.offer_price : item.price;
  const discount = item.offer_price ? item.price - offer : 0;
  const percent = discount ? Math.round((discount / item.price) * 100) : 0;

  return (
    <Row gutter={16} align="middle" className="row-wrap">
      {/* image */}
      <Col xs={6} md={4}>
        <img
          src={
            item.image.startsWith("http")
              ? item.image
              : `${API_BASE_URL}/images/${item.image}`
          }
          alt={item.name}
          style={{ width: "100%", borderRadius: 8 }}
        />
      </Col>

      {/* details */}
      <Col xs={10} md={12}>
        <Text strong>{item.name}</Text>
        <br />
        {discount ? (
          <>
            <Text delete>₹{item.price.toLocaleString()}</Text>{" "}
            <Text strong>₹{offer.toLocaleString()}</Text>{" "}
            <Tag color="green">{percent}% off</Tag>
          </>
        ) : (
          <Text strong>₹{offer.toLocaleString()}</Text>
        )}
      </Col>

      {/* controls */}
      <Col xs={8} md={8} style={{ textAlign: "right" }}>
        {qty === 0 ? (
          <Button type="primary" onClick={() => onAdd(item)}>
            Add
          </Button>
        ) : (
          <>
            <Tag icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} color="default">
              Added
            </Tag>
            <Button.Group size="small">
              <Button
                icon={<MinusOutlined />}
                onClick={() => onChangeQty(item.id, qty - 1)}
              />
              <Text style={{ padding: "0 8px" }}>{qty}</Text>
              <Button
                icon={<PlusOutlined />}
                onClick={() => onChangeQty(item.id, qty + 1)}
              />
            </Button.Group>
          </>
        )}
      </Col>
    </Row>
  );
}
