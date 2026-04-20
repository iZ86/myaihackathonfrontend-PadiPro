import Layout from "../../components/Layout";
import WeatherForecast from "@features/weather/components/WeatherForecast";

export default function Weather() {
  return (
    <Layout>
      <div className="px-6 max-w-2xl mx-auto space-y-8">
        <WeatherForecast />
      </div>
    </Layout>
  );
}
