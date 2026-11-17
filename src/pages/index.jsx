import React, { useState, useEffect, useMemo, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  ShieldCheck,
  Truck,
  Package,
  Layers,
  Store,
  User,
  LogOut,
  Sun,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Bike,
  X,
  CreditCard,
  Trash2,
  Edit,
  LayoutGrid,
  Table,
  Filter,
  Tag,
  Printer,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  FileText,
  Navigation,
  Bell,
  Sparkles,
  ExternalLink,
  Monitor,
  ShoppingCart,
  Flame,
  Utensils,
  Ticket,
  Percent,
  Users,
  BarChart3,
  PieChart,
  Settings,
  Sliders,
  Check,
  Minus,
  Download,
  Award,
  UserPlus,
  UserCheck,
  Key,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://e-commerce-backend-153p.onrender.com/api/v1";

export default function AdminDashboard() {
  const router = useRouter();

  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // App Theme
  const [darkMode, setDarkMode] = useState(false);

  // Active Navigation Tab: 
  // 'dispatcher' | 'pos' | 'kds' | 'riders' | 'products' | 'categories' | 'branches' | 'coupons' | 'customers' | 'analytics' | 'store_settings' | 'profile'
  const [activeTab, setActiveTab] = useState("dispatcher");

  // Core Data State
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);

  // Toast Notification System
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Dispatcher Filter State
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Assign Driver Modal
  const [selectedOrderForDriver, setSelectedOrderForDriver] = useState(null);
  const [driverForm, setDriverForm] = useState({
    driver_name: "ពិសិដ្ឋ Express (Piseth Express)",
    driver_phone: "+855 12 345 678",
    driver_plate_number: "1AB-8899",
    estimated_delivery_minutes: 25,
  });

  // Timeline Modal
  const [selectedOrderForTimeline, setSelectedOrderForTimeline] = useState(null);

  // Print Bill / Receipt Modal
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null);

  // =======================
  // 1. IN-STORE POS STATE
  // =======================
  const [posCart, setPosCart] = useState([]);
  const [posOrderType, setPosOrderType] = useState("DINE_IN"); // DINE_IN | TAKEAWAY | DELIVERY
  const [posCustomerName, setPosCustomerName] = useState("Walk-in Guest");
  const [posCustomerPhone, setPosCustomerPhone] = useState("+855 12 000 000");
  const [posTableOrAddress, setPosTableOrAddress] = useState("Table #01");
  const [posPaymentMethod, setPosPaymentMethod] = useState("Cash"); // Cash | ABA KHQR | Credit Card
  const [posPromoCodeInput, setPosPromoCodeInput] = useState("");
  const [posDiscountPercent, setPosDiscountPercent] = useState(0);
  const [posSearchQuery, setPosSearchQuery] = useState("");
  const [posCategoryFilter, setPosCategoryFilter] = useState("ALL");
  const [posSubmitting, setPosSubmitting] = useState(false);

  // =======================
  // 2. KITCHEN DISPLAY (KDS) STATE
  // =======================
  const [kdsFilter, setKdsFilter] = useState("ALL"); // ALL | COOKING | READY
  const [kdsCheckedItems, setKdsCheckedItems] = useState({}); // `${orderId}_${itemIdx}` => boolean

  // =======================
  // 3. RIDERS & FLEET STATE
  // =======================
  const [riders, setRiders] = useState([
    { id: 1, name: "សុខ ពិសិដ្ឋ (Piseth)", phone: "+855 12 345 678", plate: "1AB-8899", status: "AVAILABLE", rating: 4.9, trips: 28 },
    { id: 2, name: "ចាន់ ដារ៉ា (Dara)", phone: "+855 77 889 900", plate: "1CD-5522", status: "ON_ROUTE", rating: 4.8, trips: 35 },
    { id: 3, name: "ម៉ៅ វិបុល (Vibol)", phone: "+855 96 112 233", plate: "1EF-7711", status: "AVAILABLE", rating: 5.0, trips: 42 },
    { id: 4, name: "គង់ សំណាង (Samnang)", phone: "+855 88 445 566", plate: "1GH-3344", status: "OFFLINE", rating: 4.7, trips: 19 },
  ]);
  const [riderSearchQuery, setRiderSearchQuery] = useState("");
  const [showAddRiderModal, setShowAddRiderModal] = useState(false);
  const [newRider, setNewRider] = useState({
    name: "",
    phone: "+855 ",
    plate: "",
    status: "AVAILABLE",
  });

  // =======================
  // 4. COUPONS & PROMO STATE
  // =======================
  const [coupons, setCoupons] = useState([
    { id: 1, code: "WELCOME20", discount_type: "PERCENT", value: 20, min_order: 10, expiry: "2026-12-31", uses: 64, is_active: true },
    { id: 2, code: "FREEDELIVERY", discount_type: "FIXED", value: 1.5, min_order: 15, expiry: "2026-12-31", uses: 120, is_active: true },
    { id: 3, code: "LUNCHDEAL", discount_type: "PERCENT", value: 15, min_order: 8, expiry: "2026-11-30", uses: 45, is_active: true },
    { id: 4, code: "VIPGOLD50", discount_type: "PERCENT", value: 50, min_order: 30, expiry: "2026-12-31", uses: 18, is_active: true },
  ]);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "PERCENT",
    value: 10,
    min_order: 10,
    expiry: "2026-12-31",
    is_active: true,
  });

  // =======================
  // 5. CUSTOMERS CRM STATE
  // =======================
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  // =======================
  // 6. STORE SETTINGS STATE
  // =======================
  const [storeSettings, setStoreSettings] = useState({
    store_name: "Omni POS & Delivery Enterprise",
    exchange_rate_khr: 4100,
    default_delivery_fee: 1.5,
    free_delivery_threshold: 25.0,
    tax_vat_percent: 10,
    auto_accept_orders: false,
    kitchen_sound_alert: true,
    currency_symbol: "$",
  });

  // =======================
  // PRODUCTS STATE
  // =======================
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    barcode: "",
    name: "",
    category: "Coffee & Drinks",
    price: "",
    cost_price: "",
    stock: 50,
    description: "",
    image_url: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("ALL");
  const [productViewMode, setProductViewMode] = useState("grid"); // 'grid' | 'table'
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    id: null,
    barcode: "",
    name: "",
    category: "",
    price: "",
    cost_price: "",
    stock: 0,
    description: "",
    image_url: "",
  });
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // =======================
  // CATEGORIES STATE
  // =======================
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    icon_name: "Layers",
    image_url: "",
    display_order: 1,
  });
  const [editCategoryForm, setEditCategoryForm] = useState({
    id: null,
    name: "",
    slug: "",
    description: "",
    icon_name: "Layers",
    image_url: "",
    display_order: 1,
    is_active: true,
  });
  const [updatingCategory, setUpdatingCategory] = useState(false);

  // =======================
  // BRANCHES STATE
  // =======================
  const [branchSearchQuery, setBranchSearchQuery] = useState("");
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [selectedBranchForEdit, setSelectedBranchForEdit] = useState(null);
  const [newBranch, setNewBranch] = useState({
    name: "",
    code: "",
    address: "",
    phone: "+855 ",
    opening_hours: "07:00 AM - 10:00 PM",
    latitude: 11.5564,
    longitude: 104.9282,
  });
  const [editBranchForm, setEditBranchForm] = useState({
    id: null,
    name: "",
    code: "",
    address: "",
    phone: "",
    opening_hours: "07:00 AM - 10:00 PM",
    latitude: 11.5564,
    longitude: 104.9282,
    is_active: true,
  });
  const [updatingBranch, setUpdatingBranch] = useState(false);

  // =======================
  // PROFILE STATE
  // =======================
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    current_password: "",
    new_password: "",
  });
  const [profileMessage, setProfileMessage] = useState("");
  // =======================
  // USERS & STAFF STATE
  // =======================
  const [usersList, setUsersList] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [newUserForm, setNewUserForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "cashier",
  });
  const [editUserForm, setEditUserForm] = useState({
    id: null,
    email: "",
    full_name: "",
    phone: "",
    role: "cashier",
    is_active: true,
    new_password: "",
  });
  const [savingUser, setSavingUser] = useState(false);



  // Clean Logout & Redirect
  const handleLogout = useCallback(() => {
    localStorage.removeItem("omni_admin_token");
    localStorage.removeItem("omni_admin_user");
    setAuthToken(null);
    setCurrentUser(null);
    setAuthChecked(false);
    router.push("/login");
  }, [router]);

  // Authenticated Fetch Helper
  const authFetch = useCallback(
    async (url, options = {}) => {
      const token = authToken || localStorage.getItem("omni_admin_token");
      if (!token) {
        handleLogout();
        return null;
      }

      const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      };

      try {
        const res = await fetch(url, { ...options, headers });
        if (res.status === 401 || res.status === 403) {
          console.warn("Session expired or unauthorized. Redirecting to login.");
          handleLogout();
          return null;
        }
        return res;
      } catch (err) {
        console.error("Network error during authFetch:", err);
        return null;
      }
    },
    [authToken, handleLogout]
  );

  // 1. Initial Authentication & Theme Check
  useEffect(() => {
    const savedTheme = localStorage.getItem("omni_theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const token = localStorage.getItem("omni_admin_token");
    const userJson = localStorage.getItem("omni_admin_user");

    if (!token || !userJson) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userJson);
      if (user.role !== "admin" && user.role !== "cashier") {
        handleLogout();
        return;
      }

      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) {
            handleLogout();
            return;
          }
          return res.json();
        })
        .then((verifiedUser) => {
          if (verifiedUser) {
            setAuthToken(token);
            setCurrentUser(verifiedUser);
            setProfileForm({
              full_name: verifiedUser.full_name || "",
              phone: verifiedUser.phone || "",
              current_password: "",
              new_password: "",
            });
            setAuthChecked(true);
          }
        })
        .catch(() => handleLogout());
    } catch {
      handleLogout();
    }
  }, [handleLogout, router]);

  // 2. Fetch Helper Functions
  const fetchOrders = useCallback(async () => {
    const res = await authFetch(`${API_BASE}/orders/admin/all`);
    if (res && res.ok) {
      const data = await res.json();
      setOrders(data);
    }
  }, [authFetch]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res && res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.log("Error loading products:", err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res && res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && !newProduct.category) {
          setNewProduct((prev) => ({ ...prev, category: data[0].name }));
        }
      }
    } catch (err) {
      console.log("Error loading categories:", err);
    }
  }, [newProduct.category]);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/branches`);
      if (res && res.ok) {
        const data = await res.json();
        setBranches(data);
      }
    } catch (err) {
      console.log("Error loading branches:", err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/auth/users`);
      if (res && res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.log("Error loading users:", err);
    }
  }, [authFetch]);

  // 3. Polling for Live Orders every 10s
  useEffect(() => {
    if (!authChecked || !authToken) return;

    fetchOrders();
    fetchProducts();
    fetchCategories();
    fetchBranches();
    fetchUsers();

    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, [authChecked, authToken, fetchOrders, fetchProducts, fetchCategories, fetchBranches, fetchUsers]);

  // Theme Toggle
  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("omni_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("omni_theme", "light");
    }
  };

  // Dispatch Actions: Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    const res = await authFetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res && res.ok) {
      showToast(`Order #${orderId} status changed to ${newStatus}`, "success");
      fetchOrders();
    } else if (res) {
      showToast("Failed to update status", "error");
    }
  };

  // Driver Assignment Save
  const handleAssignDriver = async (e) => {
    e.preventDefault();
    if (!selectedOrderForDriver) return;

    const res = await authFetch(
      `${API_BASE}/orders/${selectedOrderForDriver.id}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "OUT_FOR_DELIVERY",
          driver_name: driverForm.driver_name,
          driver_phone: driverForm.driver_phone,
          driver_plate_number: driverForm.driver_plate_number,
        }),
      }
    );

    if (res && res.ok) {
      showToast(`Rider assigned to Order #${selectedOrderForDriver.id}`, "success");
      setSelectedOrderForDriver(null);
      fetchOrders();
    } else {
      await updateOrderStatus(selectedOrderForDriver.id, "OUT_FOR_DELIVERY");
      setSelectedOrderForDriver(null);
      fetchOrders();
    }
  };

  // Cloudinary Image Upload
  const handleImageUpload = async (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await authFetch(`${API_BASE}/uploads/image`, {
      method: "POST",
      body: formData,
    });

    if (res && res.ok) {
      const data = await res.json();
      if (target === "category") {
        setNewCategory((prev) => ({ ...prev, image_url: data.url }));
      } else if (target === "edit_category") {
        setEditCategoryForm((prev) => ({ ...prev, image_url: data.url }));
      } else if (target === "edit_product") {
        setEditProductForm((prev) => ({ ...prev, image_url: data.url }));
      } else {
        setNewProduct((prev) => ({ ...prev, image_url: data.url }));
      }
      showToast("Image uploaded to Cloudinary successfully!", "success");
    } else {
      showToast("Image upload failed", "error");
    }
    setUploadingImage(false);
  };

  // Create Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const res = await authFetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newProduct,
        price: parseFloat(newProduct.price),
        cost_price: newProduct.cost_price ? parseFloat(newProduct.cost_price) : null,
        stock: parseInt(newProduct.stock),
      }),
    });

    if (res && res.ok) {
      setShowAddProductModal(false);
      setNewProduct({
        barcode: "",
        name: "",
        category: categories[0]?.name || "Coffee & Drinks",
        price: "",
        cost_price: "",
        stock: 50,
        description: "",
        image_url: "",
      });
      showToast("Product added to catalog successfully", "success");
      fetchProducts();
    } else if (res) {
      const error = await res.json();
      showToast(error.detail || "Unable to save product", "error");
    }
  };

  // Open Edit Product Modal
  const handleStartEditProduct = (p) => {
    setEditProductForm({
      id: p.id,
      barcode: p.barcode || "",
      name: p.name || "",
      category: p.category || (categories[0]?.name || "Coffee & Drinks"),
      price: p.price !== undefined ? p.price : "",
      cost_price: p.cost_price !== null && p.cost_price !== undefined ? p.cost_price : "",
      stock: p.stock !== undefined ? p.stock : 0,
      description: p.description || "",
      image_url: p.image_url || "",
    });
    setSelectedProductForEdit(p);
  };

  // Save / Update Existing Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProductForm.id) return;
    setUpdatingProduct(true);

    const res = await authFetch(`${API_BASE}/products/${editProductForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barcode: editProductForm.barcode ? editProductForm.barcode.trim() : null,
        name: editProductForm.name.trim(),
        category: editProductForm.category,
        price: parseFloat(editProductForm.price),
        cost_price: editProductForm.cost_price ? parseFloat(editProductForm.cost_price) : null,
        stock: parseInt(editProductForm.stock),
        description: editProductForm.description ? editProductForm.description.trim() : null,
        image_url: editProductForm.image_url ? editProductForm.image_url.trim() : null,
      }),
    });

    setUpdatingProduct(false);

    if (res && res.ok) {
      setSelectedProductForEdit(null);
      showToast("Product updated successfully", "success");
      fetchProducts();
    } else if (res) {
      const error = await res.json().catch(() => ({}));
      showToast(error.detail || "Unable to update product", "error");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId, productName) => {
    if (
      !window.confirm(
        `តើអ្នកពិតជាចង់លុបទំនិញ "${productName}" នេះមែនទេ?\n(Are you sure you want to delete "${productName}"?)`
      )
    ) {
      return;
    }

    setDeletingProductId(productId);
    const res = await authFetch(`${API_BASE}/products/${productId}`, {
      method: "DELETE",
    });
    setDeletingProductId(null);

    if (res && (res.status === 204 || res.ok)) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast(`Product "${productName}" deleted`, "success");
    } else if (res) {
      const error = await res.json().catch(() => ({}));
      showToast(error.detail || "Unable to delete product", "error");
    }
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const slugValue =
      newCategory.slug.trim() ||
      newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const res = await authFetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newCategory,
        slug: slugValue,
        display_order: parseInt(newCategory.display_order) || 0,
      }),
    });

    if (res && res.ok) {
      setShowAddCategoryModal(false);
      setNewCategory({
        name: "",
        slug: "",
        description: "",
        icon_name: "Layers",
        image_url: "",
        display_order: categories.length + 1,
      });
      showToast("Category created successfully", "success");
      fetchCategories();
    } else if (res) {
      const error = await res.json();
      showToast(error.detail || "Failed to create category", "error");
    }
  };

  // Start Edit Category
  const handleStartEditCategory = (cat) => {
    setEditCategoryForm({
      id: cat.id,
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      icon_name: cat.icon_name || "Layers",
      image_url: cat.image_url || "",
      display_order: cat.display_order ?? 1,
      is_active: cat.is_active ?? true,
    });
    setSelectedCategoryForEdit(cat);
  };

  // Update Category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryForm.id) return;
    setUpdatingCategory(true);

    const res = await authFetch(`${API_BASE}/categories/${editCategoryForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editCategoryForm.name.trim(),
        slug: editCategoryForm.slug.trim(),
        description: editCategoryForm.description?.trim() || null,
        icon_name: editCategoryForm.icon_name || "Layers",
        image_url: editCategoryForm.image_url?.trim() || null,
        display_order: parseInt(editCategoryForm.display_order) || 1,
        is_active: Boolean(editCategoryForm.is_active),
      }),
    });

    setUpdatingCategory(false);

    if (res && res.ok) {
      setSelectedCategoryForEdit(null);
      showToast("Category updated successfully", "success");
      fetchCategories();
    } else if (res) {
      const err = await res.json().catch(() => ({}));
      showToast(err.detail || "Failed to update category", "error");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (
      !window.confirm(
        `តើអ្នកពិតជាចង់លុបប្រភេទ "${categoryName || categoryId}" នេះមែនទេ? (Delete this category?)`
      )
    ) {
      return;
    }
    const res = await authFetch(`${API_BASE}/categories/${categoryId}`, {
      method: "DELETE",
    });
    if (res && (res.status === 204 || res.ok)) {
      showToast("Category deleted successfully", "success");
      fetchCategories();
    } else if (res) {
      const err = await res.json().catch(() => ({}));
      showToast(err.detail || "Failed to delete category", "error");
    }
  };

  // Create Branch
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    const res = await authFetch(`${API_BASE}/branches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newBranch,
        latitude: parseFloat(newBranch.latitude),
        longitude: parseFloat(newBranch.longitude),
      }),
    });

    if (res && res.ok) {
      setShowAddBranchModal(false);
      setNewBranch({
        name: "",
        code: "",
        address: "",
        phone: "+855 ",
        opening_hours: "07:00 AM - 10:00 PM",
        latitude: 11.5564,
        longitude: 104.9282,
      });
      showToast("Store branch created successfully", "success");
      fetchBranches();
    fetchUsers();
    } else if (res) {
      const error = await res.json();
      showToast(error.detail || "Failed to create branch", "error");
    }
  };

  // Start Edit Branch
  const handleStartEditBranch = (b) => {
    setEditBranchForm({
      id: b.id,
      name: b.name || "",
      code: b.code || "",
      address: b.address || "",
      phone: b.phone || "+855 ",
      opening_hours: b.opening_hours || "07:00 AM - 10:00 PM",
      latitude: b.latitude || 11.5564,
      longitude: b.longitude || 104.9282,
      is_active: b.is_active ?? true,
    });
    setSelectedBranchForEdit(b);
  };

  // Update Branch
  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    if (!editBranchForm.id) return;
    setUpdatingBranch(true);

    const res = await authFetch(`${API_BASE}/branches/${editBranchForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editBranchForm.name.trim(),
        code: editBranchForm.code.trim(),
        address: editBranchForm.address.trim(),
        phone: editBranchForm.phone.trim(),
        opening_hours: editBranchForm.opening_hours.trim(),
        latitude: parseFloat(editBranchForm.latitude),
        longitude: parseFloat(editBranchForm.longitude),
        is_active: Boolean(editBranchForm.is_active),
      }),
    });

    setUpdatingBranch(false);

    if (res && res.ok) {
      setSelectedBranchForEdit(null);
      showToast("Branch updated successfully", "success");
      fetchBranches();
    fetchUsers();
    } else if (res) {
      const err = await res.json().catch(() => ({}));
      showToast(err.detail || "Failed to update branch", "error");
    }
  };

  // Delete Branch
  const handleDeleteBranch = async (branchId, branchName) => {
    if (
      !window.confirm(
        `តើអ្នកពិតជាចង់លុបសាខា "${branchName || branchId}" នេះមែនទេ? (Delete this branch?)`
      )
    ) {
      return;
    }
    const res = await authFetch(`${API_BASE}/branches/${branchId}`, {
      method: "DELETE",
    });
    if (res && (res.status === 204 || res.ok)) {
      showToast("Branch deleted successfully", "success");
      fetchBranches();
    fetchUsers();
    } else if (res) {
      const err = await res.json().catch(() => ({}));
      showToast(err.detail || "Failed to delete branch", "error");
    }
  };

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage("");
    const res = await authFetch(`${API_BASE}/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        current_password: profileForm.current_password || null,
        new_password: profileForm.new_password || null,
      }),
    });

    if (res && res.ok) {
      const updatedUser = await res.json();
      setCurrentUser(updatedUser);
      localStorage.setItem("omni_admin_user", JSON.stringify(updatedUser));
      setProfileMessage("Profile successfully updated!");
      showToast("Admin profile updated", "success");
    } else if (res) {
      const err = await res.json();
      setProfileMessage(err.detail || "Update failed");
      showToast(err.detail || "Update failed", "error");
    }
  };

  // ============================================
  // POS TERMINAL HANDLERS
  // ============================================
  const handlePosAddToCart = (product) => {
    setPosCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity: 1,
        },
      ];
    });
    showToast(`Added "${product.name}" to cart`, "info");
  };

  const handlePosChangeQty = (productId, delta) => {
    setPosCart((prev) =>
      prev
        .map((item) => {
          if (item.product_id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handlePosRemoveItem = (productId) => {
    setPosCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const handleApplyPromoCode = () => {
    const q = posPromoCodeInput.trim().toUpperCase();
    const match = coupons.find((c) => c.code === q && c.is_active);
    if (match) {
      if (match.discount_type === "PERCENT") {
        setPosDiscountPercent(match.value);
        showToast(`Promo applied! ${match.value}% discount`, "success");
      } else {
        setPosDiscountPercent(15);
        showToast(`Promo applied! Discount added`, "success");
      }
    } else {
      showToast("Invalid or expired promo code", "error");
    }
  };

  const handlePosSubmitOrder = async () => {
    if (posCart.length === 0) {
      showToast("Cart is empty! Add products first", "error");
      return;
    }

    setPosSubmitting(true);
    const orderPayload = {
      order_type: posOrderType,
      delivery_address:
        posOrderType === "DINE_IN"
          ? posTableOrAddress || "Dine-In Table #01"
          : posOrderType === "TAKEAWAY"
          ? "Takeaway Counter"
          : posTableOrAddress || "Express Delivery Address",
      contact_phone: posCustomerPhone || "+855 12 000 000",
      delivery_note: `${posOrderType} Order placed via In-Store POS Terminal`,
      payment_method: posPaymentMethod,
      items: posCart.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      })),
    };

    const res = await authFetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    setPosSubmitting(false);

    if (res && res.ok) {
      const createdOrder = await res.json();
      setPosCart([]);
      setPosPromoCodeInput("");
      setPosDiscountPercent(0);
      showToast(`Order #${createdOrder.id} successfully created!`, "success");
      fetchOrders();
      fetchProducts();
      setSelectedOrderForReceipt(createdOrder);
    } else if (res) {
      const err = await res.json().catch(() => ({}));
      showToast(err.detail || "Failed to create order", "error");
    }
  };

  // ============================================
  // RIDERS & FLEET HANDLERS
  // ============================================
  const handleCreateRider = (e) => {
    e.preventDefault();
    if (!newRider.name.trim()) return;
    const riderObj = {
      id: Date.now(),
      name: newRider.name.trim(),
      phone: newRider.phone.trim(),
      plate: newRider.plate.trim() || "1XX-0000",
      status: newRider.status || "AVAILABLE",
      rating: 5.0,
      trips: 0,
    };
    setRiders((prev) => [riderObj, ...prev]);
    setShowAddRiderModal(false);
    setNewRider({ name: "", phone: "+855 ", plate: "", status: "AVAILABLE" });
    showToast(`Rider "${riderObj.name}" added to fleet!`, "success");
  };

  const handleDeleteRider = (riderId, riderName) => {
    if (!window.confirm(`Delete rider "${riderName}"?`)) return;
    setRiders((prev) => prev.filter((r) => r.id !== riderId));
    showToast(`Rider "${riderName}" removed`, "success");
  };

  const handleUpdateRiderStatus = (riderId, newStatus) => {
    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, status: newStatus } : r))
    );
    showToast("Rider status updated", "info");
  };

  // ============================================
  // COUPONS HANDLERS
  // ============================================
  const handleToggleCoupon = (couponId) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, is_active: !c.is_active } : c))
    );
    showToast("Coupon status updated", "info");
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    const couponObj = {
      id: Date.now(),
      code: newCoupon.code.trim().toUpperCase(),
      discount_type: newCoupon.discount_type,
      value: parseFloat(newCoupon.value) || 10,
      min_order: parseFloat(newCoupon.min_order) || 5,
      expiry: newCoupon.expiry || "2026-12-31",
      uses: 0,
      is_active: true,
    };
    setCoupons((prev) => [couponObj, ...prev]);
    setShowAddCouponModal(false);
    setNewCoupon({
      code: "",
      discount_type: "PERCENT",
      value: 10,
      min_order: 10,
      expiry: "2026-12-31",
      is_active: true,
    });
    showToast(`Coupon "${couponObj.code}" created!`, "success");
  };

  const handleDeleteCoupon = (couponId, couponCode) => {
    if (!window.confirm(`Delete coupon "${couponCode}"?`)) return;
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    showToast(`Coupon "${couponCode}" deleted`, "success");
  };

  // ============================================
  // STORE SETTINGS HANDLER
  // ============================================
  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    localStorage.setItem("omni_store_settings", JSON.stringify(storeSettings));
    showToast("Store settings saved successfully!", "success");
  };

  // ============================================
  // MEMOIZED DATA & COMPUTATIONS
  // ============================================
  const dashboardStats = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeProducts = Array.isArray(products) ? products : [];
    const safeBranches = Array.isArray(branches) ? branches : [];
    const totalRev = safeOrders
      .filter((o) => o?.status === "DELIVERED")
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const activeOrdersCount = safeOrders.filter(
      (o) =>
        o.status === "PENDING" ||
        o.status === "CONFIRMED" ||
        o.status === "PREPARING" ||
        o.status === "OUT_FOR_DELIVERY"
    ).length;

    const lowStockCount = safeProducts.filter((p) => p.stock !== null && p.stock < 20).length;

    return {
      totalRevenue: totalRev,
      activeOrders: activeOrdersCount,
      lowStockCount,
      totalOrders: safeOrders.length,
      totalProducts: safeProducts.length,
      totalBranches: safeBranches.length,
    };
  }, [orders, products, branches]);

  // POS Cart Totals
  const posTotals = useMemo(() => {
    const subtotal = posCart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const discount = (subtotal * posDiscountPercent) / 100;
    const deliveryFee = posOrderType === "DELIVERY" ? storeSettings.default_delivery_fee : 0;
    const grandTotalUsd = Math.max(0, subtotal - discount + deliveryFee);
    const grandTotalKhr = Math.round(grandTotalUsd * storeSettings.exchange_rate_khr);

    return {
      subtotal,
      discount,
      deliveryFee,
      grandTotalUsd,
      grandTotalKhr,
    };
  }, [posCart, posDiscountPercent, posOrderType, storeSettings]);

  // Filtered Orders for Dispatch Board
  const filteredOrders = useMemo(() => {
    return (Array.isArray(orders) ? orders : []).filter((order) => {
      const matchesStatus =
        deliveryStatusFilter === "ALL" || order.status === deliveryStatusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.id.toString().includes(q) ||
        (order.delivery_address &&
          order.delivery_address.toLowerCase().includes(q)) ||
        (order.contact_phone && order.contact_phone.includes(q)) ||
        (order.driver_name && order.driver_name.toLowerCase().includes(q)) ||
        (order.items &&
          order.items.some((it) => it.product_name?.toLowerCase().includes(q)));
      return matchesStatus && matchesSearch;
    });
  }, [orders, deliveryStatusFilter, searchQuery]);

  // Filtered Products for Catalog Tab
  const filteredProducts = useMemo(() => {
    return (Array.isArray(products) ? products : []).filter((p) => {
      const matchesCategory =
        productCategoryFilter === "ALL" || p.category === productCategoryFilter;
      const q = productSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [products, productCategoryFilter, productSearchQuery]);

  // Filtered Products for POS Menu
  const posFilteredProducts = useMemo(() => {
    return (Array.isArray(products) ? products : []).filter((p) => {
      const matchesCategory =
        posCategoryFilter === "ALL" || p.category === posCategoryFilter;
      const q = posSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [products, posCategoryFilter, posSearchQuery]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery) return categories;
    const q = categorySearchQuery.toLowerCase().trim();
    return (Array.isArray(categories) ? categories : []).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.slug && c.slug.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, categorySearchQuery]);

  // Filtered Branches
  const filteredBranches = useMemo(() => {
    if (!branchSearchQuery) return branches;
    const q = branchSearchQuery.toLowerCase().trim();
    return (Array.isArray(branches) ? branches : []).filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.code && b.code.toLowerCase().includes(q)) ||
        (b.address && b.address.toLowerCase().includes(q)) ||
        (b.phone && b.phone.includes(q))
    );
  }, [branches, branchSearchQuery]);

  // Filtered Riders
  const filteredRiders = useMemo(() => {
    if (!riderSearchQuery) return riders;
    const q = riderSearchQuery.toLowerCase().trim();
    return (Array.isArray(riders) ? riders : []).filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.plate.toLowerCase().includes(q)
    );
  }, [riders, riderSearchQuery]);

  // KDS Tickets (Sorted active orders: Pending, Confirmed, Preparing)
  const kdsTickets = useMemo(() => {
    return orders.filter((o) => {
      if (kdsFilter === "COOKING") return o.status === "PREPARING";
      if (kdsFilter === "READY") return o.status === "OUT_FOR_DELIVERY";
      return o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PREPARING";
    });
  }, [orders, kdsFilter]);

  // Customer CRM List (Aggregated from real orders)
  const customerList = useMemo(() => {
    const custMap = {};
    orders.forEach((o) => {
      const phone = o.contact_phone || "Unknown";
      if (!custMap[phone]) {
        custMap[phone] = {
          phone,
          name: o.delivery_address?.split(",")[0] || "Guest Customer",
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: o.created_at,
        };
      }
      custMap[phone].totalOrders += 1;
      custMap[phone].totalSpent += o.total_amount || 0;
      if (new Date(o.created_at) > new Date(custMap[phone].lastOrderDate)) {
        custMap[phone].lastOrderDate = o.created_at;
      }
    });

    const list = Object.values(custMap).map((c) => {
      let tier = "BRONZE";
      if (c.totalSpent > 300) tier = "PLATINUM";
      else if (c.totalSpent > 150) tier = "GOLD";
      else if (c.totalSpent > 50) tier = "SILVER";
      return { ...c, tier };
    });

    if (!customerSearchQuery) return list;
    const q = customerSearchQuery.toLowerCase().trim();
    return list.filter(
      (c) => c.phone.includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [orders, customerSearchQuery]);

  // Analytics Computation
  const analyticsData = useMemo(() => {
    const productSalesMap = {};
    const categorySalesMap = {};
    let cardCount = 0;
    let cashCount = 0;
    let khqrCount = 0;

    orders.forEach((o) => {
      if (o.status === "DELIVERED") {
        if (o.payment_method?.includes("QR")) khqrCount++;
        else if (o.payment_method?.includes("Card")) cardCount++;
        else cashCount++;

        o.items?.forEach((it) => {
          productSalesMap[it.product_name] =
            (productSalesMap[it.product_name] || 0) + it.quantity;
        });
      }
    });

    const topProducts = Object.entries(productSalesMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    products.forEach((p) => {
      categorySalesMap[p.category] = (categorySalesMap[p.category] || 0) + 1;
    });

    const totalOrdersDelivered = orders.filter((o) => o?.status === "DELIVERED").length;
    const avgOrderValue =
      totalOrdersDelivered > 0
        ? dashboardStats.totalRevenue / totalOrdersDelivered
        : 0;

    return {
      topProducts,
      categorySalesMap,
      paymentBreakdown: { khqrCount, cashCount, cardCount },
      avgOrderValue,
      totalOrdersDelivered,
    };
  }, [orders, products, dashboardStats.totalRevenue]);

  // Status Styling Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
      case "PREPARING":
        return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800";
      case "OUT_FOR_DELIVERY":
        return "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200";
    }
  };


  // =======================
  // USERS & STAFF HANDLERS
  // =======================
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.email || !newUserForm.password) {
      showToast("Please provide both email and password", "error");
      return;
    }
    setSavingUser(true);
    try {
      const res = await authFetch(`${API_BASE}/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserForm),
      });
      if (res && res.ok) {
        const created = await res.json();
        setUsersList((prev) => [created, ...prev]);
        setShowAddUserModal(false);
        setNewUserForm({
          email: "",
          password: "",
          full_name: "",
          phone: "",
          role: "cashier",
        });
        showToast(`Staff account "${created.email}" created successfully!`, "success");
      } else if (res) {
        const err = await res.json().catch(() => ({}));
        showToast(err.detail || "Failed to create user", "error");
      }
    } catch (err) {
      showToast("Network error creating user", "error");
    } finally {
      setSavingUser(false);
    }
  };

  const handleStartEditUser = (user) => {
    setSelectedUserForEdit(user);
    setEditUserForm({
      id: user.id,
      email: user.email,
      full_name: user.full_name || "",
      phone: user.phone || "",
      role: user.role || "cashier",
      is_active: user.is_active,
      new_password: "",
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;
    setSavingUser(true);
    try {
      const payload = {
        full_name: editUserForm.full_name,
        phone: editUserForm.phone,
        role: editUserForm.role,
        is_active: editUserForm.is_active,
      };
      if (editUserForm.new_password && editUserForm.new_password.trim()) {
        payload.password = editUserForm.new_password.trim();
      }
      const res = await authFetch(`${API_BASE}/auth/users/${selectedUserForEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res && res.ok) {
        const updated = await res.json();
        setUsersList((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setSelectedUserForEdit(null);
        showToast(`Staff account "${updated.email}" updated successfully!`, "success");
      } else if (res) {
        const err = await res.json().catch(() => ({}));
        showToast(err.detail || "Failed to update user", "error");
      }
    } catch (err) {
      showToast("Network error updating user", "error");
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to permanently delete staff account "${userEmail}"?`)) return;
    try {
      const res = await authFetch(`${API_BASE}/auth/users/${userId}`, {
        method: "DELETE",
      });
      if (res && res.ok) {
        setUsersList((prev) => prev.filter((u) => u.id !== userId));
        showToast(`Staff account "${userEmail}" deleted successfully!`, "success");
      } else if (res) {
        const err = await res.json().catch(() => ({}));
        showToast(err.detail || "Failed to delete user", "error");
      }
    } catch (err) {
      showToast("Network error deleting user", "error");
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      const res = await authFetch(`${API_BASE}/auth/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      if (res && res.ok) {
        const updated = await res.json();
        setUsersList((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        showToast(`User ${updated.email} is now ${updated.is_active ? "Active" : "Deactivated"}`, "info");
      }
    } catch (err) {
      showToast("Error updating user status", "error");
    }
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return (Array.isArray(usersList) ? usersList : []).filter((u) => {
      const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
      const q = userSearchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q));
      return matchesRole && matchesQuery;
    });
  }, [usersList, userRoleFilter, userSearchQuery]);



  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Verifying session permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col">
      <Head>
        <title>Omni POS & Delivery Dispatch Enterprise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-[999] flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-bounce bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
          {toast.type === "error" && <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
          {toast.type === "info" && <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0" />}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Enterprise Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Omni POS & Delivery Enterprise
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                v2.5 Pro
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Neon Cloud PostgreSQL • Cloudinary CDN • Multi-Branch Ready
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected (Live 10s)</span>
          </div>

          <button
            onClick={toggleTheme}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:border-blue-400 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} alt="User" className="w-full h-full object-cover" />
              ) : (
                currentUser?.full_name?.charAt(0) || "A"
              )}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                {currentUser?.full_name || "Admin"}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                {currentUser?.role || "Staff"}
              </p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Modern Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between flex-shrink-0 overflow-y-auto">
          <div className="space-y-1.5">
            {/* OPERATIONS */}
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Operations
            </p>

            <button
              onClick={() => setActiveTab("dispatcher")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "dispatcher"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Dispatcher</span>
              {orders.length > 0 && (
                <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "dispatcher" ? "bg-white/20 text-white" : "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300"}`}>
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("pos")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "pos"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>In-Store POS Terminal</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                POS
              </span>
            </button>

            <button
              onClick={() => setActiveTab("kds")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "kds"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Kitchen Display (KDS)</span>
              {kdsTickets.length > 0 && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {kdsTickets.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("riders")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "riders"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Bike className="w-4 h-4 text-indigo-500" />
              <span>Riders & Fleet</span>
              <span className="ml-auto text-xs text-slate-400 font-semibold">{riders.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "products"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products & Stock</span>
              <span className="ml-auto text-xs text-slate-400 font-semibold">{products.length}</span>
            </button>

            {/* MANAGEMENT */}
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              Management
            </p>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "categories"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories</span>
              <span className="ml-auto text-xs text-slate-400 font-semibold">{categories.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("branches")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "branches"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Store Branches</span>
              <span className="ml-auto text-xs text-slate-400 font-semibold">{branches.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("coupons")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "coupons"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Ticket className="w-4 h-4 text-rose-500" />
              <span>Discounts & Coupons</span>
              <span className="ml-auto text-xs text-slate-400 font-semibold">{coupons.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("customers")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "customers"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Users className="w-4 h-4 text-teal-500" />
              <span>Customers CRM</span>
              <span className="ml-auto text-xs text-slate-400 font-semibold">{(customerList || []).length}</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <UserCheck className="w-4 h-4 text-indigo-500" />
              <span>Staff & Users</span>
              <span className="ml-auto text-xs text-slate-400 font-semibold">{(usersList || []).length}</span>
            </button>

            {/* FINANCE & REPORTS */}
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              Finance & Reports
            </p>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>Sales & Analytics</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                PRO
              </span>
            </button>

            {/* SETTINGS */}
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              Settings
            </p>

            <button
              onClick={() => setActiveTab("store_settings")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "store_settings"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Settings</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Admin Profile</span>
            </button>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Session</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* Top Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 transition">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales (Delivered)</span>
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                ${dashboardStats.totalRevenue.toFixed(2)}
              </p>
              <div className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>From {orders.filter((o) => o.status === "DELIVERED").length} completed orders</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 transition">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Live Active Queue</span>
                <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {dashboardStats.activeOrders}
              </p>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-1">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                <span>Pending, Kitchen & On Way</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 transition">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Menu Catalog</span>
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {dashboardStats.totalProducts} items
              </p>
              <div className="mt-1">
                {dashboardStats.lowStockCount > 0 ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{dashboardStats.lowStockCount} items low in stock (&lt;20)</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ All items well stocked
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 transition">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Outlets</span>
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Store className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
                {branches.filter((b) => b.is_active).length} of {branches.length}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Multi-branch GPS enabled</p>
            </div>
          </div>

          {/* TAB: DISPATCHER */}
          {activeTab === "dispatcher" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Live Delivery Dispatch Board</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {filteredOrders.length} orders
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Orders synched instantly across Mobile Customer App & Cloud Database.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search order #, customer phone, address, rider..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 sm:w-72"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={fetchOrders}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                    title="Refresh orders"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Filter Badges */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
                {[
                  { key: "ALL", label: "All Orders" },
                  { key: "PENDING", label: "Pending" },
                  { key: "CONFIRMED", label: "Confirmed" },
                  { key: "PREPARING", label: "Kitchen Preparing" },
                  { key: "OUT_FOR_DELIVERY", label: "On Delivery" },
                  { key: "DELIVERED", label: "Delivered" },
                  { key: "CANCELLED", label: "Cancelled" },
                ].map((tab) => {
                  const count =
                    tab.key === "ALL"
                      ? orders.length
                      : orders.filter((o) => o.status === tab.key).length;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setDeliveryStatusFilter(tab.key)}
                      className={`px-3 py-1.5 rounded-xl font-semibold flex items-center space-x-1.5 transition ${
                        deliveryStatusFilter === tab.key
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${deliveryStatusFilter === tab.key ? "bg-white/20 dark:bg-black/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Orders Table */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400 mb-3">
                    <Truck className="w-6 h-6" />
                  </div>
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                    No orders found in this view
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Customer orders submitted via Flutter App or POS will automatically appear here.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <th className="p-4">Order ID & Date</th>
                          <th className="p-4">Delivery Destination</th>
                          <th className="p-4">Items Summary</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4">Assigned Rider</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                            <td className="p-4">
                              <p className="font-bold text-sm text-slate-900 dark:text-white">#{order.id}</p>
                              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {order.order_type || "DELIVERY"}
                              </span>
                              <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                              </p>
                            </td>

                            <td className="p-4 max-w-xs">
                              <p className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1">
                                <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                <span className="line-clamp-1">{order.delivery_address}</span>
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{order.contact_phone}</span>
                              </p>
                              {order.delivery_note && (
                                <p className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded mt-1 inline-block">
                                  Note: {order.delivery_note}
                                </p>
                              )}
                            </td>

                            <td className="p-4">
                              <div className="space-y-1">
                                {order.items?.map((it, idx) => (
                                  <div key={idx} className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200">
                                    <span className="font-bold text-blue-600 dark:text-blue-400">{it.quantity}x</span>
                                    <span className="line-clamp-1">{it.product_name}</span>
                                  </div>
                                ))}
                              </div>
                            </td>

                            <td className="p-4">
                              <p className="font-bold text-slate-900 dark:text-white text-sm">
                                ${order.total_amount.toFixed(2)}
                              </p>
                              <span className="inline-flex items-center space-x-1 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                <CreditCard className="w-3 h-3" />
                                <span>{order.payment_method || "Cash"}</span>
                              </span>
                            </td>

                            <td className="p-4">
                              {order.driver_name ? (
                                <div className="space-y-0.5">
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                                    <Bike className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>{order.driver_name}</span>
                                  </p>
                                  <p className="text-[11px] text-slate-500">{order.driver_plate_number}</p>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setSelectedOrderForDriver(order)}
                                  className="px-2.5 py-1 rounded-lg border border-dashed border-blue-400 text-blue-600 dark:text-blue-400 text-[11px] font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                >
                                  + Assign Rider
                                </button>
                              )}
                            </td>

                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(order.status)}`}>
                                {order.status}
                              </span>
                            </td>

                            <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                              {order.status === "PENDING" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "PREPARING")}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition"
                                >
                                  Accept & Kitchen
                                </button>
                              )}
                              {order.status === "PREPARING" && (
                                <button
                                  onClick={() => setSelectedOrderForDriver(order)}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition"
                                >
                                  Dispatch Rider
                                </button>
                              )}
                              {order.status === "OUT_FOR_DELIVERY" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition"
                                >
                                  Mark Delivered
                                </button>
                              )}

                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="PREPARING">PREPARING</option>
                                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>

                              <button
                                onClick={() => setSelectedOrderForReceipt(order)}
                                title="Print Bill / Receipt"
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 transition"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setSelectedOrderForTimeline(order)}
                                title="View Delivery Timeline"
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              >
                                <Clock className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: IN-STORE POS TERMINAL */}
          {activeTab === "pos" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-blue-600" />
                    <span>In-Store Point of Sale (POS Terminal)</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Fast cashier checkout for Dine-In, Takeaway, and Express delivery orders.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Order Type Selector */}
                  {["DINE_IN", "TAKEAWAY", "DELIVERY"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPosOrderType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        posOrderType === type
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {type === "DINE_IN" ? "Dine-In (នៅហាង)" : type === "TAKEAWAY" ? "Takeaway (ខ្ចប់)" : "Delivery (ដឹក)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* POS Workspace Split: Left (Menu) vs Right (Cart) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left (Catalog & Menu) */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Filter & Search Bar */}
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={posSearchQuery}
                        onChange={(e) => setPosSearchQuery(e.target.value)}
                        placeholder="Scan Barcode or Search food & drinks..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() => setPosCategoryFilter("ALL")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        posCategoryFilter === "ALL"
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      All ({products.length})
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id || c.name}
                        onClick={() => setPosCategoryFilter(c.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                          posCategoryFilter === c.name
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1">
                    {posFilteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handlePosAddToCart(p)}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm hover:border-blue-500 hover:shadow-md cursor-pointer transition flex flex-col justify-between group"
                      >
                        <div>
                          <div className="h-28 w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative mb-2">
                            <img
                              src={p.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"}
                              alt={p.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60";
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white backdrop-blur-sm">
                              Stock: {p.stock}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{p.name}</h4>
                          <p className="text-[10px] text-slate-400">{p.category}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                          <span className="font-bold text-sm text-blue-600 dark:text-blue-400">${p.price.toFixed(2)}</span>
                          <button className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right (POS Cart & Bill Summary) */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between h-[680px]">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Current Order</h3>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {posCart.reduce((sum, i) => sum + i.quantity, 0)} items
                      </span>
                    </div>

                    {/* Table / Customer Input */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400">
                          {posOrderType === "DINE_IN" ? "Table #" : posOrderType === "TAKEAWAY" ? "Pickup Name" : "Delivery Address"}
                        </label>
                        <input
                          type="text"
                          value={posTableOrAddress}
                          onChange={(e) => setPosTableOrAddress(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400">Customer Phone</label>
                        <input
                          type="text"
                          value={posCustomerPhone}
                          onChange={(e) => setPosCustomerPhone(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                        />
                      </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {posCart.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                          <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p>Cart is empty. Tap items to add.</p>
                        </div>
                      ) : (
                        posCart.map((item) => (
                          <div key={item.product_id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                            <div className="flex-1 min-w-0 pr-2">
                              <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400">${item.price.toFixed(2)} each</p>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <button onClick={() => handlePosChangeQty(item.product_id, -1)} className="p-1 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 shadow-sm">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => handlePosChangeQty(item.product_id, 1)} className="p-1 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 shadow-sm">
                                <Plus className="w-3 h-3" />
                              </button>
                              <span className="font-bold text-slate-900 dark:text-white w-14 text-right">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <button onClick={() => handlePosRemoveItem(item.product_id)} className="p-1 text-rose-500 hover:text-rose-700">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Payment & Checkout Area */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    {/* Promo Code Input */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Promo Coupon (e.g. WELCOME20)"
                        value={posPromoCodeInput}
                        onChange={(e) => setPosPromoCodeInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono uppercase"
                      />
                      <button onClick={handleApplyPromoCode} className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold">
                        Apply
                      </button>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal:</span>
                        <span>${posTotals.subtotal.toFixed(2)}</span>
                      </div>
                      {posTotals.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Discount ({posDiscountPercent}%):</span>
                          <span>-${posTotals.discount.toFixed(2)}</span>
                        </div>
                      )}
                      {posTotals.deliveryFee > 0 && (
                        <div className="flex justify-between text-slate-500">
                          <span>Delivery Fee:</span>
                          <span>${posTotals.deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">Grand Total:</span>
                        <div className="text-right">
                          <p className="font-extrabold text-lg text-blue-600 dark:text-blue-400">
                            ${posTotals.grandTotalUsd.toFixed(2)}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            {posTotals.grandTotalKhr.toLocaleString()} KHR (៛)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="grid grid-cols-3 gap-2">
                      {["Cash", "ABA KHQR", "Credit Card"].map((method) => (
                        <button
                          key={method}
                          onClick={() => setPosPaymentMethod(method)}
                          className={`py-1.5 rounded-lg text-[11px] font-bold transition border ${
                            posPaymentMethod === method
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>

                    {/* Submit Order Button */}
                    <button
                      onClick={handlePosSubmitOrder}
                      disabled={posSubmitting || posCart.length === 0}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{posSubmitting ? "Processing..." : `Complete & Pay ($${posTotals.grandTotalUsd.toFixed(2)})`}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: KITCHEN DISPLAY SYSTEM (KDS) */}
          {activeTab === "kds" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    <span>Kitchen Display System (KDS)</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {kdsTickets.length} active tickets
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Real-time chef orders board with preparation timers and item checklist.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {["ALL", "COOKING", "READY"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setKdsFilter(tab)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        kdsFilter === tab
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {tab === "ALL" ? "All Queue" : tab === "COOKING" ? "In Cooking" : "Ready for Pickup"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kitchen Tickets Grid */}
              {kdsTickets.length === 0 ? (
                <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
                  <Flame className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">No active kitchen orders</p>
                  <p className="text-xs text-slate-400 mt-1">All orders are cooked and ready to serve.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {kdsTickets.map((ticket) => {
                    const elapsedMins = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
                    const isUrgent = elapsedMins > 15;

                    return (
                      <div
                        key={ticket.id}
                        className={`rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition ${
                          isUrgent
                            ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900 ring-2 ring-rose-500/20"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        <div>
                          {/* Ticket Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-black text-base text-slate-900 dark:text-white">#{ticket.id}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                  {ticket.order_type || "DELIVERY"}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">{ticket.delivery_address}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold ${isUrgent ? "bg-rose-500 text-white animate-pulse" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                                <Clock className="w-3 h-3" />
                                <span>{elapsedMins}m ago</span>
                              </span>
                            </div>
                          </div>

                          {/* Items Checklist */}
                          <div className="space-y-2 py-2">
                            {ticket.items?.map((it, idx) => {
                              const key = `${ticket.id}_${idx}`;
                              const isDone = kdsCheckedItems[key];

                              return (
                                <div
                                  key={idx}
                                  onClick={() => setKdsCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))}
                                  className={`flex items-center space-x-2.5 p-2 rounded-xl cursor-pointer transition ${
                                    isDone
                                      ? "bg-slate-100 dark:bg-slate-800/40 text-slate-400 line-through"
                                      : "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"}`}>
                                    {isDone && <Check className="w-3 h-3" />}
                                  </div>
                                  <span className="font-bold text-blue-600 dark:text-blue-400">{it.quantity}x</span>
                                  <span className="text-xs flex-1">{it.product_name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Ticket Footer Action */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                          <button
                            onClick={() => setSelectedOrderForReceipt(ticket)}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                            title="Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {ticket.status === "PENDING" || ticket.status === "CONFIRMED" ? (
                            <button
                              onClick={() => updateOrderStatus(ticket.id, "PREPARING")}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25"
                            >
                              Start Cooking
                            </button>
                          ) : (
                            <button
                              onClick={() => updateOrderStatus(ticket.id, "OUT_FOR_DELIVERY")}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/25 flex items-center space-x-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Food Ready! (រួចរាល់)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: RIDERS & FLEET MANAGEMENT */}
          {activeTab === "riders" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Bike className="w-5 h-5 text-indigo-600" />
                    <span>Riders & Fleet Management</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {filteredRiders.length} drivers
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Track delivery motorbikes, live route status, driver ratings, and contact info.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search rider name, phone, plate..."
                      value={riderSearchQuery}
                      onChange={(e) => setRiderSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-48 sm:w-60"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddRiderModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center space-x-2 transition whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Rider</span>
                  </button>
                </div>
              </div>

              {/* Rider Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredRiders.map((r) => (
                  <div key={r.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                          <Bike className="w-5 h-5" />
                        </div>
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateRiderStatus(r.id, e.target.value)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            r.status === "AVAILABLE"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                              : r.status === "ON_ROUTE"
                              ? "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300"
                              : "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          <option value="AVAILABLE">Available (ទំនេរ)</option>
                          <option value="ON_ROUTE">On Route (កំពុងដឹក)</option>
                          <option value="OFFLINE">Offline (សម្រាក)</option>
                        </select>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{r.name}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Plate: {r.plate}</p>

                      <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        <p className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`tel:${r.phone}`} className="hover:underline hover:text-blue-600">{r.phone}</a>
                        </p>
                        <p className="flex items-center space-x-1.5 text-amber-500 font-semibold">
                          <span>★ {r.rating} Rating</span>
                          <span className="text-slate-400 font-normal">({r.trips} trips)</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <a
                        href={`tel:${r.phone}`}
                        className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition"
                      >
                        Call Rider
                      </a>
                      <button
                        onClick={() => handleDeleteRider(r.id, r.name)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Remove Rider"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS & STOCK */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>Products & Inventory Management</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {filteredProducts.length} items
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    ស្វែងរក កែប្រែ លុប និងគ្រប់គ្រងស្តុកមុខទំនិញ (Search, edit, delete and manage POS products)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setProductViewMode("grid")}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        productViewMode === "grid"
                          ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Card</span>
                    </button>
                    <button
                      onClick={() => setProductViewMode("table")}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        productViewMode === "table"
                          ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>តារាង (Table)</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center space-x-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="ស្វែងរកតាមឈ្មោះមុខទំនិញ ឬ Barcode... (Search by name or barcode)"
                    className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
                  />
                  {productSearchQuery && (
                    <button onClick={() => setProductSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  <button
                    onClick={() => setProductCategoryFilter("ALL")}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      productCategoryFilter === "ALL"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    All ({products.length})
                  </button>
                  {categories.map((c) => {
                    const count = products.filter((p) => p.category === c.name).length;
                    return (
                      <button
                        key={c.id || c.name}
                        onClick={() => setProductCategoryFilter(c.name)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                          productCategoryFilter === c.name
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {c.name} {count > 0 && `(${count})`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VIEW MODE 1: GRID */}
              {productViewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredProducts.map((p) => {
                    const margin =
                      p.cost_price && p.price > p.cost_price
                        ? Math.round(((p.price - p.cost_price) / p.price) * 100)
                        : null;

                    return (
                      <div
                        key={p.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition group"
                      >
                        <div>
                          <div className="h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                            <img
                              src={p.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"}
                              alt={p.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60";
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                              {p.category}
                            </span>
                            {p.barcode && (
                              <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-white/90 text-slate-800 backdrop-blur-md">
                                BC: {p.barcode}
                              </span>
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{p.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                              {p.description || "Fresh and prepared to order."}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-0">
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mb-3">
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase font-semibold">Selling Price</p>
                              <div className="flex items-baseline space-x-1.5">
                                <span className="text-base font-bold text-blue-600 dark:text-blue-400">${Number(p.price).toFixed(2)}</span>
                                {margin !== null && <span className="text-[10px] font-bold text-emerald-600">+{margin}%</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 uppercase font-semibold">Stock</p>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${p.stock < 20 ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                                {p.stock} units
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStartEditProduct(p)}
                              className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 font-semibold text-xs transition"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              disabled={deletingProductId === p.id}
                              className="flex items-center justify-center px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 text-xs font-semibold transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VIEW MODE 2: TABLE */}
              {productViewMode === "table" && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <th className="py-3.5 px-4">ផលិតផល (Product)</th>
                          <th className="py-3.5 px-4">ប្រភេទ (Category)</th>
                          <th className="py-3.5 px-4">តម្លៃលក់ (Price)</th>
                          <th className="py-3.5 px-4">ថ្លៃដើម (Cost)</th>
                          <th className="py-3.5 px-4">ស្តុក (Stock)</th>
                          <th className="py-3.5 px-4 text-right">សកម្មភាព (Actions)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {filteredProducts.map((p) => {
                          const margin = p.cost_price && p.price > p.cost_price ? Math.round(((p.price - p.cost_price) / p.price) * 100) : null;
                          return (
                            <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition group">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={p.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"}
                                    alt={p.name}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60";
                                    }}
                                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{p.name}</p>
                                    <div className="flex items-center space-x-2 mt-0.5">
                                      {p.barcode && <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">BC: {p.barcode}</span>}
                                      <span className="text-[11px] text-slate-400 truncate max-w-[220px]">{p.description || "Freshly made"}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                  {p.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-bold text-base text-blue-600 dark:text-blue-400">${Number(p.price).toFixed(2)}</td>
                              <td className="py-3 px-4">
                                {p.cost_price ? (
                                  <div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">${Number(p.cost_price).toFixed(2)}</p>
                                    {margin !== null && <span className="text-[10px] font-bold text-emerald-600">+{margin}%</span>}
                                  </div>
                                ) : <span className="text-xs text-slate-400">-</span>}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${p.stock < 20 ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}`}>
                                  {p.stock} units
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => handleStartEditProduct(p)} className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 text-slate-600 hover:text-blue-600 transition">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteProduct(p.id, p.name)} className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 text-slate-600 hover:text-rose-600 transition">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-blue-600" />
                    <span>Category Management</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {filteredCategories.length} categories
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    គ្រប់គ្រងប្រភេទមុខម្ហូប និងភេសជ្ជៈសម្រាប់ App & POS (Organize menu categories and display order)
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search category name, slug..."
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-48 sm:w-60"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center space-x-2 transition whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Category</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredCategories.map((c) => {
                  const itemCount = products.filter((p) => p.category === c.name).length;
                  return (
                    <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between hover:border-blue-400 transition">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden">
                            {c.image_url ? (
                              <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                              <Layers className="w-5 h-5" />
                            )}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.is_active ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                            {c.is_active ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{c.name}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">slug: /{c.slug}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{c.description || "General category section."}</p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400 font-semibold">Order: #{c.display_order}</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {itemCount} items
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => handleStartEditCategory(c)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteCategory(c.id, c.name)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: STORE BRANCHES */}
          {activeTab === "branches" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Store className="w-5 h-5 text-blue-600" />
                    <span>Store Branches & Outlets</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {filteredBranches.length} outlets
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Physical stores with GPS coordinates, phone lines, and operating hours.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search branch code, address, phone..."
                      value={branchSearchQuery}
                      onChange={(e) => setBranchSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-48 sm:w-60"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddBranchModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center space-x-2 transition whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Branch</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBranches.map((b) => (
                  <div key={b.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:border-blue-400 transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {b.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.is_active ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                          {b.is_active ? "Operational" : "Closed"}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{b.name}</h3>

                      <div className="space-y-2 mt-3 text-xs text-slate-600 dark:text-slate-300">
                        <p className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{b.address}</span>
                        </p>
                        <p className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <a href={`tel:${b.phone}`} className="hover:text-blue-600 hover:underline">{b.phone}</a>
                        </p>
                        <p className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          <span>{b.opening_hours}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      {b.latitude && b.longitude ? (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${b.latitude},${b.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-semibold"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>View on Maps</span>
                        </a>
                      ) : <span className="text-slate-400 text-[11px]">No GPS</span>}

                      <div className="flex items-center space-x-1">
                        <button onClick={() => handleStartEditBranch(b)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteBranch(b.id, b.name)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DISCOUNTS & COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Ticket className="w-5 h-5 text-rose-600" />
                    <span>Discounts, Coupons & Promo Codes</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {coupons.length} vouchers
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Create promotional discounts, free delivery vouchers, and seasonal sales for customers.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddCouponModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center space-x-2 transition whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Promo Code</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {coupons.map((c) => (
                  <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between hover:border-rose-400 transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                          {c.code}
                        </span>
                        <button
                          onClick={() => handleToggleCoupon(c.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.is_active ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600"}`}
                        >
                          {c.is_active ? "Active" : "Paused"}
                        </button>
                      </div>

                      <div className="my-2">
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                          {c.discount_type === "PERCENT" ? `${c.value}% OFF` : `$${c.value.toFixed(2)} OFF`}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">Min. Order: ${c.min_order.toFixed(2)}</p>
                        <p className="text-[11px] text-slate-500 mt-1">Expires: {c.expiry}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{c.uses} redeemed</span>
                      <button onClick={() => handleDeleteCoupon(c.id, c.code)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CUSTOMERS CRM */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-teal-600" />
                    <span>Customer Relationship Management (CRM)</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      {customerList.length} customers
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Customer directory, order histories, total lifetime spend, and loyalty tiers.
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search customer phone, name..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-56 sm:w-72"
                  />
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Loyalty Tier</th>
                        <th className="p-4">Total Orders</th>
                        <th className="p-4">Lifetime Spend</th>
                        <th className="p-4">Last Activity</th>
                        <th className="p-4 text-right">Quick Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {customerList.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</p>
                            <p className="text-slate-400 text-[11px]">{c.phone}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              c.tier === "PLATINUM" ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" :
                              c.tier === "GOLD" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" :
                              c.tier === "SILVER" ? "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200" :
                              "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
                            }`}>
                              <Award className="w-3 h-3" />
                              <span>{c.tier}</span>
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-900 dark:text-white">{c.totalOrders} orders</td>
                          <td className="p-4 font-bold text-blue-600 dark:text-blue-400 text-sm">${c.totalSpent.toFixed(2)}</td>
                          <td className="p-4 text-slate-400 text-[11px]">{new Date(c.lastOrderDate).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                            <a
                              href={`tel:${c.phone}`}
                              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold text-xs hover:bg-blue-100 transition inline-block"
                            >
                              Call Customer
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SALES & ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    <span>Sales, Revenue & Operations Analytics</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Financial performance, top food items, payment breakdown, and exportable reports.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," + "Order ID,Date,Type,Amount,Payment,Status\n" +
                      orders.map(o => `${o.id},${o.created_at},${o.order_type || "DELIVERY"},${o.total_amount},${o.payment_method},${o.status}`).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `Omni_POS_Sales_Report_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    showToast("Sales report CSV exported!", "success");
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-500/25 flex items-center space-x-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report (CSV)</span>
                </button>
              </div>

              {/* Analytics Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold uppercase text-slate-400">Total Net Revenue</p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">${dashboardStats.totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">✓ 100% cloud synced</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold uppercase text-slate-400">Avg. Order Value (AOV)</p>
                  <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">${analyticsData.avgOrderValue.toFixed(2)}</p>
                  <p className="text-xs text-slate-400 mt-1">Per completed transaction</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-xs font-semibold uppercase text-slate-400">Completed Orders</p>
                  <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">{analyticsData.totalOrdersDelivered}</p>
                  <p className="text-xs text-slate-400 mt-1">Successfully fulfilled</p>
                </div>
              </div>

              {/* Visual Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>Top 5 Best-Selling Foods & Drinks</span>
                  </h3>
                  <div className="space-y-4">
                    {analyticsData.topProducts.length === 0 ? (
                      <p className="text-xs text-slate-400">No delivered orders yet.</p>
                    ) : (
                      analyticsData.topProducts.map((p, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-800 dark:text-slate-200">{p.name}</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{p.qty} sold</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, p.qty * 10)}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Payment Methods Breakdown */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2 mb-4">
                    <CreditCard className="w-4 h-4 text-indigo-500" />
                    <span>Payment Methods Distribution</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>ABA KHQR Mobile Pay</span>
                        <span className="font-bold">{analyticsData.paymentBreakdown.khqrCount} orders</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${analyticsData.totalOrdersDelivered ? (analyticsData.paymentBreakdown.khqrCount / analyticsData.totalOrdersDelivered) * 100 : 0}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Cash on Delivery (COD)</span>
                        <span className="font-bold">{analyticsData.paymentBreakdown.cashCount} orders</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${analyticsData.totalOrdersDelivered ? (analyticsData.paymentBreakdown.cashCount / analyticsData.totalOrdersDelivered) * 100 : 0}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Credit / Debit Card</span>
                        <span className="font-bold">{analyticsData.paymentBreakdown.cardCount} orders</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: `${analyticsData.totalOrdersDelivered ? (analyticsData.paymentBreakdown.cardCount / analyticsData.totalOrdersDelivered) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STORE SETTINGS */}
          {activeTab === "store_settings" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <div className="flex items-center space-x-3 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Store & POS System Configurations</h2>
                    <p className="text-xs text-slate-400">Manage currency exchange rate, default delivery fees, and POS tax.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveStoreSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={storeSettings.store_name}
                        onChange={(e) => setStoreSettings({ ...storeSettings, store_name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Exchange Rate (USD to KHR ៛)
                      </label>
                      <input
                        type="number"
                        value={storeSettings.exchange_rate_khr}
                        onChange={(e) => setStoreSettings({ ...storeSettings, exchange_rate_khr: parseInt(e.target.value) || 4100 })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Default Delivery Fee ($)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={storeSettings.default_delivery_fee}
                        onChange={(e) => setStoreSettings({ ...storeSettings, default_delivery_fee: parseFloat(e.target.value) || 1.5 })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Free Delivery Over ($)
                      </label>
                      <input
                        type="number"
                        value={storeSettings.free_delivery_threshold}
                        onChange={(e) => setStoreSettings({ ...storeSettings, free_delivery_threshold: parseFloat(e.target.value) || 25 })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tax (VAT %)
                      </label>
                      <input
                        type="number"
                        value={storeSettings.tax_vat_percent}
                        onChange={(e) => setStoreSettings({ ...storeSettings, tax_vat_percent: parseInt(e.target.value) || 10 })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={storeSettings.kitchen_sound_alert}
                        onChange={(e) => setStoreSettings({ ...storeSettings, kitchen_sound_alert: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Play Audio Chime Sound for Incoming Kitchen Orders</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={storeSettings.auto_accept_orders}
                        onChange={(e) => setStoreSettings({ ...storeSettings, auto_accept_orders: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Auto-Accept Mobile Orders to Kitchen (Skip Pending Confirmation)</span>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/25 transition">
                      Save Store Configurations
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB: PROFILE & ACCOUNT */}
          
          {/* TAB: USERS & STAFF MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-indigo-600" />
                    <span>Staff & User Access Management</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {(filteredUsers || []).length} accounts
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage staff logins, cashier POS access, delivery riders, and administrators.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name, email, phone..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-48 sm:w-60"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/25 transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add New User</span>
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400">Total Users</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{(usersList || []).length}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Admins</p>
                  <p className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">
                    {(usersList || []).filter((u) => u.role === "admin").length}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Cashiers (POS)</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {(usersList || []).filter((u) => u.role === "cashier").length}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Riders</p>
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                    {(usersList || []).filter((u) => u.role === "driver").length}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">Active Accounts</p>
                  <p className="text-lg font-black text-teal-600 dark:text-teal-400 mt-0.5">
                    {(usersList || []).filter((u) => u.is_active).length}
                  </p>
                </div>
              </div>

              {/* Role Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: "ALL", label: "All Roles" },
                  { key: "admin", label: "Administrators" },
                  { key: "cashier", label: "Cashiers" },
                  { key: "driver", label: "Drivers" },
                  { key: "customer", label: "Customers" },
                ].map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => setUserRoleFilter(pill.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      userRoleFilter === pill.key
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Users Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">User & Email</th>
                        <th className="py-3 px-4">Role / Permissions</th>
                        <th className="py-3 px-4">Phone Number</th>
                        <th className="py-3 px-4">Account Status</th>
                        <th className="py-3 px-4">Created Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {(filteredUsers || []).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p>No user accounts found matching your query.</p>
                          </td>
                        </tr>
                      ) : (
                        (filteredUsers || []).map((u) => {
                          const getRoleBadge = (role) => {
                            switch (role?.toLowerCase()) {
                              case "admin":
                                return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800";
                              case "cashier":
                                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
                              case "driver":
                                return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800";
                              default:
                                return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800";
                            }
                          };

                          return (
                            <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                    {(u.full_name || u.email || "U")[0]}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 dark:text-white">
                                      {u.full_name || "Unnamed User"}
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadge(u.role)}`}>
                                  {u.role}
                                </span>
                              </td>

                              <td className="py-3 px-4 font-mono text-[11px]">
                                {u.phone || "—"}
                              </td>

                              <td className="py-3 px-4">
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserStatus(u)}
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition flex items-center space-x-1 ${
                                    u.is_active
                                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-rose-50 hover:text-rose-600"
                                      : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-emerald-50 hover:text-emerald-600"
                                  }`}
                                  title="Click to toggle account status"
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? "bg-emerald-500" : "bg-rose-500"}`} />
                                  <span>{u.is_active ? "Active" : "Deactivated"}</span>
                                </button>
                              </td>

                              <td className="py-3 px-4 text-slate-400 text-[11px]">
                                {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end space-x-1">
                                  <button
                                    onClick={() => handleStartEditUser(u)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                    title="Edit user info or reset password"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  {currentUser?.id !== u.id && (
                                    <button
                                      onClick={() => handleDeleteUser(u.id, u.email)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                      title="Delete staff account"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl uppercase shadow-lg shadow-blue-500/20 overflow-hidden">
                    {currentUser?.avatar_url ? (
                      <img src={currentUser.avatar_url} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      currentUser?.full_name?.charAt(0) || "A"
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {currentUser?.full_name || "Super Admin"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Role: {currentUser?.role}
                    </span>
                  </div>
                </div>

                {profileMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{profileMessage}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-2">Change Password</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-slate-500 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={profileForm.current_password}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, current_password: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-500 mb-1">New Password</label>
                        <input
                          type="password"
                          value={profileForm.new_password}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, new_password: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/25 transition"
                    >
                      Update Account Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

{/* MODAL 1: ASSIGN DRIVER */}
      {selectedOrderForDriver && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Bike className="w-5 h-5 text-blue-600" />
                <span>Assign Delivery Rider (Order #{selectedOrderForDriver.id})</span>
              </h3>
              <button
                onClick={() => setSelectedOrderForDriver(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignDriver} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Driver Name
                </label>
                <input
                  type="text"
                  required
                  value={driverForm.driver_name}
                  onChange={(e) => setDriverForm({ ...driverForm, driver_name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Driver Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={driverForm.driver_phone}
                  onChange={(e) => setDriverForm({ ...driverForm, driver_phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Motorcycle Plate
                  </label>
                  <input
                    type="text"
                    required
                    value={driverForm.driver_plate_number}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, driver_plate_number: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Est. Minutes
                  </label>
                  <input
                    type="number"
                    required
                    value={driverForm.estimated_delivery_minutes}
                    onChange={(e) =>
                      setDriverForm({
                        ...driverForm,
                        estimated_delivery_minutes: parseInt(e.target.value) || 20,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDriver(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25"
                >
                  Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TIMELINE */}
      {selectedOrderForTimeline && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Live Order Tracking Timeline #{selectedOrderForTimeline.id}</span>
              </h3>
              <button
                onClick={() => setSelectedOrderForTimeline(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">Destination:</p>
                <p className="text-slate-600 dark:text-slate-300">{selectedOrderForTimeline.delivery_address}</p>
                <p className="text-slate-400">Phone: {selectedOrderForTimeline.contact_phone}</p>
              </div>

              <div className="space-y-3 py-2">
                {[
                  { key: "PENDING", label: "Order Placed & Registered", time: "Step 1" },
                  { key: "PREPARING", label: "Kitchen Preparing Meals", time: "Step 2" },
                  { key: "OUT_FOR_DELIVERY", label: "Driver Dispatched on Route", time: "Step 3" },
                  { key: "DELIVERED", label: "Delivered & Completed", time: "Step 4" },
                ].map((s, idx) => {
                  const isCurrent = selectedOrderForTimeline.status === s.key;
                  return (
                    <div key={idx} className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          isCurrent
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-500/20"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${isCurrent ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"}`}>
                          {s.label}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{s.time}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedOrderForTimeline(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PRINT BILL / RECEIPT */}
      {selectedOrderForReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[95vh] overflow-y-auto">
            {/* Header controls (no-print) */}
            <div className="flex items-center justify-between mb-4 no-print border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Printer className="w-4 h-4 text-blue-600" />
                <span>វិក្កយបត្របញ្ជាទិញ (Order Receipt #{selectedOrderForReceipt.id})</span>
              </h3>
              <button
                onClick={() => setSelectedOrderForReceipt(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Receipt Paper Container */}
            <div id="printable-receipt" className="bg-white text-slate-900 p-4 rounded-xl border border-slate-200 shadow-sm font-sans text-xs">
              <div className="text-center pb-3 border-b border-dashed border-slate-300">
                <h2 className="text-base font-black tracking-tight uppercase">OMNI POS & DELIVERY</h2>
                <p className="text-[11px] text-slate-500 font-semibold">សាខាកណ្តាល រាជធានីភ្នំពេញ (Phnom Penh HQ)</p>
                <p className="text-[10px] text-slate-400">Tel: +855 23 888 999 • Hotline: +855 12 345 678</p>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 mt-1 uppercase">
                  DELIVERY INVOICE / វិក្កយបត្រដឹកជញ្ជូន
                </div>
              </div>

              {/* Order Info */}
              <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID / លេខកូដ:</span>
                  <span className="font-bold font-mono">#{selectedOrderForReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time / កាលបរិច្ឆេទ:</span>
                  <span>{new Date(selectedOrderForReceipt.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Phone / ទូរស័ព្ទ:</span>
                  <span className="font-semibold">{selectedOrderForReceipt.contact_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address / ទីតាំង:</span>
                  <span className="font-medium text-right max-w-[200px] truncate">{selectedOrderForReceipt.delivery_address}</span>
                </div>
                {selectedOrderForReceipt.delivery_note && (
                  <div className="flex justify-between text-amber-700">
                    <span>Note / កំណត់សម្គាល់:</span>
                    <span>{selectedOrderForReceipt.delivery_note}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="py-2.5 border-b border-dashed border-slate-300">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="text-slate-400 font-bold border-b border-slate-100">
                      <th className="pb-1">Item (ទំនិញ)</th>
                      <th className="pb-1 text-center">Qty</th>
                      <th className="pb-1 text-right">Price</th>
                      <th className="pb-1 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrderForReceipt.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-1 font-semibold">{it.product_name}</td>
                        <td className="py-1 text-center font-bold text-blue-600">{it.quantity}</td>
                        <td className="py-1 text-right">${it.unit_price?.toFixed(2)}</td>
                        <td className="py-1 text-right font-bold">${it.subtotal?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Breakdown */}
              <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal (សរុបទំនិញ):</span>
                  <span>${selectedOrderForReceipt.subtotal?.toFixed(2) || (selectedOrderForReceipt.total_amount - (selectedOrderForReceipt.delivery_fee || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee (ថ្លៃដឹកជញ្ជូន):</span>
                  <span>${selectedOrderForReceipt.delivery_fee?.toFixed(2) || "1.50"}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Discount (បញ្ចុះតម្លៃ):</span>
                  <span>-$0.00</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>Grand Total (សរុបរួម):</span>
                  <span className="text-blue-600 text-base">${selectedOrderForReceipt.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment & Rider Info */}
              <div className="py-2.5 border-b border-dashed border-slate-300 text-[10px] space-y-0.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Payment / វិធីសាស្ត្រទូទាត់:</span>
                  <span className="font-bold">{selectedOrderForReceipt.payment_method || "Cash on Delivery"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status / ស្ថានភាព:</span>
                  <span className="font-bold uppercase text-emerald-600">{selectedOrderForReceipt.payment_status || "PENDING"}</span>
                </div>
                {selectedOrderForReceipt.driver_name && (
                  <div className="flex justify-between">
                    <span>Driver / អ្នកដឹកជញ្ជូន:</span>
                    <span>{selectedOrderForReceipt.driver_name} ({selectedOrderForReceipt.driver_phone})</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-3 text-[10px] text-slate-400">
                <p className="font-bold text-slate-600">សូមអរគុណសម្រាប់ការបញ្ជាទិញ!</p>
                <p>Thank you for choosing Omni Delivery POS Enterprise.</p>
                <p className="mt-1 font-mono text-[9px]">Receipt Token: OMNI-{selectedOrderForReceipt.id}-{Date.now().toString().slice(-4)}</p>
              </div>
            </div>

            {/* Print and Close Actions (no-print) */}
            <div className="flex items-center justify-end space-x-2 pt-4 no-print">
              <button
                type="button"
                onClick={() => setSelectedOrderForReceipt(null)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold text-xs"
              >
                Close (បិទ)
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-500/25 flex items-center space-x-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill (បោះពុម្ព)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>Add Product to Catalog</span>
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Classic Beef Burger"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Barcode (POS Scanner)
                  </label>
                  <input
                    type="text"
                    value={newProduct.barcode}
                    onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                    placeholder="e.g. 89350012001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="4.50"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cost Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.cost_price}
                    onChange={(e) => setNewProduct({ ...newProduct, cost_price: e.target.value })}
                    placeholder="2.20"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Photo to Cloudinary
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "product")}
                    className="w-full text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploadingImage && <span className="text-blue-500 font-semibold animate-pulse">Uploading...</span>}
                </div>
                {newProduct.image_url && (
                  <p className="text-[10px] text-emerald-600 mt-1 truncate">Cloudinary URL: {newProduct.image_url}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Ingredients, preparation and allergens..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT PRODUCT */}
      {selectedProductForEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <span>កែប្រែព័ត៌មានមុខទំនិញ (Edit Product #{selectedProductForEdit.id})</span>
              </h3>
              <button
                onClick={() => setSelectedProductForEdit(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Name / ឈ្មោះមុខទំនិញ
                </label>
                <input
                  type="text"
                  required
                  value={editProductForm.name}
                  onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category / ប្រភេទ
                  </label>
                  <select
                    value={editProductForm.category}
                    onChange={(e) => setEditProductForm({ ...editProductForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Barcode (POS Scanner)
                  </label>
                  <input
                    type="text"
                    value={editProductForm.barcode}
                    onChange={(e) => setEditProductForm({ ...editProductForm, barcode: e.target.value })}
                    placeholder="e.g. 89350012001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editProductForm.price}
                    onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cost Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProductForm.cost_price}
                    onChange={(e) => setEditProductForm({ ...editProductForm, cost_price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={editProductForm.stock}
                    onChange={(e) => setEditProductForm({ ...editProductForm, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Replace Photo (Cloudinary) or Image URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "edit_product")}
                    className="w-full text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploadingImage && <span className="text-blue-500 font-semibold animate-pulse">Uploading...</span>}
                </div>
                <input
                  type="text"
                  value={editProductForm.image_url}
                  onChange={(e) => setEditProductForm({ ...editProductForm, image_url: e.target.value })}
                  placeholder="Or paste direct image URL (https://...)"
                  className="w-full mt-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-[11px]"
                />
                {editProductForm.image_url && (
                  <div className="mt-2 flex items-center space-x-2 p-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                    <img
                      src={editProductForm.image_url}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60";
                      }}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate flex-1">
                      {editProductForm.image_url}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / ការពិពណ៌នា
                </label>
                <textarea
                  rows="2"
                  value={editProductForm.description}
                  onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                  placeholder="Ingredients, preparation and allergens..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedProductForEdit(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingProduct || uploadingImage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25 flex items-center space-x-1.5"
                >
                  {updatingProduct ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: ADD CATEGORY */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>Add New Category</span>
              </h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g. Specialty Coffees"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    placeholder="specialty-coffees"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={newCategory.display_order}
                    onChange={(e) => setNewCategory({ ...newCategory, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "category")}
                  className="w-full text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {newCategory.image_url && (
                  <p className="text-[10px] text-emerald-600 mt-1 truncate">Uploaded: {newCategory.image_url}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Khmer & English menu description..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: EDIT CATEGORY */}
      {selectedCategoryForEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <span>កែប្រែប្រភេទ (Edit Category #{selectedCategoryForEdit.id})</span>
              </h3>
              <button
                onClick={() => setSelectedCategoryForEdit(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name / ឈ្មោះប្រភេទ
                </label>
                <input
                  type="text"
                  required
                  value={editCategoryForm.name}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editCategoryForm.slug}
                    onChange={(e) => setEditCategoryForm({ ...editCategoryForm, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editCategoryForm.display_order}
                    onChange={(e) => setEditCategoryForm({ ...editCategoryForm, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Photo or Paste URL
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "edit_category")}
                  className="w-full text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <input
                  type="text"
                  value={editCategoryForm.image_url || ""}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, image_url: e.target.value })}
                  placeholder="Or direct image URL (https://...)"
                  className="w-full mt-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / ការពិពណ៌នា
                </label>
                <textarea
                  rows="2"
                  value={editCategoryForm.description || ""}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="cat_active"
                  checked={editCategoryForm.is_active}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="cat_active" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category is Active / បើកដំណើរការ
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryForEdit(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingCategory || uploadingImage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25"
                >
                  {updatingCategory ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: ADD BRANCH */}
      {showAddBranchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Store className="w-5 h-5 text-blue-600" />
                <span>Add Store Outlet Branch</span>
              </h3>
              <button
                onClick={() => setShowAddBranchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    placeholder="e.g. BKK1 Flagship"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranch.code}
                    onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
                    placeholder="BKK-01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Street Address
                </label>
                <input
                  type="text"
                  required
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  placeholder="St. 51 Corner St. 302, BKK1, Phnom Penh"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={newBranch.opening_hours}
                    onChange={(e) => setNewBranch({ ...newBranch, opening_hours: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Latitude (GPS)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newBranch.latitude}
                    onChange={(e) => setNewBranch({ ...newBranch, latitude: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Longitude (GPS)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newBranch.longitude}
                    onChange={(e) => setNewBranch({ ...newBranch, longitude: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25"
                >
                  Save Store Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 9: EDIT BRANCH */}
      {selectedBranchForEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <span>កែប្រែព័ត៌មានសាខា (Edit Branch #{selectedBranchForEdit.id})</span>
              </h3>
              <button
                onClick={() => setSelectedBranchForEdit(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBranch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Branch Name / ឈ្មោះសាខា
                  </label>
                  <input
                    type="text"
                    required
                    value={editBranchForm.name}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    required
                    value={editBranchForm.code}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Street Address / អាសយដ្ឋាន
                </label>
                <input
                  type="text"
                  required
                  value={editBranchForm.address}
                  onChange={(e) => setEditBranchForm({ ...editBranchForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={editBranchForm.phone}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={editBranchForm.opening_hours}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, opening_hours: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Latitude (GPS)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editBranchForm.latitude}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, latitude: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Longitude (GPS)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editBranchForm.longitude}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, longitude: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="branch_active"
                  checked={editBranchForm.is_active}
                  onChange={(e) => setEditBranchForm({ ...editBranchForm, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="branch_active" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Branch is Operational / បើកដំណើរការ
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedBranchForEdit(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingBranch}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25"
                >
                  {updatingBranch ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    

      {/* MODAL 10: ADD RIDER */}
      {showAddRiderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Bike className="w-5 h-5 text-blue-600" />
                <span>Register Fleet Rider / ចុះឈ្មោះអ្នកដឹក</span>
              </h3>
              <button
                onClick={() => setShowAddRiderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRider} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rider Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chan Dara"
                  value={newRider.name}
                  onChange={(e) => setNewRider({ ...newRider, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +855 12 345 678"
                  value={newRider.phone}
                  onChange={(e) => setNewRider({ ...newRider, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1AB-8899"
                    value={newRider.plate}
                    onChange={(e) => setNewRider({ ...newRider, plate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newRider.status}
                    onChange={(e) => setNewRider({ ...newRider, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ON_ROUTE">ON_ROUTE</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddRiderModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25"
                >
                  Register Rider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 11: ADD COUPON */}
      {showAddCouponModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <span>Create Promo Coupon / បង្កើតប័ណ្ណបញ្ចុះតម្លៃ</span>
              </h3>
              <button
                onClick={() => setShowAddCouponModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE25"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newCoupon.discount_type}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, discount_type: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="PERCENT">PERCENT (%)</option>
                    <option value="FIXED">FIXED ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newCoupon.value}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, value: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min Order Spend ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newCoupon.min_order}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, min_order: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newCoupon.expiry}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, expiry: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 12: ADD USER / STAFF */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Add Staff Account / បញ្ចូលបុគ្គលិកថ្មី</span>
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / ឈ្មោះពេញ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sok Piseth"
                  value={newUserForm.full_name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address / អ៊ីមែល *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. cashier@omni.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password / លេខសម្ងាត់ *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number / លេខទូរស័ព្ទ
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 012 345 678"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  System Role & Permissions / តួនាទី *
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="cashier">Cashier (បេឡា / គិតលុយ - POS & Dispatcher)</option>
                  <option value="driver">Driver (អ្នកដឹកជញ្ជូន - Fleet Delivery)</option>
                  <option value="admin">Administrator (អ្នកគ្រប់គ្រងប្រព័ន្ធពេញសិទ្ធិ)</option>
                  <option value="customer">Customer (អតិថិជន Mobile App)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25 transition"
                >
                  {savingUser ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 13: EDIT USER / RESET PASSWORD */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <span>Edit User ({selectedUserForEdit.email})</span>
              </h3>
              <button
                onClick={() => setSelectedUserForEdit(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / ឈ្មោះពេញ
                </label>
                <input
                  type="text"
                  required
                  value={editUserForm.full_name}
                  onChange={(e) => setEditUserForm({ ...editUserForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editUserForm.phone}
                    onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role / តួនាទី
                  </label>
                  <select
                    value={editUserForm.role}
                    onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="cashier">Cashier (បេឡា)</option>
                    <option value="driver">Driver (អ្នកដឹក)</option>
                    <option value="admin">Administrator (Admin)</option>
                    <option value="customer">Customer (អតិថិជន)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reset Password / ប្តូរលេខសម្ងាត់ថ្មី (Leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  placeholder="New password (optional)"
                  value={editUserForm.new_password}
                  onChange={(e) => setEditUserForm({ ...editUserForm, new_password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="user_active_toggle"
                  checked={editUserForm.is_active}
                  onChange={(e) => setEditUserForm({ ...editUserForm, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="user_active_toggle" className="font-semibold text-slate-700 dark:text-slate-300">
                  Account is Active / បើកដំណើរការគណនី
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25 transition"
                >
                  {savingUser ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
