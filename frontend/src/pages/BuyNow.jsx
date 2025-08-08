import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
//import { FaPlus, FaMinus } from "react-icons/fa";
import FrequentlyBoughtPopup from "../components/FrequentlyBoughtPopup";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  //IconButton,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
 // Table,
  //TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

export default function BuyNow() {
  const [showFBTPopup, setShowFBTPopup] = useState(true); // Show initially

  const navigate = useNavigate();

  /* -------- state (unchanged) -------- */
  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  //const [showPlanModal, setShowPlanModal] = useState(false);
  const [showOpenBoxInfo, setShowOpenBoxInfo] = useState(false);
 // const [cartItems, setCartItems] = useState([]);
  const [pickedCart, setPickedCart] = useState([]);
  const [addonItems, setAddonItems] = useState([]);

  /* -------- effects (unchanged) -------- */
  //useEffect(() => {
  //   const plan = sessionStorage.getItem("protectionPlan");
  //   if (plan && plan !== "none") setSelectedPlan(+plan);
  //   const saved = localStorage.getItem("cart");
  //   if (saved) setCartItems(JSON.parse(saved));
  // }, []);

  useEffect(() => {
    const id = sessionStorage.getItem("buyNowProductId");
    if (!id) return navigate("/");
    fetch(`${API_BASE_URL}/get_product_detail.php?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.product) setProduct(d.product);
        else if (d.id) setProduct(d);
        else navigate("/");
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("customer"));
    if (!user?.id) return;
    fetch(`${API_BASE_URL}/get_addresses.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: user.id }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setAddresses(d.addresses);
          if (d.addresses.length) setSelectedAddressId(d.addresses[0].id);
        }
      });
  }, []);

  // /* -------- cart helpers -------- */
  // const toggleCartItem = (item) => {
  //   const exists = pickedCart.find((c) => c.id === item.id);
  //   const updated = exists
  //     ? pickedCart.filter((c) => c.id !== item.id)
  //     : [...pickedCart, { ...item, quantity: 1 }];
  //   setPickedCart(updated);
  // };
  // const changePickedQty = (id, qty) => {
  //   if (qty <= 0) return toggleCartItem({ id });
  //   setPickedCart(
  //     pickedCart.map((c) => (c.id === id ? { ...c, quantity: qty } : c))
  //   );
  // };

  /* -------- totals -------- */
  if (!product) return <Typography sx={{ p: 4 }}>Loading…</Typography>;
  const price = +product.price;
  const offerPrice = product.offer_price ? +product.offer_price : price;
  const discount = product.offer_price ? price - offerPrice : 0;
  const productSubtotal = offerPrice + (selectedPlan || 0);
  const cartSubtotal = pickedCart.reduce((s, i) => s + i.price * i.quantity, 0);
  const addonsTotal = addonItems.reduce((s, i) => s + +(i.offer_price || i.price), 0);
  const grandTotal = productSubtotal + cartSubtotal + addonsTotal;
  const addr = addresses.find((a) => a.id === selectedAddressId);
  /* -------- continue -------- */
  const handleContinue = () => {
    sessionStorage.setItem(
      "orderDetails",
      JSON.stringify({
        buyNowProduct: { ...product, price: offerPrice },
        cartItems: pickedCart,
        addons: addonItems,
        selectedPlan,
        totalAmount: grandTotal,
        addressId: selectedAddressId,
      })
    );
    navigate("/payment");
  };
// Show FBT popup before actual BuyNow page
if (showFBTPopup) {
  return (
    <FrequentlyBoughtPopup
  open={showFBTPopup}
  selectedAddons={addonItems}
  baseAmount={offerPrice}
  onSkip={(planPrice) => {
    if (planPrice) setSelectedPlan(planPrice); // <-- THIS FIXES YOUR ISSUE
    setShowFBTPopup(false);
  }}
  onSelect={(item) => {
        const exists = addonItems.find((a) => a.id === item.id);
        if (exists) {
          setAddonItems(addonItems.filter((a) => a.id !== item.id));
        } else {
          setAddonItems([...addonItems, item]);
        }
      }}
    />
  );
}


  /* -------- render -------- */
  return (
    <Box sx={{ maxWidth: 880, mx: "auto", p: 2, pb: 10 }}>
      {/* Steps */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {["① Address", "② Order Summary", "③ Payment"].map((s, i) => (
          <Chip
            key={s}
            label={s}
            color={i === 1 ? "primary" : i < 1 ? "success" : "default"}
            variant={i === 1 ? "filled" : "outlined"}
            sx={{ flex: 1 }}
          />
        ))}
      </Stack>

      {/* Address */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Deliver to:
          </Typography>
          {addr ? (
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography fontWeight={600}>{addr.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
                  <br />
                  {addr.phone}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  navigate(`/address?returnTo=buy-now&productId=${product.id}`)
                }
              >
                Change
              </Button>
            </Stack>
          ) : (
            <Typography color="text.secondary">Please add address.</Typography>
          )}
        </CardContent>
      </Card>

      {/* Product */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: "flex", gap: 2 }}>
          <Box
            component="img"
            src={`${API_BASE_URL}/images/${product.image}`}
            sx={{ width: 120, height: 120, borderRadius: 2, objectFit: "cover" }}
          />
          <Box flex={1}>
            <Typography fontWeight={600}>
              {product.name}{" "}
              <Typography component="span" color="text.secondary">
                ({product.colour})
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              ⭐ {product.avg_rating || 0} ({product.total_reviews} reviews)
            </Typography>

            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography fontWeight={700}>
                ₹{offerPrice.toLocaleString()}
              </Typography>
              {discount > 0 && (
                <>
                  <Typography
                    sx={{ textDecoration: "line-through" }}
                    color="text.secondary"
                  >
                    ₹{price.toLocaleString()}
                  </Typography>
                  <Chip
                    label={`${Math.round((discount / price) * 100)}% off`}
                    color="success"
                    size="small"
                  />
                </>
              )}
            </Stack>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Protection Plan: ₹{selectedPlan || 0}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Price summary with GST breakdown */}
<Card>
  <CardContent>
    <Typography variant="h6" gutterBottom>
      Price Details
    </Typography>
    <Stack spacing={1}>
      <PriceRow label="Product" value={offerPrice} />
      

      {discount > 0 && (
        <PriceRow
          label="Discount on Product"
          value={-discount}
          color="success.main"
        />
      )}

      {selectedPlan && (
        <>
          <PriceRow label="Protection Plan" value={selectedPlan} />
         
        </>
      )}

      {pickedCart.length > 0 && (
        <>
          <PriceRow
            label={`Cart Items (${pickedCart.length})`}
            value={cartSubtotal}
          />
          
        </>
      )}

      {addonItems.length > 0 && (
        <>
          <PriceRow
            label={`Add‑ons (${addonItems.length})`}
            value={addonsTotal}
          />
         
        </>
      )}

      <Divider sx={{ my: 1 }} />
      <PriceRow label="Total Payable" value={grandTotal} bold />
    </Stack>
  </CardContent>
</Card>


      {/* Footer */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "#fff",
          borderTop: "1px solid #e0e0e0",
          py: 1.5,
          px: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Typography fontWeight={700}>
         ₹{grandTotal.toLocaleString()}
        </Typography>
        <Button
  variant="contained"
  onClick={handleContinue}
  sx={{
    backgroundColor: "#fb641b",      // orange
    "&:hover": { backgroundColor: "#e65a15" } // slightly darker hover
  }}
>
  {grandTotal === productSubtotal ? "Skip & Continue" : "Continue"}
</Button>

      </Box>

      {/* ---- Open Box Modal ---- */}
      <Dialog
        open={showOpenBoxInfo}
        onClose={() => setShowOpenBoxInfo(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Why Open Box Delivery?</DialogTitle>
        <DialogContent dividers>
          <Typography paragraph>
            Open Box Delivery ensures you can inspect your phone in front of the
            delivery agent before accepting it.
          </Typography>
          <ul style={{ paddingInlineStart: 18, margin: 0 }}>
            <li>Prevents empty‑box or wrong‑item fraud</li>
            <li>Instant damage check saves return hassle</li>
            <li>Pay only after inspection — peace of mind</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOpenBoxInfo(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ---------- helpers ---------- */
const Row = ({ k, v }) => (
  <TableRow>
    <TableCell sx={{ fontWeight: 600 }}>{k}</TableCell>
    <TableCell>{v}</TableCell>
  </TableRow>
);
function PriceRow({ label, value, color, bold }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography>{label}</Typography>
      <Typography fontWeight={bold ? 700 : 400} color={color || "text.primary"}>
        {value < 0 ? "- " : ""}
        ₹{Math.abs(value).toLocaleString()}
      </Typography>
    </Stack>
  );
}
