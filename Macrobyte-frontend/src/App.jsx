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
const imageFor = (item) =>
  item?.imageUrl || item?.images?.[0] || "/assets/macrobyte-logo.png";
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
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(() =>
    readCart().reduce(
      (total, item) => total + Math.max(Number(item.quantity) || 1, 1),
      0,
    ),
  );
  useEffect(() => {
    api("/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);
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
          <img src="/assets/macrobyte-logo.png" alt="MacroByte Trade" width="148" height="52" />
        </Link>
        <nav className="mb-nav" aria-label="Main navigation">
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
              onClick={() => setCategoryOpen(true)}
            >
              <span className="mb-category-label">Categories</span>
              <svg
                className="mb-chevron"
                viewBox="0 0 16 10"
                aria-hidden="true"
              >
                <path d="m2 2 6 6 6-6" />
              </svg>
            </button>
            <div className="mb-dropdown">
              <Link to="/products" onClick={close}>
                All categories
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${encodeURIComponent(category.slug)}`}
                  onClick={close}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
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
              placeholder="Search products…"
              autoComplete="off"
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
            width="148"
            height="52"
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
  const productImage = product.images?.[0] || product.imageUrl;
  return (
    <article className="product-card">
      {productImage ? (
        <Link
          className="product-media"
          aria-label={`View ${product.name}`}
          to={productPath(product)}
        >
          <img src={productImage} alt={product.name} width="720" height="540" loading="lazy" />
        </Link>
      ) : (
        <Link
          className="product-placeholder"
          aria-label={`View ${product.name}`}
          to={productPath(product)}
        >
          <img src="/assets/macrobyte-logo.png" alt="" width="220" height="90" />
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

function useCatalogue() {
  const [state, setState] = useState({
    products: [],
    categories: [],
    services: [],
    site: null,
    error: "",
  });
  useEffect(() => {
    Promise.all([
      api("/site"),
      api("/products"),
      api("/categories"),
      api("/services"),
    ])
      .then(([site, products, categories, services]) =>
        setState({ site, products, categories, services, error: "" }),
      )
      .catch((error) =>
        setState((value) => ({ ...value, error: error.message })),
      );
  }, []);
  return state;
}

function Home() {
  const { site, products, categories, services, error } = useCatalogue();
  const featuredProducts = products.slice(0, 7);
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <h1>Technology that works.</h1>
          <p>
            {site?.hero?.description ||
              "Technology, services, and business supply in one place."}
          </p>
          <div className="hero-actions">
            <Link className="button" to="/shop">
              Explore products <span aria-hidden="true">→</span>
            </Link>
            <Link className="hero-story" to="/about">
              <i aria-hidden="true">▶</i> Watch our story
            </Link>
          </div>
        </div>
        <aside className="hero-visual" aria-label="MacroByte Trade solutions">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="hero-logo-plate">
            <img
              src={site?.logoUrl || "/assets/macrobyte-logo.png"}
              alt={site?.brand || "MacroByte Trade"}
              width="380"
              height="328"
              fetchPriority="high"
            />
          </div>
          <div className="hero-float hero-float-top">
            <i aria-hidden="true">+</i>
            <span>Smart IT<small>Solutions</small></span>
          </div>
          <div className="hero-float hero-float-right">
            <i aria-hidden="true">▣</i>
            <span>Business<small>Supplies</small></span>
          </div>
          <div className="hero-float hero-float-bottom">
            <i aria-hidden="true">◌</i>
            <span>Creative &amp;<small>Digital services</small></span>
          </div>
        </aside>
        <div className="hero-benefits">
          <span><i aria-hidden="true">▣</i><b>Wide Product Range<small>For Home &amp; Business</small></b></span>
          <span><i aria-hidden="true">+</i><b>Expert Support<small>Reliable &amp; Responsive</small></b></span>
          <span><i aria-hidden="true">◈</i><b>Trusted Partner<small>Quality &amp; Genuine Products</small></b></span>
          <span><i aria-hidden="true">▣</i><b>Fast Nationwide Delivery<small>Across Bangladesh</small></b></span>
        </div>
      </section>

      <section className="tech-pulse" aria-label="MacroByte catalogue overview">
        <div className="tech-pulse-copy">
          <h2>Technology, support &amp; supply.</h2>
          <p>Explore a practical catalogue built around the equipment, setup and day-to-day support modern work demands.</p>
          <Link to="/contact">Plan a requirement with us <span aria-hidden="true">→</span></Link>
        </div>
        <div className="tech-stats">
          <article><strong>{products.length || "—"}</strong><span>Products to explore</span></article>
          <article><strong>{categories.length || "—"}</strong><span>Technology categories</span></article>
          <article><strong>{services.length || "—"}</strong><span>Service capabilities</span></article>
        </div>
      </section>

      <section className="home-product-run" aria-labelledby="product-run-title">
        <div className="home-section-intro">
          <h2 id="product-run-title">Browse products.</h2>
          <p>Start with what you need now, then move into the detail when you are ready.</p>
          <Link to="/shop">Browse every product</Link>
        </div>
        {error && <p className="error" role="status">{error}</p>}
        <div className="product-frame-run">
          {featuredProducts.map((product, index) => (
            <Link
              className={`product-frame ${index === 2 ? "product-frame-lifted" : ""}`}
              key={product.id}
              to={productPath(product)}
            >
              <img src={imageFor(product)} alt={product.name} width="720" height="540" loading="lazy" onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/assets/macrobyte-logo.png";
              }} />
              <span>{product.name}</span>
              <strong>{price(product.price)}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-services-index" aria-labelledby="services-index-title">
        <div className="home-section-intro">
          <h2 id="services-index-title">Services for the work around the product.</h2>
          <p>Bring the equipment, setup and support conversation into one place.</p>
        </div>
        <div className="services-index-groups">
          {services.slice(0, 6).map((service) => (
            <article key={service.id}>
              <h3>{service.name || service.title}</h3>
              <p>{service.description}</p>
              <Link to="/services">See service details</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-category-index" aria-labelledby="category-index-title">
        <div className="home-category-copy">
          <h2 id="category-index-title">Find your starting point.</h2>
          <p>Choose a category to keep the search focused, or open the full shop when you know exactly what you need.</p>
          <Link to="/shop">Open the full shop</Link>
        </div>
        <div className="category-list">
          {categories.map((category) => {
            const count = products.filter((product) => product.category === category.name).length;
            return (
              <Link key={category.id} to={`/shop?category=${encodeURIComponent(category.slug)}`}>
                <img src={imageFor(category)} alt="" width="96" height="72" loading="lazy" onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/assets/macrobyte-logo.png";
                }} />
                <span>{category.name}</span>
                <small>{count} products</small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-enquiry" aria-labelledby="enquiry-title">
        <div>
          <h2 id="enquiry-title">Have a specific requirement?</h2>
          <p>Tell MacroByte what you are sourcing and receive practical guidance for the next step.</p>
        </div>
        <Link className="catalogue-primary-action" to="/contact">Request a quote</Link>
      </section>
    </>
  );
}

function Shop() {
  const [allProducts, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  useEffect(() => {
    Promise.all([api("/products"), api("/categories")])
      .then(([products, list]) => {
        setProducts(products);
        setCategories(list);
      })
      .catch(() => setProducts([]));
  }, []);
  const products = useMemo(
    () =>
      allProducts.filter(
        (item) =>
          (!category ||
            item.category ===
              categories.find((x) => x.slug === category)?.name ||
            item.category === category) &&
          (!query ||
            `${item.name} ${item.brand} ${item.model} ${item.category}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [allProducts, categories, category, query],
  );
  const update = (key, value) => {
    const next = new URLSearchParams(searchParams);
    value ? next.set(key, value) : next.delete(key);
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
  return (
    <main className="page">
      <span className="eyebrow">MacroByte shop</span>
      <h1>Technology for work, home and business.</h1>
      <p>
        Browse stocked products by category, compare models and request delivery
        or a quotation.
      </p>
      <div className="shop-tools">
        <input
          value={query}
          onChange={(event) => update("q", event.target.value)}
          placeholder="Search brand, model or product…"
          aria-label="Search catalogue"
          autoComplete="off"
        />
        <select
          value={category}
          onChange={(event) => update("category", event.target.value)}
          aria-label="Filter products by category"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <p className="shop-summary">
        {products.length} product{products.length === 1 ? "" : "s"} found
      </p>
      <div className="cards">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} add={add} />
        ))}
      </div>
    </main>
  );
}

function Categories() {
  const { products, categories } = useCatalogue();
  return (
    <main className="page">
      <span className="eyebrow">Product catalogue</span>
      <h1>Browse products by category.</h1>
      <div className="cards">
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

function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(undefined);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewMessage, setReviewMessage] = useState("");
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
  if (product === undefined)
    return (
      <main className="page">
        <p>Loading product…</p>
      </main>
    );
  if (!product)
    return (
      <main className="page">
        <h1>Product not found</h1>
        <Link to="/shop">Return to shop</Link>
      </main>
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
        <div className="product-detail-media">
          <img src={imageFor(product)} alt={product.name} />
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
  const { services } = useCatalogue();
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
        <p className="success" role="status">Thank you. Your enquiry has been sent.</p>
      )}
      {error && <p className="error" role="alert">{error}</p>}
      <form className="contact-form" onSubmit={submit}>
        <label>
          Your name *<input name="name" autoComplete="name" required />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" />
        </label>
        <label>
          Email
          <input type="email" name="email" autoComplete="email" spellCheck={false} />
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
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />
      <main className="app-main" id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products" element={<Categories />} />
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
