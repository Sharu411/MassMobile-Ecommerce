import React, { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Select,
  Typography,
  Modal,
  message,
  Input,
  Row,
  Col,
  Grid
} from 'antd';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_BASE_URL } from '../../utils/api';

const { Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

export default function ReturnRequests() {
  const [returns, setReturns] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const screens = useBreakpoint();

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/get_return_requests.php`)
      .then((res) => res.json())
      .then((data) => {
        setReturns(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error fetching returns:', err);
        setLoading(false);
      });
  };

  const handleApprove = (order_id) => {
    fetch(`${API_BASE_URL}/update_return_status.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id, return_status: 'Approved' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          message.success('✅ Return Approved');
          fetchReturns();
        } else {
          message.error('❌ Error: ' + data.message);
        }
      });
  };

  const handleReject = (order_id) => {
    setSelectedOrderId(order_id);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const submitRejection = () => {
    if (!rejectReason.trim()) {
      message.warning('❗ Rejection reason is required.');
      return;
    }

    fetch(`${API_BASE_URL}/reject_return.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `order_id=${selectedOrderId}&rejection_reason=${encodeURIComponent(rejectReason)}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          message.success('🚫 Return Rejected');
          fetchReturns();
          setRejectModalVisible(false);
        } else {
          message.error('❌ Error: ' + data.message);
        }
      })
      .catch(() => {
        message.error('❌ Request failed');
        setRejectModalVisible(false);
      });
  };

  const filteredReturns = returns.filter((r) =>
    filter === 'All' ? true : r.return_status === filter
  );

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      responsive: ['sm'],
    },
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
    },
    {
      title: 'Reason',
      dataIndex: 'return_reason',
      key: 'return_reason',
      responsive: ['md'],
    },
    {
      title: 'Status',
      dataIndex: 'return_status',
      key: 'return_status',
      render: (status) => {
        let color =
          status === 'Approved' ? 'green' :
          status === 'Rejected' ? 'red' :
          'gold';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        record.return_status === 'Requested' ? (
          <div style={{ display: 'flex', flexDirection: screens.xs ? 'column' : 'row', gap: '8px' }}>
            <Button type="primary" size="small" onClick={() => handleApprove(record.id)}>
              ✅ Approve
            </Button>
            <Button type="primary" danger size="small" onClick={() => handleReject(record.id)}>
              ❌ Reject
            </Button>
          </div>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 16 }}>
        <Title level={4} style={{ textAlign: 'center', color: '#1890ff' }}>
          📦 Return Requests
        </Title>

        <Row justify="end" style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={filter}
              onChange={setFilter}
              style={{ width: '100%' }}
            >
              <Option value="All">All</Option>
              <Option value="Requested">Requested</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Col>
        </Row>

        <div style={{ overflowX: 'auto' }}>
          <Table
            dataSource={filteredReturns}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 8 }}
            bordered
          />
        </div>

        <Modal
          title="Reject Return Request"
          open={rejectModalVisible}
          onOk={submitRejection}
          onCancel={() => setRejectModalVisible(false)}
          okText="Reject"
          okButtonProps={{ danger: true }}
        >
          <p>Please enter a reason for rejection:</p>
          <Input.TextArea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Type reason..."
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}
