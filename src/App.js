import { useState } from "react";

const PRODUITS = {
  tomate: {
    emoji: "🍅", name: "Tomate", saison: "★ Vedette",
    origin: "Drôme · Rhône",
    sub: "Producteurs de la Drôme & du Rhône",
    eco: "Km 0 · cueilli à maturité · non traité",
  },
  courgette: {
    emoji: "🥒", name: "Courgette", saison: "Pleine saison",
    origin: "Ain · Isère",
    sub: "Producteurs de l'Ain & de l'Isère",
    eco: "Culture raisonnée · Circuit court < 80km",
  },
  peche: {
    emoji: "🍑", name: "Pêche", saison: "Début saison",
    origin: "Ardèche",
    sub: "Vergers d'Ardèche — début de saison",
    eco: "Sans traitement post-récolte · Variétés locales",
  },
  basilic: {
    emoji: "🌿", name: "Basilic", saison: "Pleine saison",
    origin: "Local · Bio",
    sub: "Production locale & biologique · Lyon",
    eco: "100% bio · Cultivé en serre locale",
  },
  fromage: {
    emoji: "🧀", name: "St-Marcellin", saison: "En affinage",
    origin: "IGP · Isère",
    sub: "IGP Isère — affinage optimal ce mois",
    eco: "Lait cru · Elevage pâturant local",
  },
};

const RESTOS = [
  { emoji: "🏡", bg: "#fef3e8", name: "Le Potager des Halles", type: "Bistrot · 2e arr · Presqu'île", dist: "0,4 km", price: "14–22€", tags: [{ label: "🌱 Éco-label", cls: "eco" }, { label: "Local", cls: "local" }] },
  { emoji: "🔥", bg: "#fce7e0", name: "Braise & Racines", type: "Gastronomique · 6e arr", dist: "1,2 km", price: "35–55€", tags: [{ label: "Nouveau", cls: "new" }, { label: "Bio", cls: "bio" }] },
  { emoji: "🌿", bg: "#e8f4ea", name: "Chlorophylle", type: "Végétarien · Croix-Rousse", dist: "1,8 km", price: "11–18€", tags: [{ label: "🌱 Éco-label", cls: "eco" }, { label: "Bio", cls: "bio" }] },
  { emoji: "🥂", bg: "#f5f0e8", name: "Café des Canuts", type: "Bouchon moderne · 1er arr", dist: "2,1 km", price: "16–28€", tags: [{ label: "Local", cls: "local" }] },
];

const RECETTES = [
  { emoji: "🥗", bg: "#fef3e8", name: "Gaspacho de tomates de la Drôme", meta: "⏱ 15 min · 4 personnes · Végétarien", diff: 1 },
  { emoji: "🍕", bg: "#fce7e0", name: "Tarte tatin tomate & basilic", meta: "⏱ 45 min · 6 personnes · Chef Viannay", diff: 2 },
  { emoji: "🥘", bg: "#e8f4ea", name: "Ratatouille niçoise revisitée", meta: "⏱ 60 min · 4 personnes · Éco-responsable", diff: 3 },
  { emoji: "🫙", bg: "#f5f0e8", name: "Coulis de tomate à conserver", meta: "⏱ 30 min · Zéro déchet · Anti-gaspi", diff: 1 },
];

const ADRESSES = [
  { icon: "🏪", name: "Marché de la Croix-Rousse", type: "Marché alimentaire", rue: "Bd de la Croix-Rousse · 4e arr", horaires: "Mar–Sam 6h–13h30 · 12 producteurs ce mois" },
  { icon: "🌿", name: "La Ferme de la Côte", type: "Producteur direct · Drôme", rue: "Point de vente : 8 rue Ferrachat · 7e", horaires: "Ven 16h–19h · Panier hebdomadaire dispo" },
  { icon: "🛒", name: "Épicerie du Soleil", type: "Épicerie fine & bio", rue: "23 rue de la République · 2e arr", horaires: "Lun–Sam 9h–19h30 · Stock tomates garantis" },
  { icon: "🤝", name: "AMAP les Jardins du Rhône", type: "Association · Panier hebdomadaire", rue: "Distribution : Place Carnot · 2e", horaires: "Mer 18h–19h30 · Inscription ouverte" },
];

const TAG_STYLES = {
  eco: { background: "#e8f4ea", color: "#3D5A3E" },
  local: { background: "#fef3e2", color: "#a16207" },
  new: { background: "#fce7e0", color: "#C4622D" },
  bio: { background: "#e6f4ea", color: "#276749" },
};

export default function App() {
  const [activeProduit, setActiveProduit] = useState("tomate");
  const [activeTab, setActiveTab] = useState("restos");
  const [restoFilter, setRestoFilter] = useState("Tous");
  const [recetteFilter, setRecetteFilter] = useState("Toutes");
  const [adresseFilter, setAdresseFilter] = useState("Tout Lyon");

  const p = PRODUITS[activeProduit];

  const s = {
    page: { fontFamily: "'DM Sans', sans-serif", background: "#F9F6F1", color: "#1A1208", maxWidth: 430, margin: "0 auto", minHeight: "100vh", position: "relative" },
    header: { background: "#2C1F0E", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontFamily: "Georgia, serif", fontSize: "1.45rem", color: "#E8D9B5", letterSpacing: "0.04em" },
    logoSpan: { color: "#7A9E7E", fontStyle: "italic" },
    locPill: { background: "rgba(255,255,255,0.12)", color: "#E8D9B5", fontSize: "0.7rem", padding: "5px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 },
    hero: { background: "linear-gradient(155deg,#3D5A3E 0%,#2a3d2b 100%)", padding: "22px 18px 18px", position: "relative", overflow: "hidden" },
    heroLabel: { fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7A9E7E", marginBottom: 3 },
    heroTitle: { fontFamily: "Georgia, serif", fontSize: "1.75rem", color: "#F5F0E8", lineHeight: 1.1, marginBottom: 8 },
    heroTitleEm: { color: "#D4A843", fontStyle: "italic" },
    heroDesc: { fontSize: "0.77rem", color: "rgba(245,240,232,0.7)", lineHeight: 1.5, maxWidth: 280 },
    heroStats: { display: "flex", gap: 18, marginTop: 16 },
    statNum: { fontFamily: "Georgia, serif", fontSize: "1.4rem", color: "#D4A843", display: "block" },
    statLabel: { fontSize: "0.6rem", color: "rgba(245,240,232,0.5)", letterSpacing: "0.08em", textTransform: "uppercase" },
    ecoBadge: { position: "absolute", top: 18, right: 16, background: "rgba(122,158,126,0.22)", border: "1px solid rgba(122,158,126,0.4)", color: "#7A9E7E", fontSize: "0.62rem", fontWeight: 700, padding: "5px 10px", borderRadius: 20 },
    section: { padding: "18px 18px 0" },
    secHeader: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 },
    secTitle: { fontFamily: "Georgia, serif", fontSize: "1.05rem", color: "#2C1F0E" },
    seeAll: { fontSize: "0.68rem", color: "#C4622D", fontWeight: 600, cursor: "pointer" },
    produitsRow: { display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" },
    prodCard: (active) => ({
      minWidth: 105, background: active ? "#3D5A3E" : "white",
      border: `2px solid ${active ? "#3D5A3E" : "transparent"}`,
      borderRadius: 14, padding: "12px 10px", cursor: "pointer",
      textAlign: "center", boxShadow: "0 2px 8px rgba(44,31,14,0.06)",
      transition: "all 0.18s", flexShrink: 0,
    }),
    prodEmoji: { fontSize: "1.9rem", display: "block", marginBottom: 5 },
    prodName: (active) => ({ fontWeight: 600, fontSize: "0.75rem", color: active ? "white" : "#2C1F0E", display: "block" }),
    prodOrigin: (active) => ({ fontSize: "0.6rem", color: active ? "rgba(255,255,255,0.65)" : "#6B5B3E", display: "block", marginTop: 2 }),
    prodSeason: (active) => ({
      display: "inline-block", marginTop: 5, fontSize: "0.58rem", fontWeight: 700,
      background: active ? "rgba(255,255,255,0.15)" : "#E8D9B5",
      color: active ? "white" : "#C4622D", padding: "2px 7px", borderRadius: 10,
    }),
    panel: { margin: "14px 18px 0", background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(44,31,14,0.08)" },
    panelHero: { background: "linear-gradient(135deg,#3D5A3E,#2a3d2b)", padding: "18px", display: "flex", alignItems: "center", gap: 14 },
    panelEmoji: { fontSize: "3.2rem" },
    panelName: { fontFamily: "Georgia, serif", fontSize: "1.35rem", color: "#F5F0E8" },
    panelSub: { fontSize: "0.7rem", color: "rgba(245,240,232,0.65)", marginTop: 2 },
    panelEco: { marginTop: 7, fontSize: "0.63rem", color: "#7A9E7E", fontWeight: 500 },
    tabs: { display: "flex", borderBottom: "1px solid #E8D9B5", background: "white" },
    tab: (active) => ({
      flex: 1, padding: "11px 4px", textAlign: "center", fontSize: "0.68rem",
      fontWeight: 700, color: active ? "#3D5A3E" : "#6B5B3E", cursor: "pointer",
      borderBottom: `2px solid ${active ? "#3D5A3E" : "transparent"}`,
      transition: "all 0.18s", letterSpacing: "0.02em",
    }),
    tabContent: { padding: 14 },
    pillRow: { display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 12, scrollbarWidth: "none" },
    pill: (active) => ({
      whiteSpace: "nowrap", fontSize: "0.66rem", fontWeight: 500,
      padding: "5px 11px", borderRadius: 20,
      border: `1.5px solid ${active ? "#2C1F0E" : "#E8D9B5"}`,
      background: active ? "#2C1F0E" : "white",
      color: active ? "#E8D9B5" : "#6B5B3E", cursor: "pointer", flexShrink: 0,
    }),
    restoItem: { display: "flex", alignItems: "center", gap: 11, padding: "10px 0", borderBottom: "1px solid #E8D9B5" },
    restoAvatar: (bg) => ({ width: 42, height: 42, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }),
    restoName: { fontWeight: 700, fontSize: "0.8rem", color: "#2C1F0E" },
    restoMeta: { fontSize: "0.66rem", color: "#6B5B3E", marginTop: 2 },
    restoTags: { display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" },
    tag: (cls) => ({ fontSize: "0.57rem", padding: "2px 6px", borderRadius: 7, fontWeight: 600, ...TAG_STYLES[cls] }),
    restoRight: { textAlign: "right", flexShrink: 0, marginLeft: "auto" },
    restoDist: { fontSize: "0.63rem", color: "#6B5B3E" },
    restoPrice: { fontSize: "0.7rem", fontWeight: 700, color: "#2C1F0E", marginTop: 2 },
    resaBtn: { marginTop: 4, background: "#3D5A3E", color: "white", fontSize: "0.58rem", fontWeight: 700, padding: "3px 8px", borderRadius: 8, border: "none", cursor: "pointer" },
    recItem: { display: "flex", gap: 11, padding: "10px 0", borderBottom: "1px solid #E8D9B5", cursor: "pointer" },
    recImg: (bg) => ({ width: 58, height: 58, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", flexShrink: 0 }),
    recName: { fontWeight: 700, fontSize: "0.8rem", color: "#2C1F0E" },
    recMeta: { fontSize: "0.66rem", color: "#6B5B3E", marginTop: 2 },
    diffRow: { display: "flex", gap: 3, marginTop: 5 },
    dot: (filled) => ({ width: 6, height: 6, borderRadius: "50%", background: filled ? "#C4622D" : "#E8D9B5" }),
    adrItem: { display: "flex", gap: 11, padding: "10px 0", borderBottom: "1px solid #E8D9B5", alignItems: "flex-start" },
    adrIcon: { width: 38, height: 38, borderRadius: 10, background: "#E8D9B5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.15rem", flexShrink: 0 },
    adrName: { fontWeight: 700, fontSize: "0.8rem", color: "#2C1F0E" },
    adrType: { fontSize: "0.63rem", color: "#C4622D", fontWeight: 600, marginTop: 1 },
    adrRue: { fontSize: "0.63rem", color: "#6B5B3E", marginTop: 2 },
    adrHoraires: { fontSize: "0.6rem", color: "#3D5A3E", marginTop: 2, fontWeight: 600 },
    trendGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    trendCard: (featured) => ({
      background: featured ? "linear-gradient(135deg,#2C1F0E,#3d2a10)" : "white",
      borderRadius: 16, padding: 14, cursor: "pointer",
      boxShadow: "0 2px 8px rgba(44,31,14,0.07)",
    }),
    trendEmoji: { fontSize: "1.5rem", marginBottom: 5 },
    trendLabel: (featured) => ({ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: featured ? "#D4A843" : "#C4622D", marginBottom: 3 }),
    trendName: (featured) => ({ fontFamily: "Georgia, serif", fontSize: "0.92rem", color: featured ? "#E8D9B5" : "#2C1F0E", lineHeight: 1.2 }),
    trendSub: (featured) => ({ fontSize: "0.63rem", color: featured ? "rgba(245,240,232,0.5)" : "#6B5B3E", marginTop: 4 }),
    ecoBlock: { margin: "18px 18px 0", background: "linear-gradient(135deg,#3D5A3E,#2d4a2e)", borderRadius: 18, padding: 18 },
    ecoTitle: { fontFamily: "Georgia, serif", fontSize: "1rem", color: "#E8D9B5", marginBottom: 3 },
    ecoSub: { fontSize: "0.68rem", color: "rgba(245,240,232,0.55)", marginBottom: 14 },
    ecoBarRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
    ecoBarLabel: { fontSize: "0.63rem", color: "rgba(245,240,232,0.7)", width: 80, flexShrink: 0 },
    ecoBarTrack: { flex: 1, height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" },
    ecoBarFill: (pct) => ({ height: "100%", width: `${pct}%`, background: "#7A9E7E", borderRadius: 10 }),
    ecoBarVal: { fontSize: "0.63rem", fontWeight: 700, color: "#7A9E7E", width: 24, textAlign: "right", flexShrink: 0 },
    nav: { background: "white", borderTop: "1px solid #E8D9B5", display: "flex", padding: "8px 0 6px", marginTop: 22, position: "sticky", bottom: 0 },
    navItem: (active) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "3px 0" }),
    navIcon: { fontSize: "1.2rem" },
    navLabel: (active) => ({ fontSize: "0.57rem", fontWeight: 600, color: active ? "#3D5A3E" : "#6B5B3E" }),
    divider: { height: 1, background: "#E8D9B5", margin: "18px 18px 0" },
  };

  const restoPills = ["Tous", "Bistrots", "Gastro", "Végé", "< 15€"];
  const recPills = ["Toutes", "Rapide", "Facile", "Chef", "Végé"];
  const adrPills = ["Tout Lyon", "Marchés", "Épiceries", "Producteurs", "AMAP"];
  const navItems = [["🌿", "Saisons"], ["🗺️", "Carte"], ["👨‍🍳", "Recettes"], ["🏪", "Adresses"], ["👤", "Profil"]];

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.logo}>Ra<span style={s.logoSpan}>cines</span></div>
        <div style={s.locPill}>📍 Lyon</div>
      </div>

      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroLabel}>Juin 2026 · Saison estivale</div>
        <div style={s.heroTitle}>Le temps des<br /><em style={s.heroTitleEm}>premières tomates</em></div>
        <div style={s.heroDesc}>Les producteurs du Rhône commencent leur récolte. 47 restaurants lyonnais les mettent à l'honneur.</div>
        <div style={s.heroStats}>
          {[["47","Restaurants"],["12","Producteurs"],["28","Recettes"]].map(([n,l]) => (
            <div key={l}><span style={s.statNum}>{n}</span><span style={s.statLabel}>{l}</span></div>
          ))}
        </div>
        <div style={s.ecoBadge}>🌱 Circuit court</div>
      </div>

      {/* PRODUITS DU MOIS */}
      <div style={s.section}>
        <div style={s.secHeader}>
          <div style={s.secTitle}>Produits du mois</div>
          <span style={s.seeAll}>Voir tout →</span>
        </div>
        <div style={s.produitsRow}>
          {Object.entries(PRODUITS).map(([key, prod]) => {
            const active = activeProduit === key;
            return (
              <div key={key} style={s.prodCard(active)} onClick={() => { setActiveProduit(key); setActiveTab("restos"); }}>
                <span style={s.prodEmoji}>{prod.emoji}</span>
                <span style={s.prodName(active)}>{prod.name}</span>
                <span style={s.prodOrigin(active)}>{prod.origin}</span>
                <span style={s.prodSeason(active)}>{prod.saison}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL PANEL */}
      <div style={s.panel}>
        <div style={s.panelHero}>
          <div style={s.panelEmoji}>{p.emoji}</div>
          <div>
            <div style={s.panelName}>{p.name}</div>
            <div style={s.panelSub}>{p.sub}</div>
            <div style={s.panelEco}>🌱 {p.eco}</div>
          </div>
        </div>

        {/* TABS */}
        <div style={s.tabs}>
          {[["restos","🍽 Restaurants"],["recettes","👨‍🍳 Recettes"],["adresses","🏪 Adresses"]].map(([id,label]) => (
            <div key={id} style={s.tab(activeTab===id)} onClick={() => setActiveTab(id)}>{label}</div>
          ))}
        </div>

        <div style={s.tabContent}>
          {/* RESTOS */}
          {activeTab === "restos" && (
            <>
              <div style={s.pillRow}>
                {restoPills.map(f => <span key={f} style={s.pill(restoFilter===f)} onClick={() => setRestoFilter(f)}>{f}</span>)}
              </div>
              {RESTOS.map((r, i) => (
                <div key={i} style={{ ...s.restoItem, borderBottom: i < RESTOS.length-1 ? "1px solid #E8D9B5" : "none" }}>
                  <div style={s.restoAvatar(r.bg)}>{r.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.restoName}>{r.name}</div>
                    <div style={s.restoMeta}>{r.type}</div>
                    <div style={s.restoTags}>
                      {r.tags.map(t => <span key={t.label} style={s.tag(t.cls)}>{t.label}</span>)}
                    </div>
                  </div>
                  <div style={s.restoRight}>
                    <div style={s.restoDist}>{r.dist}</div>
                    <div style={s.restoPrice}>{r.price}</div>
                    <button style={s.resaBtn}>Réserver</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* RECETTES */}
          {activeTab === "recettes" && (
            <>
              <div style={s.pillRow}>
                {recPills.map(f => <span key={f} style={s.pill(recetteFilter===f)} onClick={() => setRecetteFilter(f)}>{f}</span>)}
              </div>
              {RECETTES.map((r, i) => (
                <div key={i} style={{ ...s.recItem, borderBottom: i < RECETTES.length-1 ? "1px solid #E8D9B5" : "none" }}>
                  <div style={s.recImg(r.bg)}>{r.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.recName}>{r.name}</div>
                    <div style={s.recMeta}>{r.meta}</div>
                    <div style={s.diffRow}>
                      {[1,2,3].map(d => <div key={d} style={s.dot(d <= r.diff)} />)}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ADRESSES */}
          {activeTab === "adresses" && (
            <>
              <div style={s.pillRow}>
                {adrPills.map(f => <span key={f} style={s.pill(adresseFilter===f)} onClick={() => setAdresseFilter(f)}>{f}</span>)}
              </div>
              {ADRESSES.map((a, i) => (
                <div key={i} style={{ ...s.adrItem, borderBottom: i < ADRESSES.length-1 ? "1px solid #E8D9B5" : "none" }}>
                  <div style={s.adrIcon}>{a.icon}</div>
                  <div>
                    <div style={s.adrName}>{a.name}</div>
                    <div style={s.adrType}>{a.type}</div>
                    <div style={s.adrRue}>{a.rue}</div>
                    <div style={s.adrHoraires}>{a.horaires}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* TRENDING */}
      <div style={s.divider} />
      <div style={{ ...s.section, paddingTop: 18 }}>
        <div style={s.secHeader}>
          <div style={s.secTitle}>Tendances à Lyon</div>
          <span style={s.seeAll}>Explorer →</span>
        </div>
        <div style={s.trendGrid}>
          <div style={{ ...s.trendCard(true), gridRow: "span 2" }}>
            <div style={s.trendEmoji}>🍷</div>
            <div style={s.trendLabel(true)}>Saison prochaine</div>
            <div style={s.trendName(true)}>Beaujolais nouveau 2026</div>
            <div style={s.trendSub(true)}>Dans 4 mois · 38 caves partenaires déjà inscrites</div>
          </div>
          <div style={s.trendCard(false)}>
            <div style={s.trendEmoji}>🧀</div>
            <div style={s.trendLabel(false)}>En ce moment</div>
            <div style={s.trendName(false)}>St-Marcellin au pic</div>
            <div style={s.trendSub(false)}>Affinage parfait ce mois</div>
          </div>
          <div style={s.trendCard(false)}>
            <div style={s.trendEmoji}>🍑</div>
            <div style={s.trendLabel(false)}>Bientôt</div>
            <div style={s.trendName(false)}>Pêches d'Ardèche</div>
            <div style={s.trendSub(false)}>Ouverture récolte le 20 juin</div>
          </div>
        </div>
      </div>

      {/* ECO SCORE */}
      <div style={s.ecoBlock}>
        <div style={s.ecoTitle}>Ton impact ce mois-ci 🌱</div>
        <div style={s.ecoSub}>Basé sur tes visites et achats déclarés</div>
        {[["Km parcourus", 85, "A+"], ["Local < 100km", 70, "A"], ["Saisonnalité", 92, "A+"], ["Anti-gaspi", 55, "B+"]].map(([label, pct, val]) => (
          <div key={label} style={s.ecoBarRow}>
            <div style={s.ecoBarLabel}>{label}</div>
            <div style={s.ecoBarTrack}><div style={s.ecoBarFill(pct)} /></div>
            <div style={s.ecoBarVal}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 20 }} />

      {/* BOTTOM NAV */}
      <div style={s.nav}>
        {navItems.map(([icon, label], i) => (
          <div key={label} style={s.navItem(i === 0)}>
            <div style={s.navIcon}>{icon}</div>
            <div style={s.navLabel(i === 0)}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
