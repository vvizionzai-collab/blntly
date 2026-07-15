"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  accent: string;
  initials: string;
};

const products: Product[] = [
  { id: 1, name: "Classic Leaf Wraps", category: "Wraps", price: 4.99, accent: "red", initials: "LW" },
  { id: 2, name: "Ultra Thin Papers", category: "Papers", price: 3.49, accent: "blue", initials: "RP" },
  { id: 3, name: "Premium Cigar Pack", category: "Cigars", price: 11.99, accent: "purple", initials: "PC" },
  { id: 4, name: "Rechargeable Device", category: "Vapes", price: 19.99, accent: "cyan", initials: "VD" },
  { id: 5, name: "Natural Leaf Pack", category: "Wraps", price: 7.99, accent: "amber", initials: "NL" },
  { id: 6, name: "Hookah Coal Kit", category: "Hookah", price: 9.49, accent: "pink", initials: "HK" },
];

const categories = ["All", "Wraps", "Papers", "Cigars", "Vapes", "Hookah"];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "logo compact" : "logo"} aria-label="BLNTLY">
      blntly<span className="logo-dot">.</span>
    </span>
  );
}

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    pin: <><path d="M12 21s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/></>,
    bag: <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    shield: <><path d="M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M10 20v-6h4v6"/></>,
    orders: <><path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"/>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    car: <><path d="m5 16-1-3 2-6h12l2 6-1 3"/><path d="M3 16h18v3H3z"/><circle cx="7" cy="19" r="1"/><circle cx="17" cy="19" r="1"/></>,
    store: <><path d="M4 9h16l-2-6H6L4 9Z"/><path d="M5 9v12h14V9M9 21v-6h6v6"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

export default function Home() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Product[]>([]);
  const [screen, setScreen] = useState("discover");
  const [role, setRole] = useState("Customer");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [messages, setMessages] = useState([{ from: "ai", text: "Hey—I'm BLNTLY Assist. How can I help with your order?" }]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  const visibleProducts = useMemo(
    () => category === "All" ? products : products.filter((item) => item.category === category),
    [category]
  );
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  const verifyAge = () => {
    window.sessionStorage.setItem("blntly-age", "verified");
    setAgeVerified(true);
  };

  const addItem = (product: Product) => setCart((current) => [...current, product]);

  const sendMessage = () => {
    if (!chatText.trim()) return;
    setMessages((current) => [...current, { from: "user", text: chatText.trim() }, { from: "ai", text: "I’ve got you. I can check an order, explain ID verification, or connect you to a live specialist." }]);
    setChatText("");
  };

  return (
    <main>
      {!ageVerified && (
        <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title">
          <div className="age-card">
            <Logo />
            <div className="age-mark">21+</div>
            <p className="eyebrow">Age-restricted marketplace</p>
            <h1 id="age-title">Are you 21 or older?</h1>
            <p>BLNTLY is only for adults of legal purchasing age. Valid government-issued photo ID is required before checkout and again at delivery.</p>
            <button className="primary full" onClick={verifyAge}>Yes, I’m 21 or older</button>
            <a className="exit-link" href="https://www.fda.gov/tobacco-products/retail-sales-tobacco-products/tobacco-21">No, exit and learn about Tobacco 21</a>
            <small>By entering, you confirm you meet the legal age requirement in your location.</small>
          </div>
        </div>
      )}

      <header className="site-header">
        <a href="#top" className="brand-link"><Logo /></a>
        <nav className={mobileMenu ? "site-nav open" : "site-nav"} aria-label="Main navigation">
          <a href="#how" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#safety" onClick={() => setMobileMenu(false)}>Safety</a>
          <a href="#partners" onClick={() => setMobileMenu(false)}>Partners</a>
          <a href="#app" onClick={() => setMobileMenu(false)}>App demo</a>
        </nav>
        <div className="header-actions">
          <span className="adult-pill">21+ ONLY</span>
          <a className="primary small" href="#app">Open app</a>
          <button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu"><Icon name={mobileMenu ? "close" : "menu"} /></button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow red" />
        <div className="hero-glow blue" />
        <div className="hero-copy">
          <div className="status-chip"><span /> Regulated delivery, rebuilt</div>
          <h1>Your local smoke shop.<br/><span>At your door.</span></h1>
          <p>Order tobacco wraps, papers, cigars, vapes, and hookah essentials from licensed local retailers—with two-step age verification built into every delivery.</p>
          <div className="hero-actions">
            <a className="primary" href="#app">Explore the app <Icon name="arrow" /></a>
            <a className="secondary" href="#partners">Become a partner</a>
          </div>
          <div className="trust-row">
            <span><Icon name="shield" /> Two-step ID check</span>
            <span><Icon name="clock" /> Live order tracking</span>
            <span><Icon name="pin" /> Local licensed stores</span>
          </div>
        </div>

        <div className="phone-shell" aria-label="BLNTLY app preview">
          <div className="phone-top"><span>9:41</span><div className="island"/><span>● ◒</span></div>
          <div className="phone-header">
            <Logo compact />
            <button className="cart-button" onClick={() => setScreen("cart")} aria-label={`Cart with ${cart.length} items`}><Icon name="bag" />{cart.length > 0 && <b>{cart.length}</b>}</button>
          </div>
          {screen === "discover" && (
            <div className="app-screen">
              <button className="delivery-address"><span><Icon name="pin" /></span><div><small>Deliver now</small><strong>Home · Pacoima, CA</strong></div><b>⌄</b></button>
              <div className="app-greeting"><p>Good evening</p><h2>What do you need?</h2></div>
              <label className="search-box"><Icon name="search" /><input aria-label="Search products or stores" placeholder="Search products or stores" /></label>
              <div className="category-scroll">
                {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
              </div>
              <div className="store-line"><h3>Fast near you</h3><span>See all</span></div>
              <div className="product-list">
                {visibleProducts.slice(0, 3).map((product) => (
                  <article className="product-row" key={product.id}>
                    <div className={`product-art ${product.accent}`}>{product.initials}</div>
                    <div><small>{product.category}</small><h4>{product.name}</h4><p><Icon name="clock" /> 18–28 min · <b>${product.price.toFixed(2)}</b></p></div>
                    <button onClick={() => addItem(product)} aria-label={`Add ${product.name}`}>+</button>
                  </article>
                ))}
              </div>
            </div>
          )}
          {screen === "orders" && <OrderScreen />}
          {screen === "profile" && <ProfileScreen />}
          {screen === "cart" && <CartScreen cart={cart} subtotal={subtotal} back={() => setScreen("discover")} remove={(index) => setCart((items) => items.filter((_, i) => i !== index))} />}
          <div className="app-nav">
            <button className={screen === "discover" ? "active" : ""} onClick={() => setScreen("discover")}><Icon name="home" /><span>Discover</span></button>
            <button className={screen === "orders" ? "active" : ""} onClick={() => setScreen("orders")}><Icon name="orders" /><span>Orders</span></button>
            <button className={screen === "profile" ? "active" : ""} onClick={() => setScreen("profile")}><Icon name="user" /><span>Profile</span></button>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Platform features">
        <div><strong>4</strong><span>connected role experiences</span></div>
        <div><strong>2×</strong><span>age verification checkpoints</span></div>
        <div><strong>Live</strong><span>inventory and delivery tracking</span></div>
        <div><strong>24/7</strong><span>AI-assisted support</span></div>
      </section>

      <section className="section how" id="how">
        <div className="section-heading"><p className="eyebrow">Simple by design</p><h2>From nearby to delivered<br/>in four protected steps.</h2><p>BLNTLY keeps the speed people expect while making compliance visible at every critical moment.</p></div>
        <div className="steps-grid">
          {[
            ["01", "Verify once", "Create your account and complete an independent age and identity check."],
            ["02", "Shop local", "Browse real-time inventory from approved smoke shops, liquor stores, and hookah retailers."],
            ["03", "Track live", "Follow the order from merchant acceptance through pickup and arrival."],
            ["04", "Show ID", "The driver scans valid photo ID and confirms the adult recipient before handoff."],
          ].map(([num, title, text]) => <article className="step-card" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="section safety" id="safety">
        <div className="safety-visual">
          <div className="shield-orbit"><Icon name="shield" /></div>
          <div className="safety-card one"><Icon name="check" /><span><small>Account check</small><strong>Age verified</strong></span></div>
          <div className="safety-card two"><Icon name="pin" /><span><small>Delivery check</small><strong>ID matched</strong></span></div>
          <div className="safety-card three"><Icon name="check" /><span><small>Merchant</small><strong>License active</strong></span></div>
        </div>
        <div className="safety-copy"><p className="eyebrow">Compliance at the core</p><h2>Safety isn’t a pop-up.<br/>It’s the architecture.</h2><p>Every order is designed to move through a regulated state machine—created, verified, accepted, prepared, picked up, en route, ID checked, and delivered.</p><ul><li><Icon name="check" /> Independent database-backed age verification</li><li><Icon name="check" /> Government ID re-check at the door</li><li><Icon name="check" /> Masked customer, store, and driver contact</li><li><Icon name="check" /> Restricted-zone and operating-hours controls</li><li><Icon name="check" /> Complete audit trail for every handoff</li></ul></div>
      </section>

      <section className="section role-section" id="partners">
        <div className="section-heading centered"><p className="eyebrow">One connected platform</p><h2>Built for every side<br/>of the delivery.</h2></div>
        <div className="role-tabs" role="tablist">
          {["Customer", "Driver", "Merchant", "Admin"].map((item) => <button role="tab" aria-selected={role === item} className={role === item ? "active" : ""} onClick={() => setRole(item)} key={item}>{item}</button>)}
        </div>
        <RolePanel role={role} />
      </section>

      <section className="section app-demo" id="app">
        <div><p className="eyebrow">Mobile-ready PWA</p><h2>One tap from<br/>your home screen.</h2><p>The BLNTLY experience is responsive, touch-friendly, keyboard accessible, and installable on supported mobile devices. No app-store wait required for the first launch.</p><div className="hero-actions"><button className="primary" onClick={() => setInstalled(true)}>{installed ? "Install instructions ready" : "Install BLNTLY"} <Icon name="arrow" /></button><button className="secondary" onClick={() => setChatOpen(true)}>Try AI support</button></div>{installed && <div className="install-note"><Icon name="check" /> On your phone, open the browser menu and choose “Add to Home Screen.”</div>}</div>
        <div className="feature-stack"><div><Icon name="spark" /><span><strong>BLNTLY Assist</strong><small>Fast, tone-aware order support</small></span></div><div><Icon name="bag" /><span><strong>BLNTLY Rewards</strong><small>Earn points on eligible purchases</small></span></div><div><Icon name="car" /><span><strong>Driver Growth</strong><small>Transparent earnings and milestones</small></span></div></div>
      </section>

      <footer><div><Logo /><p>Regulated local delivery for adults 21+.</p></div><div><strong>Platform</strong><a href="#how">How it works</a><a href="#safety">Safety</a><a href="#partners">Partners</a></div><div><strong>Legal</strong><a href="#safety">Age policy</a><a href="#safety">Privacy</a><a href="#safety">Terms</a></div><div className="footer-adult"><span>21+</span><p>Tobacco products contain nicotine. Nicotine is an addictive chemical.</p></div><small className="copyright">© 2026 BLNTLY. Concept platform by ValleyVizionz AI. Availability is subject to local law, licensing, and approved payment processing.</small></footer>

      <button className="chat-launcher" onClick={() => setChatOpen(!chatOpen)} aria-label="Open BLNTLY Assist"><Icon name={chatOpen ? "close" : "spark"} /></button>
      {chatOpen && <div className="chat-panel"><div className="chat-head"><span><Icon name="spark" /></span><div><strong>BLNTLY Assist</strong><small>AI support · Online</small></div><button onClick={() => setChatOpen(false)} aria-label="Close chat"><Icon name="close" /></button></div><div className="chat-messages">{messages.map((message, i) => <p key={i} className={message.from}>{message.text}</p>)}</div><div className="quick-replies"><button onClick={() => setChatText("Where is my order?")}>Track order</button><button onClick={() => setChatText("How does ID verification work?")}>ID help</button></div><div className="chat-input"><input value={chatText} onChange={(e) => setChatText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Type a message…" aria-label="Chat message"/><button onClick={sendMessage}><Icon name="arrow" /></button></div></div>}
    </main>
  );
}

function OrderScreen() {
  return <div className="app-screen order-screen"><div className="app-greeting"><p>Active order</p><h2>On the way</h2></div><div className="mini-map"><div className="road r1"/><div className="road r2"/><div className="route-line"/><span className="store-pin"><Icon name="store" /></span><span className="car-pin"><Icon name="car" /></span><span className="home-pin"><Icon name="home" /></span></div><article className="tracking-card"><div className="tracking-top"><span><Icon name="clock" /></span><div><small>Estimated arrival</small><h3>18–24 minutes</h3></div></div><div className="progress"><i/><i/><i/><i className="muted"/></div><div className="driver-row"><div className="avatar">DJ</div><div><strong>DeAndre</strong><small>Verified delivery partner · 4.9 ★</small></div><button>•••</button></div><div className="id-reminder"><Icon name="shield" /><span><strong>Have your ID ready</strong><small>The recipient must be 21+ and match the order.</small></span></div></article></div>;
}

function ProfileScreen() {
  return <div className="app-screen profile-screen"><div className="profile-top"><div className="avatar large">MB</div><h2>Marquise</h2><span className="verified-badge"><Icon name="check" /> Age verified</span></div><div className="points-card"><small>BLNTLY REWARDS</small><strong>1,240</strong><span>points available</span><div><i style={{width:"62%"}}/></div><p>260 points until your next reward</p></div><div className="profile-links"><button><span><Icon name="pin" /> Saved addresses</span>›</button><button><span><Icon name="shield" /> Identity & safety</span>›</button><button><span><Icon name="spark" /> Help & support</span>›</button></div></div>;
}

function CartScreen({ cart, subtotal, remove, back }: { cart: Product[]; subtotal: number; remove: (index: number) => void; back: () => void }) {
  const fee = cart.length ? 3.99 : 0;
  return <div className="app-screen cart-screen"><div className="cart-title"><button onClick={back}>‹</button><h2>Your cart</h2><span>{cart.length} items</span></div>{cart.length === 0 ? <div className="empty-cart"><Icon name="bag" /><h3>Your cart is empty</h3><p>Add something from a nearby licensed store.</p></div> : <><div className="cart-items">{cart.map((item, i) => <div key={`${item.id}-${i}`}><div className={`product-art small ${item.accent}`}>{item.initials}</div><span><strong>{item.name}</strong><small>{item.category}</small></span><b>${item.price.toFixed(2)}</b><button onClick={() => remove(i)} aria-label={`Remove ${item.name}`}>×</button></div>)}</div><div className="cart-totals"><p><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></p><p><span>Delivery & compliance</span><b>${fee.toFixed(2)}</b></p><p className="total"><span>Estimated total</span><b>${(subtotal + fee).toFixed(2)}</b></p></div><button className="primary full checkout-button"><Icon name="shield" /> Verify ID to checkout</button><small className="cart-note">Payment activates only after location, license, tax, inventory, and age checks pass.</small></>}</div>;
}

function RolePanel({ role }: { role: string }) {
  const data: Record<string, { icon: string; label: string; title: string; text: string; metrics: [string, string][]; list: string[] }> = {
    Customer: { icon: "bag", label: "Customer app", title: "Fast, familiar, protected.", text: "Discover approved local inventory, save favorites, earn loyalty points, track every order, and get support without hunting through menus.", metrics: [["18–28 min", "Typical delivery window"], ["2-step", "Age verification"]], list: ["Voice-friendly search and support", "Real-time order state", "Secure rewards wallet"] },
    Driver: { icon: "car", label: "Driver app", title: "Earn with clear rules.", text: "Accept eligible routes, navigate pickup and delivery, complete ID verification, document exceptions, and see every dollar before accepting.", metrics: [["100%", "Tip transparency"], ["+2%", "8-month milestone raise"]], list: ["Masked calling and messaging", "Built-in incident escalation", "Compliance-guided handoff"] },
    Merchant: { icon: "store", label: "Merchant portal", title: "Turn shelves into delivery.", text: "Licensed retailers manage inventory, hours, pricing, taxes, fulfillment, and staff permissions from one focused operations console.", metrics: [["Live", "Inventory controls"], ["Role-based", "Staff access"]], list: ["License and permit status", "Order preparation timers", "Payout and tax reporting"] },
    Admin: { icon: "shield", label: "Admin command", title: "See risk before it spreads.", text: "Operations teams monitor license status, verification failures, restricted locations, refunds, incidents, and system health across the marketplace.", metrics: [["24/7", "Risk monitoring"], ["Full", "Audit trail"]], list: ["Jurisdiction rule engine", "Fraud and abuse review", "Merchant and driver controls"] },
  };
  const item = data[role];
  return <div className="role-panel"><div className="role-copy"><span className="role-label"><Icon name={item.icon} /> {item.label}</span><h3>{item.title}</h3><p>{item.text}</p><ul>{item.list.map((line) => <li key={line}><Icon name="check" /> {line}</li>)}</ul><button className="primary">Explore {role.toLowerCase()} flow <Icon name="arrow" /></button></div><div className="role-dashboard"><div className="dash-top"><Logo compact /><span>{role} dashboard</span><div className="avatar mini">MB</div></div><div className="dash-chart"><small>PERFORMANCE SNAPSHOT</small><div className="bar-chart">{[45,68,52,83,62,91,76].map((height, i) => <i key={i} style={{height:`${height}%`}} />)}</div><div className="chart-days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div><div className="metric-grid">{item.metrics.map(([value,label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><div className="dash-alert"><Icon name="shield" /><span><strong>All systems ready</strong><small>Compliance checks are operational</small></span><b>Active</b></div></div></div>;
}
