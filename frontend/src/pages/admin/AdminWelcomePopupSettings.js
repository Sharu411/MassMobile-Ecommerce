import React, { useEffect, useState } from "react";
import {
  Button,
  Upload,
  Switch,
  message,
  Image,
  Row,
  Col,
  Typography,
  Select,
  Divider,
  Card,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_BASE_URL, getPopupImageUrl } from "../../utils/api";
import AdminNavbar from "../../components/admin/AdminLayout";
import { DatePicker } from "antd";
import dayjs from "dayjs";


const AdminWelcomePopupSettings = () => {
  const [popup, setPopup] = useState({});
  const [status, setStatus] = useState(false);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
const [saleEndDate, setSaleEndDate] = useState(null);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const offerOptions = [
    { label: "Aadi Sale", value: "aadi-sale" },
    { label: "Pongal Sale", value: "pongal-sale" },
    { label: "Diwali Offer", value: "diwali-offer" },
    { label: "Summer Blast", value: "summer-blast" },
  ];

  useEffect(() => {
    
axios.get(`${API_BASE_URL}/get_welcome_popup.php`).then((res) => {
  setPopup(res.data);
  setStatus(res.data.status === "enabled");
  setLink(res.data.link || "");
  if (res.data.sale_end) {
    setSaleEndDate(dayjs(res.data.sale_end));
  }
});

    axios.get(`${API_BASE_URL}/get_all_brands.php`).then((res) => {
      setBrands(res.data.brands);
    });
    axios.get(`${API_BASE_URL}/get_all_categories.php`).then((res) => {
      setCategories(res.data.categories);
    });
  }, []);

 const handlePopupSubmit = () => {
  const formData = new FormData();
  formData.append("status", status ? "enabled" : "disabled");
  formData.append("link", link);
  if (file) formData.append("image", file);

  // ✅ Format and append sale end date if selected
  if (saleEndDate) {
    formData.append("sale_end", dayjs(saleEndDate).format("YYYY-MM-DD HH:mm:ss"));
  }

  axios
    .post(`${API_BASE_URL}/update_welcome_popup.php`, formData)
    .then(() => {
      message.success("Popup updated successfully");
      setFile(null);
      axios.get(`${API_BASE_URL}/get_welcome_popup.php`).then((res) => {
        setPopup(res.data);
        if (res.data.sale_end) {
          setSaleEndDate(dayjs(res.data.sale_end));
        }
      });
    })
    .catch(() => message.error("Failed to update popup"));
};


  const handleOfferApply = () => {
    if (!selectedOffer) {
      return message.warning("Please select an offer");
    }

    axios
      .post(`${API_BASE_URL}/bulk_update_offer_flexible.php`, {
        category: selectedCategory,
        brand: selectedBrand,
        offer_name: selectedOffer,
      })
      .then((res) => {
        if (res.data.success) {
          message.success("Offer applied successfully!");
          setSelectedCategory(null);
          setSelectedBrand(null);
          setSelectedOffer(null);
        } else {
          message.error(res.data.message || "Offer update failed");
        }
      })
      .catch(() => {
        message.error("Error occurred while applying offer");
      });
  };

  return (
    <AdminNavbar>
      <Card
        title="🎉 Manage Welcome Popup"
        style={{ maxWidth: 900, margin: "0 auto", marginTop: 24 }}
      >
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Space>
              <Switch checked={status} onChange={setStatus} />
              <Typography.Text>Enable</Typography.Text>
            </Space>
          </Col>
          <Col>
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Col>
          <Col>
            <Button type="primary" onClick={handlePopupSubmit}>
              Update Popup
            </Button>
          </Col>
        </Row>

        <div style={{ marginTop: 24 }}>
          <Typography.Text strong>Select Offer Page</Typography.Text>
        <Select
  value={
    link?.startsWith("/offers/") ? link.replace("/offers/", "") : null
  }
  onChange={(val) => {
    if (val) {
      setLink(`/offers/${val}`);
    } else {
      setLink(""); // clear if no selection
    }
  }}
  placeholder="Choose offer page"
  style={{ width: "100%", marginTop: 8 }}
  allowClear
>
  {offerOptions.map((offer) => (
    <Select.Option key={offer.value} value={offer.value}>
      {offer.label}
    </Select.Option>
  ))}
</Select>
<Row justify="center" style={{ marginBottom: 20 }}>
  <Col span={12}>
    <Typography.Text strong>Sale End Date</Typography.Text>
    <DatePicker
      value={saleEndDate}
      onChange={(date) => setSaleEndDate(date)}
      format="YYYY-MM-DD HH:mm:ss"
      showTime
      style={{ width: "100%", marginTop: 8 }}
    />
  </Col>
</Row>

        </div>


        {popup?.image && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Image
              width={250}
              src={getPopupImageUrl(popup.image)}
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        )}
      </Card>

      {/* ===== OFFER SECTION ===== */}
      <Card
        title="🛍 Assign Offers to Products"
        style={{ maxWidth: 900, margin: "40px auto" }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Select Category (optional)"
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: "100%" }}
              allowClear
            >
              {categories.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Select Brand (optional)"
              value={selectedBrand}
              onChange={setSelectedBrand}
              style={{ width: "100%" }}
              allowClear
            >
              {brands.map((b) => (
                <Select.Option key={b} value={b}>
                  {b}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Select Offer (required)"
              value={selectedOffer}
              onChange={setSelectedOffer}
              style={{ width: "100%" }}
            >
              {offerOptions.map((o) => (
                <Select.Option key={o.value} value={o.value}>
                  {o.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Button type="primary" onClick={handleOfferApply}>
          Apply Offer
        </Button>
      </Card>
    </AdminNavbar>
  );
};

export default AdminWelcomePopupSettings;
