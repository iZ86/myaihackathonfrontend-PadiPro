import Layout from "../../components/Layout";
import ChatArea from "@features/chat/components/ChatArea";

export default function Chat() {
  return (
    <Layout>
      <div className="h-[calc(100dvh-80px)] overflow-hidden">
        <ChatArea />
      </div>
    </Layout>
  );
}
