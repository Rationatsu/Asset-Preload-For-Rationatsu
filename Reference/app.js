const navLinks = [...document.querySelectorAll('.nav-link')];
const crumbName = document.getElementById('crumbName');
const sidebar = document.getElementById('sidebar');
const toast = document.getElementById('toast');
let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400)}
const pageNames={home:'Overview',portfolio:'Portfolio',projects:'Projects',fanart:'Fan Art',instrument:'Instrument Virtual',novel:'Novel',school:'School'};
function activatePage(page){const name=pageNames[page]||'Overview';crumbName.textContent=name;navLinks.forEach(link=>link.classList.toggle('active',link.dataset.page===page));sidebar.classList.remove('open');if(page!=='home')showToast(`${name} Ini prototype dari gemini`)}
navLinks.forEach(link=>link.addEventListener('click',()=>activatePage(link.dataset.page)));
document.querySelectorAll('a[href^="#"]').forEach(link=>{link.addEventListener('click',()=>{const page=link.getAttribute('href').slice(1);if(pageNames[page])activatePage(page)})});
document.getElementById('menuToggle').addEventListener('click',()=>sidebar.classList.toggle('open'));
const filterButtons=[...document.querySelectorAll('.filter')];const cards=[...document.querySelectorAll('.recent-card')];const searchInput=document.getElementById('globalSearch');let currentFilter='all';
function filterCards(){const term=searchInput.value.trim().toLowerCase();let visible=0;cards.forEach(card=>{const matchesCategory=currentFilter==='all'||card.dataset.category===currentFilter;const matchesSearch=!term||(card.dataset.search+' '+card.innerText).toLowerCase().includes(term);const show=matchesCategory&&matchesSearch;card.hidden=!show;if(show)visible++});document.getElementById('emptyState').hidden=visible>0}
filterButtons.forEach(button=>button.addEventListener('click',()=>{currentFilter=button.dataset.filter;filterButtons.forEach(b=>b.classList.toggle('active',b===button));filterCards()}));searchInput.addEventListener('input',filterCards);
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();searchInput.focus()}if(event.key==='Escape'){searchInput.blur();sidebar.classList.remove('open')}});
document.querySelector('.notification').addEventListener('click',()=>showToast('Kamu sudah up to date ✨'));
