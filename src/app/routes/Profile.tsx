import Layout from "../../components/Layout";
import ProfileCard from "@features/user/components/ProfileCard";

export default function Profile() {
  return (
    <Layout>
      <div className="px-6 max-w-2xl mx-auto">
        <ProfileCard />
      </div>
    </Layout>
  );
}
