import Layout from "../../components/Layout";
import HistoryCard from "@features/history/components/HistoryCard";

export default function History() {
  return (
    <Layout>
      <div className="px-6 max-w-2xl mx-auto">
        <HistoryCard />
      </div>
    </Layout>
  );
}
