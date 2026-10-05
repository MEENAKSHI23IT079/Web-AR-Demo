/* Rule-based interior design logic used by the AR Home Interior Designer. */
(function () {
  const ROOMS = {
    living: { label: 'Living Room', essentials: ['sofa','coffeeTable','rug','plant','tvUnit'], minArea: 120 },
    bedroom: { label: 'Bedroom', essentials: ['bed','sideTable','lamp','plant'], minArea: 90 },
    dining: { label: 'Dining Room', essentials: ['diningTable','plant','lamp'], minArea: 80 },
    study: { label: 'Study / Home Office', essentials: ['desk','chair','lamp','plant'], minArea: 60 }
  };
  const STYLES = {
    modern: { label:'Modern', palette:['#F4F1EA','#2D3142','#BFC0C0'], factor:1.00 },
    minimal: { label:'Minimal', palette:['#F7F5F0','#D9D5CC','#5C677D'], factor:0.90 },
    scandi: { label:'Scandinavian', palette:['#F6F0E8','#D8B08C','#6B705C'], factor:0.95 },
    boho: { label:'Boho', palette:['#EAD7C0','#A65D4B','#6B705C'], factor:1.05 },
    classic: { label:'Classic', palette:['#F1E6D2','#7A4E2D','#7F8C8D'], factor:1.12 }
  };
  const BUDGETS = {
    low: { label:'Budget', max:1200 }, medium:{label:'Comfort',max:3000}, high:{label:'Premium',max:7000}
  };
  const ITEMS = {
    sofa:{label:'Sofa',price:450,type:'seating'}, coffeeTable:{label:'Coffee Table',price:90,type:'table'}, rug:{label:'Area Rug',price:90,type:'decor'}, plant:{label:'Indoor Plant',price:50,type:'decor'}, tvUnit:{label:'TV Unit',price:250,type:'storage'},
    bed:{label:'Bed',price:500,type:'bed'}, sideTable:{label:'Side Table',price:90,type:'table'}, lamp:{label:'Floor Lamp',price:75,type:'lighting'}, diningTable:{label:'Dining Table',price:380,type:'table'}, desk:{label:'Study Desk',price:250,type:'table'}, chair:{label:'Work Chair',price:150,type:'seating'}
  };
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function generatePlan(input={}) {
    const room=ROOMS[input.room]||ROOMS.living, style=STYLES[input.style]||STYLES.modern, budget=BUDGETS[input.budget]||BUDGETS.medium;
    const area=Number(input.area)||120;
    let ids=[...room.essentials];
    if(area>=room.minArea*1.55 && budget.max>=3000) {
      if(input.room==='living') ids.push('sideTable');
      if(input.room==='bedroom') ids.push('rug');
      if(input.room==='dining') ids.push('sideTable');
      if(input.room==='study') ids.push('sideTable');
    }
    let total=ids.reduce((s,id)=>s+ITEMS[id].price,0)*style.factor;
    // Budget-aware pruning: retain the essentials first and remove optional decor first.
    const optional=['rug','plant','sideTable','lamp'];
    for(const id of optional){ if(total>budget.max && ids.length>room.essentials.length){ ids=ids.filter(x=>x!==id); total=ids.reduce((s,x)=>s+ITEMS[x].price,0)*style.factor; } }
    const utilization=clamp(Math.round((total/budget.max)*100),1,100);
    const suggestions=[];
    if(area<room.minArea) suggestions.push(`Use compact furniture because the room is below the recommended ${room.minArea} sq.ft.`);
    else if(area>room.minArea*1.6) suggestions.push('Leave a clear circulation path and use one larger statement piece instead of many small pieces.');
    if(style.label==='Minimal') suggestions.push('Keep visual clutter low and use a light neutral base with one accent tone.');
    if(style.label==='Boho') suggestions.push('Mix natural textures, plants and warm accent colours for a layered look.');
    if(style.label==='Modern') suggestions.push('Prefer clean lines, balanced spacing and a small number of statement pieces.');
    if(input.color && input.color!=='auto') suggestions.push(`Use ${input.color} as the main accent colour.`);
    suggestions.push('Keep at least 75 cm of walking clearance around major furniture where possible.');
    return {room:input.room||'living',roomLabel:room.label,style:input.style||'modern',styleLabel:style.label,budget:input.budget||'medium',budgetLabel:budget.label,budgetMax:budget.max,area,accent:input.color||'auto',palette:style.palette,items:ids,total:Math.round(total),utilization,suggestions};
  }
  function savePlan(plan){ localStorage.setItem('arInteriorPlan',JSON.stringify(plan)); }
  function loadPlan(){ try{return JSON.parse(localStorage.getItem('arInteriorPlan')||'null')}catch(e){return null} }
  window.InteriorDesignerLogic={ROOMS,STYLES,BUDGETS,ITEMS,generatePlan,savePlan,loadPlan};
})();
