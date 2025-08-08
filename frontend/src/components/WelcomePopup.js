import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { fetchWelcomePopupSettings, getPopupImageUrl } from "../utils/api";
import { Link } from "react-router-dom";

const WelcomePopup = () => {
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [link, setLink] = useState("/offers");

  useEffect(() => {
  const loadPopup = async () => {
    if (localStorage.getItem("popupShown")) return;

    try {
      const data = await fetchWelcomePopupSettings();
      if (data?.status === "enabled" && data?.image) {
        setImageUrl(getPopupImageUrl(data.image));
        setLink(data.link || "/offers");
        setVisible(true);
        sessionStorage.setItem("popupShown", "true"); // prevent future popups this session
      }
    } catch (error) {
      console.error("Failed to load welcome popup", error);
    }
  };

  loadPopup();
}, []);


  if (!imageUrl) return null;

  return (
    <Modal
      open={visible}
      footer={null}
      closable={true}
      onCancel={() => setVisible(false)}
      centered
      zIndex={9999}
      bodyStyle={{
        padding: 0,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      style={{ maxWidth: "90vw", top: 20 }}
    >
      <Link to={link} onClick={() => setVisible(false)}>
        <img
          src={imageUrl}
          alt="Welcome"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            display: "block",
            maxHeight: "80vh",
            cursor: "pointer",
          }}
        />
      </Link>
    </Modal>
  );
};

export default WelcomePopup;
