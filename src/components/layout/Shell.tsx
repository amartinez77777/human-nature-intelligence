import {NavLink,Link,useNavigate,useLocation} from 'react-router-dom';
import {useEffect,useRef,useState,type FormEvent,type ReactNode} from 'react';
import {BrainCircuit,Network,GraduationCap,BookOpenText,LibraryBig,Landmark,FlaskConical,GalleryVerticalEnd,Search,Menu,X,ArrowUpRight,Download,PanelLeftClose} from 'lucide-react';
import {useProgress} from '../../app/ProgressContext';
const nav=[
 {to:'/',label:'Command Center',icon:GalleryVerticalEnd},
 {to:'/laws',label:'The 18 Laws Library',icon:BookOpenText},
 {to:'/atlas',label:'Human Behavior Atlas',icon:LibraryBig},
 {to:'/cases',label:'Historical Case Studies',icon:Landmark},
 {to:'/network',label:'Knowledge Network',icon:Network},
 {to:'/lab',label:'Behavioral Simulation Lab',icon:BrainCircuit},
 {to:'/evidence',label:'Science & Criticism',icon:FlaskConical},
 {to:'/academy',label:'Intelligence Academy',icon:GraduationCap}
];
function MenuLinks({onSelect}:{onSelect?:()=>void}){return <nav className="nav-links" aria-label="Main navigation">{nav.map((n,i)=>{const Icon=n.icon;return <NavLink key={n.to} end={n.to==='/'} to={n.to} onClick={onSelect} className={({isActive})=>`nav-link ${isActive?'selected':''}`}><Icon size={18}/><span>{n.label}</span>{i===0&&<span className="nav-number">01</span>}</NavLink>})}</nav>}
export function Shell({children}:{children:ReactNode}){
 const menuButton=useRef<HTMLButtonElement>(null);const drawer=useRef<HTMLElement>(null);const main=useRef<HTMLElement>(null);
 const navigate=useNavigate();const loc=useLocation();const [query,setQuery]=useState('');const [open,setOpen]=useState(false);const [collapsed,setCollapsed]=useState(false);const {progress,storageWarning,storageCorrupt}=useProgress();
 useEffect(()=>{setOpen(false);window.scrollTo(0,0)},[loc.pathname]);
 useEffect(()=>{
  if(!open)return;
  drawer.current?.querySelector<HTMLElement>('a')?.focus();
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();setOpen(false);menuButton.current?.focus();}
   if(event.key==='Tab'){
    const links=drawer.current?.querySelectorAll<HTMLElement>('a,button');
    if(!links?.length)return;
    const first=links[0],last=links[links.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   }
  };
  const media=window.matchMedia('(max-width:800px)');
  const onResize=()=>{if(!media.matches)setOpen(false);};
  document.addEventListener('keydown',onKey);media.addEventListener('change',onResize);
  return()=>{document.removeEventListener('keydown',onKey);media.removeEventListener('change',onResize);};
 },[open]);
 const closeForNavigation=()=>{if(open){setOpen(false);main.current?.focus();}};
 const submit=(e:FormEvent)=>{e.preventDefault();navigate(`/search?q=${encodeURIComponent(query.trim())}`);setOpen(false)};
 return <div className={`shell ${collapsed?'collapsed':''}`}>
 <a className="skip-link" href="#main" onClick={e=>{e.preventDefault();document.getElementById('main')?.focus();}}>Skip to content</a>
 <aside ref={drawer} id="hni-navigation" className={`sidebar ${open?'mobile-open':''}`}>
 <Link to="/" className="brand" onClick={closeForNavigation}><div className="brand-mark"><BrainCircuit size={22}/></div><div><strong>HUMAN NATURE</strong><span>INTELLIGENCE / HNI</span></div></Link>
 <button className="icon-button drawer-close" aria-label="Close navigation" onClick={()=>{setOpen(false);menuButton.current?.focus();}}><X size={21}/></button><div className="sidebar-label">INTELLIGENCE SYSTEM</div><MenuLinks onSelect={closeForNavigation}/>
 <div className="sidebar-bottom"><div className="sidebar-data"><span>RESEARCH BASE</span><strong>18 laws · 2018 edition</strong><small>Source-grounded · Partial review</small></div><Link to="/settings" onClick={closeForNavigation} className="sidebar-settings">Personal data & backups <ArrowUpRight size={15}/></Link></div>
 </aside>
 {open&&<button className="mobile-overlay" aria-label="Close navigation" onClick={()=>{setOpen(false);menuButton.current?.focus();}}/>}
 <div className="main-area"><header className="topbar"><div className="topbar-left"><button ref={menuButton} className="icon-button mobile-menu" aria-controls="hni-navigation" aria-expanded={open} aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(v=>!v)}>{open?<X size={21}/>:<Menu size={21}/>}</button><button className="icon-button desktop-collapse" aria-controls="hni-navigation" aria-expanded={!collapsed} onClick={()=>setCollapsed(v=>!v)} aria-label="Toggle sidebar"><PanelLeftClose size={20}/></button><span className="topbar-context">THE HUMAN BEHAVIOR ARCHIVE <span className="topbar-dot">●</span> v1.0.0-rc1</span></div><form className="top-search" role="search" onSubmit={submit}><Search size={17}/><input aria-label="Search the archive" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search laws, ideas, case studies..."/><kbd>↵</kbd></form><Link to="/settings" className="icon-button top-backup" aria-label="Data settings"><Download size={19}/></Link></header>
 {storageWarning&&<div className="storage-alert" role="alert">{storageCorrupt?'Saved browser progress is corrupt and was preserved untouched. Open Data & backups to restore a valid file.':'Browser storage is unavailable or full. Recent changes were not saved; see Data & backups.'}</div>}
 <main ref={main} className="page-content" id="main" tabIndex={-1}>{children}</main>
 <footer className="site-footer"><span>HNI / RESEARCH ARCHIVE</span><span>{progress.bookmarks.length} saved items · No account · Local-first</span></footer>
 </div>
 <nav className="mobile-bottom" aria-label="Quick navigation">{[{to:'/',icon:GalleryVerticalEnd,label:'Home'},{to:'/laws',icon:BookOpenText,label:'Laws'},{to:'/atlas',icon:LibraryBig,label:'Atlas'},{to:'/network',icon:Network,label:'Network'},{to:'/academy',icon:GraduationCap,label:'Learn'}].map(x=>{const Icon=x.icon;return <NavLink key={x.to} to={x.to} end={x.to==='/'} className={({isActive})=>`mobile-tab ${isActive?'selected':''}`}><Icon size={19}/><span>{x.label}</span></NavLink>})}</nav>
 </div>;
}
