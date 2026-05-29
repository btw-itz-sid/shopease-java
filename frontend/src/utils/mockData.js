// Mock database entries mimicking the Day 4 User, Category, and Product JPA Entity tables.

export const mockUsers = [
  {
    id: 50,
    name: "OmniTech Ventures",
    email: "seller50@shopease.com",
    role: "SELLER"
  },
  {
    id: 51,
    name: "Lumio Labs",
    email: "seller51@shopease.com",
    role: "SELLER"
  },
  {
    id: 52,
    name: "Kobe Furniture Co",
    email: "seller52@shopease.com",
    role: "SELLER"
  },
  {
    id: 53,
    name: "PulseAudio Ltd",
    email: "seller53@shopease.com",
    role: "SELLER"
  }
];

export const mockCategories = [
  {
    id: 1,
    name: "Electronics & Tech",
    slug: "electronics-tech",
    description: "Cutting-edge gadgets, computing, and smart accessories.",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=80",
    parent: null,
    isActive: true
  },
  {
    id: 2,
    name: "Audio & Acoustics",
    slug: "audio-acoustics",
    description: "Premium headphones, high-fidelity speakers, and studio monitors.",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80",
    parent: { id: 1, name: "Electronics & Tech", slug: "electronics-tech" },
    isActive: true
  },
  {
    id: 3,
    name: "Smartphones & Mobile",
    slug: "smartphones-mobile",
    description: "Latest cellular devices, folding tablets, and wearables.",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80",
    parent: { id: 1, name: "Electronics & Tech", slug: "electronics-tech" },
    isActive: true
  },
  {
    id: 4,
    name: "Home & Lifestyle",
    slug: "home-lifestyle",
    description: "Intelligent ambient systems, office aesthetics, and designer living.",
    imageUrl: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&auto=format&fit=crop&q=80",
    parent: null,
    isActive: true
  },
  {
    id: 5,
    name: "Smart Ambient Lighting",
    slug: "smart-ambient-lighting",
    description: "Dynamic RGB IC backlighting, neon bars, and smart bulbs.",
    imageUrl: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=500&auto=format&fit=crop&q=80",
    parent: { id: 4, name: "Home & Lifestyle", slug: "home-lifestyle" },
    isActive: true
  },
  {
    id: 6,
    name: "Minimalist Furniture",
    slug: "minimalist-furniture",
    description: "Ergonomic seating, walnut wood desks, and shelving units.",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=80",
    parent: { id: 4, name: "Home & Lifestyle", slug: "home-lifestyle" },
    isActive: true
  }
];

export const mockProducts = [
  {
    id: 101,
    seller: mockUsers[0], // OmniTech Ventures
    category: mockCategories[1], // Audio & Acoustics
    title: "Aether Dynamic Wireless Headphones",
    slug: "aether-dynamic-wireless-headphones",
    description: "Experience pure acoustic bliss with custom dynamic drivers, hybrid Active Noise Cancellation (ANC), and spatial tracking audio. Styled in deep space grey with ultra-breathable memory foam cushions.",
    price: 299.99,
    stock: 24,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80"
    ]),
    rating: 4.85,
    ratingCount: 142,
    isActive: true
  },
  {
    id: 102,
    seller: mockUsers[0], // OmniTech Ventures
    category: mockCategories[2], // Smartphones & Mobile
    title: "Vortex Pro Titanium Smartphone",
    slug: "vortex-pro-titanium-smartphone",
    description: "Harness standard-defining mobile computing with an aerospace titanium frame, 120Hz LTPO OLED display, and the revolutionary Neural8 processor. Tri-lens system with optical image stabilization.",
    price: 1099.00,
    stock: 12,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
    ]),
    rating: 4.92,
    ratingCount: 88,
    isActive: true
  },
  {
    id: 103,
    seller: mockUsers[1], // Lumio Labs
    category: mockCategories[4], // Smart Ambient Lighting
    title: "Lumio Horizon smart LED Lightbar",
    slug: "lumio-horizon-smart-led-lightbar",
    description: "Transform your workspace with 16 million colors, dual-zone addressable LED layout, and custom sound reactive visualizer mode. Integrates seamlessly with top smart assistant standards.",
    price: 79.99,
    stock: 120,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80"
    ]),
    rating: 4.67,
    ratingCount: 312,
    isActive: true
  },
  {
    id: 104,
    seller: mockUsers[2], // Kobe Furniture Co
    category: mockCategories[5], // Minimalist Furniture
    title: "Kobe Ergonomic Oak Office Desk",
    slug: "kobe-ergonomic-oak-office-desk",
    description: "A gorgeous desk designed to fuel concentration and clarity. Handcrafted from sustainably-sourced American white oak wood, paired with heavy-duty powder-coated structural steel frames and integrated cable tray systems.",
    price: 549.00,
    stock: 8,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80"
    ]),
    rating: 4.79,
    ratingCount: 54,
    isActive: true
  },
  {
    id: 105,
    seller: mockUsers[0], // OmniTech Ventures
    category: mockCategories[2], // Smartphones & Mobile
    title: "Chrono X Hybrid Smartwatch",
    slug: "chrono-x-hybrid-smartwatch",
    description: "The ultimate convergence of traditional horology and biometric intelligence. Features active heart rate mapping, sleep scoring, e-paper display with 14-day battery reserve, wrapped in surgical steel.",
    price: 249.99,
    stock: 45,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
    ]),
    rating: 4.58,
    ratingCount: 95,
    isActive: true
  },
  {
    id: 106,
    seller: mockUsers[3], // PulseAudio Ltd
    category: mockCategories[1], // Audio & Acoustics
    title: "Pulse Mini Waterproof Bluetooth Speaker",
    slug: "pulse-mini-waterproof-bluetooth-speaker",
    description: "Small footprint, colossal sound. Features 360-degree expansive bass transducers, IPX7 dust-and-waterproofing, and dynamic LED rings that dance to your music beats. Perfect for rugged adventures.",
    price: 49.50,
    stock: 200,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80"
    ]),
    rating: 4.45,
    ratingCount: 423,
    isActive: true
  }
];
