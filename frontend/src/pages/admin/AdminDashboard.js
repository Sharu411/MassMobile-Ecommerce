import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_BASE_URL } from '../../utils/api';
import { useNavigate } from 'react-router-dom';


const { Title, Text } = Typography;

export default function AdminDashboard() {
 const [stats, setStats] = useState({
  total_orders: 0,
  total_revenue: 0,
  total_customers: 0,
  total_products: 0,
  out_of_stock: 0,
});

const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard_stats.php`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch dashboard stats:", err));
  }, []);

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <Title level={3} style={{ marginBottom: '24px' }}>
          📊 Dashboard Overview
        </Title>

       <Row gutter={[24, 24]}>
  {/* Total Orders */}
  <Col xs={24} md={8}>
    <Card bordered hoverable onClick={() => navigate('/admin/orders')}>
      <Text type="secondary">Total Orders</Text>
      <Title level={2} style={{ color: '#1890ff' }}>
        {stats.total_orders}
      </Title>
    </Card>
  </Col>

  {/* Total Revenue */}
  <Col xs={24} md={8}>
    <Card bordered hoverable onClick={() => navigate('/admin/orders')}>
      <Text type="secondary">Total Revenue</Text>
      <Title level={2} style={{ color: '#52c41a' }}>
        ₹{stats.total_revenue.toLocaleString()}
      </Title>
    </Card>
  </Col>

  {/* Total Customers */}
  <Col xs={24} md={8}>
    <Card bordered hoverable onClick={() => navigate('/admin/customers')}>
      <Text type="secondary">Total Customers</Text>
      <Title level={2} style={{ color: '#13c2c2' }}>
        {stats.total_customers}
      </Title>
    </Card>
  </Col>

  {/* Total Products */}
  <Col xs={24} md={8}>
    <Card bordered hoverable onClick={() => navigate('/admin/products')}>
      <Text type="secondary">All Available Products</Text>
      <Title level={2} style={{ color: '#722ed1' }}>
        {stats.total_products}
      </Title>
    </Card>
  </Col>

  {/* Out of Stock */}
  <Col xs={24} md={8}>
    <Card bordered hoverable onClick={() => navigate('/admin/products?filter=outofstock')}>
      <Text type="secondary">Out of Stock</Text>
      <Title level={2} style={{ color: '#f5222d' }}>
        {stats.out_of_stock}
      </Title>
    </Card>
  </Col>
</Row>

      </div>
    </AdminLayout>
  );
}
