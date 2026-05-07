import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import HistoryDetailCard from "@features/history/components/HistoryDetailCard";
import type { HistoryItem } from "@datatypes/historyType";

export default function HistoryDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = (location.state || {}) as { item?: HistoryItem };

  useEffect(() => {
    if (!item) {
      navigate("/history", { replace: true });
    }
  }, [item, navigate]);

  if (!item) return null;

  return (
    <Layout>
      <div className="px-6 max-w-2xl mx-auto pt-4">
        <HistoryDetailCard item={item} />
      </div>
    </Layout>
  );
}
