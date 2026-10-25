import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const api = async (path) => {
  const response = await fetch(`/api${path}`);
  if (!response.ok) throw new Error("Unable to load this information.");
  return response.json();
};
const galleryFor = (item) =>
  Array.from(
    new Set(
      [
        ...(Array.isArray(item?.images)
          ? item.images
          : typeof item?.images === "string"
            ? item.images.split(/\r?\n/)
            : []),
        item?.imageUrl,
      ]
        .map((value) => String(value || "").trim())
        .filter(Boolean),
    ),
  );
const imageFor = (item) => galleryFor(item)[0] || "/assets/macrobyte-logo.png";
const price = (value) => value || "Request a quote";
const productPath = (product) =>
  `/product/${encodeURIComponent(product.slug || product.id)}`;
const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("mb_cart") || "[]");
  } catch {
    return [];
  }
};
const writeCart = (items) => {
  localStorage.setItem("mb_cart", JSON.stringify(items));
  window.dispatchEvent(new Event("mb-cart-updated"));
};

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(() =>
    readCart().reduce(
      (total, item) => total + Math.max(Number(item.quantity) || 1, 1),
      0,
    ),
  );
  useEffect(() => {
    api("/category-menu")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.classList.add("mobile-drawer-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("mobile-drawer-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  useEffect(() => {
    const updateCartCount = () =>
      setCartCount(
        readCart().reduce(
          (total, item) => total + Math.max(Number(item.quantity) || 1, 1),
          0,
        ),
      );
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("mb-cart-updated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("mb-cart-updated", updateCartCount);
    };
  }, []);
  const close = () => {
    setOpen(false);
    setCategoryOpen(false);
    setExpandedCategory(null);
  };
  const search = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q")?.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
    event.currentTarget.reset();
    close();
  };
  return (
    <header className={`mb-header${open ? " open" : ""}`}>
      <div className="mb-header-inner">
        <Link className="mb-brand" to="/" onClick={close}>
          <img src="/assets/macrobyte-logo.png" alt="MacroByte Trade" />
        </Link>
        <nav className="mb-nav" aria-label="Main navigation">
          <Link className="mb-drawer-brand" to="/" onClick={close}>
            <img src="/assets/macrobyte-logo.png" alt="MacroByte Trade" />
          </Link>
          <Link to="/services" onClick={close}>
            Services
          </Link>
          <Link to="/shop" onClick={close}>
            Shop
          </Link>
          <div
            className={`mb-category${categoryOpen ? " open" : ""}`}
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={categoryOpen}
              onClick={() => setCategoryOpen((value) => !value)}
            >
              <span className="mb-category-label">Categories</span>
              <span className="mb-category-arrow" aria-hidden="true" />
            </button>
            <div className="mb-dropdown">
              <Link to="/products" onClick={close}>
                All categories
              </Link>
              {categories.map((category) => {
                const hasSubcategories = category.subcategories?.length > 0;
                const expanded = expandedCategory === category.id;
                return (
                  <div
                    className={`mb-category-group${expanded ? " expanded" : ""}`}
                    key={category.id}
                  >
                    <div className="mb-category-group-head">
                      <Link
                        className="mb-parent-category"
                        to={`/shop?category=${encodeURIComponent(category.slug)}`}
                        onClick={close}
                      >
                        {category.name}
                      </Link>
                      {hasSubcategories && (
                        <button
                          className="mb-subcategory-toggle"
                          type="button"
                          aria-label={`Toggle ${category.name} subcategories`}
                          aria-expanded={expanded}
                          onClick={() =>
                            setExpandedCategory((value) =>
                              value === category.id ? null : category.id,
                            )
                          }
                        >
                          <span aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    {hasSubcategories && (
                      <div className="mb-subcategory-menu">
                        <div className="mb-subcategory-links">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              to={`/shop?category=${encodeURIComponent(category.slug)}&subcategory=${encodeURIComponent(subcategory.slug)}`}
                              onClick={close}
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <Link to="/brands" onClick={close}>
            Brands
          </Link>
          <Link to="/about" onClick={close}>
            About
          </Link>
          <Link to="/contact" onClick={close}>
            Contact
          </Link>
        </nav>
        <div className="mb-actions">
          <form className="header-search" onSubmit={search}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              name="q"
              aria-label="Search products"
              placeholder="Search products..."
            />
          </form>
          <Link
            className="mb-cart"
            to="/cart"
            onClick={close}
            aria-label={`Cart${cartCount ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.5 4.5h2l1.7 10.1a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 1.9-1.5l1.2-5.9H7.1" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="17" cy="20" r="1" />
            </svg>
            <span className="mb-cart-label">Cart</span>
            {cartCount > 0 && <b>{cartCount}</b>}
          </Link>
          <Link className="mb-quote" to="/contact" onClick={close}>
            Get a quote
          </Link>
        </div>
        <button
          className="mb-menu"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <button
        className="mb-drawer-backdrop"
        type="button"
        aria-label="Close navigation"
        onClick={close}
      />
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <img
            src="/assets/macrobyte-logo.png"
            alt="MacroByte Trade"
            className="footer-logo"
          />
          <p>
            Technology, practical services, and dependable business supply in
            one place.
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link to="/shop">Shop</Link>
          <Link to="/products">Categories</Link>
          <Link to="/brands">Brands</Link>
          <Link to="/services">Services</Link>
        </div>
        <div>
          <h2>Company</h2>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
          <a href="/admin/">Admin</a>
        </div>
        <div>
          <h2>Get in touch</h2>
          <p>
            Banasree, Rampura
            <br />
            Dhaka, Bangladesh
          </p>
          <Link to="/contact">Send an enquiry →</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} MacroByte Trade. All rights reserved.
      </div>
    </footer>
  );
}

function WhatsAppButton() {
  const [phone, setPhone] = useState("");
  useEffect(() => {
    api("/site")
      .then((site) => setPhone(site?.contact?.whatsapp || site?.contact?.phone || ""))
      .catch(() => setPhone(""));
  }, []);
  const number = phone.replace(/\D/g, "");
  const configured = number.length >= 10 && !/^8800+$/.test(number);
  const href = configured
    ? `https://wa.me/${number}?text=${encodeURIComponent("Hello MacroByte Trade, I would like some assistance.")}`
    : "/contact";
  return (
    <a
      className="whatsapp-float"
      href={href}
      target={configured ? "_blank" : undefined}
      rel={configured ? "noreferrer" : undefined}
      aria-label={configured ? "Message MacroByte Trade on WhatsApp" : "Contact MacroByte Trade"}
      title={configured ? "Message us on WhatsApp" : "Contact us"}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4.2a11.5 11.5 0 0 0-9.8 17.5L4.6 27l5.5-1.5A11.5 11.5 0 1 0 16 4.2Zm0 20.7a9.2 9.2 0 0 1-4.7-1.3l-.4-.2-3.2.8.9-3.1-.2-.4A9.2 9.2 0 1 1 16 24.9Zm5-6.9c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.2-.8 1-.9 1.1-.4.2-.7.1a7.5 7.5 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6s0-.4 0-.6c-.1-.1-.7-1.7-.9-2.3-.3-.7-.5-.6-.7-.6h-.6c-.2 0-.6.1-.9.5s-1.2 1.1-1.2 2.7 1.3 3.1 1.5 3.3a10.5 10.5 0 0 0 4 3.5c.6.2 1 .4 1.4.5.6.2 1.2.2 1.6.1.5-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.2-.2-.5-.3Z" />
      </svg>
      <span>WhatsApp</span>
    </a>
  );
}

function ProductCard({ product, add }) {
  const productImage = galleryFor(product)[0];
  return (
    <article className="product-card">
      {productImage ? (
        <Link
          className="product-media"
          aria-label={`View ${product.name}`}
          to={productPath(product)}
        >
          <img src={productImage} alt={product.name} />
        </Link>
      ) : (
        <Link
          className="product-placeholder"
          aria-label={`View ${product.name}`}
          to={productPath(product)}
        >
          <img src="/assets/macrobyte-logo.png" alt="" />
          <span>Image coming soon</span>
        </Link>
      )}
      <div className="product-card-body">
        <p className="eyebrow">{product.category}</p>
        <h2>{product.name}</h2>
        <strong>{price(product.price)}</strong>
        <div className="card-actions">
          <Link to={productPath(product)}>View product</Link>
          {add && (
            <button type="button" onClick={() => add(product)}>
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function PageLoader({ label = "Loading" }) {
  return (
    <main className="page page-loader" role="status" aria-live="polite">
      <span className="page-loader-spinner" aria-hidden="true" />
      <p>{label}</p>
    </main>
  );
}

function useCatalogue() {
  const [state, setState] = useState({
    products: [],
    categories: [],
    services: [],
    site: null,
    error: "",
    loading: true,
  });
  useEffect(() => {
    Promise.all([
      api("/site"),
      api("/products"),
      api("/categories"),
      api("/services"),
    ])
      .then(([site, products, categories, services]) =>
        setState({ site, products, categories, services, error: "", loading: false }),
      )
      .catch((error) =>
        setState((value) => ({ ...value, error: error.message, loading: false })),
      );
  }, []);
  return state;
}

function Home() {
  const { site, products, categories, services, error, loading } = useCatalogue();
  if (loading) return <PageLoader label="Loading MacroByte Trade" />;
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            {site?.hero?.eyebrow || "MacroByte Trade"}
          </span>
          <h1>
            {site?.hero?.title || "Technology that works for your world."}
          </h1>
          <p>
            {site?.hero?.description ||
              "Technology, services, and business supply in one place."}
          </p>
          <div className="hero-actions">
            <Link className="button" to="/shop">
              Explore products <span>→</span>
            </Link>
            <Link className="hero-story" to="/about">
              <i>▶</i> Watch our story
            </Link>
          </div>
        </div>
        <aside className="hero-visual" aria-label="MacroByte Trade solutions">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="hero-logo-plate">
            <img
              src={site?.logoUrl || "/assets/macrobyte-logo.png"}
              alt={site?.brand || "MacroByte Trade"}
            />
          </div>
          <div className="hero-float hero-float-top">
            <i>⚙</i>
            <span>
              Smart IT<small>Solutions</small>
            </span>
          </div>
          <div className="hero-float hero-float-right">
            <i>▣</i>
            <span>
              Business<small>Supplies</small>
            </span>
          </div>
          <div className="hero-float hero-float-bottom">
            <i>◌</i>
            <span>
              Creative &<small>Digital services</small>
            </span>
          </div>
        </aside>
        <div className="hero-benefits">
          <span>
            ▣
            <b>
              Wide Product Range<small>For Home & Business</small>
            </b>
          </span>
          <span>
            ⚙
            <b>
              Expert Support<small>Reliable & Responsive</small>
            </b>
          </span>
          <span>
            ◈
            <b>
              Trusted Partner<small>Quality & Genuine Products</small>
            </b>
          </span>
          <span>
            ▣
            <b>
              Fast Nationwide Delivery<small>Across Bangladesh</small>
            </b>
          </span>
        </div>
      </section>
      <section className="tech-pulse" aria-label="MacroByte catalogue overview">
        <div className="tech-pulse-copy">
          <span className="eyebrow">MacroByte signal</span>
          <h2>Technology sourcing, support and services—working as one.</h2>
          <p>
            Explore a practical catalogue built around the equipment, setup and
            day-to-day support modern work demands.
          </p>
          <Link to="/contact">Plan a requirement with us <span>→</span></Link>
        </div>
        <div className="tech-stats">
          <article>
            <strong>{products.length || "—"}</strong>
            <span>Products to explore</span>
          </article>
          <article>
            <strong>{categories.length || "—"}</strong>
            <span>Technology categories</span>
          </article>
          <article>
            <strong>{services.length || "—"}</strong>
            <span>Service capabilities</span>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="section-title">
          <div>
            <span className="eyebrow">What we do</span>
            <h2>Solutions for every part of your work.</h2>
          </div>
          <Link to="/services">All services →</Link>
        </div>
        <div className="cards service-cards">
          {services.slice(0, 6).map((service) => (
            <article className="service-card" key={service.id}>
              <h3>{service.name || service.title}</h3>
              <p>{service.description}</p>
              <Link to="/services">Learn more →</Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-title">
          <div>
            <span className="eyebrow">Products & supplies</span>
            <h2>Browse products by category.</h2>
          </div>
          <Link to="/shop">View the shop →</Link>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="cards">
          {categories.map((category) => (
            <article className="category-card" key={category.id}>
              <img src={imageFor(category)} alt={category.name} />
              <div>
                <h3>{category.name}</h3>
                <p>
                  {
                    products.filter(
                      (product) => product.category === category.name,
                    ).length
                  }{" "}
                  stocked products available
                </p>
                <Link
                  to={`/shop?category=${encodeURIComponent(category.slug)}`}
                >
                  Explore {category.name} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="solution-matrix">
        <div className="solution-matrix-intro">
          <span className="eyebrow">Built for real work</span>
          <h2>A clearer path from idea to a working setup.</h2>
          <p>
            Whether you are upgrading one desk or planning for an entire team,
            we help bring the right pieces together.
          </p>
          <Link to="/contact">Start a conversation →</Link>
        </div>
        <div className="solution-matrix-grid">
          <article>
            <span>01</span>
            <h3>Equip</h3>
            <p>Practical technology and supplies for workspaces and everyday use.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Connect</h3>
            <p>Accessories and infrastructure choices that fit together properly.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Support</h3>
            <p>Clear guidance when you need to compare, source or move forward.</p>
          </article>
        </div>
      </section>
      <section className="section how-it-works">
        <div className="section-title">
          <div>
            <span className="eyebrow">Straightforward support</span>
            <h2>From requirement to the right solution.</h2>
          </div>
          <Link to="/contact">Talk to our team →</Link>
        </div>
        <div className="process-grid">
          <article>
            <span>01</span>
            <h3>Tell us what you need</h3>
            <p>
              Share the product, service, office setup, or supply requirement
              you are planning.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Get practical guidance</h3>
            <p>
              We help compare options, confirm compatibility, availability, and
              the next best step.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Move forward with confidence</h3>
            <p>
              Receive a clear quotation, delivery plan, or service arrangement
              suited to your requirements.
            </p>
          </article>
        </div>
      </section>
      <section className="section featured-products">
        <div className="section-title">
          <div>
            <span className="eyebrow">Selected from the catalogue</span>
            <h2>Popular essentials, ready to explore.</h2>
          </div>
          <Link to="/shop">See all products →</Link>
        </div>
        <div className="cards featured-product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="category-network">
        <div>
          <span className="eyebrow">Technology network</span>
          <h2>Find the right starting point.</h2>
          <p>
            Browse organised product areas, then move from discovery to a
            focused enquiry whenever you need guidance.
          </p>
        </div>
        <div className="network-links">
          {categories.slice(0, 8).map((category, index) => (
            <Link
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.slug)}`}
            >
              <span>0{index + 1}</span>
              {category.name}
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>
      <section className="business-callout">
        <div>
          <span className="eyebrow">For offices, shops and growing teams</span>
          <h2>One partner for technology, services and business supply.</h2>
          <p>
            From a single accessory to a complete workplace requirement,
            MacroByte Trade makes sourcing and support easier.
          </p>
        </div>
        <div className="business-callout-actions">
          <Link className="button" to="/contact">
            Request a business quote →
          </Link>
          <Link to="/services">Explore our services</Link>
        </div>
      </section>
    </>
  );
}

function Shop() {
  const [allProducts, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategoryMenu, setSubcategoryMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const availability = searchParams.get("availability") || "";
  const sort = searchParams.get("sort") || "featured";
  useEffect(() => {
    Promise.all([api("/products"), api("/categories"), api("/category-menu")])
      .then(([products, list, menu]) => {
        setProducts(products);
        setCategories(list);
        setSubcategoryMenu(menu);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);
  const brands = useMemo(
    () =>
      Array.from(
        new Set(allProducts.map((item) => item.brand).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b)),
    [allProducts],
  );
  const products = useMemo(() => {
    const toNumber = (value) => Number(String(value || "").replace(/[^0-9.]/g, "")) || 0;
    const filtered = allProducts.filter(
        (item) =>
          (!category ||
            item.category ===
              categories.find((x) => x.slug === category)?.name ||
            item.category === category) &&
          (!subcategory ||
            item.subCategory ===
              subcategoryMenu
                .flatMap((item) => item.subcategories || [])
                .find((item) => item.slug === subcategory)?.name ||
            item.subCategory === subcategory) &&
          (!query ||
            `${item.name} ${item.brand} ${item.model} ${item.category} ${item.subCategory}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (!brand || item.brand === brand) &&
          (!minPrice || toNumber(item.price) >= Number(minPrice)) &&
          (!maxPrice || toNumber(item.price) <= Number(maxPrice)) &&
          (!availability || (availability === "in-stock" && Number(item.stockQty) > 0)),
      );
    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return toNumber(a.price) - toNumber(b.price);
      if (sort === "price-high") return toNumber(b.price) - toNumber(a.price);
      if (sort === "name") return a.name.localeCompare(b.name);
      return Number(a.order || 0) - Number(b.order || 0);
    });
  }, [allProducts, availability, brand, categories, category, maxPrice, minPrice, query, sort, subcategory, subcategoryMenu]);
  const update = (key, value) => {
    const next = new URLSearchParams(searchParams);
    value ? next.set(key, value) : next.delete(key);
    if (key === "category") next.delete("subcategory");
    setSearchParams(next, { replace: true });
  };
  const add = (product) => {
    const items = readCart();
    const old = items.find((item) => item.id === product.id);
    writeCart(
      old
        ? items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...items, { ...product, quantity: 1 }],
    );
  };
  const clearFilters = () => setSearchParams({}, { replace: true });
  if (loading) return <PageLoader label="Loading product catalogue" />;
  return (
    <main className="page catalogue-page">
      <header className="catalogue-intro">
        <div>
          <span className="eyebrow">MacroByte catalogue</span>
          <h1>Find the right technology.</h1>
          <p>Search stocked products, compare practical options, and request a quotation when you are ready.</p>
        </div>
        <div className="catalogue-intro-stats" aria-label="Catalogue summary">
          <strong>{allProducts.length}</strong><span>Listed products</span>
          <strong>{categories.length}</strong><span>Categories</span>
        </div>
      </header>
      <div className="catalogue-layout">
        <aside className="catalogue-controls" aria-label="Filter products">
          <div className="catalogue-filter-heading"><h2>Filter products</h2><p>Refine the catalogue to match your requirement.</p></div>
          <div className="catalogue-search">
            <label htmlFor="catalogue-search">Search catalogue</label>
            <input id="catalogue-search" value={query} onChange={(event) => update("q", event.target.value)} placeholder="Search products, brands or models" />
          </div>
          <div className="catalogue-filter-grid">
            <label>Category<select value={category} onChange={(event) => update("category", event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>
            <label>Subcategory<select value={subcategory} onChange={(event) => update("subcategory", event.target.value)}><option value="">All subcategories</option>{subcategoryMenu.find((item) => item.slug === category)?.subcategories?.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>) || subcategoryMenu.flatMap((item) => item.subcategories || []).map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>
            <label>Brand<select value={brand} onChange={(event) => update("brand", event.target.value)}><option value="">All brands</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label>Minimum price<input type="number" min="0" value={minPrice} onChange={(event) => update("minPrice", event.target.value)} placeholder="Any" /></label>
            <label>Maximum price<input type="number" min="0" value={maxPrice} onChange={(event) => update("maxPrice", event.target.value)} placeholder="Any" /></label>
            <label>Availability<select value={availability} onChange={(event) => update("availability", event.target.value)}><option value="">All products</option><option value="in-stock">In stock</option></select></label>
            <label>Sort by<select value={sort} onChange={(event) => update("sort", event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></label>
          </div>
          {(query || category || subcategory || brand || minPrice || maxPrice || availability || sort !== "featured") && <button className="catalogue-clear" type="button" onClick={clearFilters}>Clear all filters</button>}
        </aside>
        <section className="catalogue-products" aria-label="Product results">
          <div className="catalogue-results"><p><strong>{products.length}</strong> product{products.length === 1 ? "" : "s"} found</p><span>Stock and final pricing are confirmed before ordering.</span></div>
          <div className="cards catalogue-cards">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} add={add} />
            ))}
            {!products.length && <div className="catalogue-empty"><h2>No products match these filters.</h2><p>Try clearing a filter or searching a different product name.</p><button type="button" onClick={clearFilters}>Show all products</button></div>}
          </div>
        </section>
      </div>
    </main>
  );
}

function Categories() {
  const { products, categories, loading } = useCatalogue();
  if (loading) return <PageLoader label="Loading categories" />;
  return (
    <main className="page catalogue-page">
      <header className="catalogue-intro catalogue-directory-intro"><div><span className="eyebrow">Product catalogue</span><h1>Browse by category.</h1><p>Explore product groups built for home, office, and growing businesses.</p></div><Link className="button" to="/shop">Browse all products</Link></header>
      <div className="cards catalogue-cards category-directory">
        {categories.map((category) => (
          <article className="category-card" key={category.id}>
            <img src={imageFor(category)} alt={category.name} />
            <div>
              <h3>{category.name}</h3>
              <p>
                {category.description ||
                  `${products.filter((product) => product.category === category.name).length} stocked products available`}
              </p>
              <Link to={`/shop?category=${encodeURIComponent(category.slug)}`}>
                Explore {category.name} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Brands() {
  const { products, loading } = useCatalogue();
  const brands = useMemo(() => Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b)), [products]);
  if (loading) return <PageLoader label="Loading brands" />;
  return (
    <main className="page catalogue-page">
      <header className="catalogue-intro catalogue-directory-intro"><div><span className="eyebrow">Product catalogue</span><h1>Shop trusted brands.</h1><p>Browse the brands currently available through MacroByte Trade.</p></div><Link className="button" to="/shop">Browse all products</Link></header>
      <div className="brand-directory">
        {brands.map((brand) => { const count = products.filter((product) => product.brand === brand).length; return <Link key={brand} to={`/shop?brand=${encodeURIComponent(brand)}`}><strong>{brand}</strong><span>{count} product{count === 1 ? "" : "s"}</span><b>View products →</b></Link>; })}
        {!brands.length && <div className="catalogue-empty"><h2>Brands are being prepared.</h2><p>Please browse the full product catalogue in the meantime.</p><Link to="/shop">Browse products</Link></div>}
      </div>
    </main>
  );
}

function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(undefined);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewMessage, setReviewMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => {
    api("/products")
      .then((items) => {
        const current =
          items.find((item) => item.slug === slug || item.id === slug) || null;
        setProduct(current);
        setRelated(
          current
            ? items
                .filter(
                  (item) =>
                    item.id !== current.id &&
                    item.category === current.category,
                )
                .slice(0, 4)
            : [],
        );
      })
      .catch(() => setProduct(null));
  }, [slug]);
  useEffect(() => {
    if (!product?.id) return;
    api(`/reviews?productId=${encodeURIComponent(product.id)}`)
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [product?.id]);
  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);
  if (product === undefined)
    return <PageLoader label="Loading product details" />;
  if (!product)
    return (
      <main className="page">
        <h1>Product not found</h1>
        <Link to="/shop">Return to shop</Link>
      </main>
    );
  const galleryImages = galleryFor(product);
  const visibleImages = galleryImages.length
    ? galleryImages
    : ["/assets/macrobyte-logo.png"];
  const selectedImage = visibleImages[activeImage] || visibleImages[0];
  const changeImage = (direction) =>
    setActiveImage(
      (index) =>
        (index + direction + visibleImages.length) % visibleImages.length,
    );
  const add = (target = product) => {
    const items = readCart();
    const old = items.find((item) => item.id === target.id);
    writeCart(
      old
        ? items.map((item) =>
            item.id === target.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...items, { ...target, quantity: 1 }],
    );
  };
  const submitReview = async (event) => {
    event.preventDefault();
    setReviewMessage("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          productId: product.id,
          productName: product.name,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to submit your review.");
      setReviewMessage(result.message);
      event.currentTarget.reset();
    } catch (error) {
      setReviewMessage(error.message);
    }
  };
  return (
    <main className="page product-page">
      <section className="product-detail">
        <div className="product-detail-media product-gallery">
          <div className="product-gallery-stage">
            <img
              key={selectedImage}
              src={selectedImage}
              alt={product.name}
              width="960"
              height="720"
              fetchPriority="high"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/assets/macrobyte-logo.png";
              }}
            />
            {visibleImages.length > 1 && (
              <>
                <button
                  className="gallery-control gallery-control-previous"
                  type="button"
                  aria-label="Show previous product image"
                  onClick={() => changeImage(-1)}
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  className="gallery-control gallery-control-next"
                  type="button"
                  aria-label="Show next product image"
                  onClick={() => changeImage(1)}
                >
                  <span aria-hidden="true">›</span>
                </button>
                <span className="gallery-count" aria-live="polite">
                  {activeImage + 1} / {visibleImages.length}
                </span>
              </>
            )}
          </div>
          {visibleImages.length > 1 && (
            <div className="product-gallery-thumbnails" aria-label="Product images">
              {visibleImages.map((src, index) => (
                <button
                  key={src}
                  className="product-gallery-thumbnail"
                  type="button"
                  aria-label={`Show image ${index + 1} of ${visibleImages.length}`}
                  aria-pressed={index === activeImage}
                  onClick={() => setActiveImage(index)}
                  style={{ backgroundImage: `url("${src}")` }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-detail-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-copy">
            {product.details || product.description || product.model}
          </p>
          <div className="product-purchase">
            <div>
              <span>Price</span>
              <strong>{price(product.price)}</strong>
            </div>
            <p className="stock-status">
              {product.stockStatus || "Stock confirmation required"}
            </p>
          </div>
          {product.features?.length > 0 && (
            <div className="product-features">
              <h2>Product highlights</h2>
              <ul>
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="product-detail-actions">
            <button
              className="button"
              type="button"
              onClick={() => add(product)}
            >
              Add to cart
            </button>
            <Link to={`/contact?product=${encodeURIComponent(product.name)}`}>
              Request a quote
            </Link>
          </div>
          <p className="product-assurance">
            Secure your stock before visiting—we will confirm availability and
            delivery options.
          </p>
        </div>
      </section>
      <section
        className="product-confidence"
        aria-label="Buying with MacroByte Trade"
      >
        <div>
          <strong>Stock confirmation</strong>
          <span>We confirm availability before your order is finalised.</span>
        </div>
        <div>
          <strong>Business support</strong>
          <span>Ask for delivery, bulk pricing, or a tailored quotation.</span>
        </div>
        <div>
          <strong>Local assistance</strong>
          <span>Get practical help from our Dhaka team when you need it.</span>
        </div>
      </section>
      <section className="product-reviews">
        <div className="review-list">
          <span className="eyebrow">Customer feedback</span>
          <h2>Reviews for this product</h2>
          {reviews.length ? (
            <div className="review-items">
              {reviews.map((review) => (
                <article key={review.id}>
                  <div>
                    <strong>{review.name}</strong>
                    <span aria-label={`${review.rating} out of 5 stars`}>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="no-reviews">
              No approved reviews yet. Be the first to share your experience.
            </p>
          )}
        </div>
        <form className="review-form" onSubmit={submitReview}>
          <h2>Write a review</h2>
          <label>
            Your name
            <input name="name" minLength="2" maxLength="80" required />
          </label>
          <label>
            Your rating
            <select name="rating" defaultValue="5" required>
              <option value="5">5 — Excellent</option>
              <option value="4">4 — Good</option>
              <option value="3">3 — Average</option>
              <option value="2">2 — Fair</option>
              <option value="1">1 — Poor</option>
            </select>
          </label>
          <label>
            Your review
            <textarea
              name="comment"
              minLength="10"
              maxLength="1500"
              rows="4"
              required
            />
          </label>
          <button type="submit">Submit review</button>
          {reviewMessage && <p className="review-message">{reviewMessage}</p>}
        </form>
      </section>
      {related.length > 0 && (
        <section className="related-products">
          <div className="section-title">
            <div>
              <span className="eyebrow">You may also need</span>
              <h2>Related products</h2>
            </div>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
              View all in {product.category} →
            </Link>
          </div>
          <div className="cards">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} add={add} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Services() {
  const { services, loading } = useCatalogue();
  if (loading) return <PageLoader label="Loading services" />;
  return (
    <main className="page">
      <span className="eyebrow">What we do</span>
      <h1>Solutions for every part of your work.</h1>
      <div className="cards service-cards">
        {services.map((service) => (
          <article className="service-card" key={service.id}>
            <h2>{service.name || service.title}</h2>
            <p>{service.description}</p>
            <Link to="/contact">Make an enquiry →</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
function About() {
  return (
    <main className="page">
      <span className="eyebrow">About MacroByte</span>
      <h1>A practical partner for people and businesses.</h1>
      <p>
        MacroByte Trade brings digital assistance, technology support, creative
        services and trading supplies together in one convenient place in
        Banasree, Dhaka.
      </p>
      <h2>Straightforward service. Solutions that make sense.</h2>
      <p>
        Get help with digital tasks, IT equipment and business supplies under
        one roof. Discuss your requirements and understand the next steps before
        proceeding.
      </p>
    </main>
  );
}
function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Please check the form and try again.");
      setSent(true);
      event.currentTarget.reset();
    } catch (reason) {
      setError(reason.message);
    }
  };
  return (
    <main className="page contact-page">
      <span className="eyebrow">Let’s connect</span>
      <h1>What can we help you with?</h1>
      <p>
        Tell us about your service request or product requirement. We’ll use the
        details to understand what you need.
      </p>
      {sent && (
        <p className="success">Thank you. Your enquiry has been sent.</p>
      )}
      {error && <p className="error">{error}</p>}
      <form className="contact-form" onSubmit={submit}>
        <label>
          Your name *<input name="name" required />
        </label>
        <label>
          Phone
          <input name="phone" />
        </label>
        <label>
          Email
          <input type="email" name="email" />
        </label>
        <label>
          Subject
          <input name="subject" />
        </label>
        <label>
          How can we help? *<textarea name="message" required rows="6" />
        </label>
        <button className="button">Send enquiry</button>
      </form>
    </main>
  );
}
function Cart() {
  const [items, setItems] = useState(readCart);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) =>
      sum +
      (Number(String(item.price || "").replace(/[^0-9.]/g, "")) || 0) *
        item.quantity,
    0,
  );
  const change = (id, quantity) => {
    const next =
      quantity < 1
        ? items.filter((item) => item.id !== id)
        : items.map((item) => (item.id === id ? { ...item, quantity } : item));
    setItems(next);
    writeCart(next);
  };
  return (
    <main className="page cart-page">
      <span className="eyebrow">Your selection</span>
      <h1>Your cart</h1>
      {!items.length ? (
        <div className="empty-cart">
          <h2>Your cart is waiting for you.</h2>
          <p>
            Browse our technology, accessories and business supplies to get
            started.
          </p>
          <Link className="button" to="/shop">
            Explore products →
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <article key={item.id}>
                <img src={imageFor(item)} alt="" />
                <div className="cart-item-info">
                  <p className="eyebrow">
                    {item.category || "MacroByte Trade"}
                  </p>
                  <h2>{item.name}</h2>
                  <strong>{price(item.price)}</strong>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => change(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => change(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => change(item.id, 0)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <p>
              <span>Products ({totalItems})</span>
              <strong>
                {total ? `৳${total.toLocaleString("en-BD")}` : "On request"}
              </strong>
            </p>
            <p>
              <span>Delivery</span>
              <strong>Confirmed after order</strong>
            </p>
            <div>
              <span>Estimated total</span>
              <strong>
                {total
                  ? `৳${total.toLocaleString("en-BD")}`
                  : "Request a quote"}
              </strong>
            </div>
            <Link className="button" to="/contact">
              Request a quote →
            </Link>
            <small>
              We will confirm stock, delivery options and final pricing before
              your order is placed.
            </small>
          </aside>
        </div>
      )}
    </main>
  );
}
function NotFound() {
  return (
    <main className="page">
      <h1>Page not found</h1>
      <p>The page you requested is unavailable.</p>
      <Link to="/">Return home</Link>
    </main>
  );
}
function ScrollToRouteTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <>
      <ScrollToRouteTop />
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/admin"
            element={<Navigate to="/admin/index.html" replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
