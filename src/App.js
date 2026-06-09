import { useState } from "react";

const MOIS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
const CALENDRIER = {
  0:  ["🥬 Chou","🌿 Poireau","🥕 Carotte","🧅 Panais"],
  1:  ["🥬 Chou","🌿 Poireau","🥗 Mâche","🧅 Endive"],
  2:  ["🌱 Asperge","🌶 Radis","🥬 Épinard","🫛 Pois"],
  3:  ["🌱 Asperge","🫛 Petits pois","🍓 Fraise","🥬 Épinard"],
  4:  ["🍓 Fraise","🍒 Cerise","🫘 Fève","🫛 Petits pois"],
  5:  ["🍅 Tomate","🥒 Courgette","🍓 Fraise","🍒 Cerise"],
  6:  ["🍅 Tomate","🍆 Aubergine","🫑 Poivron","🍑 Abricot"],
  7:  ["🍅 Tomate","🫑 Poivron","🍈 Melon","🍑 Pêche"],
  8:  ["🍇 Raisin","🍂 Figue","🎃 Courge","🫘 Haricot"],
  9:  ["🎃 Courge","🍎 Pomme","🍄 Champignon","🌰 Châtaigne"],
  10: ["🥬 Chou","🍎 Pomme","🍐 Poire","🥕 Carotte"],
  11: ["🥬 Chou","🍊 Clémentine","🌿 Poireau","🥕 Carotte"],
};

const PRODUITS = {
  tomate:    { emoji:"🍅", name:"Tomate",       saison:"★ Vedette",      origin:"Drôme · Rhône",   sub:"Producteurs de la Drôme & du Rhône",     eco:"Km 0 · cueilli à maturité · non traité" },
  courgette: { emoji:"🥒", name:"Courgette",    saison:"Pleine saison",  origin:"Ain · Isère",     sub:"Producteurs de l'Ain & de l'Isère",      eco:"Culture raisonnée · Circuit court < 80km" },
  peche:     { emoji:"🍑", name:"Pêche",        saison:"Début saison",   origin:"Ardèche",         sub:"Vergers d'Ardèche — début de saison",    eco:"Sans traitement post-récolte · Variétés locales" },
  basilic:   { emoji:"🌿", name:"Basilic",      saison:"Pleine saison",  origin:"Local · Bio",     sub:"Production locale & biologique · Lyon",  eco:"100% bio · Cultivé en serre locale" },
  fromage:   { emoji:"🧀", name:"St-Marcellin", saison:"En affinage",    origin:"IGP · Isère",     sub:"IGP Isère — affinage optimal ce mois",   eco:"Lait cru · Elevage pâturant local" },
};

const PRODUCTEURS = [
  { emoji:"👨‍🌾", bg:"#e8f4ea", name:"Ferme des Collines", lieu:"Drôme · 42 km", type:"Maraîchage bio", produits:"Tomates, courgettes, basilic", certif:"AB · HVE", note:"4.9", nbAvis:128, dispo:"Panier dispo ven." },
  { emoji:"🧑‍🌾", bg:"#fef3e8", name:"Vergers Dupont",     lieu:"Ardèche · 68 km", type:"Arboriculture",  produits:"Pêches, abricots, cerises",   certif:"Local garanti", note:"4.7", nbAvis:84, dispo:"Marché sam. matin" },
  { emoji:"👩‍🌾", bg:"#fce7e0", name:"GAEC du Rhône",       lieu:"Ain · 35 km",  type:"Fromages & lait", produits:"St-Marcellin, yaourts, beurre",certif:"IGP · Fermier", note:"5.0", nbAvis:61, dispo:"Vente directe mer." },
];

const RESTOS = [
  { emoji:"🏡", bg:"#fef3e8", name:"Le Potager des Halles", type:"Bistrot · 2e arr · Presqu'île", dist:"0,4 km", price:"14–22€", tags:[{label:"🌱 Éco-label",cls:"eco"},{label:"Local",cls:"local"}] },
  { emoji:"🔥", bg:"#fce7e0", name:"Braise & Racines",      type:"Gastronomique · 6e arr",        dist:"1,2 km", price:"35–55€", tags:[{label:"Nouveau",cls:"new"},{label:"Bio",cls:"bio"}] },
  { emoji:"🌿", bg:"#e8f4ea", name:"Chlorophylle",           type:"Végétarien · Croix-Rousse",     dist:"1,8 km", price:"11–18€", tags:[{label:"🌱 Éco-label",cls:"eco"},{label:"Bio",cls:"bio"}] },
  { emoji:"🥂", bg:"#f5f0e8", name:"Café des Canuts",        type:"Bouchon moderne · 1er arr",     dist:"2,1 km", price:"16–28€", tags:[{label:"Local",cls:"local"}] },
];

const RECETTES = [
  { emoji:"🥗", bg:"#fef3e8", name:"Gaspacho de tomates de la Drôme",  meta:"⏱ 15 min · 4 pers · Végétarien",          diff:1 },
  { emoji:"🍕", bg:"#fce7e0", name:"Tarte tatin tomate & basilic",      meta:"⏱ 45 min · 6 pers · Chef Viannay",         diff:2 },
  { emoji:"🥘", bg:"#e8f4ea", name:"Ratatouille niçoise revisitée",     meta:"⏱ 60 min · 4 pers · Éco-responsable",      diff:3 },
  { emoji:"🫙", bg:"#f5f0e8", name:"Coulis de tomate à conserver",      meta:"⏱ 30 min · Zéro déchet · Anti-gaspi",      diff:1 },
];

const ADRESSES = [
  { icon:"🏪", name:"Marché de la Croix-Rousse", type:"Marché alimentaire",              rue:"Bd de la Croix-Rousse · 4e arr",       horaires:"Mar–Sam 6h–13h30 · 12 producteurs" },
  { icon:"🌿", name:"La Ferme de la Côte",        type:"Producteur direct · Drôme",       rue:"Point de vente : 8 rue Ferrachat · 7e", horaires:"Ven 16h–19h · Panier hebdo dispo" },
  { icon:"🛒", name:"Épicerie du Soleil",          type:"Épicerie fine & bio",             rue:"23 rue de la République · 2e arr",     horaires:"Lun–Sam 9h–19h30" },
  { icon:"🤝", name:"AMAP les Jardins du Rhône",  type:"Association · Panier hebdomadaire",rue:"Distribution : Place Carnot · 2e",     horaires:"Mer 18h–19h30 · Inscription ouverte" },
];

const BADGES = [
  { emoji:"🌱", name:"Premier pas",     desc:"1ère adresse locale visitée",     unlocked:true  },
  { emoji:"🛒", name:"Locavore",        desc:"5 achats locaux validés",          unlocked:true  },
  { emoji:"👨‍🍳", name:"Chef du marché", desc:"3 recettes de saison cuisinées",   unlocked:true  },
  { emoji:"🌍", name:"Zéro gaspi",      desc:"Signaler 5 invendus sauvés",       unlocked:false },
  { emoji:"📅", name:"Saisons master",  desc:"Consommer local 4 saisons de suite",unlocked:false },
  { emoji:"🏆", name:"Top du board",    desc:"Atteindre le top 3 entre amis",    unlocked:false },
];

const AMIS = [
  { rank:1, avatar:"🧑‍🦱", name:"Théo",    score:2840, badge:"🏆", trend:"→" },
  { rank:2, avatar:"👩‍🦰", name:"Camille", score:2310, badge:"🥈", trend:"↑" },
  { rank:3, avatar:"🧑",   name:"Toi",     score:1980, badge:"🥉", trend:"↑", isMe:true },
  { rank:4, avatar:"👨‍🦳", name:"Marc",    score:1540, badge:"",   trend:"↓" },
  { rank:5, avatar:"👩",   name:"Léa",     score:1200, badge:"",   trend:"→" },
];

const TAG_STYLES = {
  eco:   { background:"#e8f4ea", color:"#3D5A3E" },
  local: { background:"#fef3e2", color:"#a16207" },
  new:   { background:"#fce7e0", color:"#C4622D" },
  bio:   { background:"#e6f4ea", color:"#276749" },
};

const PAGES = ["saisons","carte","recettes","adresses","profil"];

export default function App() {
  const [activeProduit, setActiveProduit]   = useState("tomate");
  const [activeTab, setActiveTab]           = useState("restos");
  const [restoFilter, setRestoFilter]       = useState("Tous");
  const [recetteFilter, setRecetteFilter]   = useState("Toutes");
  const [adresseFilter, setAdresseFilter]   = useState("Tout Lyon");
  const [activePage, setActivePage]         = useState("saisons");
  const [activeMois, setActiveMois]         = useState(5); // juin = index 5

  const p = PRODUITS[activeProduit];

  const s = {
    page:       { fontFamily:"'DM Sans', sans-serif", background:"#F9F6F1", color:"#1A1208", maxWidth:430, margin:"0 auto", minHeight:"100vh", position:"relative" },
    header:     { background:"#2C1F0E", padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 },
    logo:       { fontFamily:"Georgia, serif", fontSize:"1.35rem", color:"#E8D9B5", letterSpacing:"0.04em" },
    logoSpan:   { color:"#7A9E7E", fontStyle:"italic" },
    logoFork:   { fontSize:"1.1rem", marginRight:6 },
    locPill:    { background:"rgba(255,255,255,0.12)", color:"#E8D9B5", fontSize:"0.7rem", padding:"5px 10px", borderRadius:20, display:"flex", alignItems:"center", gap:4 },
    hero:       { background:"linear-gradient(155deg,#3D5A3E 0%,#2a3d2b 100%)", padding:"22px 18px 18px", position:"relative", overflow:"hidden" },
    heroLabel:  { fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#7A9E7E", marginBottom:3 },
    heroTitle:  { fontFamily:"Georgia, serif", fontSize:"1.75rem", color:"#F5F0E8", lineHeight:1.1, marginBottom:8 },
    heroTitleEm:{ color:"#D4A843", fontStyle:"italic" },
    heroDesc:   { fontSize:"0.77rem", color:"rgba(245,240,232,0.7)", lineHeight:1.5, maxWidth:280 },
    heroStats:  { display:"flex", gap:18, marginTop:16 },
    statNum:    { fontFamily:"Georgia, serif", fontSize:"1.4rem", color:"#D4A843", display:"block" },
    statLabel:  { fontSize:"0.6rem", color:"rgba(245,240,232,0.5)", letterSpacing:"0.08em", textTransform:"uppercase" },
    ecoBadge:   { position:"absolute", top:18, right:16, background:"rgba(122,158,126,0.22)", border:"1px solid rgba(122,158,126,0.4)", color:"#7A9E7E", fontSize:"0.62rem", fontWeight:700, padding:"5px 10px", borderRadius:20 },
    section:    { padding:"18px 18px 0" },
    secHeader:  { display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:12 },
    secTitle:   { fontFamily:"Georgia, serif", fontSize:"1.05rem", color:"#2C1F0E" },
    seeAll:     { fontSize:"0.68rem", color:"#C4622D", fontWeight:600, cursor:"pointer" },
    produitsRow:{ display:"flex", gap:10, overflowX:"auto", paddingBottom:10, scrollbarWidth:"none" },
    prodCard:   (a) => ({ minWidth:105, background:a?"#3D5A3E":"white", border:`2px solid ${a?"#3D5A3E":"transparent"}`, borderRadius:14, padding:"12px 10px", cursor:"pointer", textAlign:"center", boxShadow:"0 2px 8px rgba(44,31,14,0.06)", transition:"all 0.18s", flexShrink:0 }),
    prodEmoji:  { fontSize:"1.9rem", display:"block", marginBottom:5 },
    prodName:   (a) => ({ fontWeight:600, fontSize:"0.75rem", color:a?"white":"#2C1F0E", display:"block" }),
    prodOrigin: (a) => ({ fontSize:"0.6rem", color:a?"rgba(255,255,255,0.65)":"#6B5B3E", display:"block", marginTop:2 }),
    prodSeason: (a) => ({ display:"inline-block", marginTop:5, fontSize:"0.58rem", fontWeight:700, background:a?"rgba(255,255,255,0.15)":"#E8D9B5", color:a?"white":"#C4622D", padding:"2px 7px", borderRadius:10 }),
    panel:      { margin:"14px 18px 0", background:"white", borderRadius:18, overflow:"hidden", boxShadow:"0 4px 20px rgba(44,31,14,0.08)" },
    panelHero:  { background:"linear-gradient(135deg,#3D5A3E,#2a3d2b)", padding:"18px", display:"flex", alignItems:"center", gap:14 },
    panelEmoji: { fontSize:"3.2rem" },
    panelName:  { fontFamily:"Georgia, serif", fontSize:"1.35rem", color:"#F5F0E8" },
    panelSub:   { fontSize:"0.7rem", color:"rgba(245,240,232,0.65)", marginTop:2 },
    panelEco:   { marginTop:7, fontSize:"0.63rem", color:"#7A9E7E", fontWeight:500 },
    tabs:       { display:"flex", borderBottom:"1px solid #E8D9B5", background:"white", overflowX:"auto" },
    tab:        (a) => ({ flex:1, minWidth:70, padding:"11px 4px", textAlign:"center", fontSize:"0.63rem", fontWeight:700, color:a?"#3D5A3E":"#6B5B3E", cursor:"pointer", borderBottom:`2px solid ${a?"#3D5A3E":"transparent"}`, transition:"all 0.18s", whiteSpace:"nowrap" }),
    tabContent: { padding:14 },
    pillRow:    { display:"flex", gap:7, overflowX:"auto", paddingBottom:4, marginBottom:12, scrollbarWidth:"none" },
    pill:       (a) => ({ whiteSpace:"nowrap", fontSize:"0.66rem", fontWeight:500, padding:"5px 11px", borderRadius:20, border:`1.5px solid ${a?"#2C1F0E":"#E8D9B5"}`, background:a?"#2C1F0E":"white", color:a?"#E8D9B5":"#6B5B3E", cursor:"pointer", flexShrink:0 }),
    restoItem:  { display:"flex", alignItems:"center", gap:11, padding:"10px 0" },
    restoAvatar:(bg) => ({ width:42, height:42, borderRadius:11, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", flexShrink:0 }),
    restoName:  { fontWeight:700, fontSize:"0.8rem", color:"#2C1F0E" },
    restoMeta:  { fontSize:"0.66rem", color:"#6B5B3E", marginTop:2 },
    restoTags:  { display:"flex", gap:4, marginTop:4, flexWrap:"wrap" },
    tag:        (cls) => ({ fontSize:"0.57rem", padding:"2px 6px", borderRadius:7, fontWeight:600, ...TAG_STYLES[cls] }),
    restoRight: { textAlign:"right", flexShrink:0, marginLeft:"auto" },
    restoDist:  { fontSize:"0.63rem", color:"#6B5B3E" },
    restoPrice: { fontSize:"0.7rem", fontWeight:700, color:"#2C1F0E", marginTop:2 },
    resaBtn:    { marginTop:4, background:"#3D5A3E", color:"white", fontSize:"0.58rem", fontWeight:700, padding:"3px 8px", borderRadius:8, border:"none", cursor:"pointer" },
    recItem:    { display:"flex", gap:11, padding:"10px 0", cursor:"pointer" },
    recImg:     (bg) => ({ width:58, height:58, borderRadius:11, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.7rem", flexShrink:0 }),
    recName:    { fontWeight:700, fontSize:"0.8rem", color:"#2C1F0E" },
    recMeta:    { fontSize:"0.66rem", color:"#6B5B3E", marginTop:2 },
    diffRow:    { display:"flex", gap:3, marginTop:5 },
    dot:        (f) => ({ width:6, height:6, borderRadius:"50%", background:f?"#C4622D":"#E8D9B5" }),
    adrItem:    { display:"flex", gap:11, padding:"10px 0", alignItems:"flex-start" },
    adrIcon:    { width:38, height:38, borderRadius:10, background:"#E8D9B5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.15rem", flexShrink:0 },
    adrName:    { fontWeight:700, fontSize:"0.8rem", color:"#2C1F0E" },
    adrType:    { fontSize:"0.63rem", color:"#C4622D", fontWeight:600, marginTop:1 },
    adrRue:     { fontSize:"0.63rem", color:"#6B5B3E", marginTop:2 },
    adrHoraires:{ fontSize:"0.6rem", color:"#3D5A3E", marginTop:2, fontWeight:600 },
    trendGrid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
    trendCard:  (f) => ({ background:f?"linear-gradient(135deg,#2C1F0E,#3d2a10)":"white", borderRadius:16, padding:14, cursor:"pointer", boxShadow:"0 2px 8px rgba(44,31,14,0.07)" }),
    trendEmoji: { fontSize:"1.5rem", marginBottom:5 },
    trendLabel: (f) => ({ fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:f?"#D4A843":"#C4622D", marginBottom:3 }),
    trendName:  (f) => ({ fontFamily:"Georgia, serif", fontSize:"0.92rem", color:f?"#E8D9B5":"#2C1F0E", lineHeight:1.2 }),
    trendSub:   (f) => ({ fontSize:"0.63rem", color:f?"rgba(245,240,232,0.5)":"#6B5B3E", marginTop:4 }),
    ecoBlock:   { margin:"18px 18px 0", background:"linear-gradient(135deg,#3D5A3E,#2d4a2e)", borderRadius:18, padding:18 },
    ecoTitle:   { fontFamily:"Georgia, serif", fontSize:"1rem", color:"#E8D9B5", marginBottom:3 },
    ecoSub:     { fontSize:"0.68rem", color:"rgba(245,240,232,0.55)", marginBottom:14 },
    ecoBarRow:  { display:"flex", alignItems:"center", gap:8, marginBottom:8 },
    ecoBarLabel:{ fontSize:"0.63rem", color:"rgba(245,240,232,0.7)", width:80, flexShrink:0 },
    ecoBarTrack:{ flex:1, height:5, background:"rgba(255,255,255,0.1)", borderRadius:10, overflow:"hidden" },
    ecoBarFill: (pct) => ({ height:"100%", width:`${pct}%`, background:"#7A9E7E", borderRadius:10 }),
    ecoBarVal:  { fontSize:"0.63rem", fontWeight:700, color:"#7A9E7E", width:24, textAlign:"right", flexShrink:0 },
    nav:        { background:"white", borderTop:"1px solid #E8D9B5", display:"flex", padding:"8px 0 6px", marginTop:22, position:"sticky", bottom:0 },
    navItem:    (a) => ({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"3px 0" }),
    navIcon:    { fontSize:"1.2rem" },
    navLabel:   (a) => ({ fontSize:"0.57rem", fontWeight:600, color:a?"#3D5A3E":"#6B5B3E" }),
    divider:    { height:1, background:"#E8D9B5", margin:"18px 18px 0" },
    // Calendrier
    calStrip:   { display:"flex", gap:6, overflowX:"auto", paddingBottom:6, scrollbarWidth:"none" },
    calMois:    (a) => ({ minWidth:48, padding:"7px 4px", borderRadius:10, textAlign:"center", background:a?"#3D5A3E":"white", border:`1.5px solid ${a?"#3D5A3E":"#E8D9B5"}`, cursor:"pointer", flexShrink:0 }),
    calMoisLabel:(a)=>({ fontSize:"0.65rem", fontWeight:700, color:a?"white":"#6B5B3E", display:"block" }),
    calMoisDot: (a) => ({ width:5, height:5, borderRadius:"50%", background:a?"#D4A843":"#E8D9B5", margin:"4px auto 0" }),
    calProdGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:14 },
    calProdItem:{ background:"white", borderRadius:12, padding:"10px 12px", boxShadow:"0 2px 8px rgba(44,31,14,0.06)", display:"flex", alignItems:"center", gap:8 },
    calProdText:{ fontSize:"0.73rem", fontWeight:600, color:"#2C1F0E" },
    calWarning: { background:"#fef3e8", border:"1px solid #F5D9A0", borderRadius:12, padding:"10px 14px", marginTop:12, fontSize:"0.68rem", color:"#92600A", lineHeight:1.5 },
    // Badges
    badgeGrid:  { display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 },
    badgeCard:  (u) => ({ background:u?"white":"#F5F2EE", borderRadius:14, padding:"14px 8px", textAlign:"center", boxShadow:u?"0 2px 8px rgba(44,31,14,0.07)":"none", opacity:u?1:0.6 }),
    badgeEmoji: (u) => ({ fontSize:"2rem", display:"block", filter:u?"none":"grayscale(1)" }),
    badgeName:  { fontSize:"0.68rem", fontWeight:700, color:"#2C1F0E", marginTop:6, display:"block" },
    badgeDesc:  { fontSize:"0.57rem", color:"#6B5B3E", marginTop:3, lineHeight:1.3 },
    badgeLock:  { fontSize:"0.65rem", display:"block", marginTop:4, color:"#aaa" },
    // Leaderboard
    boardItem:  (me) => ({ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:me?"linear-gradient(135deg,#3D5A3E,#2d4a2e)":"white", borderRadius:14, marginBottom:8, boxShadow:"0 2px 8px rgba(44,31,14,0.06)" }),
    boardRank:  (me) => ({ fontFamily:"Georgia, serif", fontSize:"1rem", fontWeight:700, color:me?"#D4A843":"#2C1F0E", width:22, flexShrink:0, textAlign:"center" }),
    boardAvatar:{ fontSize:"1.5rem", flexShrink:0 },
    boardName:  (me) => ({ fontWeight:700, fontSize:"0.8rem", color:me?"#E8D9B5":"#2C1F0E", flex:1 }),
    boardScore: (me) => ({ fontSize:"0.72rem", fontWeight:700, color:me?"#7A9E7E":"#3D5A3E" }),
    boardTrend: (me) => ({ fontSize:"0.75rem", color:me?"rgba(255,255,255,0.5)":"#aaa", marginLeft:4 }),
    boardBadge: { fontSize:"0.9rem" },
    // Profil producteur
    prodCard2:  { background:"white", borderRadius:16, overflow:"hidden", marginBottom:12, boxShadow:"0 2px 8px rgba(44,31,14,0.06)" },
    prodHeader: (bg) => ({ background:bg, padding:"14px", display:"flex", alignItems:"center", gap:12 }),
    prodAva:    { fontSize:"2.2rem" },
    prodPName:  { fontWeight:700, fontSize:"0.85rem", color:"#2C1F0E" },
    prodPLieu:  { fontSize:"0.63rem", color:"#6B5B3E", marginTop:2 },
    prodCertif: { display:"inline-block", fontSize:"0.57rem", fontWeight:700, background:"#3D5A3E", color:"white", padding:"2px 7px", borderRadius:8, marginTop:4 },
    prodBody:   { padding:"12px 14px" },
    prodPRow:   { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 },
    prodPLabel: { fontSize:"0.63rem", color:"#6B5B3E" },
    prodPVal:   { fontSize:"0.72rem", fontWeight:700, color:"#2C1F0E" },
    prodNote:   { display:"flex", alignItems:"center", gap:4 },
    prodNoteNum:{ fontFamily:"Georgia, serif", fontSize:"1.1rem", color:"#D4A843" },
    prodNoteAvis:{ fontSize:"0.6rem", color:"#6B5B3E" },
    contactBtn: { width:"100%", background:"#3D5A3E", color:"white", border:"none", borderRadius:10, padding:"9px", fontSize:"0.72rem", fontWeight:700, cursor:"pointer", marginTop:4 },
    // Profil perso
    profilHero: { background:"linear-gradient(135deg,#2C1F0E,#3d2a10)", padding:"24px 18px", textAlign:"center" },
    profilAva:  { fontSize:"3.5rem", display:"block" },
    profilName: { fontFamily:"Georgia, serif", fontSize:"1.2rem", color:"#E8D9B5", marginTop:8 },
    profilSub:  { fontSize:"0.68rem", color:"rgba(245,240,232,0.55)", marginTop:4 },
    profilScore:{ display:"inline-block", background:"#3D5A3E", color:"#D4A843", fontFamily:"Georgia, serif", fontSize:"1.1rem", fontWeight:700, padding:"6px 18px", borderRadius:20, marginTop:12 },
  };

  const restoPills = ["Tous","Bistrots","Gastro","Végé","< 15€"];
  const recPills   = ["Toutes","Rapide","Facile","Chef","Végé"];
  const adrPills   = ["Tout Lyon","Marchés","Épiceries","Producteurs","AMAP"];
  const navItems   = [["🌿","saisons","Saisons"],["📅","carte","Calendrier"],["👨‍🍳","recettes","Recettes"],["🏆","adresses","Classement"],["👤","profil","Profil"]];

  return (
    <div style={s.page}>

      {/* HEADER */}
      <div style={s.header}>
        <div style={s.logo}>Ra<span style={s.logoSpan}>cines</span></div>
        <div style={s.locPill}>📍 Lyon</div>
      </div>

      {/* PAGE SAISONS */}
      {activePage === "saisons" && <>
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
          <div style={s.tabs}>
            {[["restos","🍽 Restos"],["recettes","👨‍🍳 Recettes"],["adresses","🏪 Adresses"],["producteurs","👨‍🌾 Producteurs"]].map(([id,label]) => (
              <div key={id} style={s.tab(activeTab===id)} onClick={() => setActiveTab(id)}>{label}</div>
            ))}
          </div>
          <div style={s.tabContent}>
            {activeTab === "restos" && <>
              <div style={s.pillRow}>{restoPills.map(f => <span key={f} style={s.pill(restoFilter===f)} onClick={() => setRestoFilter(f)}>{f}</span>)}</div>
              {RESTOS.map((r,i) => (
                <div key={i} style={{ ...s.restoItem, borderBottom: i<RESTOS.length-1?"1px solid #E8D9B5":"none" }}>
                  <div style={s.restoAvatar(r.bg)}>{r.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={s.restoName}>{r.name}</div>
                    <div style={s.restoMeta}>{r.type}</div>
                    <div style={s.restoTags}>{r.tags.map(t => <span key={t.label} style={s.tag(t.cls)}>{t.label}</span>)}</div>
                  </div>
                  <div style={s.restoRight}>
                    <div style={s.restoDist}>{r.dist}</div>
                    <div style={s.restoPrice}>{r.price}</div>
                    <button style={s.resaBtn}>Réserver</button>
                  </div>
                </div>
              ))}
            </>}
            {activeTab === "recettes" && <>
              <div style={s.pillRow}>{recPills.map(f => <span key={f} style={s.pill(recetteFilter===f)} onClick={() => setRecetteFilter(f)}>{f}</span>)}</div>
              {RECETTES.map((r,i) => (
                <div key={i} style={{ ...s.recItem, borderBottom: i<RECETTES.length-1?"1px solid #E8D9B5":"none" }}>
                  <div style={s.recImg(r.bg)}>{r.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={s.recName}>{r.name}</div>
                    <div style={s.recMeta}>{r.meta}</div>
                    <div style={s.diffRow}>{[1,2,3].map(d => <div key={d} style={s.dot(d<=r.diff)} />)}</div>
                  </div>
                </div>
              ))}
            </>}
            {activeTab === "adresses" && <>
              <div style={s.pillRow}>{adrPills.map(f => <span key={f} style={s.pill(adresseFilter===f)} onClick={() => setAdresseFilter(f)}>{f}</span>)}</div>
              {ADRESSES.map((a,i) => (
                <div key={i} style={{ ...s.adrItem, borderBottom: i<ADRESSES.length-1?"1px solid #E8D9B5":"none" }}>
                  <div style={s.adrIcon}>{a.icon}</div>
                  <div>
                    <div style={s.adrName}>{a.name}</div>
                    <div style={s.adrType}>{a.type}</div>
                    <div style={s.adrRue}>{a.rue}</div>
                    <div style={s.adrHoraires}>{a.horaires}</div>
                  </div>
                </div>
              ))}
            </>}
            {activeTab === "producteurs" && <>
              {PRODUCTEURS.map((pr,i) => (
                <div key={i} style={{ ...s.adrItem, borderBottom: i<PRODUCTEURS.length-1?"1px solid #E8D9B5":"none" }}>
                  <div style={{ ...s.restoAvatar(pr.bg), fontSize:"1.6rem" }}>{pr.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={s.restoName}>{pr.name}</div>
                    <div style={s.restoMeta}>{pr.lieu} · {pr.type}</div>
                    <div style={{ fontSize:"0.6rem", color:"#3D5A3E", marginTop:3, fontWeight:600 }}>{pr.produits}</div>
                  </div>
                  <div style={s.restoRight}>
                    <div style={{ fontSize:"0.7rem", fontWeight:700, color:"#D4A843" }}>⭐ {pr.note}</div>
                    <div style={s.restoDist}>{pr.nbAvis} avis</div>
                    <button style={s.resaBtn}>Contacter</button>
                  </div>
                </div>
              ))}
            </>}
          </div>
        </div>

        {/* TRENDING */}
        <div style={s.divider} />
        <div style={{ ...s.section, paddingTop:18 }}>
          <div style={s.secHeader}>
            <div style={s.secTitle}>Tendances à Lyon</div>
            <span style={s.seeAll}>Explorer →</span>
          </div>
          <div style={s.trendGrid}>
            <div style={{ ...s.trendCard(true), gridRow:"span 2" }}>
              <div style={s.trendEmoji}>🍷</div>
              <div style={s.trendLabel(true)}>Saison prochaine</div>
              <div style={s.trendName(true)}>Beaujolais nouveau 2026</div>
              <div style={s.trendSub(true)}>Dans 4 mois · 38 caves partenaires</div>
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
          {[["Km parcourus",85,"A+"],["Local < 100km",70,"A"],["Saisonnalité",92,"A+"],["Anti-gaspi",55,"B+"]].map(([label,pct,val]) => (
            <div key={label} style={s.ecoBarRow}>
              <div style={s.ecoBarLabel}>{label}</div>
              <div style={s.ecoBarTrack}><div style={s.ecoBarFill(pct)} /></div>
              <div style={s.ecoBarVal}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ height:20 }} />
      </>}

      {/* PAGE CALENDRIER */}
      {activePage === "carte" && <>
        <div style={s.hero}>
          <div style={s.heroLabel}>Calendrier des saisons</div>
          <div style={s.heroTitle}>Manger <em style={s.heroTitleEm}>vraiment</em> local</div>
          <div style={s.heroDesc}>Sélectionne un mois pour voir ce qui est vraiment de saison — et éviter les faux "produits locaux".</div>
          <div style={s.ecoBadge}>🛡 Anti-greenwashing</div>
        </div>

        <div style={s.section}>
          <div style={s.calStrip}>
            {MOIS.map((m,i) => (
              <div key={i} style={s.calMois(activeMois===i)} onClick={() => setActiveMois(i)}>
                <span style={s.calMoisLabel(activeMois===i)}>{m}</span>
                <div style={s.calMoisDot(activeMois===i)} />
              </div>
            ))}
          </div>

          <div style={{ marginTop:18 }}>
            <div style={s.secHeader}>
              <div style={s.secTitle}>Produits de {MOIS[activeMois]}</div>
              <span style={{ fontSize:"0.63rem", background:"#3D5A3E", color:"white", padding:"3px 8px", borderRadius:8, fontWeight:600 }}>✓ Certifié saison</span>
            </div>
            <div style={s.calProdGrid}>
              {CALENDRIER[activeMois].map((prod,i) => (
                <div key={i} style={s.calProdItem}>
                  <span style={{ fontSize:"1.3rem" }}>{prod.split(" ")[0]}</span>
                  <span style={s.calProdText}>{prod.split(" ").slice(1).join(" ")}</span>
                </div>
              ))}
            </div>
            <div style={s.calWarning}>
              ⚠️ <strong>Méfie-toi des étiquettes "local"</strong> — un produit hors saison cultivé sous serre chauffée n'est pas éco-responsable, même s'il vient de France.
            </div>
          </div>

          <div style={{ marginTop:18 }}>
            <div style={s.secTitle}>Producteurs qui livrent en {MOIS[activeMois]}</div>
            <div style={{ marginTop:12 }}>
              {PRODUCTEURS.map((pr,i) => (
                <div key={i} style={s.prodCard2}>
                  <div style={s.prodHeader(pr.bg)}>
                    <div style={s.prodAva}>{pr.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={s.prodPName}>{pr.name}</div>
                      <div style={s.prodPLieu}>📍 {pr.lieu}</div>
                      <span style={s.prodCertif}>{pr.certif}</span>
                    </div>
                    <div style={s.prodNote}>
                      <span style={s.prodNoteNum}>⭐ {pr.note}</span>
                      <span style={s.prodNoteAvis}>{pr.nbAvis} avis</span>
                    </div>
                  </div>
                  <div style={s.prodBody}>
                    <div style={s.prodPRow}>
                      <span style={s.prodPLabel}>Produits</span>
                      <span style={s.prodPVal}>{pr.produits}</span>
                    </div>
                    <div style={s.prodPRow}>
                      <span style={s.prodPLabel}>Disponibilité</span>
                      <span style={{ ...s.prodPVal, color:"#3D5A3E" }}>{pr.dispo}</span>
                    </div>
                    <button style={s.contactBtn}>📩 Contacter le producteur</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height:20 }} />
      </>}

      {/* PAGE RECETTES */}
      {activePage === "recettes" && <>
        <div style={s.hero}>
          <div style={s.heroLabel}>Recettes de saison</div>
          <div style={s.heroTitle}>Cuisiner <em style={s.heroTitleEm}>ce que la terre donne</em></div>
          <div style={s.heroDesc}>Des idées simples et savoureuses avec les produits du moment.</div>
        </div>
        <div style={s.section}>
          <div style={s.pillRow}>{recPills.map(f => <span key={f} style={s.pill(recetteFilter===f)} onClick={() => setRecetteFilter(f)}>{f}</span>)}</div>
          {RECETTES.map((r,i) => (
            <div key={i} style={{ ...s.recItem, borderBottom: i<RECETTES.length-1?"1px solid #E8D9B5":"none" }}>
              <div style={s.recImg(r.bg)}>{r.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={s.recName}>{r.name}</div>
                <div style={s.recMeta}>{r.meta}</div>
                <div style={s.diffRow}>{[1,2,3].map(d => <div key={d} style={s.dot(d<=r.diff)} />)}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height:20 }} />
      </>}

      {/* PAGE CLASSEMENT */}
      {activePage === "adresses" && <>
        <div style={s.hero}>
          <div style={s.heroLabel}>Classement entre amis</div>
          <div style={s.heroTitle}>Qui est le plus <em style={s.heroTitleEm}>éco-friendly ?</em></div>
          <div style={s.heroDesc}>Gagne des points en consommant local et de saison. Défie tes amis !</div>
          <div style={s.ecoBadge}>🏆 Juin 2026</div>
        </div>

        <div style={s.section}>
          <div style={s.secHeader}>
            <div style={s.secTitle}>Tes badges</div>
            <span style={s.seeAll}>{BADGES.filter(b=>b.unlocked).length}/{BADGES.length} débloqués</span>
          </div>
          <div style={s.badgeGrid}>
            {BADGES.map((b,i) => (
              <div key={i} style={s.badgeCard(b.unlocked)}>
                <span style={s.badgeEmoji(b.unlocked)}>{b.emoji}</span>
                <span style={s.badgeName}>{b.name}</span>
                <span style={s.badgeDesc}>{b.desc}</span>
                {!b.unlocked && <span style={s.badgeLock}>🔒</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...s.section, paddingTop:18 }}>
          <div style={s.secHeader}>
            <div style={s.secTitle}>Classement · Juin</div>
            <span style={s.seeAll}>Inviter →</span>
          </div>
          {AMIS.map((a,i) => (
            <div key={i} style={s.boardItem(a.isMe)}>
              <span style={s.boardRank(a.isMe)}>{a.rank}</span>
              <span style={s.boardAvatar}>{a.avatar}</span>
              <span style={s.boardName(a.isMe)}>{a.name}{a.isMe ? " (moi)" : ""}</span>
              <span style={s.boardScore(a.isMe)}>{a.score} pts</span>
              <span style={s.boardTrend(a.isMe)}>{a.trend}</span>
              {a.badge && <span style={s.boardBadge}>{a.badge}</span>}
            </div>
          ))}
          <div style={{ background:"#F5F2EE", borderRadius:14, padding:"12px 14px", marginTop:4, fontSize:"0.68rem", color:"#6B5B3E", textAlign:"center" }}>
            +2 places ce mois · Continue comme ça ! 🌱
          </div>
        </div>
        <div style={{ height:20 }} />
      </>}

      {/* PAGE PROFIL */}
      {activePage === "profil" && <>
        <div style={s.profilHero}>
          <span style={s.profilAva}>👤</span>
          <div style={s.profilName}>Mon profil</div>
          <div style={s.profilSub}>Consommateur local · Lyon · Membre depuis mai 2026</div>
          <div style={s.profilScore}>🌿 1 980 pts · Rang #3</div>
        </div>

        <div style={s.section}>
          <div style={s.secTitle}>Mon impact</div>
          <div style={{ ...s.ecoBlock, margin:"12px 0 0" }}>
            <div style={s.ecoSub}>Basé sur tes visites et achats déclarés</div>
            {[["Km parcourus",85,"A+"],["Local < 100km",70,"A"],["Saisonnalité",92,"A+"],["Anti-gaspi",55,"B+"]].map(([label,pct,val]) => (
              <div key={label} style={s.ecoBarRow}>
                <div style={s.ecoBarLabel}>{label}</div>
                <div style={s.ecoBarTrack}><div style={s.ecoBarFill(pct)} /></div>
                <div style={s.ecoBarVal}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...s.section, paddingTop:18 }}>
          <div style={s.secTitle}>Mes badges</div>
          <div style={{ ...s.badgeGrid, marginTop:12 }}>
            {BADGES.map((b,i) => (
              <div key={i} style={s.badgeCard(b.unlocked)}>
                <span style={s.badgeEmoji(b.unlocked)}>{b.emoji}</span>
                <span style={s.badgeName}>{b.name}</span>
                {!b.unlocked && <span style={s.badgeLock}>🔒</span>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:20 }} />
      </>}

      {/* BOTTOM NAV */}
      <div style={s.nav}>
        {navItems.map(([icon,page,label]) => (
          <div key={page} style={s.navItem(activePage===page)} onClick={() => setActivePage(page)}>
            <div style={s.navIcon}>{icon}</div>
            <div style={s.navLabel(activePage===page)}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
