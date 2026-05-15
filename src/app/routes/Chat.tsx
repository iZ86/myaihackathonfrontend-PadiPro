import Layout from "../../components/Layout";
import ChatArea from "@features/chat/components/ChatArea";

export default function Chat() {
  return (
    <Layout>
      <div className="flex flex-col" style={{ height: "calc(100dvh - 80px)" }}>
        <ChatArea />
      </div>
    </Layout>
  );
}
