import Layout from "../../components/Layout";
import ChatArea from "@features/chat/components/ChatArea";

export default function Chat() {
  return (
    <Layout>
      <div className="px-4 py-6 max-w-full mx-auto space-y-6 flex flex-col h-[calc(100vh-160px)]">
        <div className="grow">
          <ChatArea />
        </div>
      </div>
    </Layout>
  );
}
