import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

export default function StickyOfferBar() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_sticky_bar.php`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'enabled') {
          setData(res);
        }
      })
      .catch(err => console.error("Sticky bar load failed", err));
  }, []);

  if (!data) return null;

  return (
    <div style={{
      backgroundColor: '#f5222d',
      color: 'white',
      textAlign: 'center',
      padding: '10px',
      position: 'sticky',
      top: '64px', // match your header height
      zIndex: 1000,
      fontWeight: 'bold'
    }}>
      <Link to={data.link || '/offers'} style={{ color: 'white', textDecoration: 'none' }}>
        {data.message}
      </Link>
    </div>
  );
}
