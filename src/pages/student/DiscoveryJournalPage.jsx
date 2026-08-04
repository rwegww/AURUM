import React from 'react';
import { Navigate } from 'react-router-dom';

// Giữ liên kết cũ hoạt động, nhưng sổ tay nay được mở bằng modal trên trang Lab.
const DiscoveryJournalPage = () => (
  <Navigate to="/lab" replace state={{ openDiscovery: true }} />
);

export default DiscoveryJournalPage;
