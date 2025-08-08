import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Typography,
  Space,
  Image,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../utils/api";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import EditProduct from "./EditProduct";
import { useLocation } from 'react-router-dom';
const { Title } = Typography;

let debounceTimer;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
const [brandSearch, setBrandSearch] = useState("");
const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
const [showOutOfStockOnly, setShowOutOfStockOnly] = useState(false);

  const fetchProducts = () => {
    fetch(`${API_BASE_URL}/products.showall.php`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((product) => {
  const matchesName = nameSearch
    ? product.name.toLowerCase().includes(nameSearch.toLowerCase())
    : true;

  const matchesBrand = brandSearch
    ? product.brand.toLowerCase().includes(brandSearch.toLowerCase())
    : true;

  const matchesCategory = categorySearch
    ? product.category.toLowerCase().includes(categorySearch.toLowerCase())
    : true;

  const isOutOfStockMatch = showOutOfStockOnly
    ? product.quantity === "0" || product.quantity === 0
    : product.quantity > 0; // 👈 hide out of stock unless button is clicked

  return matchesName && matchesBrand && matchesCategory && isOutOfStockMatch;
});


        setProducts(filtered);
        setSearchPerformed(true);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        message.error("Failed to fetch products.");
      });
  };
const loadAllProducts = () => {
  fetch(`${API_BASE_URL}/products.showall.php`)
    .then((res) => res.json())
    .then((data) => {
      setProducts(data);
      setSearchPerformed(true);
      setNameSearch("");
      setBrandSearch("");
      setCategorySearch("");
    })
    .catch((err) => {
      console.error("Error loading all products:", err);
      message.error("Failed to load all products.");
    });
};

  // 👇 Auto trigger search when search or category changes (with debounce)
 useEffect(() => {
  if (nameSearch || brandSearch || categorySearch) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 400);
  } else {
    setProducts([]);
    setSearchPerformed(false);
  }
}, [nameSearch, brandSearch, categorySearch]);

const location = useLocation();
useEffect(() => {
  if (showOutOfStockOnly && !searchPerformed) {
    fetchProducts();
  }
}, [showOutOfStockOnly]);
const handleDelete = (id) => {
  fetch(`${API_BASE_URL}/products.delete.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, _method: "DELETE" }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        message.success("Product deleted successfully.");
      } else {
        message.error("Failed to delete product.");
      }
    });
};
const handleBulkDelete = () => {
  if (selectedRowKeys.length === 0) {
    message.warning("No products selected.");
    return;
  }

  Promise.all(
    selectedRowKeys.map((id) =>
      fetch(`${API_BASE_URL}/products.delete.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, _method: "DELETE" }),
      }).then((res) => res.json())
    )
  )
    .then((results) => {
      const successCount = results.filter((r) => r.success).length;
      if (successCount > 0) {
        message.success(`${successCount} product(s) deleted.`);
        setSelectedRowKeys([]);
        fetchProducts();
      } else {
        message.error("No products were deleted.");
      }
    })
    .catch((err) => {
      console.error("Bulk delete error:", err);
      message.error("Error deleting products.");
    });
};

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (img, record) => (
        <Image
          src={`${API_BASE_URL}/images/${img}`}
          alt={record.name}
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Brand", dataIndex: "brand" },
    { title: "Category", dataIndex: "category" },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => <s className="text-muted">₹{price}</s>,
    },
    {
      title: "Offer",
      dataIndex: "offer_price",
      render: (offer_price) => (
        <span className="text-danger fw-bold">₹{offer_price}</span>
      ),
    },
    {
      title: "Color",
      render: (_, record) => record.color || record.colour || "—",
    },
    { title: "RAM", dataIndex: "ram" },
    { title: "Storage", dataIndex: "storage" },
    { title: "Battery", dataIndex: "battery" },
    {
      title: "Camera",
      render: (record) => `${record.rear_camera}/${record.front_camera}`,
    },
    { title: "Qty", dataIndex: "quantity" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            type="warning"
            onClick={() => {
              setSelectedProductId(record.id);
              setEditModalOpen(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete this product?"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: "24px" }}>
        <Title level={3} className="text-center">
          🔍 Search Products
        </Title>

        <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    justifyContent: "space-between",
    marginBottom: "16px",
  }}
>
  {/* Left: Filters */}
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      flex: 1,
      minWidth: "250px",
    }}
  >
    <Input
      placeholder="Search by brand..."
      value={brandSearch}
      onChange={(e) => setBrandSearch(e.target.value)}
      style={{ minWidth: 200, flex: 1 }}
      allowClear
    />

    <Input
      placeholder="Search by name..."
      value={nameSearch}
      onChange={(e) => setNameSearch(e.target.value)}
      style={{ minWidth: 200, flex: 1 }}
      allowClear
    />

    <Input
      placeholder="Search by category..."
      value={categorySearch}
      onChange={(e) => setCategorySearch(e.target.value)}
      style={{ minWidth: 200, flex: 1 }}
      allowClear
    />
  
  </div>

  {/* Right: Action Buttons */}
 <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "12px",
  }}
>
  <Link to="/admin/bulk-upload">
    <Button icon={<UploadOutlined />}>Bulk Upload</Button>
  </Link>

  <Link to="/admin/add-product">
    <Button type="primary" icon={<PlusOutlined />}>
      Add New Product
    </Button>
  </Link>

  <Button
    onClick={() => {
      setShowOutOfStockOnly(false);
      setSelectedRowKeys([]);
      loadAllProducts();
    }}
  >
    All Products
  </Button>

<Button
  danger={showOutOfStockOnly}
  type={showOutOfStockOnly ? "primary" : "default"}
  onClick={() => {
    setShowOutOfStockOnly(true);
    setNameSearch("");
    setBrandSearch("");
    setCategorySearch("");
    setSearchPerformed(false); // Optional: reset search UI
  }}
>
  Out of Stock
</Button>


  {/* Show only in Out of Stock Mode */}
  {showOutOfStockOnly && (
    <>
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => {
          const outOfStockIds = products
            .filter((p) => p.quantity === "0" || p.quantity === 0)
            .map((p) => p.id);
          setSelectedRowKeys(outOfStockIds);
        }}
      >
        Select All Out of Stock
      </Button>

      <Popconfirm
        title={`Delete ${selectedRowKeys.length} selected product(s)?`}
        icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
        onConfirm={handleBulkDelete}
        okText="Yes"
        cancelText="No"
        disabled={selectedRowKeys.length === 0}
      >
        <Button
          danger
          icon={<DeleteOutlined />}
          disabled={selectedRowKeys.length === 0}
        >
          Delete Selected
        </Button>
      </Popconfirm>
    </>
  )}
</div>


</div>



        {/* Show only after search */}
        {searchPerformed && (
         <Table
  bordered
  rowKey="id"
  dataSource={products}
  columns={columns}
  scroll={{ x: true }}
  rowSelection={{
    selectedRowKeys,
    onChange: (newSelectedKeys) => {
      setSelectedRowKeys(newSelectedKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.quantity > 0, // Only allow selection if out of stock
    }),
  }}
/>

        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <EditProduct
            id={selectedProductId}
            visible={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSuccess={fetchProducts}
          />
        )}
      </div>
    </AdminLayout>
  );
}
