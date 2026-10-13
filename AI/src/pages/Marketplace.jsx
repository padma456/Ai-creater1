
import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import {
  Search,
  Plus,
  ShoppingBag,
  Store,
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  X,
  Trash2,
  Tag,
  Sparkles,
  Eye,
  IndianRupee,
} from "lucide-react";
import "./Marketplace.css";

const API_BASE = "http://localhost:5000";

// IMPORTANT: Replace with your actual receiving UPI ID.
const RECEIVER_UPI_ID = "YOUR_UPI_ID@bank";
const RECEIVER_NAME = "CreatorSphere";

const categories = [
  "All",
  "AI Images",
  "Videos",
  "Articles",
  "Captions",
  "Templates",
  "Digital Art",
  "Other",
];

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

function getAuthToken() {
  const tokenKeys = [
    "creatorSphereToken",
    "token",
    "cs-token",
    "authToken",
    "accessToken",
    "jwtToken",
  ];

  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);

    if (token && token !== "null" && token !== "undefined") {
      return token;
    }
  }

  const userKeys = [
    "user",
    "cs-user",
    "currentUser",
    "authUser",
    "creatorSphereUser",
  ];

  for (const key of userKeys) {
    try {
      const user = JSON.parse(localStorage.getItem(key) || "null");
      const token = user?.token || user?.accessToken || user?.jwtToken;

      if (token) return token;
    } catch {
      // Try the next storage key.
    }
  }

  return null;
}

async function readResponse(response) {
  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || `Request failed with status ${response.status}.`
    );
  }

  return data;
}

function normalizeProduct(product) {
  const rawImage = product.image ?? product.image_url ?? "";

  const rawMediaType = String(
    product.mediaType ?? product.media_type ?? "image"
  ).toLowerCase();

  let mediaType = "image";

  if (rawMediaType.includes("video")) {
    mediaType = "video";
  } else if (
    rawMediaType.includes("document") ||
    rawMediaType.includes("pdf") ||
    rawMediaType.includes("text")
  ) {
    mediaType = "document";
  }

  return {
    ...product,
    id: product.id,
    name: product.name ?? product.title ?? "Untitled content",
    description: product.description ?? "",
    category: product.category ?? "Other",
    seller:
      product.seller ??
      product.creator_name ??
      product.creatorName ??
      "Independent Creator",
    price: Number(product.price) || 0,
    image:
      typeof rawImage === "string" && rawImage.startsWith("/uploads/")
        ? `${API_BASE}${rawImage}`
        : rawImage,
    mediaType,
    fileName: product.fileName ?? product.file_name ?? "",
  };
}

async function fetchProductsFromApi() {
  const response = await fetch(`${API_BASE}/api/products`);
  const data = await readResponse(response);

  return (data.products || []).map(normalizeProduct);
}

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [activeTab, setActiveTab] = useState("buy");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  const [preview, setPreview] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "AI Images",
    price: "",
    description: "",
    file: null,
  });

  // Load the product list from Express/MySQL.
  async function refreshProducts() {
    setProducts(await fetchProductsFromApi());
  }

  useEffect(() => {
    let active = true;

    fetchProductsFromApi()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((error) => {
        if (active) {
          setNotice(`Could not load products: ${error.message}`);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.description,
        product.seller,
        product.category,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "text/plain",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setNotice(
        "Choose a JPG, PNG, WEBP, GIF, MP4, WEBM, TXT, or PDF file."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setNotice("Please choose a file smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    setForm((previous) => ({
      ...previous,
      file,
    }));

    setNotice("");
  }

  // Publish a new marketplace product.
  async function addProduct(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setNotice("Please enter a title and description.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setNotice("Please enter a valid price.");
      return;
    }

    if (!form.file) {
      setNotice("Please select a content file.");
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setNotice("Please log in before publishing content.");
      return;
    }

    setIsSubmitting(true);
    setNotice("");

    try {
      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("category", form.category);
      formData.append("price", String(Number(form.price)));
      formData.append("description", form.description.trim());
      formData.append("file", form.file);

      const response = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      await readResponse(response);
      await refreshProducts();

      setActiveTab("listings");
      setSearch("");
      setCategory("All");
      setShowForm(false);

      setForm({
        name: "",
        category: "AI Images",
        price: "",
        description: "",
        file: null,
      });

      setNotice("Your content has been published successfully!");
    } catch (error) {
      setNotice(error.message || "Unable to publish content.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // BUY NOW: create a pending order and open the UPI QR checkout.
  async function buyProduct(product) {
    if (isCreatingOrder) return;

    if (!product?.id) {
      setNotice("Product ID is missing. Please refresh and try again.");
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setNotice("Please log in before placing an order.");
      return;
    }

    setIsCreatingOrder(true);
    setNotice("");
    setPaymentError("");

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      const data = await readResponse(response);
      const order = data.order;

      const orderId =
        order?.id ?? order?.orderId ?? data.orderId ?? data.id;

      if (!orderId) {
        console.error("Unexpected order response:", data);
        throw new Error("The server did not return the order ID.");
      }

      const amount = Number(order?.amount ?? product.price);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("The order has an invalid payment amount.");
      }

      setPreview(null);

      setPaymentOrder({
        id: orderId,
        productName: product.name,
        amount,
      });
    } catch (error) {
      console.error("Order creation error:", error);
      setNotice(error.message || "Could not create order.");
    } finally {
      setIsCreatingOrder(false);
    }
  }

  // Build the UPI payment link for the current order.
  const upiPaymentUri = paymentOrder
    ? `upi://pay?${new URLSearchParams({
        pa: RECEIVER_UPI_ID,
        pn: RECEIVER_NAME,
        am: Number(paymentOrder.amount).toFixed(2),
        cu: "INR",
        tn: `CreatorSphere Order ${paymentOrder.id}`,
      }).toString()}`
    : "";

  const isUpiConfigured =
    RECEIVER_UPI_ID !== "YOUR_UPI_ID@bank" &&
    RECEIVER_UPI_ID.includes("@");

  function openUpiApp() {
    if (!upiPaymentUri) return;
    window.location.href = upiPaymentUri;
  }

  async function deleteProduct(id) {
    const token = getAuthToken();

    if (!token) {
      setNotice("Please log in to delete a listing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await readResponse(response);
      await refreshProducts();

      if (String(preview?.id) === String(id)) {
        setPreview(null);
      }

      setNotice("Listing removed successfully.");
    } catch (error) {
      setNotice(error.message || "Unable to delete listing.");
    }
  }

  return (
    <main className="marketplace-page">
      {/* HERO */}
      <section className="market-hero">
        <div className="market-hero-content">
          <span className="market-eyebrow">
            <Sparkles size={15} /> CREATOR ECONOMY
          </span>

          <h1>
            Your creativity.
            <br />
            <span>Your marketplace.</span>
          </h1>

          <p>
            Discover digital content, showcase your creativity, and build
            your own collection of AI-powered assets.
          </p>

          <button
            type="button"
            className="market-primary-btn"
            onClick={() => {
              setActiveTab("listings");
              setShowForm(true);
            }}
          >
            <Plus size={18} /> Sell your content
          </button>
        </div>

        <div className="market-hero-art">
          <div className="market-art-orbit orbit-one" />
          <div className="market-art-orbit orbit-two" />

          <div className="market-art-center">
            <Sparkles size={54} />
          </div>

          <div className="market-floating-card card-top">
            <ImageIcon size={20} />
            <span>AI Images</span>
          </div>

          <div className="market-floating-card card-bottom">
            <Video size={20} />
            <span>Creative Videos</span>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="market-benefits">
        <div>
          <ShoppingBag size={21} />
          <span>Discover digital products</span>
        </div>

        <div>
          <Upload size={21} />
          <span>Upload your creations</span>
        </div>

        <div>
          <Store size={21} />
          <span>Build your storefront</span>
        </div>
      </section>

      {/* NOTIFICATIONS */}
      {notice && (
        <div className="market-notice" role="status">
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Dismiss notice"
            onClick={() => setNotice("")}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* MARKETPLACE */}
      <section className="market-catalog">
        <div className="market-section-heading">
          <div>
            <span className="market-eyebrow">EXPLORE & CREATE</span>
            <h2>Digital Marketplace</h2>
            <p>Find inspiration or publish your next creation.</p>
          </div>

          <span className="market-count">
            {products.length}{" "}
            {products.length === 1 ? "listing" : "listings"}
          </span>
        </div>

        {/* TABS */}
        <div className="market-tabs">
          <button
            type="button"
            className={activeTab === "buy" ? "active" : ""}
            onClick={() => {
              setActiveTab("buy");
              setShowForm(false);
            }}
          >
            <ShoppingBag size={17} /> Buy Content
          </button>

          <button
            type="button"
            className={activeTab === "listings" ? "active" : ""}
            onClick={() => {
              setActiveTab("listings");
              setShowForm(false);
            }}
          >
            <Store size={17} /> My Listings
          </button>

          <button
            type="button"
            className="market-add-tab"
            onClick={() => {
              setActiveTab("listings");
              setShowForm((previous) => !previous);
            }}
          >
            <Plus size={17} /> Add Content
          </button>
        </div>

        {/* PUBLISH FORM */}
        {showForm && (
          <form className="market-product-form" onSubmit={addProduct}>
            <div className="market-form-heading">
              <div>
                <span className="market-eyebrow">NEW LISTING</span>
                <h3>Publish your content</h3>
              </div>

              <button
                type="button"
                className="market-icon-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="market-form-grid">
              <label>
                Content title *
                <input
                  name="name"
                  value={form.name}
                  onChange={updateForm}
                  placeholder="e.g. Instagram AI Art Pack"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Category *
                <select
                  name="category"
                  value={form.category}
                  onChange={updateForm}
                  required
                >
                  {categories
                    .filter((item) => item !== "All")
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Price (₹) *
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={updateForm}
                  min="0"
                  max="1000000"
                  placeholder="299"
                  required
                />
              </label>

              <label className="market-full-field">
                Description *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  placeholder="Describe what the customer will receive..."
                  maxLength={500}
                  rows={3}
                  required
                />
              </label>

              <label className="market-full-field">
                Upload content file *
                <div className="market-upload-area">
                  <Upload size={27} />

                  <strong>
                    {form.file
                      ? form.file.name
                      : "Choose a file from your computer"}
                  </strong>

                  <span>
                    Images, videos, TXT or PDF · Maximum 2 MB
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,text/plain,application/pdf"
                    onChange={handleFile}
                    required
                  />
                </div>
              </label>
            </div>

            <div className="market-form-actions">
              <button
                type="button"
                className="market-secondary-btn"
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="market-primary-btn"
                disabled={isSubmitting}
              >
                <Plus size={17} />
                {isSubmitting ? "Publishing..." : "Publish listing"}
              </button>
            </div>
          </form>
        )}

        {/* SEARCH AND CATEGORY FILTER */}
        <div className="market-toolbar">
          <div className="market-search">
            <Search size={19} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search content, creators, categories..."
              aria-label="Search content"
            />
          </div>

          <label className="market-category-select">
            <Tag size={17} />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
            >
              {categories.map((item) => (
                <option value={item} key={item}>
                  {item === "All" ? "All categories" : item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="market-results-line">
          <h3>
            {activeTab === "buy" ? "Explore content" : "Your listings"}
          </h3>
          <span>{visibleProducts.length} results</span>
        </div>

        {/* PRODUCT RESULTS */}
        {isLoading ? (
          <div className="market-empty">
            <ShoppingBag size={38} />
            <h3>Loading marketplace...</h3>
            <p>Fetching products from the database.</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="market-empty">
            <ShoppingBag size={38} />
            <h3>No content found</h3>
            <p>Try another search or publish your first listing.</p>

            <button
              type="button"
              className="market-primary-btn"
              onClick={() => {
                setActiveTab("listings");
                setShowForm(true);
              }}
            >
              <Plus size={17} /> Add content
            </button>
          </div>
        ) : (
          <div className="market-product-grid">
            {visibleProducts.map((product) => (
              <article className="market-product-card" key={product.id}>
                <div className="market-product-media">
                  {product.mediaType === "video" ? (
                    <video
                      src={product.image}
                      className="market-product-image"
                      controls
                      preload="metadata"
                    />
                  ) : product.mediaType === "document" ? (
                    <div className="market-document-preview">
                      <FileText size={45} />
                      <span>{product.fileName || "Digital document"}</span>
                    </div>
                  ) : (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="market-product-image"
                    />
                  )}

                  <span className="market-product-category">
                    {product.category}
                  </span>

                  <button
                    type="button"
                    className="market-preview-btn"
                    onClick={() => setPreview(product)}
                    aria-label={`View ${product.name}`}
                  >
                    <Eye size={17} />
                  </button>
                </div>

                <div className="market-product-info">
                  <div className="market-seller-line">
                    <span className="market-seller-avatar">
                      {(product.seller || "C").charAt(0).toUpperCase()}
                    </span>
                    <span>{product.seller}</span>
                  </div>

                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <div className="market-product-bottom">
                    <div>
                      <span className="market-price-label">Price</span>
                      <strong>{formatPrice(product.price)}</strong>
                    </div>

                    {activeTab === "buy" ? (
                      <button
                        type="button"
                        className="market-buy-btn"
                        disabled={isCreatingOrder}
                        onClick={() => buyProduct(product)}
                      >
                        <ShoppingBag size={15} />
                        {isCreatingOrder
                          ? "Creating order..."
                          : "Buy Now"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="market-delete-btn"
                        onClick={() => deleteProduct(product.id)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* PRODUCT PREVIEW MODAL */}
      {preview && (
        <div
          className="market-modal-backdrop"
          onClick={() => setPreview(null)}
        >
          <section
            className="market-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label={preview.name}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="market-icon-btn market-modal-close"
              onClick={() => setPreview(null)}
              aria-label="Close preview"
            >
              <X size={21} />
            </button>

            {preview.mediaType === "video" ? (
              <video
                src={preview.image}
                controls
                className="market-modal-media"
              />
            ) : preview.mediaType === "document" ? (
              <div className="market-document-preview market-modal-document">
                <FileText size={52} />
                <span>{preview.fileName || "Digital document"}</span>
                <a href={preview.image} target="_blank" rel="noreferrer">
                  Open document
                </a>
              </div>
            ) : (
              <img
                src={preview.image}
                alt={preview.name}
                className="market-modal-media"
              />
            )}

            <span className="market-eyebrow">{preview.category}</span>
            <h2>{preview.name}</h2>
            <p>{preview.description}</p>

            <div className="market-modal-footer">
              <strong>{formatPrice(preview.price)}</strong>
              <button
                type="button"
                className="market-primary-btn"
                disabled={isCreatingOrder}
                onClick={() => buyProduct(preview)}
              >
                <ShoppingBag size={17} />
                {isCreatingOrder ? "Creating order..." : "Buy Now"}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* UPI QR CHECKOUT */}
      {paymentOrder && (
        <div
          className="market-modal-backdrop"
          onClick={() => {
            setPaymentOrder(null);
            setPaymentError("");
          }}
        >
          <section
            className="market-preview-modal market-qr-checkout"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-checkout-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="market-icon-btn market-modal-close"
              onClick={() => {
                setPaymentOrder(null);
                setPaymentError("");
              }}
              aria-label="Close checkout"
            >
              <X size={21} />
            </button>

            <span className="market-eyebrow">SECURE CHECKOUT</span>
            <h2 id="qr-checkout-title">Scan to pay</h2>

            <p className="qr-product-name">{paymentOrder.productName}</p>

            <div className="qr-total">
              <span>Total amount</span>
              <strong>{formatPrice(paymentOrder.amount)}</strong>
            </div>

            <div className="qr-code-container">
              {isUpiConfigured ? (
                <QRCode
                  value={upiPaymentUri}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  title="Scan to pay with UPI"
                />
              ) : (
                <div className="qr-setup-message">
                  <IndianRupee size={32} />
                  <strong>UPI ID not configured</strong>
                  <p>
                    Update RECEIVER_UPI_ID at the top of Marketplace.jsx
                    to generate your payment QR code.
                  </p>
                </div>
              )}
            </div>

            {isUpiConfigured && (
              <>
                <p className="qr-instructions">
                  Open a UPI app on your phone, scan the QR code, and verify
                  the recipient name and amount before approving payment.
                </p>

                <button
                  type="button"
                  className="market-primary-btn qr-open-app"
                  onClick={openUpiApp}
                >
                  Open UPI app
                </button>
              </>
            )}

            <div className="qr-order-reference">
              Order #{paymentOrder.id}
            </div>

            {paymentError && (
              <p className="qr-payment-error" role="alert">
                {paymentError}
              </p>
            )}

            <p className="qr-important-note">
              Payment is not automatically verified by this QR code. Your
              order remains pending until the backend verifies payment.
            </p>

            <button
              type="button"
              className="market-secondary-btn qr-close-btn"
              onClick={() => {
                setPaymentOrder(null);
                setPaymentError("");
              }}
            >
              Close checkout
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
