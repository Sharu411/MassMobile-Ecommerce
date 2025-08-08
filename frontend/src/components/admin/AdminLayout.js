// src/components/admin/AdminLayout.js
import React from 'react';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout({ children }) {
  return (
    <div className="bg-light min-vh-100">
      <AdminNavbar />
      <div className="container py-4">
        {children}
      </div>
    </div>
  );
}
