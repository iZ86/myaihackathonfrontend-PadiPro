import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  Droplets,
  Eye,
  FlaskConical,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import type { HistoryItem } from "@datatypes/historyType";
import { useLanguage } from "@context/lang/useLanguage";
import type { Language } from "@config/translations";

const SCIENTIFIC_NAMES: Record<string, string> = {
  "BROWN SPOT": "Bipolaris oryzae",
  BLAST: "Magnaporthe oryzae",
  "BACTERIAL BLIGHT": "Xanthomonas oryzae pv. oryzae",
  "SHEATH BLIGHT": "Rhizoctonia solani",
  "STEM ROT": "Sclerotium oryzae",
  TUNGRO: "Rice tungro virus complex",
  "NARROW BROWN LEAF SPOT": "Cercospora janseana",
  HEALTHY: "Oryza sativa",
};

type TreatmentDay = {
  day: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  steps: string[];
  note: string;
};

const TREATMENT_DAYS: Record<Language, TreatmentDay[]> = {
  en: [
    {
      day: 1,
      title: "Initial Assessment & Documentation",
      icon: <Eye className="w-4 h-4" />,
      color: "#0f5238",
      bg: "rgba(15,82,56,0.08)",
      steps: [
        "Walk the entire affected field and mark all visibly infected zones using GPS or physical markers.",
        "Photograph representative samples from at least 5 different spots across the paddy field.",
        "Record the percentage of leaf area affected per plant section — focus on flag leaves.",
        "Collect 10–15 infected leaf samples in a sealed bag for laboratory confirmation if severity exceeds 30%.",
        "Do not apply any chemical treatment yet — allow accurate baseline documentation first.",
      ],
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proper documentation at this stage determines the effectiveness of the entire treatment regimen. Pellentesque habitant morbi tristique senectus et netus.",
    },
    {
      day: 2,
      title: "Soil & Water Management",
      icon: <Droplets className="w-4 h-4" />,
      color: "#2d6a4f",
      bg: "rgba(45,106,79,0.08)",
      steps: [
        "Drain standing water from affected fields to reduce leaf wetness duration — a key driver of fungal spread.",
        "Maintain a shallow water depth of 2–3 cm once drainage is complete to avoid drought stress.",
        "Check soil pH and EC (electrical conductivity) levels — ideal pH range is 6.0–7.0.",
        "Apply potassium silicate at 2 kg/ha to strengthen leaf cell walls and improve disease resistance.",
        "Avoid overhead irrigation for the next 5 days; shift to furrow or subsurface irrigation if available.",
      ],
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Water management is the single highest-impact non-chemical intervention available. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    },
    {
      day: 3,
      title: "First Fungicide Application",
      icon: <FlaskConical className="w-4 h-4" />,
      color: "#8e4e14",
      bg: "rgba(142,78,20,0.08)",
      steps: [
        "Apply a systemic fungicide (e.g., Tricyclazole 75 WP at 0.6 g/L or Propiconazole 25 EC at 1 mL/L) diluted in clean water.",
        "Spray uniformly in the early morning (06:00–08:00) or late evening to avoid UV degradation and high temperature.",
        "Ensure complete coverage of both leaf surfaces — use a knapsack sprayer at 400–500 L/ha.",
        "Do not mix with herbicides or fertilisers in the same tank — risk of phytotoxicity.",
        "Record the product name, batch number, rate applied, and weather conditions in your field log.",
      ],
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam. Always wear full PPE (gloves, mask, goggles) during application.",
    },
    {
      day: 5,
      title: "Progress Monitoring",
      icon: <Eye className="w-4 h-4" />,
      color: "#404943",
      bg: "rgba(64,73,67,0.07)",
      steps: [
        "Re-survey the previously marked infection zones and compare visible lesion spread against Day 1 photographs.",
        "Count new lesions per leaf on 20 randomly selected tillers across 4 quadrants of the field.",
        "If new lesion formation has slowed by >50%, the treatment is working — continue scheduled plan.",
        "If lesion formation continues at the same rate, consider rotating to a different fungicide group (MoA group change).",
        "Check for secondary pest activity (e.g., brown planthoppers) which may exploit weakened plants.",
      ],
      note: "Lorem ipsum dolor sit amet. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat.",
    },
    {
      day: 7,
      title: "Second Fungicide Application",
      icon: <FlaskConical className="w-4 h-4" />,
      color: "#8e4e14",
      bg: "rgba(142,78,20,0.08)",
      steps: [
        "Apply a second round of fungicide — rotate to a contact fungicide (e.g., Mancozeb 75 WP at 2.5 g/L) to prevent resistance.",
        "Focus spray on newly emerging tillers and panicles — these are most vulnerable at this growth stage.",
        "Supplement with foliar potassium (0-0-50 at 3 g/L) to boost plant immunity and grain fill.",
        "Ensure at least 7-day interval from previous fungicide application to avoid phytotoxicity.",
        "Re-check drainage conditions and remove any waterlogged sections to prevent re-infection.",
      ],
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Resistance management through fungicide rotation is critical for long-term disease control.",
    },
    {
      day: 10,
      title: "Nutritional Recovery",
      icon: <Leaf className="w-4 h-4" />,
      color: "#0f5238",
      bg: "rgba(15,82,56,0.08)",
      steps: [
        "Apply split-dose nitrogen fertiliser (urea at 30 kg/ha) to support leaf recovery and new growth.",
        "Use a chelated zinc micronutrient spray (zinc sulphate at 0.5%) to address potential micronutrient depletion.",
        "Spray silicon-based biostimulant (sodium silicate 2%) to rebuild epidermal cell strength.",
        "Inspect root health — yellowing with no above-ground symptoms may indicate root rot co-infection.",
        "Introduce beneficial microorganisms (Trichoderma harzianum at 5 g/L) as soil drench if root damage suspected.",
      ],
      note: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.",
    },
    {
      day: 14,
      title: "Final Assessment & Prevention",
      icon: <ShieldCheck className="w-4 h-4" />,
      color: "#0f5238",
      bg: "rgba(15,82,56,0.08)",
      steps: [
        "Conduct a final field walk and compare against Day 1 baseline — document recovery percentage.",
        "Collect a final set of 10–15 leaf samples for laboratory analysis to confirm pathogen suppression.",
        "If field shows >80% recovery, transition to a preventive spray schedule (every 14 days at lower dose).",
        "Destroy all infected crop debris by burning or deep burial — prevents carryover to the next season.",
        "Update your field records with treatment efficacy data and share with extension officer for advisory review.",
      ],
      note: "Lorem ipsum dolor sit amet. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.",
    },
  ],
  bm: [
    {
      day: 1,
      title: "Penilaian Awal & Dokumentasi",
      icon: <Eye className="w-4 h-4" />,
      color: "#0f5238",
      bg: "rgba(15,82,56,0.08)",
      steps: [
        "Berjalan di seluruh kawasan ladang yang terjejas dan tandakan semua zon yang kelihatan dijangkiti menggunakan GPS atau penanda fizikal.",
        "Ambil gambar sampel mewakili dari sekurang-kurangnya 5 tempat berbeza merentasi sawah padi.",
        "Rekod peratusan kawasan daun yang terjejas per bahagian tumbuhan — fokus pada daun bendera.",
        "Kumpulkan 10–15 sampel daun yang dijangkiti dalam beg tertutup untuk pengesahan makmal jika keparahan melebihi 30%.",
        "Jangan gunakan sebarang rawatan kimia buat masa ini — biarkan dokumentasi garis asas yang tepat dibuat dahulu.",
      ],
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dokumentasi yang betul pada peringkat ini menentukan keberkesanan keseluruhan rejimen rawatan. Pellentesque habitant morbi tristique senectus et netus.",
    },
    {
      day: 2,
      title: "Pengurusan Tanah & Air",
      icon: <Droplets className="w-4 h-4" />,
      color: "#2d6a4f",
      bg: "rgba(45,106,79,0.08)",
      steps: [
        "Toskan air bertakung dari kawasan terjejas untuk mengurangkan tempoh kebasahan daun — faktor utama penyebaran kulat.",
        "Kekalkan kedalaman air cetek 2–3 cm setelah pengaliran selesai untuk mengelak tekanan kemarau.",
        "Periksa pH tanah dan paras EC (kekonduksian elektrik) — julat pH ideal ialah 6.0–7.0.",
        "Gunakan kalium silikat pada kadar 2 kg/ha untuk menguatkan dinding sel daun dan meningkatkan rintangan penyakit.",
        "Elakkan pengairan dari atas selama 5 hari akan datang; alihkan ke pengairan alur atau bawah permukaan jika ada.",
      ],
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pengurusan air adalah intervensi bukan kimia yang paling berkesan. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    },
    {
      day: 3,
      title: "Aplikasi Fungisid Pertama",
      icon: <FlaskConical className="w-4 h-4" />,
      color: "#8e4e14",
      bg: "rgba(142,78,20,0.08)",
      steps: [
        "Sapukan fungisid sistemik (cth. Tricyclazole 75 WP pada 0.6 g/L atau Propiconazole 25 EC pada 1 mL/L) yang dicairkan dalam air bersih.",
        "Semburkan secara seragam pada waktu pagi awal (06:00–08:00) atau petang lewat untuk mengelak degradasi UV dan suhu tinggi.",
        "Pastikan liputan penuh kedua-dua permukaan daun — gunakan penyembur sandang pada 400–500 L/ha.",
        "Jangan dicampur dengan herbisid atau baja dalam tangki yang sama — risiko fitotoksisiti.",
        "Rekod nama produk, nombor batch, kadar yang digunakan, dan keadaan cuaca dalam log ladang anda.",
      ],
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sentiasa pakai PPE lengkap (sarung tangan, pelitup muka, cermin mata) semasa penggunaan.",
    },
    {
      day: 5,
      title: "Pemantauan Kemajuan",
      icon: <Eye className="w-4 h-4" />,
      color: "#404943",
      bg: "rgba(64,73,67,0.07)",
      steps: [
        "Tinjau semula zon jangkitan yang telah ditanda dan bandingkan penyebaran lesi yang kelihatan dengan gambar Hari 1.",
        "Hitung lesi baru per daun pada 20 anak padi yang dipilih secara rawak merentasi 4 kuadran ladang.",
        "Jika pembentukan lesi baru berkurangan lebih 50%, rawatan berjaya — teruskan pelan yang dijadualkan.",
        "Jika pembentukan lesi berterusan pada kadar yang sama, pertimbangkan untuk menukar kepada kumpulan fungisid berbeza (perubahan kumpulan MoA).",
        "Periksa aktiviti perosak sekunder (cth. wereng coklat) yang mungkin mengeksploitasi tumbuhan yang lemah.",
      ],
      note: "Lorem ipsum dolor sit amet. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat.",
    },
    {
      day: 7,
      title: "Aplikasi Fungisid Kedua",
      icon: <FlaskConical className="w-4 h-4" />,
      color: "#8e4e14",
      bg: "rgba(142,78,20,0.08)",
      steps: [
        "Gunakan pusingan fungisid kedua — tukar kepada fungisid sentuhan (cth. Mancozeb 75 WP pada 2.5 g/L) untuk mengelak rintangan.",
        "Fokuskan semburan pada anak anakan dan malai yang baru muncul — ini paling terdedah pada peringkat pertumbuhan ini.",
        "Tambah dengan kalium foliar (0-0-50 pada 3 g/L) untuk meningkatkan imuniti tumbuhan dan pengisian bijirin.",
        "Pastikan selang sekurang-kurangnya 7 hari dari aplikasi fungisid sebelumnya untuk mengelak fitotoksisiti.",
        "Semak semula keadaan saliran dan buang mana-mana bahagian yang bertakung untuk mencegah jangkitan semula.",
      ],
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pengurusan rintangan melalui penggiliran fungisid adalah kritikal untuk kawalan penyakit jangka panjang.",
    },
    {
      day: 10,
      title: "Pemulihan Nutrien",
      icon: <Leaf className="w-4 h-4" />,
      color: "#0f5238",
      bg: "rgba(15,82,56,0.08)",
      steps: [
        "Gunakan baja nitrogen dos terbahagi (urea pada 30 kg/ha) untuk menyokong pemulihan daun dan pertumbuhan baru.",
        "Gunakan semburan mikronutrien zink terkelat (zink sulfat pada 0.5%) untuk menangani kemungkinan kekurangan mikronutrien.",
        "Semburkan biostimulan berasaskan silikon (natrium silikat 2%) untuk membina semula kekuatan sel epidermis.",
        "Periksa kesihatan akar — penguningan tanpa gejala di atas tanah mungkin menunjukkan jangkitan reput akar bersama.",
        "Perkenalkan mikroorganisma bermanfaat (Trichoderma harzianum pada 5 g/L) sebagai rendaman tanah jika kerosakan akar disyaki.",
      ],
      note: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.",
    },
    {
      day: 14,
      title: "Penilaian Akhir & Pencegahan",
      icon: <ShieldCheck className="w-4 h-4" />,
      color: "#0f5238",
      bg: "rgba(15,82,56,0.08)",
      steps: [
        "Jalankan lawatan ladang akhir dan bandingkan dengan garis asas Hari 1 — rekod peratusan pemulihan.",
        "Kumpulkan set terakhir 10–15 sampel daun untuk analisis makmal bagi mengesahkan penindasan patogen.",
        "Jika ladang menunjukkan pemulihan lebih 80%, peralihan ke jadual semburan pencegahan (setiap 14 hari pada dos rendah).",
        "Musnahkan semua sisa tanaman yang dijangkiti dengan pembakaran atau pengebumian dalam — mencegah pemindahan ke musim berikutnya.",
        "Kemas kini rekod ladang anda dengan data keberkesanan rawatan dan kongsikan dengan pegawai penyuluhan untuk semakan nasihat.",
      ],
      note: "Lorem ipsum dolor sit amet. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.",
    },
  ],
};

const formatDate = (isoString: string, language: Language) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(language === "bm" ? "ms-MY" : "en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
};

const toNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  const n = parseFloat(v as string);
  return isNaN(n) ? 0 : n;
};

const getDetectionMeta = (
  d: { disease: string; severity: number; score: number },
  language: Language,
) => {
  const isHighRisk = d.severity > 0.5;
  const isHealthy = d.disease === "HEALTHY";
  const isUnknown = d.disease === "Unknown";

  const name = isHealthy
    ? language === "bm"
      ? "Tanaman Sihat"
      : "Healthy Crop"
    : isUnknown
      ? language === "bm"
        ? "Tidak Diketahui"
        : "Unknown"
      : d.disease.charAt(0) + d.disease.slice(1).toLowerCase();

  const sciName =
    SCIENTIFIC_NAMES[d.disease.toUpperCase()] || "Species undetermined";

  const riskLabel = isHealthy
    ? language === "bm"
      ? "SIHAT"
      : "HEALTHY"
    : isUnknown
      ? language === "bm"
        ? "TIDAK DIKETAHUI"
        : "UNKNOWN"
      : isHighRisk
        ? language === "bm"
          ? "RISIKO TINGGI"
          : "HIGH RISK"
        : language === "bm"
          ? "SEDERHANA"
          : "MODERATE";

  const riskStyle = isHealthy
    ? { bg: "rgba(15,82,56,0.1)", text: "#0f5238" }
    : isUnknown
      ? { bg: "rgba(156,163,175,0.12)", text: "#6b7280" }
      : isHighRisk
        ? { bg: "rgba(220,38,38,0.12)", text: "#b91c1c" }
        : { bg: "rgba(194,65,12,0.1)", text: "#c2410c" };

  const severityBarColor = isHighRisk
    ? "linear-gradient(90deg,#c2410c,#dc2626)"
    : isHealthy
      ? "linear-gradient(90deg,#0f5238,#2d6a4f)"
      : "linear-gradient(90deg,#8e4e14,#c2410c)";

  return {
    name,
    sciName,
    riskLabel,
    riskStyle,
    severityBarColor,
    isHighRisk,
    isHealthy,
    isUnknown,
    confidencePct: Math.round(toNum(d.score) * 100),
    severityPct: Math.round(toNum(d.severity) * 100),
  };
};

interface Props {
  item: HistoryItem;
}

export default function HistoryDetailCard({ item }: Props) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const days = TREATMENT_DAYS[language];

  const detections = item.detections ?? [];

  // Show treatment plan if at least one detection is a real disease
  const showTreatmentPlan = detections.some(
    (d) => d.disease !== "HEALTHY" && d.disease !== "Unknown",
  );
  // Show "healthy" block only if every detection is healthy
  const allHealthy =
    detections.length > 0 && detections.every((d) => d.disease === "HEALTHY");

  return (
    <>
      {/* Back nav */}
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 mt-2 cursor-pointer group"
        style={{ color: "#0f5238", fontFamily: "'Manrope', sans-serif" }}
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-bold">
          {t.historyDetail.backToHistory}
        </span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <p
          className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2"
          style={{ color: "#8e4e14", fontFamily: "'Manrope', sans-serif" }}
        >
          {t.historyDetail.sectionLabel}
        </p>
        <h1
          className="leading-tight"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
            letterSpacing: "-0.035em",
            color: "#1c1c18",
          }}
        >
          {t.historyDetail.treatmentLabel}
          <br />
          <span style={{ color: "#0f5238" }}>
            {language === "bm" ? "Pelan" : "Plan"}
          </span>
        </h1>
        <p className="text-sm mt-2" style={{ color: "#707973" }}>
          {formatDate(item.created_at, language)}
        </p>
      </motion.div>

      {/* Scan image + disease card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="rounded-3xl overflow-hidden mb-8"
        style={{ backgroundColor: "#fff", border: "1px solid #e5e2dc" }}
      >
        {/* Full-width scan image/video */}
        <div className="w-full h-52 overflow-hidden">
          {item.download_url?.includes("/videos/") ? (
            <video
              src={item.download_url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={item.download_url}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Detection rows — one per disease found in this scan */}
        {detections.map((d, di) => {
          const meta = getDetectionMeta(d, language);
          return (
            <div key={di}>
              {di > 0 && (
                <div
                  className="mx-5 my-1"
                  style={{ borderTop: "1px dashed #f0ede8" }}
                />
              )}
              <div className="px-5 pt-4 pb-2">
                {/* Disease name + badge */}
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <p
                      className="font-extrabold"
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: "1.05rem",
                        letterSpacing: "-0.02em",
                        color: "#1c1c18",
                      }}
                    >
                      {meta.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "#9ca3af", fontStyle: "italic" }}
                    >
                      {meta.sciName}
                    </p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 mt-0.5"
                    style={{
                      backgroundColor: meta.riskStyle.bg,
                      color: meta.riskStyle.text,
                      fontFamily: "'Manrope', sans-serif",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {meta.riskLabel}
                  </span>
                </div>

                {/* Confidence bar */}
                <div className="mt-4 mb-3">
                  <div className="flex justify-between mb-1.5">
                    <span
                      className="text-[11px] font-bold"
                      style={{
                        color: "#707973",
                        fontFamily: "'Manrope', sans-serif",
                      }}
                    >
                      {t.history.confidence}
                    </span>
                    <span
                      className="text-[11px] font-extrabold"
                      style={{
                        color: "#1c1c18",
                        fontFamily: "'Manrope', sans-serif",
                      }}
                    >
                      {meta.confidencePct}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "#f0ede8" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${meta.confidencePct}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.3 + di * 0.15,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg,#0f5238,#2d6a4f)",
                      }}
                    />
                  </div>
                </div>

                {/* Severity bar */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span
                      className="text-[11px] font-bold"
                      style={{
                        color: "#707973",
                        fontFamily: "'Manrope', sans-serif",
                      }}
                    >
                      {t.history.severity}
                    </span>
                    <span
                      className="text-[11px] font-extrabold"
                      style={{
                        color: "#1c1c18",
                        fontFamily: "'Manrope', sans-serif",
                      }}
                    >
                      {meta.severityPct}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "#f0ede8" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${meta.severityPct}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.45 + di * 0.15,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full"
                      style={{ background: meta.severityBarColor }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Accuracy badge — bottom of card */}
        <div
          className="flex items-center gap-1.5 text-[11px] font-bold px-5 py-4"
          style={{
            borderTop: "1px solid #f0ede8",
            color: "#0f5238",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t.historyDetail.modelAccuracy}
        </div>
      </motion.div>

      {/* API pending notice */}
      {showTreatmentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-start gap-3 p-4 rounded-2xl mb-8"
          style={{
            backgroundColor: "rgba(142,78,20,0.07)",
            border: "1px solid rgba(142,78,20,0.15)",
          }}
        >
          <AlertTriangle
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: "#8e4e14" }}
          />
          <p
            className="text-xs font-medium leading-relaxed"
            style={{ color: "#8e4e14", fontFamily: "'Manrope', sans-serif" }}
          >
            {t.historyDetail.aiNotice}
          </p>
        </motion.div>
      )}

      {/* Treatment plan — Day by day */}
      {showTreatmentPlan && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4" style={{ color: "#0f5238" }} />
              <p
                className="text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{
                  color: "#8e4e14",
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                {t.historyDetail.treatmentLabel}
              </p>
            </div>
            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                letterSpacing: "-0.03em",
                color: "#1c1c18",
              }}
            >
              {t.historyDetail.protocol}
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-4.75 top-6 bottom-6 w-px"
              style={{ backgroundColor: "#e5e2dc" }}
            />

            <div className="space-y-4">
              {days.map((plan, i) => (
                <motion.div
                  key={plan.day}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.07,
                    ease: "easeOut",
                  }}
                  className="flex gap-4"
                >
                  {/* Day badge */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2"
                    style={{
                      backgroundColor: plan.bg,
                      borderColor: plan.color + "33",
                      color: plan.color,
                    }}
                  >
                    {plan.icon}
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 rounded-2xl p-5 mb-1"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e2dc",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: plan.bg,
                          color: plan.color,
                          fontFamily: "'Manrope', sans-serif",
                        }}
                      >
                        {t.historyDetail.dayLabel} {plan.day}
                      </span>
                      <p
                        className="font-extrabold text-sm leading-tight"
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          color: "#1c1c18",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {plan.title}
                      </p>
                    </div>

                    {/* Steps */}
                    <ul className="space-y-2 mb-4">
                      {plan.steps.map((step, si) => (
                        <li key={si} className="flex items-start gap-2">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: plan.color }}
                          />
                          <span
                            className="text-xs leading-relaxed"
                            style={{
                              color: "#404943",
                              fontFamily: "'Manrope', sans-serif",
                            }}
                          >
                            {step}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Note */}
                    <p
                      className="text-[11px] leading-relaxed px-3 py-2.5 rounded-xl"
                      style={{
                        color: "#707973",
                        backgroundColor: "#faf8f4",
                        fontStyle: "italic",
                        fontFamily: "'Manrope', sans-serif",
                        border: "1px solid #f0ede8",
                      }}
                    >
                      📌 {plan.note}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 rounded-3xl text-center"
            style={{
              background: "linear-gradient(135deg,#0f5238,#2d6a4f)",
              boxShadow: "0 8px 28px rgba(15,82,56,0.25)",
            }}
          >
            <Leaf className="w-8 h-8 text-white/70 mx-auto mb-3" />
            <p
              className="font-extrabold text-white mb-1"
              style={{
                fontFamily: "'Manrope', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {t.historyDetail.aiComingSoon}
            </p>
            <p
              className="text-sm mb-4"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {t.historyDetail.aiComingSoonDesc}
            </p>
            <button
              onClick={() => navigate("/chat")}
              className="px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              {t.historyDetail.askAI}
            </button>
          </motion.div>
        </>
      )}

      {/* Healthy result */}
      {allHealthy && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8 rounded-3xl text-center"
          style={{
            backgroundColor: "rgba(15,82,56,0.06)",
            border: "1px solid rgba(15,82,56,0.15)",
          }}
        >
          <CheckCircle2
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "#0f5238" }}
          />
          <p
            className="font-extrabold text-xl mb-2"
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: "#1c1c18",
              letterSpacing: "-0.02em",
            }}
          >
            {t.historyDetail.cropHealthy}
          </p>
          <p className="text-sm" style={{ color: "#707973" }}>
            {t.historyDetail.cropHealthyDesc}
          </p>
        </motion.div>
      )}

      <div className="h-12" />
    </>
  );
}
