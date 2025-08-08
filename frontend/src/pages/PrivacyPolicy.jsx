import React from "react";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy container py-5">
      <h2 className="mb-4">Privacy Policy</h2>

      <p>
        At <strong>Mass Mobile</strong>, we respect your privacy and are
        committed to protecting your personal data. This Privacy Policy
        describes how we collect, use, and share your information when you visit
        or make a purchase from our website.
      </p>

      <h4>1. Information We Collect</h4>
      <ul>
        <li>
          <strong>Personal Information:</strong> Name, email, phone number,
          address, etc.
        </li>
        <li>
          <strong>Payment Details:</strong> UPI ID, Razorpay reference,
          transaction details (secured via gateway).
        </li>
        <li>
          <strong>Device Information:</strong> IP address, browser type,
          operating system, and access times.
        </li>
        <li>
          <strong>Usage Data:</strong> Pages visited, time spent, and browsing
          behavior.
        </li>
      </ul>

      <h4>2. How We Use Your Information</h4>
      <ul>
        <li>To process and fulfill your orders</li>
        <li>To provide customer service and support</li>
        <li>To send you order updates and promotions (only if opted in)</li>
        <li>To improve our website performance and services</li>
      </ul>

      <h4>3. Sharing Your Information</h4>
      <p>
        We do <strong>not</strong> sell or rent your personal data. We only
        share your information with:
      </p>
      <ul>
        <li>Trusted delivery partners (for order fulfillment)</li>
        <li>Payment processors (e.g., Razorpay) for secure transactions</li>
        <li>Legal authorities if required by law</li>
      </ul>

      <h4>4. Data Security</h4>
      <p>
        We implement the latest security measures to protect your data. All
        transactions are encrypted and processed through secure gateways. We
        never store your payment information.
      </p>

      <h4>5. Cookies</h4>
      <p>
        We use cookies to improve your shopping experience by remembering
        preferences and analyzing traffic. You can disable cookies in your
        browser settings.
      </p>

      <h4>6. Your Rights</h4>
      <p>You can request to:</p>
      <ul>
        <li>Access, correct or delete your personal data</li>
        <li>Unsubscribe from marketing emails</li>
      </ul>

      <h4>7. Children’s Privacy</h4>
      <p>
        We do not knowingly collect information from children under 13. If we
        discover such data, we will delete it promptly.
      </p>

      <h4>8. Changes to This Policy</h4>
      <p>
        We may update this Privacy Policy occasionally. The revised policy will
        be posted on this page with the updated date.
      </p>

      <h4>9. Contact Us</h4>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at:
        <br />
        <strong>Email:</strong> massmobiletn69@gmail.com
        <br />
        <strong>Phone:</strong> +91 9944298448
      </p>

      <p className="mt-4">
        <em>Last updated: July 11, 2025</em>
      </p>
    </div>
  );
}
