import { useState } from "react";

const PRODUITS = [
  { id:1, nom:"Tomate cerise",   emoji:"🍅", producteur:"Michel — Drôme",             prix:2.90, unite:"500g",    bio:true  },
  { id:2, nom:"Courgette",       emoji:"🥒", producteur:"Ferme Dupont — Ain",          prix:1.50, unite:"pièce",  bio:false },
  { id:3, nom:"Pêche",           emoji:"🍑", producteur:"Vergers Martin — Ardèche",    prix:3.20, unite:"kg",     bio:true  },
  { id:4, nom:"Basilic",         emoji:"🌿", producteur:"Les Serres du Rhône",         prix:1.20, unite:"bouquet",bio:true  },
  { id:5, nom:"Saint-Marcellin", emoji:"🧀", producteur:"Fromagerie Besson — Isère",   prix:2.40, unite:"pièce",  bio:false },
  { id:6, nom:"Salade verte",    emoji:"🥬", producteur:"Michel — Drôme",             prix:1.00, unite:"pièce",  bio:true  },
];

const PRODUITS_FLASH = [
  { id:7, nom:"Tomates rondes (surplus)", emoji:"🍅", producteur:"Michel — Drôme", prix:1.20, prixOriginal:2.50, unite:"kg", bio:true, stock:8 },
];

const POINTS_COLLECTE = [
  { id:1, nom:"Place Carnot",          arrdt:"2e",  distance:"8 min",  statut:"En route",  heure:"18h22", places:12 },
  { id:2, nom:"Hôtel de Ville",        arrdt:"1er", distance:"12 min", statut:"Disponible",heure:"17h45", places:5  },
  { id:3, nom:"Croix-Rousse — Bd CR",  arrdt:"4e",  distance:"15 min", statut:"Disponible",heure:"19h00", places:20 },
  { id:4, nom:"Jean Macé",             arrdt:"7e",  distance:"18 min", statut:"Terminé",   heure:"16h30", places:0  },
];

const RECETTES = [
  { id:1, nom:"Gaspacho de tomates cerises",     produits:[1,4], temps:15, diff:1, veggie:true,  emoji:"🥗", bg:"#fef3e8" },
  { id:2, nom:"Tarte courgette-chèvre",           produits:[2],   temps:40, diff:2, veggie:true,  emoji:"🥧", bg:"#fce7e0" },
  { id:3, nom:"Carpaccio de pêches au basilic",   produits:[3,4], temps:10, diff:1, veggie:true,  emoji:"🍑", bg:"#e8f4ea" },
  { id:4, nom:"Salade estivale complète",         produits:[1,2,6],temps:20,diff:1, veggie:true,  emoji:"🥗", bg:"#f5f0e8" },
  { id:5, nom:"Risotto courgette & St-Marcellin", produits:[2,5], temps:35, diff:2, veggie:true,  emoji:"🍚", bg:"#fef3e8" },
];

const BADGES = [
  { id:1, nom:"Première Saison",      emoji:"🌱", desc:"1ère commande passée",        debloque:true  },
  { id:2, nom:"Locavore",             emoji:"📍", desc:"3 commandes consécutives",     debloque:true  },
  { id:3, nom:"Chef en herbe",        emoji:"👨‍🍳", desc:"5 recettes cuisinées",         debloque:false },
  { id:4, nom:"Anti-gaspi",           emoji:"♻️", desc:"2 paniers flash commandés",    debloque:false },
  { id:5, nom:"Passionné des Saisons",emoji:"🏆", desc:"6 mois de suite",              debloque:false },
  { id:6, nom:"Ambassadeur",          emoji:"🌟", desc:"5 amis parrainés",             debloque:false },
];

const AMIS = [
  { nom:"Lucas",  score:1240, rang:1, emoji:"🥇", moi:false },
  { nom:"Toi",    score:980,  rang:2, emoji:"🥈", moi:true  },
  { nom:"Emma",   score:820,  rang:3, emoji:"🥉", moi:false },
  { nom:"Thomas", score:650,  rang:4, emoji:"4️⃣", moi:false },
  { nom:"Sophie", score:430,  rang:5, emoji:"5️⃣", moi:false },
];

const MOIS_LABELS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];

const C = {
  soil:"#2C1F0E", moss:"#3D5A3E", sage:"#7A9E7E",
  cream:"#F5F0E8", wheat:"#E8D9B5", terracotta:"#C4622D",
  gold:"#D4A843", mist:"#F9F6F1",
};

export default function App() {
  const [activePage, setActivePage]       = useState("accueil");
  const [panier, setPanier]               = useState({});
  const [flashPanier, setFlashPanier]     = useState({});
  const [commandeStep, setCommandeStep]   = useState("selection");
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [commandePassee, setCommandePassee] = useState(false);
  const [recetteFilter, setRecetteFilter] = useState("Toutes");

  const totalItems = Object.values(panier).reduce((a,b)=>a+b,0)
    + Object.values(flashPanier).reduce((a,b)=>a+b,0);

  const totalPrix = Object.entries(panier).reduce((sum,[id,qty]) => {
    const p = PRODUITS.find(x=>x.id===+id);
    return sum + (p ? p.prix*qty : 0);
  }, 0) + Object.entries(flashPanier).reduce((sum,[id,qty]) => {
    const p = PRODUITS_FLASH.find(x=>x.id===+id);
    return sum + (p ? p.prix*qty : 0);
  }, 0);

  const addP   = (id) => setPanier(prev=>({...prev,[id]:(prev[id]||0)+1}));
  const removeP = (id) => setPanier(prev=>{ const n={...prev}; if(n[id]>1)n[id]--; else delete n[id]; return n; });
  const addF   = (id) => setFlashPanier(prev=>({...prev,[id]:(prev[id]||0)+1}));
  const removeF = (id) => setFlashPanier(prev=>{ const n={...prev}; if(n[id]>1)n[id]--; else delete n[id]; return n; });

  const produitIdSet = new Set(Object.keys(panier).map(Number));
  const recettesSuggerees = RECETTES.filter(r=>r.produits.some(pid=>produitIdSet.has(pid)));
  const produitsEnPanier = PRODUITS.filter(p=>panier[p.id]>0);
  const flashEnPanier = PRODUITS_FLASH.filter(p=>flashPanier[p.id]>0);

  const passerCommande = () => {
    setCommandePassee(true);
    setCommandeStep("suivi");
    setActivePage("accueil");
  };

  const recettesFiltrees = recetteFilter==="Mon panier" ? recettesSuggerees
    : recetteFilter==="Rapide" ? RECETTES.filter(r=>r.temps<=15)
    : recetteFilter==="Facile" ? RECETTES.filter(r=>r.diff===1)
    : recetteFilter==="Végé"   ? RECETTES.filter(r=>r.veggie)
    : RECETTES;

  const navItems = [["🌿","accueil","Accueil"],["🛒","commander","Commander"],["👨‍🍳","recettes","Recettes"],["🗺️","carte","Carte"],["🏆","profil","Profil"]];

  const statutColor = (s) => s==="En route"?"#FEF3E8" : s==="Disponible"?"#E8F4EA" : "#F5F2EE";
  const statutText  = (s) => s==="En route"?C.terracotta : s==="Disponible"?C.moss : "#999";
  const statutIcon  = (s) => s==="En route"?"🚛 " : s==="Disponible"?"✅ " : "❌ ";

  const stepLabel = {selection:"Choisir mes produits",recap:"Mon panier",collecte:"Point de collecte",confirmation:"Confirmation",suivi:"Suivi commande"};

  const ss = {
    page:       { fontFamily:"'DM Sans',Calibri,sans-serif", background:C.mist, color:C.soil, maxWidth:430, margin:"0 auto", minHeight:"100vh" },
    header:     { background:C.soil, padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 },
    logo:       { fontFamily:"Georgia,Cambria,serif", fontSize:"1.35rem", color:C.wheat, letterSpacing:"0.04em" },
    logoEm:     { color:C.sage, fontStyle:"italic" },
    locPill:    { background:"rgba(255,255,255,0.12)", color:C.wheat, fontSize:"0.7rem", padding:"5px 10px", borderRadius:20 },
    panierBadge:{ background:C.terracotta, color:"white", fontSize:"0.65rem", fontWeight:700, padding:"4px 9px", borderRadius:20, cursor:"pointer" },
    hero:       { background:`linear-gradient(155deg,${C.moss} 0%,#2a3d2b 100%)`, padding:"22px 18px 18px", position:"relative", overflow:"hidden" },
    heroLabel:  { fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:C.sage, marginBottom:3 },
    heroTitle:  { fontFamily:"Georgia,Cambria,serif", fontSize:"1.75rem", color:C.cream, lineHeight:1.1, marginBottom:8 },
    heroEm:     { color:C.gold, fontStyle:"italic" },
    heroDesc:   { fontSize:"0.77rem", color:"rgba(245,240,232,0.7)", lineHeight:1.5, maxWidth:280 },
    heroCTA:    { marginTop:16, background:C.gold, color:C.soil, fontSize:"0.8rem", fontWeight:700, padding:"11px 20px", borderRadius:25, border:"none", cursor:"pointer" },
    ecoBadge:   { position:"absolute", top:18, right:16, background:"rgba(122,158,126,0.22)", border:"1px solid rgba(122,158,126,0.4)", color:C.sage, fontSize:"0.62rem", fontWeight:700, padding:"5px 10px", borderRadius:20 },
    sec:        { padding:"18px 18px 0" },
    secH:       { display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:12 },
    secTitle:   { fontFamily:"Georgia,Cambria,serif", fontSize:"1.05rem", color:C.soil },
    seeAll:     { fontSize:"0.68rem", color:C.terracotta, fontWeight:600, cursor:"pointer" },
    divider:    { height:1, background:C.wheat, margin:"18px 18px 0" },
    card:       { background:"white", borderRadius:16, padding:"14px 16px", boxShadow:"0 2px 12px rgba(44,31,14,0.07)", marginBottom:10 },
    ctaBtn:     (off) => ({ width:"100%", background:off?"#ccc":C.moss, color:"white", fontSize:"0.85rem", fontWeight:700, padding:"14px", borderRadius:14, border:"none", cursor:off?"not-allowed":"pointer" }),
    ctaSec:     { width:"100%", background:"transparent", color:C.moss, fontSize:"0.78rem", fontWeight:600, padding:"10px", borderRadius:14, border:`1.5px solid ${C.moss}`, cursor:"pointer", marginTop:8 },
    pill:       (a) => ({ whiteSpace:"nowrap", fontSize:"0.66rem", fontWeight:500, padding:"5px 11px", borderRadius:20, border:`1.5px solid ${a?C.soil:C.wheat}`, background:a?C.soil:"white", color:a?C.cream:"#6B5B3E", cursor:"pointer", flexShrink:0 }),
    pillRow:    { display:"flex", gap:7, overflowX:"auto", paddingBottom:4, marginBottom:14, scrollbarWidth:"none" },
    ecoBlock:   { background:`linear-gradient(135deg,${C.moss},#2d4a2e)`, borderRadius:18, padding:18 },
    ecoBarRow:  { display:"flex", alignItems:"center", gap:8, marginBottom:8 },
    ecoBarLabel:{ fontSize:"0.63rem", color:"rgba(245,240,232,0.7)", width:80, flexShrink:0 },
    ecoBarTrack:{ flex:1, height:5, background:"rgba(255,255,255,0.1)", borderRadius:10, overflow:"hidden" },
    ecoBarFill: (p) => ({ height:"100%", width:`${p}%`, background:C.sage, borderRadius:10 }),
    ecoBarVal:  { fontSize:"0.63rem", fontWeight:700, color:C.sage, width:24, textAlign:"right" },
    nav:        { background:"white", borderTop:`1px solid ${C.wheat}`, display:"flex", padding:"8px 0 6px", position:"sticky", bottom:0, zIndex:100 },
    navItem:    (a) => ({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"3px 0", position:"relative" }),
    navLabel:   (a) => ({ fontSize:"0.57rem", fontWeight:600, color:a?C.moss:"#6B5B3E" }),
    navBadge:   { position:"absolute", top:-2, right:"14%", background:C.terracotta, color:"white", fontSize:"0.5rem", fontWeight:700, padding:"1px 5px", borderRadius:10 },
  };

  return (
    <div style={ss.page}>

      {/* HEADER */}
      <div style={ss.header}>
        <div style={ss.logo}>Ra<span style={ss.logoEm}>cines</span></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={ss.locPill}>📍 Lyon</div>
          {totalItems>0 && <div style={ss.panierBadge} onClick={()=>{setActivePage("commander");setCommandeStep("recap")}}>🛒 {totalItems}</div>}
        </div>
      </div>

      {/* ── ACCUEIL ── */}
      {activePage==="accueil" && <>
        <div style={ss.hero}>
          <div style={ss.heroLabel}>Juin 2026 · Tournée de Sève</div>
          <div style={ss.heroTitle}>Produit du mois :<br/><em style={ss.heroEm}>la tomate cerise</em></div>
          <div style={ss.heroDesc}>Récoltée hier par Michel en Drôme. En route pour Lyon ce soir.</div>
          <button style={ss.heroCTA} onClick={()=>setActivePage("commander")}>Commander mon panier →</button>
          <div style={ss.ecoBadge}>🚛 Tournée de Sève</div>
        </div>

        {/* TRACKER */}
        {commandePassee && (
          <div style={ss.sec}>
            <div style={{background:`linear-gradient(135deg,${C.soil},#3d2a10)`,borderRadius:16,padding:"14px 16px"}}>
              <div style={{fontSize:"0.62rem",color:C.gold,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>🚛 Ton panier est en route</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:"0.95rem",color:C.cream,lineHeight:1.4}}>Michel charge à Loriol — <strong style={{color:C.gold}}>arrivée 18h22</strong> point Carnot</div>
              <div style={{fontSize:"0.63rem",color:"rgba(245,240,232,0.5)",marginTop:4}}>Place Carnot · 2e arr · 8 min à pied</div>
            </div>
          </div>
        )}

        {/* PANIER FLASH */}
        <div style={ss.sec}>
          <div style={ss.secH}>
            <div style={ss.secTitle}>⚡ Panier flash du jour</div>
            <span style={{fontSize:"0.63rem",background:C.terracotta,color:"white",padding:"3px 8px",borderRadius:8,fontWeight:600}}>Anti-gaspi</span>
          </div>
          {PRODUITS_FLASH.map(p=>(
            <div key={p.id} style={{background:`linear-gradient(135deg,${C.terracotta},#a84e22)`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <div style={{fontSize:"2.2rem",flexShrink:0}}>{p.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:"0.95rem",color:"white",fontWeight:700}}>{p.nom}</div>
                <div style={{fontSize:"0.63rem",color:"rgba(255,255,255,0.65)",marginTop:2}}>{p.producteur}</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                  <span style={{fontSize:"1rem",fontWeight:700,color:"white"}}>{p.prix.toFixed(2)}€</span>
                  <span style={{fontSize:"0.63rem",color:"rgba(255,255,255,0.5)"}}>/{p.unite}</span>
                  <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.45)",textDecoration:"line-through"}}>{p.prixOriginal.toFixed(2)}€</span>
                </div>
                <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.45)",marginTop:2}}>Plus que {p.stock} en stock</div>
              </div>
              <button style={{background:"white",color:C.terracotta,fontSize:"0.72rem",fontWeight:700,padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",flexShrink:0}} onClick={()=>setActivePage("commander")}>J'en veux !</button>
            </div>
          ))}
        </div>

        {/* PROCHAINE TOURNÉE */}
        <div style={ss.sec}>
          <div style={ss.secH}>
            <div style={ss.secTitle}>Prochaine tournée</div>
            <span style={ss.seeAll} onClick={()=>setActivePage("carte")}>Voir la carte →</span>
          </div>
          {POINTS_COLLECTE.filter(p=>p.statut!=="Terminé").slice(0,2).map(pt=>(
            <div key={pt.id} style={ss.card}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:36,height:36,borderRadius:10,background:"#E8F4EA",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>🚛</div>
                <div>
                  <div style={{fontSize:"0.75rem",fontWeight:700,color:C.soil}}>{pt.nom} · {pt.arrdt}</div>
                  <div style={{fontSize:"0.63rem",color:"#6B5B3E",marginTop:2}}>à {pt.distance} à pied · {pt.places} places</div>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:"0.65rem",fontWeight:700,padding:"4px 10px",borderRadius:20,background:statutColor(pt.statut),color:statutText(pt.statut)}}>{statutIcon(pt.statut)}{pt.statut}</span>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:"0.85rem",fontWeight:700,color:C.soil}}>{pt.heure}</div>
                  <div style={{fontSize:"0.63rem",color:"#6B5B3E"}}>aujourd'hui</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SCORE ECO */}
        <div style={{...ss.sec,paddingTop:18}}>
          <div style={{...ss.ecoBlock}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",color:C.cream,marginBottom:3}}>Ton impact ce mois-ci 🌱</div>
            <div style={{fontSize:"0.68rem",color:"rgba(245,240,232,0.55)",marginBottom:14}}>Basé sur tes commandes</div>
            {[["Local < 100km",85,"A+"],["Saisonnalité",92,"A+"],["Anti-gaspi",55,"B+"]].map(([l,p,v])=>(
              <div key={l} style={ss.ecoBarRow}>
                <div style={ss.ecoBarLabel}>{l}</div>
                <div style={ss.ecoBarTrack}><div style={ss.ecoBarFill(p)}/></div>
                <div style={ss.ecoBarVal}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{height:20}}/>
      </>}

      {/* ── COMMANDER ── */}
      {activePage==="commander" && <>
        <div style={{background:C.moss,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
          {commandeStep!=="selection" && commandeStep!=="suivi" && (
            <button onClick={()=>{
              if(commandeStep==="recap")setCommandeStep("selection");
              else if(commandeStep==="collecte")setCommandeStep("recap");
              else if(commandeStep==="confirmation")setCommandeStep("collecte");
            }} style={{background:"none",border:"none",color:"white",fontSize:"1.2rem",cursor:"pointer",padding:0}}>←</button>
          )}
          <div style={{fontFamily:"Georgia,serif",fontSize:"1rem",color:C.cream,flex:1}}>{stepLabel[commandeStep]}</div>
          {commandeStep==="selection" && totalItems>0 && (
            <button onClick={()=>setCommandeStep("recap")} style={{background:C.gold,color:C.soil,fontSize:"0.72rem",fontWeight:700,padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer"}}>
              Panier ({totalItems}) →
            </button>
          )}
        </div>

        {/* STEP SELECTION */}
        {commandeStep==="selection" && <>
          <div style={ss.sec}>
            <div style={{fontSize:"0.7rem",color:"#6B5B3E",marginBottom:14,lineHeight:1.5}}>Produits de saison · Récoltés dans un rayon de 100 km</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {PRODUITS.map(p=>{
                const qte = panier[p.id]||0;
                return (
                  <div key={p.id} style={{background:"white",borderRadius:16,padding:14,boxShadow:qte>0?`0 0 0 2px ${C.moss},0 4px 16px rgba(61,90,62,0.12)`:"0 2px 8px rgba(44,31,14,0.06)",position:"relative",transition:"all 0.18s"}}>
                    {p.bio && <div style={{position:"absolute",top:8,right:8,fontSize:"0.55rem",fontWeight:700,background:"#E8F4EA",color:C.moss,padding:"2px 6px",borderRadius:8}}>🌱 Bio</div>}
                    <div style={{fontSize:"2.5rem",textAlign:"center",marginBottom:6}}>{p.emoji}</div>
                    <div style={{fontWeight:700,fontSize:"0.8rem",color:C.soil,marginBottom:2}}>{p.nom}</div>
                    <div style={{fontSize:"0.6rem",color:"#6B5B3E",lineHeight:1.3,marginBottom:6}}>{p.producteur}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontFamily:"Georgia,serif",fontSize:"1rem",fontWeight:700,color:C.terracotta}}>{p.prix.toFixed(2)}€</span>
                      <span style={{fontSize:"0.57rem",color:"#6B5B3E"}}>/{p.unite}</span>
                    </div>
                    {qte===0 ? (
                      <button style={{width:"100%",marginTop:8,background:C.wheat,color:C.soil,fontSize:"0.7rem",fontWeight:700,padding:"7px 0",borderRadius:10,border:"none",cursor:"pointer"}} onClick={()=>addP(p.id)}>+ Ajouter</button>
                    ):(
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
                        <button style={{width:28,height:28,borderRadius:8,background:C.wheat,border:"none",fontSize:"1rem",cursor:"pointer"}} onClick={()=>removeP(p.id)}>−</button>
                        <span style={{fontWeight:700,fontSize:"0.9rem",color:C.soil}}>{qte}</span>
                        <button style={{width:28,height:28,borderRadius:8,background:C.wheat,border:"none",fontSize:"1rem",cursor:"pointer"}} onClick={()=>addP(p.id)}>+</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FLASH */}
            <div style={{...ss.secH,marginTop:20}}>
              <div style={ss.secTitle}>⚡ Invendus du jour</div>
              <span style={{fontSize:"0.63rem",background:C.terracotta,color:"white",padding:"3px 8px",borderRadius:8,fontWeight:600}}>-52%</span>
            </div>
            {PRODUITS_FLASH.map(p=>{
              const qte=flashPanier[p.id]||0;
              return (
                <div key={p.id} style={{background:`linear-gradient(135deg,${C.terracotta},#a84e22)`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <div style={{fontSize:"2rem",flexShrink:0}}>{p.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:"0.9rem",color:"white",fontWeight:700}}>{p.nom}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                      <span style={{fontSize:"0.95rem",fontWeight:700,color:"white"}}>{p.prix.toFixed(2)}€/{p.unite}</span>
                      <span style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.45)",textDecoration:"line-through"}}>{p.prixOriginal.toFixed(2)}€</span>
                    </div>
                  </div>
                  {qte===0 ? (
                    <button style={{background:"white",color:C.terracotta,fontSize:"0.7rem",fontWeight:700,padding:"7px 12px",borderRadius:20,border:"none",cursor:"pointer",flexShrink:0}} onClick={()=>addF(p.id)}>Ajouter</button>
                  ):(
                    <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                      <button style={{width:26,height:26,borderRadius:8,background:"rgba(255,255,255,0.2)",border:"none",color:"white",cursor:"pointer"}} onClick={()=>removeF(p.id)}>−</button>
                      <span style={{fontWeight:700,color:"white"}}>{qte}</span>
                      <button style={{width:26,height:26,borderRadius:8,background:"rgba(255,255,255,0.2)",border:"none",color:"white",cursor:"pointer"}} onClick={()=>addF(p.id)}>+</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {totalItems>0 && (
            <div style={{padding:"16px 18px"}}>
              <button style={ss.ctaBtn(false)} onClick={()=>setCommandeStep("recap")}>Voir mon panier · {totalPrix.toFixed(2)} € →</button>
            </div>
          )}
        </>}

        {/* STEP RECAP */}
        {commandeStep==="recap" && <>
          <div style={{padding:"18px 0 0"}}>
            <div style={{background:"white",borderRadius:18,margin:"0 18px",padding:16,boxShadow:"0 4px 20px rgba(44,31,14,0.08)"}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:"0.95rem",color:C.soil,marginBottom:12}}>Mon panier</div>
              {[...produitsEnPanier.map(p=>({...p,qte:panier[p.id]})),
                ...flashEnPanier.map(p=>({...p,qte:flashPanier[p.id],flash:true}))
              ].map((p,i,arr)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.wheat}`:"none"}}>
                  <div style={{fontSize:"1.5rem",width:36,textAlign:"center"}}>{p.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:"0.78rem",color:C.soil}}>{p.nom}</div>
                    <div style={{fontSize:"0.6rem",color:"#6B5B3E"}}>× {p.qte} {p.unite}{p.flash?" · ⚡ Flash":""}</div>
                  </div>
                  <div style={{fontSize:"0.75rem",fontWeight:700,color:C.terracotta}}>{(p.prix*p.qte).toFixed(2)} €</div>
                  <button onClick={()=>p.flash?removeF(p.id):removeP(p.id)} style={{background:"none",border:"none",color:"#ccc",fontSize:"1rem",cursor:"pointer",marginLeft:4}}>✕</button>
                </div>
              ))}
              <div style={{borderTop:`1px solid ${C.wheat}`,paddingTop:12,marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:"0.78rem",color:"#6B5B3E"}}>Total</span>
                <span style={{fontFamily:"Georgia,serif",fontSize:"1.3rem",fontWeight:700,color:C.soil}}>{totalPrix.toFixed(2)} €</span>
              </div>
              <div style={{fontSize:"0.62rem",color:"#6B5B3E",textAlign:"right",marginTop:4}}>Livraison incluse · Circuit court &lt; 100 km</div>
            </div>
            <div style={{padding:"14px 18px 0"}}>
              <button style={ss.ctaBtn(false)} onClick={()=>setCommandeStep("collecte")}>Choisir mon point de collecte →</button>
              <button style={ss.ctaSec} onClick={()=>setCommandeStep("selection")}>Modifier mon panier</button>
            </div>
          </div>
        </>}

        {/* STEP COLLECTE */}
        {commandeStep==="collecte" && <>
          <div style={ss.sec}>
            <div style={{fontSize:"0.72rem",color:"#6B5B3E",marginBottom:16,lineHeight:1.5}}>Choisis un point de collecte et récupère ton panier lors du passage de la tournée.</div>
            {POINTS_COLLECTE.map(pt=>{
              const sel=selectedPoint===pt.id;
              const disabled=pt.statut==="Terminé";
              return (
                <div key={pt.id}
                  onClick={()=>!disabled&&setSelectedPoint(pt.id)}
                  style={{background:sel?`linear-gradient(135deg,${C.moss},#2a3d2b)`:"white",borderRadius:14,padding:"14px 16px",marginBottom:10,boxShadow:"0 2px 8px rgba(44,31,14,0.06)",cursor:disabled?"not-allowed":"pointer",border:`2px solid ${sel?C.moss:"transparent"}`,opacity:disabled?0.5:1,transition:"all 0.18s"}}
                >
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:"0.85rem",color:sel?C.cream:C.soil}}>{pt.nom}</div>
                      <div style={{fontSize:"0.63rem",color:sel?"rgba(245,240,232,0.6)":"#6B5B3E",marginTop:2}}>{pt.arrdt} arr. · {pt.distance} à pied</div>
                    </div>
                    {sel && <span style={{fontSize:"1.2rem",color:C.gold}}>✓</span>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
                    <span style={{fontSize:"0.63rem",fontWeight:700,padding:"3px 9px",borderRadius:20,background:sel?"rgba(255,255,255,0.15)":statutColor(pt.statut),color:sel?C.cream:statutText(pt.statut)}}>{statutIcon(pt.statut)}{pt.statut}</span>
                    <span style={{fontSize:"0.8rem",fontWeight:700,color:sel?C.gold:C.soil}}>{pt.heure}</span>
                  </div>
                  <div style={{fontSize:"0.6rem",color:sel?"rgba(245,240,232,0.5)":"#6B5B3E",marginTop:4}}>{pt.places>0?`${pt.places} places restantes`:"Complet pour aujourd'hui"}</div>
                </div>
              );
            })}
            <button style={ss.ctaBtn(!selectedPoint)} disabled={!selectedPoint} onClick={()=>setCommandeStep("confirmation")}>Confirmer ce point →</button>
          </div>
        </>}

        {/* STEP CONFIRMATION */}
        {commandeStep==="confirmation" && selectedPoint && <>
          <div style={{padding:"20px 0 0"}}>
            <div style={{background:`linear-gradient(135deg,${C.moss},#2a3d2b)`,borderRadius:20,margin:"0 18px",padding:"24px 20px",textAlign:"center"}}>
              <span style={{fontSize:"3rem",display:"block",marginBottom:12}}>✅</span>
              <div style={{fontFamily:"Georgia,serif",fontSize:"1.4rem",color:C.cream,marginBottom:8}}>Prêt à commander !</div>
              <div style={{fontSize:"0.72rem",color:"rgba(245,240,232,0.65)",lineHeight:1.5}}>Vérifie les détails et confirme ta commande.</div>
              <div style={{marginTop:16,background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 16px",textAlign:"left"}}>
                {[["Produits",`${totalItems} article${totalItems>1?"s":""}`],
                  ["Montant",`${totalPrix.toFixed(2)} €`],
                  ["Point de collecte",POINTS_COLLECTE.find(p=>p.id===selectedPoint)?.nom],
                  ["Heure de passage",POINTS_COLLECTE.find(p=>p.id===selectedPoint)?.heure],
                ].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                    <span style={{fontSize:"0.68rem",color:"rgba(245,240,232,0.6)"}}>{l}</span>
                    <span style={{fontSize:"0.68rem",fontWeight:700,color:C.cream}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding:"16px 18px"}}>
              <button style={ss.ctaBtn(false)} onClick={passerCommande}>🌿 Commander maintenant</button>
              <div style={{fontSize:"0.62rem",color:"#6B5B3E",textAlign:"center",marginTop:10,lineHeight:1.5}}>Paiement à la livraison · Annulation gratuite jusqu'à 2h avant</div>
            </div>
          </div>
        </>}

        {/* STEP SUIVI */}
        {commandeStep==="suivi" && <>
          <div style={{padding:"20px 0 0"}}>
            <div style={{background:`linear-gradient(135deg,${C.moss},#2a3d2b)`,borderRadius:20,margin:"0 18px",padding:"24px 20px",textAlign:"center"}}>
              <span style={{fontSize:"3rem",display:"block",marginBottom:12}}>🚛</span>
              <div style={{fontFamily:"Georgia,serif",fontSize:"1.4rem",color:C.cream,marginBottom:8}}>Commande confirmée !</div>
              <div style={{fontSize:"0.72rem",color:"rgba(245,240,232,0.65)",lineHeight:1.5}}>Michel charge à Loriol · arrivée prévue 18h22</div>
            </div>
            <div style={ss.sec}>
              <div style={{...ss.secTitle,marginBottom:16}}>Suivi de ta tournée</div>
              <div style={ss.card}>
                {[{label:"Commande reçue",sub:"Aujourd'hui à 14h32",done:true,active:false},
                  {label:"En préparation",sub:"Michel — Ferme des Collines · Drôme",done:true,active:false},
                  {label:"En route",sub:"Arrivée à 18h22 · Place Carnot",done:false,active:true},
                  {label:"Prêt à récupérer",sub:"Place Carnot · 2e arr",done:false,active:false},
                ].map((step,i)=>(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",opacity:step.done||step.active?1:0.4,marginBottom:i<3?16:0}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:step.done?C.moss:step.active?C.gold:C.wheat,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",flexShrink:0,color:step.done||step.active?"white":"#999"}}>{step.done?"✓":step.active?"→":i+1}</div>
                    <div>
                      <div style={{fontSize:"0.78rem",fontWeight:step.active||step.done?700:500,color:step.active||step.done?C.soil:"#6B5B3E"}}>{step.label}</div>
                      <div style={{fontSize:"0.63rem",color:"#6B5B3E",marginTop:2}}>{step.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{...ss.ctaBtn(false),marginTop:14}} onClick={()=>{setPanier({});setFlashPanier({});setCommandeStep("selection");setSelectedPoint(null);setCommandePassee(false)}}>Nouvelle commande</button>
            </div>
          </div>
        </>}
        <div style={{height:20}}/>
      </>}

      {/* ── RECETTES ── */}
      {activePage==="recettes" && <>
        <div style={ss.hero}>
          <div style={ss.heroLabel}>Recettes de saison</div>
          <div style={ss.heroTitle}>Cuisiner <em style={ss.heroEm}>ce que tu as commandé</em></div>
          <div style={ss.heroDesc}>{totalItems>0?`${recettesSuggerees.length} recette${recettesSuggerees.length>1?"s":""} avec ton panier`:"Des recettes pour chaque produit de saison"}</div>
        </div>
        <div style={ss.sec}>
          <div style={ss.pillRow}>
            {["Toutes","Mon panier","Rapide","Facile","Végé"].map(f=>(
              <span key={f} style={{...ss.pill(recetteFilter===f),
                ...(f==="Mon panier"&&totalItems>0?{background:C.terracotta,color:"white",border:`1.5px solid ${C.terracotta}`}:{})
              }} onClick={()=>setRecetteFilter(f)}>
                {f}{f==="Mon panier"&&totalItems>0?` (${recettesSuggerees.length})`:""}
              </span>
            ))}
          </div>
          {recettesFiltrees.length===0 && (
            <div style={{textAlign:"center",padding:"30px 0",color:"#6B5B3E",fontSize:"0.78rem"}}>Ajoute des produits à ton panier pour voir les recettes suggérées 🛒</div>
          )}
          {recettesFiltrees.map(r=>{
            const produitsR = PRODUITS.filter(p=>r.produits.includes(p.id));
            const manquants = produitsR.filter(p=>!panier[p.id]);
            return (
              <div key={r.id} style={{background:r.bg||"white",borderRadius:16,padding:14,marginBottom:10,boxShadow:"0 2px 8px rgba(44,31,14,0.06)",display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{fontSize:"2.2rem",width:52,height:52,background:"rgba(255,255,255,0.5)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{r.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:"0.82rem",color:C.soil,marginBottom:3}}>{r.nom}</div>
                  <div style={{fontSize:"0.63rem",color:"#6B5B3E"}}>⏱ {r.temps} min · {r.veggie?"Végé":"Omnivore"}</div>
                  <div style={{display:"flex",gap:3,marginTop:6}}>
                    {[1,2,3].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:d<=r.diff?C.terracotta:C.wheat}}/>)}
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
                    {produitsR.map(p=>(
                      <span key={p.id} style={{fontSize:"0.55rem",fontWeight:700,padding:"2px 6px",borderRadius:8,background:panier[p.id]?"#E8F4EA":"#FEF3E8",color:C.moss}}>{p.emoji} {p.nom}</span>
                    ))}
                  </div>
                  {manquants.length>0 && (
                    <button style={{marginTop:8,background:C.wheat,color:C.soil,fontSize:"0.63rem",fontWeight:600,padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer"}}
                      onClick={()=>{ manquants.forEach(p=>addP(p.id)); setActivePage("commander"); }}>
                      + Ajouter {manquants.length} ingrédient{manquants.length>1?"s":""} manquant{manquants.length>1?"s":""}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{height:20}}/>
      </>}

      {/* ── CARTE ── */}
      {activePage==="carte" && <>
        <div style={ss.hero}>
          <div style={ss.heroLabel}>Tournée de Sève</div>
          <div style={ss.heroTitle}>Points de <em style={ss.heroEm}>collecte</em></div>
          <div style={ss.heroDesc}>Récupère ton panier à 10 min à pied · Passage aujourd'hui</div>
          <div style={ss.ecoBadge}>🗺️ Lyon</div>
        </div>

        {/* CARTE ILLUSTRÉE */}
        <div style={{padding:"18px 18px 0"}}>
          <div style={{background:"#e8f0e4",borderRadius:16,height:200,position:"relative",overflow:"hidden",border:`1px solid ${C.wheat}`}}>
            <svg width="100%" height="100%" style={{position:"absolute",inset:0}}>
              <rect width="100%" height="100%" fill="#e8f0e4"/>
              <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#ccc" strokeWidth="2"/>
              <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#ccc" strokeWidth="2"/>
              <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#ccc" strokeWidth="2"/>
              <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#ccc" strokeWidth="2"/>
              <rect x="40%" y="35%" width="30%" height="30%" fill="#d4e8d0" rx="4"/>
              <text x="55%" y="52%" textAnchor="middle" fontSize="9" fill="#6B5B3E">Presqu'île</text>
            </svg>
            {[{x:"44%",y:"55%"},{x:"54%",y:"28%"},{x:"36%",y:"20%"},{x:"60%",y:"78%"}].map((pos,i)=>{
              const pt=POINTS_COLLECTE[i];
              return (
                <div key={pt.id} style={{position:"absolute",left:pos.x,top:pos.y,transform:"translate(-50%,-50%)",width:32,height:32,borderRadius:"50%",background:pt.statut==="En route"?C.gold:pt.statut==="Disponible"?C.moss:"#bbb",border:"3px solid white",boxShadow:"0 2px 8px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem"}}>
                  {pt.statut==="En route"?"🚛":pt.statut==="Disponible"?"✅":"❌"}
                </div>
              );
            })}
            <div style={{position:"absolute",bottom:8,left:10,background:"white",borderRadius:8,padding:"3px 8px",fontSize:"0.58rem",color:"#6B5B3E",boxShadow:"0 1px 4px rgba(0,0,0,0.1)"}}>Lyon · Tournée de Sève</div>
          </div>
          <div style={{display:"flex",gap:14,marginTop:8,paddingLeft:2}}>
            {[["🚛","En route",C.gold],["✅","Disponible",C.moss],["❌","Terminé","#bbb"]].map(([icon,label,color])=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:color}}/>
                <span style={{fontSize:"0.6rem",color:"#6B5B3E"}}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LISTE POINTS */}
        <div style={{padding:"16px 18px 0"}}>
          {POINTS_COLLECTE.map(pt=>(
            <div key={pt.id} style={{background:"white",borderRadius:14,padding:"12px 14px",marginBottom:10,boxShadow:"0 2px 8px rgba(44,31,14,0.06)",borderLeft:`4px solid ${pt.statut==="En route"?C.gold:pt.statut==="Disponible"?C.moss:"#ccc"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:"0.82rem",color:C.soil}}>{pt.nom} · {pt.arrdt}</div>
                  <div style={{display:"flex",gap:8,marginTop:4,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontSize:"0.62rem",fontWeight:700,padding:"3px 8px",borderRadius:20,background:statutColor(pt.statut),color:statutText(pt.statut)}}>{statutIcon(pt.statut)}{pt.statut}</span>
                    <span style={{fontSize:"0.62rem",color:"#6B5B3E"}}>📍 {pt.distance} à pied</span>
                    <span style={{fontSize:"0.62rem",color:"#6B5B3E"}}>🕐 {pt.heure}</span>
                  </div>
                  <div style={{fontSize:"0.6rem",color:"#6B5B3E",marginTop:4}}>{pt.places>0?`${pt.places} places restantes`:"Complet"}</div>
                </div>
                {pt.statut!=="Terminé" && (
                  <button onClick={()=>{ setSelectedPoint(pt.id); setActivePage("commander"); setCommandeStep(totalItems>0?"collecte":"selection"); }}
                    style={{background:C.moss,color:"white",fontSize:"0.65rem",fontWeight:700,padding:"6px 12px",borderRadius:10,border:"none",cursor:"pointer",flexShrink:0,marginLeft:10}}>
                    Choisir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{height:20}}/>
      </>}

      {/* ── PROFIL ── */}
      {activePage==="profil" && <>
        <div style={{background:`linear-gradient(135deg,${C.soil},#3d2a10)`,padding:"24px 18px",textAlign:"center"}}>
          <span style={{fontSize:"3.5rem",display:"block"}}>👤</span>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.2rem",color:C.cream,marginTop:8}}>Mon profil</div>
          <div style={{fontSize:"0.68rem",color:"rgba(245,240,232,0.55)",marginTop:4}}>Consommateur local · Lyon · Membre depuis mai 2026</div>
          <div style={{display:"inline-block",background:C.moss,color:C.gold,fontFamily:"Georgia,serif",fontSize:"1.05rem",fontWeight:700,padding:"6px 18px",borderRadius:20,marginTop:12}}>🌿 980 pts · Rang #2</div>
        </div>

        <div style={ss.sec}>
          <div style={ss.secTitle}>Mon impact éco</div>
          <div style={{...ss.ecoBlock,marginTop:12}}>
            <div style={{fontSize:"0.68rem",color:"rgba(245,240,232,0.55)",marginBottom:14}}>Basé sur tes commandes Racines</div>
            {[["Local < 100km",85,"A+"],["Saisonnalité",92,"A+"],["Anti-gaspi",55,"B+"],["Km économisés",70,"A"]].map(([l,p,v])=>(
              <div key={l} style={ss.ecoBarRow}>
                <div style={ss.ecoBarLabel}>{l}</div>
                <div style={ss.ecoBarTrack}><div style={ss.ecoBarFill(p)}/></div>
                <div style={ss.ecoBarVal}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{...ss.sec,paddingTop:18}}>
          <div style={ss.secH}>
            <div style={ss.secTitle}>Mes badges</div>
            <span style={ss.seeAll}>{BADGES.filter(b=>b.debloque).length}/{BADGES.length} débloqués</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:12}}>
            {BADGES.map(b=>(
              <div key={b.id} style={{background:b.debloque?"white":"#F5F2EE",borderRadius:14,padding:"14px 8px",textAlign:"center",boxShadow:b.debloque?"0 2px 8px rgba(44,31,14,0.07)":"none",opacity:b.debloque?1:0.6}}>
                <span style={{fontSize:"2rem",display:"block",filter:b.debloque?"none":"grayscale(1)"}}>{b.emoji}</span>
                <span style={{fontSize:"0.68rem",fontWeight:700,color:C.soil,marginTop:6,display:"block"}}>{b.nom}</span>
                <span style={{fontSize:"0.57rem",color:"#6B5B3E",marginTop:3,lineHeight:1.3,display:"block"}}>{b.desc}</span>
                {!b.debloque && <span style={{fontSize:"0.65rem",display:"block",marginTop:4,color:"#aaa"}}>🔒</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{...ss.sec,paddingTop:18}}>
          <div style={ss.secH}>
            <div style={ss.secTitle}>Classement amis · Juin</div>
            <span style={ss.seeAll}>Inviter →</span>
          </div>
          {AMIS.map(a=>(
            <div key={a.nom} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:a.moi?`linear-gradient(135deg,${C.moss},#2d4a2e)`:"white",borderRadius:14,marginBottom:8,boxShadow:"0 2px 8px rgba(44,31,14,0.06)"}}>
              <span style={{fontFamily:"Georgia,serif",fontSize:"1rem",fontWeight:700,color:a.moi?C.gold:C.soil,width:22,textAlign:"center"}}>{a.emoji}</span>
              <span style={{fontSize:"1.4rem",flexShrink:0}}>👤</span>
              <span style={{fontWeight:700,fontSize:"0.8rem",color:a.moi?C.cream:C.soil,flex:1}}>{a.nom}{a.moi?" (moi)":""}</span>
              <span style={{fontSize:"0.72rem",fontWeight:700,color:a.moi?C.sage:C.moss}}>{a.score} pts</span>
            </div>
          ))}
        </div>

        <div style={{...ss.sec,paddingTop:18}}>
          <div style={ss.secH}>
            <div style={ss.secTitle}>Historique commandes</div>
          </div>
          {[{date:"8 juin 2026",items:"Tomates cerise, Courgettes, Basilic",total:"7.10 €"},
            {date:"1 juin 2026",items:"Pêches, Saint-Marcellin",total:"5.60 €"},
            {date:"25 mai 2026",items:"Courgettes × 3, Salade verte",total:"5.50 €"},
          ].map((h,i)=>(
            <div key={i} style={{background:"white",borderRadius:14,padding:"12px 14px",marginBottom:10,boxShadow:"0 2px 8px rgba(44,31,14,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:"0.63rem",color:"#6B5B3E"}}>{h.date}</div>
                <div style={{fontSize:"0.82rem",fontWeight:700,color:C.soil,marginTop:2}}>{h.items}</div>
                <div style={{fontSize:"0.68rem",fontWeight:700,color:C.terracotta,marginTop:2}}>{h.total}</div>
              </div>
              <div style={{fontSize:"0.62rem",fontWeight:700,padding:"4px 10px",borderRadius:20,background:"#E8F4EA",color:C.moss,flexShrink:0}}>Livré</div>
            </div>
          ))}
        </div>

        <div style={{...ss.sec,paddingTop:18}}>
          <div style={ss.secH}>
            <div style={ss.secTitle}>Passeport Saisons 🌿</div>
            <span style={ss.seeAll}>2/12 tampons</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginTop:12}}>
            {MOIS_LABELS.map((m,i)=>(
              <div key={m} style={{background:i<2?C.moss:"#F5F2EE",borderRadius:10,padding:"8px 4px",textAlign:"center",opacity:i<2?1:0.5}}>
                <span style={{fontSize:"1.1rem",display:"block",marginBottom:2}}>{i<2?"🌿":"○"}</span>
                <span style={{fontSize:"0.57rem",fontWeight:700,color:i<2?"white":"#6B5B3E",display:"block"}}>{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{height:20}}/>
      </>}

      {/* BOTTOM NAV */}
      <div style={ss.nav}>
        {navItems.map(([icon,page,label])=>(
          <div key={page} style={ss.navItem(activePage===page)} onClick={()=>setActivePage(page)}>
            <div style={{fontSize:"1.2rem"}}>{icon}</div>
            <div style={ss.navLabel(activePage===page)}>{label}</div>
            {page==="commander" && totalItems>0 && <div style={ss.navBadge}>{totalItems}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
