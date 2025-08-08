import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Tag, Typography, Space } from 'antd';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_BASE_URL } from '../../utils/api';

const { Title } = Typography;
const { Option } = Select;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = () => {
    fetch(`${API_BASE_URL}/orders.showall.php`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error('Error fetching orders:', err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTrackingUpdate = async (orderId, newStatus) => {
    const confirmChange = window.confirm(`Change tracking status to "${newStatus}"?`);
    if (!confirmChange) return;

    try {
      const response = await fetch(`${API_BASE_URL}/update_tracking_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, tracking_status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Tracking status updated');
        fetchOrders();
      } else {
        alert('Failed to update tracking status');
      }
    } catch (error) {
      console.error('Error updating tracking:', error);
      alert('Something went wrong');
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'Delivered':
        return <Tag color="green">{status}</Tag>;
      case 'Shipped':
        return <Tag color="blue">{status}</Tag>;
      case 'Confirmed':
        return <Tag color="orange">{status}</Tag>;
      case 'Cancelled':
        return <Tag color="red">{status}</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(search.toLowerCase()) ||
      order.product_name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.tracking_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      responsive: ['md'],
    },
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `₹${parseFloat(total).toLocaleString()}`,
    },
    {
      title: 'Payment',
      dataIndex: 'payment_mode',
      key: 'payment_mode',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Delivered Date',
      dataIndex: 'delivered_at',
      key: 'delivered_at',
      render: (date) => (date ? new Date(date).toLocaleDateString() : '—'),
      responsive: ['lg'],
    },
    {
      title: 'Tracking',
      key: 'tracking_status',
      render: (_, record) => (
        <Select
          size="small"
          value={record.tracking_status || 'Confirmed'}
          onChange={(value) => handleTrackingUpdate(record.id, value)}
          style={{ width: 160 }}
        >
          {['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Order Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
      responsive: ['lg'],
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <Title level={3}>📦 All Orders</Title>

        {/* 🔍 Filters */}
        <Space style={{ marginBottom: '16px' }} direction="vertical" size="middle">
          <Input
            placeholder="Search by customer or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            style={{ width: 200 }}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="All">All Statuses</Option>
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Shipped">Shipped</Option>
            <Option value="Out for Delivery">Out for Delivery</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </Space>

        {/* 📋 Orders Table */}
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          bordered
          scroll={{ x: 'max-content' }}
        />
      </div>
    </AdminLayout>
  );
}
