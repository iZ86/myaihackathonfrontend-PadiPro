import {
  ShoppingCart,
  Plus,
  PlusCircle,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import Layout from "../../components/Layout";

export default function Products() {
  return (
    <Layout>
      <main className="pt-6 px-6 max-w-7xl mx-auto pb-40">
        {/* Hero / Section Title */}
        <div className="mb-12">
          <span className="font-label text-[11px] font-medium uppercase tracking-wider text-primary mb-2 block">
            Curation for your field
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface-variant leading-tight font-headline">
            Recommended Products.
          </h1>
        </div>

        {/* Filter Chips Section */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar">
          <button className="bg-primary text-white px-6 py-2 rounded-full font-label text-sm font-semibold whitespace-nowrap">
            All Essentials
          </button>
          <button className="bg-primary-fixed-dim text-on-primary-fixed-variant px-6 py-2 rounded-full font-label text-sm font-semibold hover:bg-surface-container-high transition-all whitespace-nowrap">
            Fertilizers
          </button>
          <button className="bg-primary-fixed-dim text-on-primary-fixed-variant px-6 py-2 rounded-full font-label text-sm font-semibold hover:bg-surface-container-high transition-all whitespace-nowrap">
            Pest Control
          </button>
          <button className="bg-primary-fixed-dim text-on-primary-fixed-variant px-6 py-2 rounded-full font-label text-sm font-semibold hover:bg-surface-container-high transition-all whitespace-nowrap">
            Organic
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Featured Product Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-8 bg-white rounded-2xl overflow-hidden group cursor-pointer shadow-sm border border-surface-container"
          >
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcxbKoJjw4ObYY-1AYKa8SrLZdUW5nCAY87TgxGQ22txdLkdgzBjA8K_CK1pMK1CVmwk-5wCMb6Jt__TYRkEpulACapAG_ykL37EIr5lDKb94NlpTA8u4gC-oU58XS2fDmJYT-Iz-nlXQodwhlPEmepBuAtERudEFoyMout7yYHeO5DgTAVfplkD189e6I6A8MfqjbQBRAtrB6WAjfuzZhKmBEYW-UxP7AMk42hvUAzHbLJUNTUEBpQoEkjR3xjWMciS_qYLQuIzWW"
                  alt="FungiGuard Pro"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Editor's Choice
                </div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-3 font-headline">
                    FungiGuard Pro
                  </h2>
                  <p className="text-on-surface-variant leading-relaxed mb-6 font-body">
                    Broad-spectrum organic fungicide designed specifically for
                    paddy leaf blight prevention and root health recovery.
                  </p>
                  <div className="flex items-center gap-2 mb-8">
                    <span className="text-2xl font-bold text-primary">
                      $45.00
                    </span>
                    <span className="text-sm text-outline line-through">
                      $58.00
                    </span>
                  </div>
                </div>
                <button className="hero-gradient text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all hover:shadow-lg active:scale-95">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>

          {/* Side Cards */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center text-center group border border-surface-container"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs8UTHOfewJlJ_0-GwWmntLpHGu-s2EToNIhHuIbmgunF-iVhCsEqRSCw3qZWiHzQddGhVJg67sBm2Uh_yyt747GzZ9JCIvgD8frN81N7gE5AN_aQUrHOnmlcWOLgowiI9kSXPabJYxXwEE5OzDQE-YQsx7JzynphEI3WWDIWZseEuTMYNgiKklBoDZB_tgxvXtqFAvvntMvd_4Y-UGAxw0xLYE-JcieiQJQAWwHxFFLpNBHgfjuzgLv_TxvpYEihnkljM_ltqZ0RN"
                alt="EcoGrain Booster"
                className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-white shadow-md transition-transform group-hover:rotate-6"
                referrerPolicy="no-referrer"
              />
              <h3 className="text-xl font-bold mb-1 font-headline">
                EcoGrain Booster
              </h3>
              <p className="text-sm text-on-surface-variant mb-4 font-body">
                Micronutrient blend for yield increase.
              </p>
              <span className="text-lg font-bold text-primary mb-4">
                $22.50
              </span>
              <button className="w-full bg-surface-container-highest text-on-surface py-3 rounded-xl font-medium hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Add
              </button>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center text-center group border border-surface-container"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXX6b1IeOsA6o6MIm1K8Sne3N5a-q6Rip1c3II-BaAeQ2zFb5cCYWyAkpdVZp9sm9CpUMrAU96xRyxUEoIS_La19fl9n3blx3aQpFrH3KfOrxu5qV9G4xA4Kz1ROTXf_jO9haarePJIiwq2u85nSwx9aQ1LBe4NzknvTCl_kevADU_yJU4KGhbbuONZ8x5OyDWZBzEoogbpl09Gts4-49tVAfGG407zeKlHQfO83FWOhbYk00fVL5ZF3KCEdFvLRgzBdcD7IU0HsxA"
                alt="BioMist 9"
                className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-white shadow-md transition-transform group-hover:rotate-6"
                referrerPolicy="no-referrer"
              />
              <h3 className="text-xl font-bold mb-1 font-headline">
                BioMist 9
              </h3>
              <p className="text-sm text-on-surface-variant mb-4 font-body">
                Targeted pesticide for leaf rollers.
              </p>
              <span className="text-lg font-bold text-primary mb-4">
                $31.90
              </span>
              <button className="w-full bg-surface-container-highest text-on-surface py-3 rounded-xl font-medium hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Add
              </button>
            </motion.div>
          </div>

          {/* More Products Section */}
          <div className="md:col-span-12 mt-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 font-headline">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              Bulk Essentials
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  name: "Nitrogen Max",
                  desc: "50kg Bulk Pack",
                  price: "$180.00",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy2KZQTnEKcHEd2N62AQSCDRX-efQZj52y7pCPpBMui2EfH0WDG3auGUwF-vwFmmf72YBVImfAkzMurt28GqPes54GMfvYWeS9-GileSJedIbKSXPd5zmxbIkAsaQ47n38j8YDKCsl56v1eyjAuMe7ZcCBdQSPeKba-adNy1rsZ-2B0kXC1kt28Tfz655RfR-fRNbXnSEYBcWxy-PlfZ1sllghBtNt3koN99urlWMGYbyLWRdzv4Ikbl5VNoHtwgh_jqwX3PneQ_Ei",
                },
                {
                  name: "Soil Pro Kit",
                  desc: "Testing Equipment",
                  price: "$65.00",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZBIgApDMeRxnSyw6WQdYOw6pNQZ2FlWM-Y854_KyZzx_H2XmHMzunyHp86T4o3mmrpV51Zb1_u3Q1npgyINxcBH9KsqIhycBCPgh3kEsoYiGKTyk3OpSNGHQPz3f1cGdsf_QIP5mcb924dmMVSi3B50b904XtDCzROkYXKYDh9FKeDE8KN3Y5UAslo1wsK5h5uGVMMNrHl29tYumuE8wx47ch_zJYnoSsQiFSfGYQHY9IIph4xd9al1td0zl5cF4inSaA4sIpmWym",
                },
                {
                  name: "Root Power",
                  desc: "Organic Extract",
                  price: "$29.00",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpSeMCiMf5dooSz6OFMEi-jgUBEeMXoufi0cY6-5czfvFMK-LwT1uxiI-XjIwHWQwtjo60q4NUErkt2Hb9aFwhwyq0d4WsILG9eVEZ7hBqjRizLpUh3nMHr3SPiyEKZYJF_GVzCmd12JIR6bMJBI39rCTRaejJUkYH45DpCgPAT1wWnCLcDs8vANidVB_1NeGQBOzj4_E-m38cj_AOyuxKGAIw-KSbQ4VKB8T35BOQp29_MG_MSbk085crBOJ1HOkqEQc0BuMEJZy4",
                },
                {
                  name: "Hydro Shield",
                  desc: "Leaf Protector",
                  price: "$42.00",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAu-X9uUlbOiCBFVZ5pGx2b6cRPTc3_XVqe7fY4xLs7jiTqyM9kcYe6kKbWdRWe1KhediuIhmsNH7whntdj7NVw1WVQ-DucYoGbElHJzA6vGMrzVWQtcMeXzlOS2t7-M7oeIm53OHd-3cNVVbe9E_8zjqgL8iGqO-Ly4nwaOe2cPELtbsspQ5Cx08X_aa_t8kdxGgSJ5M8NrLiQ-grIgkWoBE2Yg-jesRXNbjuKTs1XaRTFgTHrsDDLDqA41iaU_LtN44azsqWEOP4Q",
                },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-4 group cursor-pointer shadow-sm border border-surface-container"
                >
                  <div className="aspect-square bg-surface-container-low rounded-xl mb-4 overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-bold text-sm mb-1 truncate font-headline">
                    {p.name}
                  </h4>
                  <p className="text-xs text-on-surface-variant mb-3 font-body">
                    {p.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{p.price}</span>
                    <PlusCircle className="w-5 h-5 text-outline hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Checkout Bar */}
      <div className="fixed bottom-28 left-6 right-6 z-40 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl rounded-[20px] p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4 pl-2">
            <div className="relative">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-outline uppercase tracking-tighter">
                Total Est.
              </span>
              <span className="text-xl font-bold text-primary">$99.40</span>
            </div>
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-[14px] font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 active:scale-95 shadow-md">
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
