# 🏪 Inventory Management System

A modern, full-stack inventory management application built with React.js and Node.js, featuring AI-powered reorder recommendations, real-time analytics, and a beautiful responsive interface.

![Inventory Management Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC)

## ✨ Features

### 📊 **Dashboard & Analytics**

- Real-time inventory statistics and KPIs
- Low stock alerts with visual indicators
- Recent transaction history
- Supplier analytics with product breakdown
- Responsive charts and data visualization

### 📦 **Product Management**

- Complete CRUD operations for products
- SKU generation and tracking
- Stock quantity monitoring
- Reorder level management
- Supplier association and selection
- Product detail modal with comprehensive information

### 🏢 **Supplier Management**

- Full supplier database with contact information
- Product association tracking
- Supplier performance analytics
- Easy supplier selection during product operations

### 💰 **Transaction System**

- Purchase and sale transaction recording
- Real-time stock updates
- Transaction history with detailed product information
- Automatic inventory value calculations
- Transaction notes and documentation

### 🤖 **AI-Powered Features**

- Intelligent reorder recommendations
- Sales pattern analysis
- Inventory optimization suggestions
- Smart alerts for low stock items

### 🎨 **Modern UI/UX**

- Beautiful glass morphism design
- Fully responsive across all devices
- Smooth animations and transitions
- Intuitive navigation and user flow
- Dark/light theme support

## 🚀 Tech Stack

### **Frontend**

- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router DOM** - Client-side routing
- **React Hot Toast** - Beautiful toast notifications
- **Vite** - Fast build tool and development server

### **Backend**

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database with Mongoose ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### **Deployment**

- **Vercel** - Frontend and backend deployment
- **MongoDB Atlas** - Cloud database hosting

## 📁 Project Structure

```
inventory-management/
├── frontend/ (assingment/)
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js           # API configuration
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── Loader.jsx       # Loading component
│   │   │   └── Navbar.jsx       # Navigation component
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── Products.jsx     # Product management
│   │   │   ├── Suppliers.jsx    # Supplier management
│   │   │   └── Transactions.jsx # Transaction history
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # Global styles
│   │   ├── index.css            # Base styles
│   │   └── main.jsx             # App entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # Database configuration
│   │   ├── Controllers/
│   │   │   ├── productController.js
│   │   │   ├── supplierController.js
│   │   │   ├── transactionController.js
│   │   │   └── reportController.js
│   │   ├── Routes/
│   │   │   ├── productRoutes.js
│   │   │   ├── supplierRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   ├── reportsRoutes.js
│   │   │   └── recommendationAi.js
│   │   ├── Schema/
│   │   │   ├── Product.js       # Product data model
│   │   │   ├── Supplier.js      # Supplier data model
│   │   │   └── Transaction.js   # Transaction data model
│   │   └── index.js             # Server entry point
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
└── README.md
```

## 🛠️ Installation & Setup

### **Prerequisites**

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd inventory-management
```

### **2. Backend Setup**

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=Assingment
PORT=5000
NODE_ENV=development
HF_API_KEY=your_hugging_face_api_key_here
```

Start the backend server:

```bash
npm start
```

### **3. Frontend Setup**

```bash
cd assingment
npm install
```

Update the API base URL in `src/api/api.js` if needed:

```javascript
const BASE_URL = "http://localhost:5000/api";
```

Start the development server:

```bash
npm run dev
```

### **4. Access the Application**

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 🗄️ Database Schema

### **Products Collection**

```javascript
{
  _id: ObjectId,
  name: String,
  sku: String,
  description: String,
  stockQty: Number,
  unit: String,
  avgCost: Number,
  sellingPrice: Number,
  reorderLevel: Number,
  suppliers: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### **Suppliers Collection**

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Transactions Collection**

```javascript
{
  _id: ObjectId,
  txType: String, // "PURCHASE" | "SALE"
  items: [{
    productId: ObjectId,
    quantity: Number,
    unitPrice: Number
  }],
  note: String,
  txDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 API Endpoints

### **Products**

- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### **Suppliers**

- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### **Transactions**

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction

### **Reports**

- `GET /api/reports/low-stock` - Get low stock products
- `GET /api/reports/inventory-value` - Get total inventory value
- `GET /api/reports/products-by-supplier/:id` - Get products by supplier

### **AI Recommendations**

- `POST /api/recommendation/reorder` - Get AI reorder recommendations

## 🚀 Deployment

### **Frontend (Vercel)**

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### **Backend (Vercel)**

1. Configure `vercel.json` (already included)
2. Set environment variables in Vercel dashboard
3. Deploy backend to Vercel

### **Environment Variables for Production**

```env
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=Assingment
NODE_ENV=production
HF_API_KEY=your_hugging_face_api_key
```

## 🎯 Key Features Walkthrough

### **Dashboard Overview**

- **Statistics Cards**: Display key metrics with animated hover effects
- **Low Stock Alerts**: Visual indicators for products requiring attention
- **AI Recommendations**: Smart reorder suggestions based on sales patterns
- **Supplier Analytics**: Click on suppliers to view their product breakdown

### **Product Management**

- **Add Products**: Comprehensive form with supplier selection
- **Edit/Delete**: In-line editing with confirmation dialogs
- **Product Details**: Click any product to view detailed information modal
- **Stock Tracking**: Real-time stock updates with transaction processing

### **Transaction System**

- **Quick Entry**: Easy-to-use form for recording purchases and sales
- **Auto-Calculations**: Automatic stock and cost updates
- **History View**: Beautiful transaction cards with product details
- **Notes Support**: Add context to transactions

### **AI Recommendations**

- **Smart Analysis**: Analyzes sales patterns and stock levels
- **Formatted Output**: Professional recommendations with detailed breakdown
- **Interactive Modal**: Scrollable content with beautiful design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database solution
- Vercel for seamless deployment platform

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact: [your-email@example.com]

---

**Made with ❤️ for efficient inventory management**
