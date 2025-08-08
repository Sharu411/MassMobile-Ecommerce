import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/api";
import { message, Modal } from "antd";
import { ReactSortable } from "react-sortablejs";

export default function EditProduct({ id, visible, onClose, onSuccess }) {
  const [formState, setFormState] = useState({ images: [], videoFile: null });
  const [originalState, setOriginalState] = useState({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [changes, setChanges] = useState({});

  useEffect(() => {
    if (id && visible) {
      fetch(`${API_BASE_URL}/products.getbyid.php?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormState({ ...data, images: [] });
          setOriginalState({ ...data });
        })
        .catch(() => message.error("❌ Failed to load product data."));
    }
  }, [id, visible]);

  useEffect(() => {
    if (!visible) {
      setFormState({ images: [] });
      setOriginalState({});
      setChanges({});
      setConfirmVisible(false);
    }
  }, [visible]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormState((prev) => ({ ...prev, images: Array.from(files) }));
    } else if (name === "mainImage") {
      setFormState((prev) => ({ ...prev, mainImage: files[0] }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getChangedFields = () => {
    const changed = {};
    for (const key in formState) {
      if (key === "images" || key === "mainImage") continue;
      const original = originalState[key] ?? "";
      const current = formState[key] ?? "";
      if (String(original).trim() !== String(current).trim()) {
        changed[key] = { old: original, new: current };
      }
    }
    return changed;
  };

  const handleSubmit = () => {
    const detectedChanges = getChangedFields();
    const imagesChanged = formState.images?.length > 0;
    const mainImageChanged = !!formState.mainImage;

    if (
      Object.keys(detectedChanges).length === 0 &&
      !imagesChanged &&
      !mainImageChanged
    ) {
      alert("ℹ️ You didn't make any changes.");
      return;
    }

    setChanges(detectedChanges);
    setConfirmVisible(true);
  };

const confirmUpdate = () => {
  const formData = new FormData();
  formData.append("id", id);

  // Add changed fields
  const changedFields = getChangedFields();
  Object.entries(changedFields).forEach(([key, { new: newVal }]) => {
    formData.append(key, newVal);
  });

  // Add mainImage
  if (formState.mainImage) {
    formData.append("mainImage", formState.mainImage);
  }

  // Add gallery images
  if (formState.images && formState.images.length > 0) {
    formState.images.forEach((file) => {
      formData.append("images[]", file);
    });
  }

  // Add video file
  if (formState.videoFile) {
    formData.append("video", formState.videoFile);
  }

  fetch(`${API_BASE_URL}/products.update.php`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        message.success("✅ Product updated successfully.");
        onSuccess();
        onClose();
      } else {
        message.error("❌ Failed to update product.");
      }
    })
    .catch(() => message.error("❌ An error occurred while updating."))
    .finally(() => setConfirmVisible(false));
};

  const fields = [
    "name",
    "brand",
    "category",
    "price",
    "offer_price",
    "quantity",
    "imei",
    "color",
    "warranty",
    "storage",
    "ram",
    "battery",
    "rear_camera",
    "front_camera",
    "condition",
    "discount_percentage",
    "display",
    "network_type",
    "full_kit",
    "sim_type",
    "processor",
    "video",
  ];

  return (
    <>
      <Modal
        title="✏️ Edit Product"
        open={visible}
        onOk={handleSubmit}
        onCancel={onClose}
        okText="Update"
      >
        <div className="row g-2">
          {fields.map((field) => (
            <div className="col-md-6" key={field}>
              <label className="text-capitalize">
                {field.replace(/_/g, " ")}
              </label>
              <input
                name={field}
                className="form-control"
                value={formState[field] ?? ""}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="col-md-12">
            <label>Description</label>
            <textarea
              name="description"
              rows="3"
              className="form-control"
              value={formState.description || ""}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* ✅ Main Image Section */}
          <div className="col-md-12 mt-3">
            <label>Upload Main Image</label>
            <input
              type="file"
              name="mainImage"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
            {formState.mainImage && (
              <div className="mt-2">
                <strong>Preview:</strong>
                <img
                  src={URL.createObjectURL(formState.mainImage)}
                  height={50}
                  style={{ borderRadius: 4, marginTop: 5 }}
                  alt="main-preview"
                />
              </div>
            )}

            {/* Existing main image from DB */}
            {originalState.image && !formState.mainImage && (
              <div className="mt-2">
                <strong>Existing Main Image:</strong>
                <div style={{ marginTop: 5 }}>
                  <img
                    src={`${API_BASE_URL}/images/${originalState.image}`}
                    height={50}
                    style={{ borderRadius: 4 }}
                    alt="original-main"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ✅ Gallery Image Section */}
          <div className="col-md-12">
            <label>Upload Gallery Images</label>
            <input
              type="file"
              name="images"
              className="form-control"
              multiple
              accept="image/*"
              onChange={handleChange}
            />

            {/* Preview new gallery images */}
            {formState.images.length > 0 && (
              <div className="mt-3">
                <strong>Selected Gallery Images (Drag to Reorder):</strong>
                <ReactSortable
                  list={formState.images}
                  setList={(newList) =>
                    setFormState((prev) => ({ ...prev, images: newList }))
                  }
                  style={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 12,
                    marginTop: 10,
                    paddingBottom: 5,
                    scrollbarWidth: "thin",
                  }}
                >
                  {formState.images.map((file, idx) => (
                    <div
                      key={file.name + idx}
                      data-id={file.name + idx}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: 80,
                        cursor: "move",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`selected-${idx}`}
                        height={60}
                        style={{
                          width: 80,
                          objectFit: "cover",
                          borderRadius: 4,
                          border: "1px solid #ccc",
                        }}
                      />
                      <span
                        style={{ fontSize: 12, marginTop: 4, color: "#555" }}
                      >
                        {[
                          "First",
                          "Second",
                          "Third",
                          "Fourth",
                          "Fifth",
                          "Sixth",
                          "Seventh",
                          "Eighth",
                        ][idx] || `#${idx + 1}`}
                      </span>
                    </div>
                  ))}
                </ReactSortable>
              </div>
            )}

            {/* Existing gallery images from DB */}
            {originalState.images && (
              <div className="mt-3">
                <strong>Existing Gallery Images:</strong>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 5,
                  }}
                >
                  {originalState.images.split(",").map((img, idx) => (
                    <img
                      key={idx}
                      src={`${API_BASE_URL}/images/${img.trim()}`}
                      alt={`gallery-${idx}`}
                      height={50}
                      style={{ borderRadius: 4 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* ✅ Upload Video Section */}
        <div className="col-md-12 mt-3">
          <label>Upload Product Video</label>
          <input
            type="file"
            name="videoFile"
            className="form-control"
            accept="video/*"
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                videoFile: e.target.files[0],
              }))
            }
          />
          {formState.videoFile && (
            <div className="mt-2">
              <strong>Selected Video:</strong>
              <video
                src={URL.createObjectURL(formState.videoFile)}
                controls
                height={100}
                style={{ marginTop: 5, borderRadius: 4 }}
              />
            </div>
          )}

          {/* Existing Video Preview */}
          {originalState.video && !formState.videoFile && (
            <div className="mt-2">
              <strong>Existing Video:</strong>
              <video
                src={`${API_BASE_URL}/videos/${originalState.video}`}
                controls
                height={100}
                style={{ marginTop: 5, borderRadius: 4 }}
              />
            </div>
          )}
        </div>
      </Modal>

      {/* ✅ Confirm Modal */}
      <Modal
  open={confirmVisible}
  title="Confirm Changes"
  onOk={confirmUpdate}
  onCancel={() => setConfirmVisible(false)}
  okText="Yes, Update"
  cancelText="Cancel"
>
  <p>The following changes will be applied:</p>
  <ul>
    {Object.entries(changes).map(([field, { old, new: newVal }]) => (
      <li key={field}>
        <strong>{field.replace(/_/g, " ")}:</strong>{" "}
        <span style={{ color: "gray" }}>"{String(old)}"</span> →{" "}
        <span style={{ color: "green" }}>
          "{typeof newVal === "object" ? newVal?.name || "[object]" : String(newVal)}"
        </span>
      </li>
    ))}
    {formState.mainImage && (
      <li>
        <strong>Main Image:</strong>{" "}
        <span style={{ color: "green" }}>1 selected</span>
      </li>
    )}
    {formState.images && formState.images.length > 0 && (
      <li>
        <strong>Gallery Images:</strong>{" "}
        <span style={{ color: "green" }}>
          {formState.images.length} selected
        </span>
      </li>
    )}
    {formState.videoFile && (
      <li>
        <strong>Video:</strong>{" "}
        <span style={{ color: "green" }}>
          {formState.videoFile.name}
        </span>
      </li>
    )}
  </ul>
</Modal>

    </>
  );
}
