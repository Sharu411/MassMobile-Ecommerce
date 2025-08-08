import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Box,
  useMediaQuery,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
const sampleAddons = [
  {
    id: "charger",
    title: "20W USB‑C Charger",
    price: 1500,
    original_price: 1999,
    discountText: "₹499 off",
    description: ["20 W fast‑charge adapter", "USB‑C port"],
    image: "/images/charger.png",
  },
  {
    id: "phone_cover",
    title: "Phone Cover",
    price: 0,
    original_price: 0,
    discountText: "Included Free",
    description: ["Durable back case", "Scratch resistant", "Fits perfectly"],
    image: "/images/phone_cover.png",
  },
  {
    id: "tempered_glass",
    title: "Tempered Glass",
    price: 0,
    original_price: 0,
    discountText: "Included Free",
    description: ["Edge-to-edge protection", "Anti-shatter", "HD clarity"],
    image: "/images/tempered_glass.png",
  },
];

const protectionPlans = [
  {
    price: 1399,
    label: "Authorized Center, Original Parts (₹10K)",
    coverage: "₹10,000",
  },
  {
    price: 2399,
    label: "Authorized Center, Original Parts (₹20K)",
    coverage: "₹20,000",
  },
];

export default function FrequentlyBoughtPopup({
  open,
  onSkip,
  onSelect,
  selectedAddons = [],
  baseAmount = 0,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const addonsTotal = selectedAddons.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  const totalPayable = baseAmount + addonsTotal + (selectedPlan || 0);

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: 18,
            textAlign: "center",
            color: "#3366cc",
          }}
        >
          Frequently Bought Together
        </DialogTitle>

        <DialogContent dividers sx={{ px: isMobile ? 1 : 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Protect your device — Select from below
          </Typography>

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend" sx={{ fontWeight: 600 }}>
              Add Mobile Protection Plan
            </FormLabel>
            <RadioGroup
              name="protectionPlan"
              value={selectedPlan !== null ? selectedPlan.toString() : "none"}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedPlan(value === "none" ? null : Number(value));
              }}
            >
              {protectionPlans.map((plan) => (
                <FormControlLabel
                  key={plan.price}
                  value={plan.price.toString()}
                  control={<Radio />}
                  label={`₹${plan.price} - ${plan.label}`}
                  sx={{ mt: 1 }}
                />
              ))}
              <FormControlLabel
                value="none"
                control={<Radio />}
                label="No Protection Plan"
                sx={{ mt: 1 }}
              />
            </RadioGroup>

            <Button
              size="small"
              onClick={() => setShowPlanModal(true)}
              sx={{ mt: 1, textTransform: "none", pl: 0 }}
            >
              View plan details
            </Button>
          </FormControl>

          <Stack spacing={2}>
            {sampleAddons.map((item) => {
              const isSelected = selectedAddons.some((a) => a.id === item.id);
              return (
                <Card
                  key={item.id}
                  elevation={0}
                  sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
                >
                  <CardContent sx={{ p: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.title}
                        sx={{
                          width: 64,
                          height: 64,
                          objectFit: "contain",
                          flexShrink: 0,
                          mr: 1.5,
                        }}
                      />
                      <Box flex={1} minWidth={0}>
                        <Typography fontSize={15} fontWeight={600}>
                          {item.title}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={0.75}
                          alignItems="baseline"
                          mt={0.5}
                        >
                          <Typography fontWeight={600} fontSize={14}>
                            ₹{item.price.toLocaleString()}
                          </Typography>
                          <Typography
                            fontSize={13}
                            sx={{
                              textDecoration: "line-through",
                              color: "text.secondary",
                            }}
                          >
                            ₹{item.original_price.toLocaleString()}
                          </Typography>
                          <Typography fontSize={13} color="success.main">
                            ({item.discountText})
                          </Typography>
                        </Stack>
                        <ul style={{ paddingLeft: 18, margin: "8px 0 0", color: "#555" }}>
                          {item.description.map((d, i) => (
                            <li key={i} style={{ fontSize: 12, lineHeight: 1.4 }}>
                              {d}
                            </li>
                          ))}
                        </ul>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                          <Button
                            variant={isSelected ? "outlined" : "contained"}
                            color={isSelected ? "error" : "primary"}
                            size="small"
                            onClick={() => onSelect(item)}
                            sx={{ minWidth: 70, textTransform: "none" }}
                          >
                            {isSelected ? "Remove" : "Add"}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 1,
          }}
        >
          <Box>
            <Typography fontSize={12} color="text.secondary">
              Total Payable
            </Typography>
            <Typography fontWeight={700} fontSize={16}>
              ₹{totalPayable.toLocaleString()}
            </Typography>
          </Box>

          <Button
  variant="contained"
  fullWidth={isMobile}
  onClick={() => {
    // Inform parent about selected plan before closing
    if (selectedPlan !== null) {
      sessionStorage.setItem("protectionPlan", selectedPlan); // Optional
    }
    onSkip(selectedPlan); // pass it to parent
  }}
  sx={{
    backgroundColor: "#fb641b",
    "&:hover": { backgroundColor: "#e65a15" },
  }}
>
  {selectedAddons.length > 0 || selectedPlan
    ? "CONTINUE"
    : "SKIP & CONTINUE"}
</Button>

        </DialogActions>
      </Dialog>

      {/* Plan Details Modal */}
      <Dialog
        open={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Plan Details
          {selectedPlan && ` – ₹${selectedPlan}`}
        </DialogTitle>
        <DialogContent dividers>
          {(selectedPlan
            ? protectionPlans.filter((p) => p.price === selectedPlan)
            : protectionPlans
          ).map((plan) => (
            <Box key={plan.price} mb={3}>
              <Typography fontWeight={600} fontSize={16} mb={1}>
                ₹{plan.price} - {plan.label}
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Protection</TableCell>
                    <TableCell>Screen only</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Mobiles</TableCell>
                    <TableCell>Old & New</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell>{plan.coverage}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Center</TableCell>
                    <TableCell>Authorized</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Parts</TableCell>
                    <TableCell>Original</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                    <TableCell>1 Year</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Waiting</TableCell>
                    <TableCell>30 Days</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Coverage</TableCell>
                    <TableCell>Damage & Water Log</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPlanModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
