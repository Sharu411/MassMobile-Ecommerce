export const API_BASE_URL = "https://massmobiles.com/api";
/*https://massmobile.byethost13.com/api*/ /*http://localhost:8000/api*//*https://massmobiles.com/api*/

// Utility to get full image URL (assuming image is in /images/ folder)
export function getImageUrl(imageFileName) {
  return `${API_BASE_URL}/images/${imageFileName}`;
}
// Get full image URL
export function getPopupImageUrl(fileName) {
  return `${API_BASE_URL}/images/welcome_popup/${fileName}`;
}

// Fetch current welcome popup settings
export async function fetchWelcomePopupSettings() {
  const res = await fetch(`${API_BASE_URL}/get_welcome_popup.php`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json(); // returns { status, image, link }
}

// Submit updated settings
export async function updateWelcomePopupSettings(formData) {
  const res = await fetch(`${API_BASE_URL}/update_welcome_popup.php`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}
export async function fetchPopupImageList() {
  const response = await fetch(`${API_BASE_URL}/list_popup_images.php`);
  const data = await response.json();

  // ✅ Ensure return is always array
  return Array.isArray(data.images) ? data.images : [];
}
