// src/data/mockData.js

export const stores = [
  {
    id: 1,
    name: "Tech World",
    category: "Electronics",
    address: "123 Main Street, City Center",
    phone: "+1-234-567-8900",
    email: "contact@techworld.com",
    website: "www.techworld.com",
    description: "Your one-stop shop for all electronics and gadgets.",
    rating: 4.5,
    totalReviews: 128,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    reviews: [
      {
        id: 1,
        userId: 1,
        userName: "John Doe",
        rating: 5,
        comment: "Excellent service and great products!",
        date: "2024-01-15"
      },
      {
        id: 2,
        userId: 2,
        userName: "Jane Smith",
        rating: 4,
        comment: "Good selection, reasonable prices.",
        date: "2024-01-10"
      }
    ]
  },
  {
    id: 2,
    name: "Fashion Hub",
    category: "Clothing",
    address: "456 Fashion Ave, Shopping District",
    phone: "+1-234-567-8901",
    email: "info@fashionhub.com",
    website: "www.fashionhub.com",
    description: "Latest trends in fashion and accessories.",
    rating: 4.2,
    totalReviews: 89,
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
    reviews: [
      {
        id: 3,
        userId: 3,
        userName: "Mike Johnson",
        rating: 4,
        comment: "Great variety of clothes and helpful staff.",
        date: "2024-01-12"
      }
    ]
  },
  {
    id: 3,
    name: "Food Paradise",
    category: "Restaurant",
    address: "789 Gourmet Street, Food District",
    phone: "+1-234-567-8902",
    email: "orders@foodparadise.com",
    website: "www.foodparadise.com",
    description: "Delicious meals and exceptional dining experience.",
    rating: 4.8,
    totalReviews: 256,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    reviews: [
      {
        id: 4,
        userId: 4,
        userName: "Sarah Wilson",
        rating: 5,
        comment: "Amazing food and atmosphere!",
        date: "2024-01-14"
      },
      {
        id: 5,
        userId: 5,
        userName: "David Brown",
        rating: 4,
        comment: "Good food, but service could be faster.",
        date: "2024-01-11"
      }
    ]
  },
  {
    id: 4,
    name: "BookWorm Corner",
    category: "Books",
    address: "321 Library Lane, Academic Quarter",
    phone: "+1-234-567-8903",
    email: "hello@bookwormcorner.com",
    website: "www.bookwormcorner.com",
    description: "A cozy bookstore with a vast collection of books.",
    rating: 4.6,
    totalReviews: 75,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    reviews: [
      {
        id: 6,
        userId: 6,
        userName: "Emily Davis",
        rating: 5,
        comment: "Perfect place for book lovers!",
        date: "2024-01-13"
      }
    ]
  }
];

export const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Restaurant", 
  "Books",
  "Grocery",
  "Sports",
  "Beauty",
  "Home & Garden"
];

export const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
  },
  {
    id: 2,
    name: "Jane Smith", 
    email: "jane@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b587?w=100"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
  }
];