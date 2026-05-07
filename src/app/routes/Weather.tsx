import Layout from "../../components/Layout";
import WeatherForecast from "@features/weather/components/WeatherForecast";

export default function Weather() {
  return (
    <Layout>
      <div className="px-6 max-w-2xl mx-auto pt-4">
        <WeatherForecast />
      </div>
    </Layout>
  );
}
