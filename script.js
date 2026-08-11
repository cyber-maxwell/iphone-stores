const products=[
{name:"iPhone 17 Pro Max",meta:"256GB • WiFi Only",price:830000,type:"phone",cat:"wifi-iphone",image:"images/iphone-17-pro-max.jpg"},
{name:"iPhone 12 Pro Max",meta:"256GB • WiFi Only",price:330000,type:"phone",cat:"wifi-iphone",image:"images/iphone-12-pro-max.jpg"},
{name:"iPhone 12",meta:"128GB • WiFi Only",price:220000,type:"phone",cat:"wifi-iphone",image:"images/iphone-12-pro-max.jpg"},
{name:"iPhone 12 Pro",meta:"128GB",price:260000,type:"phone",cat:"wifi-iphone",image:"images/iphone-12-pro.jpg"},
{name:"iPhone 13",meta:"128GB",price:230000,type:"phone",cat:"wifi-iphone"},
{name:"iPhone 14",meta:"128GB",price:220000,type:"phone",cat:"wifi-iphone"},
{name:"iPhone 13 Pro Max",meta:"256GB",price:270000,type:"phone",cat:"wifi-iphone"},
{name:"iPhone 15",meta:"128GB",price:390000,type:"phone",cat:"wifi-iphone"},
{name:"iPhone 14 Pro",meta:"128GB",price:325000,type:"phone",cat:"wifi-iphone"},
{name:"iPhone 15 Pro",meta:"128GB",price:370000,type:"phone",cat:"wifi-iphone"},
{name:"iPhone 15 Pro Max",meta:"256GB",price:330000,type:"phone",cat:"wifi-iphone"},
{name:"iPhone 16 Pro",meta:"256GB",price:470000,type:"phone",cat:"wifi-iphone"},
{name:"iPhone 16 Pro Max",meta:"256GB",price:440000,type:"phone",cat:"wifi-iphone"},
{name:"iPhone 15",meta:"128GB • Standard",price:520000,type:"phone",cat:"iphone"},
{name:"iPhone 15 Pro",meta:"128GB • Standard",price:650000,type:"phone",cat:"iphone"},
{name:"iPhone 15 Pro Max",meta:"256GB • Standard",price:780000,type:"phone",cat:"iphone"},
{name:"Samsung Galaxy S24",meta:"256GB",price:680000,type:"phone",cat:"android"},
{name:"Samsung Galaxy S25",meta:"256GB",price:850000,type:"phone",cat:"android"},
{name:"Google Pixel 9 Pro",meta:"256GB",price:820000,type:"phone",cat:"android"},
{name:"ASUS ROG Strix G16",meta:"1TB • 16GB RAM",price:1850000,type:"laptop",cat:"gaming-laptop"},
{name:"Lenovo Legion 5",meta:"1TB • 16GB RAM",price:1650000,type:"laptop",cat:"gaming-laptop"},
{name:"HP Omen 16",meta:"1TB • 16GB RAM",price:1550000,type:"laptop",cat:"gaming-laptop"},
{name:"MacBook Air M3",meta:"256GB • 8GB RAM",price:1450000,type:"laptop",cat:"regular-laptop"},
{name:"MacBook Air M2",meta:"256GB • 8GB RAM",price:1150000,type:"laptop",cat:"regular-laptop"},
{name:"HP Pavilion 15",meta:"512GB • 8GB RAM",price:720000,type:"laptop",cat:"regular-laptop"},
{name:"Lenovo IdeaPad 5",meta:"512GB • 8GB RAM",price:690000,type:"laptop",cat:"regular-laptop"}
];

let main="phones", sub="all-phones", selected=null;
let cart = JSON.parse(localStorage.getItem("maxwellCart") || "[]");
const $=id=>document.getElementById(id);
const money=n=>"₦"+n.toLocaleString("en-NG");

function render(){
 const type=main==="phones"?"phone":"laptop";
 let list=products.filter(p=>p.type===type && (sub===`all-${type}s`||p.cat===sub));
 const q=$("search").value.trim().toLowerCase();
 if(q) list=list.filter(p=>(p.name+" "+p.meta).toLowerCase().includes(q));
 const s=$("sort").value;
 if(s==="low")list.sort((a,b)=>a.price-b.price);
 if(s==="high")list.sort((a,b)=>b.price-a.price);
 if(s==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
 $("products").innerHTML=list.map(p=>{
   const i=products.indexOf(p);
   return `<article class="product">
     ${p.image?`<img class="product-img" src="${p.image}" alt="${p.name}">`:`<div class="product-img"></div>`}
     <h3>${p.name}</h3><p>${p.meta}</p><div class="price">${money(p.price)}</div>
     <button class="view" data-i="${i}">View details</button>
   </article>`;
 }).join("");
 $("empty").hidden=!!list.length;
}

document.querySelectorAll(".category").forEach(btn=>btn.onclick=()=>{
 main=btn.dataset.main; sub=main==="phones"?"all-phones":"all-laptops";
 document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===btn));
 $("phoneSubs").classList.toggle("hidden",main!=="phones");
 $("laptopSubs").classList.toggle("hidden",main!=="laptops");
 document.querySelectorAll(".sub").forEach(x=>x.classList.toggle("active",x.dataset.sub===sub));
 render();
});

document.querySelectorAll(".sub").forEach(btn=>btn.onclick=()=>{
 sub=btn.dataset.sub;
 document.querySelectorAll(".sub").forEach(x=>x.classList.toggle("active",x===btn));
 render();
});
$("search").oninput=render; $("sort").onchange=render;

document.addEventListener("click",e=>{
 const b=e.target.closest(".view");
 if(!b)return;
 selected=products[+b.dataset.i];
 $("modalImg").src=selected.image||"";
 $("modalImg").style.display=selected.image?"block":"none";
 $("modalName").textContent=selected.name;
 $("modalMeta").textContent=selected.meta;
 $("modalPrice").textContent=money(selected.price);
 $("modal").classList.add("open"); $("modal").setAttribute("aria-hidden","false");
});
function closeModal(){ $("modal").classList.remove("open"); $("modal").setAttribute("aria-hidden","true"); }
$("close").onclick=closeModal;
$("modal").onclick=e=>{if(e.target===$("modal"))closeModal()};
$("add").onclick=()=>{
 if(!selected)return;
 const index=products.indexOf(selected);
 const existing=cart.find(x=>x.index===index);
 if(existing) existing.qty++; else cart.push({index,qty:1});
 saveCart(); closeModal(); openCart();
};
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeCart()}});

function saveCart(){localStorage.setItem("maxwellCart",JSON.stringify(cart));renderCart()}
function cartCount(){return cart.reduce((sum,item)=>sum+item.qty,0)}
function renderCart(){
 $("cartCount").textContent=cartCount();
 const box=$("cartItems");
 if(!cart.length){box.innerHTML='<div class="cart-empty"><span class="empty-icon">🛒</span><h3>Your cart is empty</h3><p>Add a product and it will appear here.</p></div>';$("cartTotal").textContent="₦0";return}
 let total=0;
 box.innerHTML=cart.map((item,pos)=>{const p=products[item.index];total+=p.price*item.qty;return `<div class="cart-item">${p.image?`<img src="${p.image}" alt="${p.name}">`:''}<div><h3>${p.name}</h3><p>${p.meta}</p><div class="item-price">${money(p.price*item.qty)}</div><div class="item-actions"><button class="qty-btn" data-action="minus" data-pos="${pos}">−</button><span class="qty">${item.qty}</span><button class="qty-btn" data-action="plus" data-pos="${pos}">+</button><button class="remove-item" data-action="remove" data-pos="${pos}">Remove</button></div></div></div>`}).join("");
 $("cartTotal").textContent=money(total);
}
function openCart(){$("cartPanel").classList.add("open");$("cartBackdrop").classList.add("open");$("cartPanel").setAttribute("aria-hidden","false")}
function closeCart(){$("cartPanel").classList.remove("open");$("cartBackdrop").classList.remove("open");$("cartPanel").setAttribute("aria-hidden","true")}
$("cartButton").onclick=openCart;$("cartClose").onclick=closeCart;$("cartBackdrop").onclick=closeCart;
$("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(!b)return;const pos=+b.dataset.pos;if(b.dataset.action==="plus")cart[pos].qty++;if(b.dataset.action==="minus"){cart[pos].qty--;if(cart[pos].qty<=0)cart.splice(pos,1)}if(b.dataset.action==="remove")cart.splice(pos,1);saveCart()});
$("clearCart").onclick=()=>{cart=[];saveCart()};
$("whatsappCheckout").onclick=()=>{if(!cart.length){alert("Your cart is empty. Add a product first.");return}const lines=cart.map(x=>{const p=products[x.index];return `• ${p.name} (${p.meta}) x${x.qty} — ${money(p.price*x.qty)}`});const total=cart.reduce((s,x)=>s+products[x.index].price*x.qty,0);const message=`Hello Maxwell Mobile! I would like to order:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}`;const whatsappNumber="2348067041204";window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,"_blank")};

renderCart();
render();
