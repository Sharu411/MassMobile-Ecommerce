import React, { useEffect, useState } from 'react';
import { Table, Input, Typography, Row, Col, Space } from 'antd';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_BASE_URL } from '../../utils/api';

const { Title, Text } = Typography;
const { Search } = Input;

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_customers.php`)
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error('Error fetching customers:', err));
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: text => <Text strong>{text}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: 'Joined',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: date => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Address',
      key: 'address',
      render: (_, record) =>
        record.address ? (
          <div style={{ minWidth: 220 }}>
            {record.address.address_line1}, {record.address.address_line2}, {record.address.city}, {record.address.state} - {record.address.pincode}
            <br />
            <Text type="secondary">Landmark: {record.address.landmark}</Text>
          </div>
        ) : (
          <Text type="secondary"><em>No address</em></Text>
        ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '16px' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '16px' }}>
          👥 Customer List
        </Title>

        {/* 🔍 Search */}
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <Search
              placeholder="Search by name or email..."
              enterButton
              allowClear
              size="large"
              onChange={e => setSearch(e.target.value)}
              value={search}
            />
          </Col>
        </Row>

        {/* 📋 Table */}
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: 'max-content' }} // 👈 Important for mobile/tablet
        />
      </div>
    </AdminLayout>
  );
}
