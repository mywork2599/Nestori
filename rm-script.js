/* rm-script.js
   Simple frontend matchmaking demo:
   - sample dataset
   - filter by preferences
   - small scoring for compatibility
*/

const sampleProfiles = [
  {
    id: 1,
    name: "Asha",
    age: 26,
    gender: "female",
    city: "Bengaluru",
    price: 7000,
    type: "PG",
    tags: ["clean","non-smoker"],
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Rohit",
    age: 29,
    gender: "male",
    city: "Bengaluru",
    price: 12000,
    type: "Flat",
    tags: ["pets","night-owl"],
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Priya",
    age: 24,
    gender: "female",
    city: "Bengaluru",
    price: 9000,
    type: "Flat",
    tags: ["clean","non-smoker","pets"],
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Sahil",
    age: 27,
    gender: "male",
    city: "Gurgaon",
    price: 8000,
    type: "PG",
    tags: ["clean","non-smoker"],
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Neha",
    age: 30,
    gender: "female",
    city: "Mumbai",
    price: 15000,
    type: "Flat",
    tags: ["pets","night-owl"],
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop"
  },
  {
    id: 6,
    name: "Aman",
    age: 28,
    gender: "male",
    city: "Bengaluru",
    price: 11000,
    type: "Flat",
    tags: ["clean","non-smoker","pets"],
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Kavya",
    age: 25,
    gender: "female",
    city: "Chennai",
    price: 6000,
    type: "PG",
    tags: ["clean","non-smoker"],
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop"
  },
  {
    id: 8,
    name: "Vikram",
    age: 31,
    gender: "male",
    city: "Mumbai",
    price: 14000,
    type: "Flat",
    tags: ["pets","night-owl"],
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop"
  }


];

// helpers
function $(s){ return document.querySelector(s); }
function $all(s){ return Array.from(document.querySelectorAll(s)); }

function renderResults(list){
  const container = $("#resultsList");
  container.innerHTML = "";
  $("#matchCount").textContent = `${list.length} results`;
  if(!list.length){ $("#emptyState").style.display="block"; return; }
  else $("#emptyState").style.display="none";

  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "match-card";

    card.innerHTML = `
      <div class="match-thumb"><img src="${p.img}" alt="${p.name}"></div>
      <div class="match-info">
        <div>
          <h5>${p.name}, ${p.age}</h5>
          <div class="match-meta">
            <span>${p.city}</span>
            <span>• ${p.type}</span>
            <span>• ₹${p.price.toLocaleString()}</span>
            ${p.tags.map(t=>`<span class="badge-mini">${t.replace('-',' ')}</span>`).join(" ")}
          </div>
        </div>
        <div class="mt-2 text-muted small">Member since 2023 • Verified</div>
      </div>
      <div class="match-actions">
        <div class="score">${Math.min(100, Math.round((Math.random()*30)+70))}%</div>
        <div>
          <button class="btn btn-outline-secondary btn-sm mr-1" onclick="viewProfile(${p.id})">View</button>
          <button class="btn btn-success btn-sm" onclick="contact(${p.id})">Contact</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// basic matching algorithm: filters + simple scoring
function computeMatches(){
  const city = $("#cityInput").value.trim().toLowerCase();
  const minB = Number($("#minBudget").value) || 0;
  const maxB = Number($("#maxBudget").value) || Infinity;
  const gender = $("#genderPref").value;
  const selectedTags = $all(".tag.active").map(t=>t.dataset.key);

  let results = sampleProfiles.filter(p=>{
    const inCity = !city || p.city.toLowerCase().includes(city);
    const inBudget = p.price >= minB && p.price <= maxB;
    const genderOk = (gender === "any") || (p.gender === gender);
    // tag matching: profile must have at least one selected tag (if any selected)
    const tagsOk = selectedTags.length === 0 || selectedTags.some(k => p.tags.includes(k) || (k==="smoking" && p.tags.includes("non-smoker")===false));
    return inCity && inBudget && genderOk && tagsOk;
  });

  // simple sort by price (you can improve)
  const sort = $("#sortSelect").value;
  if(sort === "priceLow") results.sort((a,b)=>a.price-b.price);

  renderResults(results);
}

document.addEventListener("DOMContentLoaded", ()=>{
  // toggle tags
  $all(".tag").forEach(btn=>{
    btn.addEventListener("click", ()=> btn.classList.toggle("active"));
  });

  // preferences form submit
  $("#prefsForm").addEventListener("submit", e=>{
    e.preventDefault();
    computeMatches();
  });

  // quick initial render
  renderResults(sampleProfiles);

  // sort change
  $("#sortSelect").addEventListener("change", computeMatches);
});

// small helpers for actions
function viewProfile(id){
  alert("Open profile modal for id: "+id);
}
function contact(id){
  alert("Open chat / contact flow for id: "+id);
}
