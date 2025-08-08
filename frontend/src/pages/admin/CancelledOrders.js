import React, { useEffect, useState } from 'react';
import { Table, Typography, Tag, Alert } from 'antd';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_BASE_URL } from '../../utils/api';

const { Title, Text } = Typography;

export default function CancelledOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_cancelled_orders.php`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error("❌ Error fetching:", err));
  }, []);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: text => <Text strong>{text}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: amt => `₹${amt}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => <Tag color="red">Cancelled</Tag>,
    },
    {
      title: 'Cancel Reason',
      dataIndex: 'cancel_reason',
      key: 'cancel_reason',
      render: reason =>
        reason ? (
          <Alert message={reason} type="warning" showIcon />
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Order Date',
      dataIndex: 'order_date',
      key: 'order_date',
      render: date => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '16px' }}>
        <Title level={4} type="danger" style={{ textAlign: 'center', marginBottom: '24px' }}>
          ❌ Cancelled Orders
        </Title>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="order_id"
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: 'max-content' }}
        />
      </div>
    </AdminLayout>
  );
}
