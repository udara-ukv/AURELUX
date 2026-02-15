# AURELUX - Premium Luxury E-Commerce Platform

A modern, fully-functional e-commerce website built with vanilla HTML, CSS, and JavaScript. No dependencies required!

## Features

### 🛍️ Core E-Commerce Features
- **Product Catalog** - Browse luxury items across multiple categories
- **Product Filtering** - Filter by category, price range, and sorting options
- **Product Details** - Detailed product pages with images, specifications, and reviews
- **Shopping Cart** - Add/remove items, adjust quantities, apply promo codes
- **Order Management** - Complete checkout process with order summary

### 👤 User Management
- **User Authentication** - Register and login functionality
- **Account Management** - User profiles with personalized experience
- **Secure Storage** - Local storage for cart and user data

### 🔍 Search & Discovery
- **Real-time Search** - Search products instantly across the catalog
- **Category Navigation** - Browse by jewelry, watches, accessories, handbags
- **Related Products** - Discover similar items on product pages
- **Customer Reviews** - Read and submit product reviews with ratings

### 🎨 Modern Design
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Luxury Aesthetic** - Premium dark brown and gold color scheme
- **Smooth Animations** - Elegant transitions and interactions
- **Accessibility** - Clean, readable typography and proper contrast

## Project Structure

```
my-webapp/
├── index.html              # Home page with hero section and featured products
├── products.html           # Products listing page with filters
├── product-detail.html     # Detailed product page with reviews
├── cart.html              # Shopping cart and checkout
├── style.css              # Complete styling (all pages)
├── script.js              # Core functionality (auth, cart, modals)
├── products.js            # Products page filtering and sorting
├── product-detail.js      # Product detail page functionality
└── cart.js                # Cart and checkout functionality
```

## Getting Started

### 1. Using Python (Recommended)
```bash
cd /home/udara/Documents/my-webapp
python3 -m http.server 8000
```
Visit: **http://localhost:8000**

### 2. Using Node.js
```bash
cd /home/udara/Documents/my-webapp
npx http-server
```

### 3. Using VS Code Live Server
- Install "Live Server" extension in VS Code
- Right-click `index.html` and select "Open with Live Server"

## Demo Credentials

**Test User Account:**
- Email: `test@example.com`
- Password: `password123`

(Or register a new account in the app)

## Available Features

### 1. User Authentication
- Register new account
- Login with credentials
- Persistent user sessions
- Logout functionality

### 2. Shopping
- Add products to cart
- Select color and size options
- Adjust quantities
- Remove items from cart
- View cart total with shipping

### 3. Filtering & Search
- Filter by category (Jewelry, Watches, Accessories, Handbags)
- Filter by price range
- Sort by price (low to high, high to low)
- Sort by newest
- Real-time product search

### 4. Promo Codes
Test these promo codes:
- `LUXURY20` - 20% off
- `SAVE10` - 10% off
- `WELCOME5` - 5% off

### 5. Product Information
- Detailed product descriptions
- Specifications and materials
- Customer ratings and reviews
- Write product reviews with ratings
- View suggested products

## Product Categories

### Jewelry
- Diamond Elegance Ring
- Pearl Necklace Set
- Elegant Bracelet

### Watches
- Luxury Automatic Watch
- Vintage Pocket Watch

### Handbags
- Premium Leather Handbag

### Accessories
- Designer Sunglasses
- Luxury Watch Strap

## Technical Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with variables and grid
- **JavaScript (Vanilla)** - No frameworks, pure JS
- **Font Awesome** - Icon library (CDN)
- **Local Storage** - Client-side data persistence

## Key JavaScript Functions

### Cart Management
```javascript
addToCart(productId, quantity, color, size)
removeFromCart(index)
updateCartQuantity(index, quantity)
```

### User Authentication
```javascript
registerUser(email, password, fullName)
loginUser(email, password)
logoutUser()
```

### Product Management
```javascript
searchProducts(query)
filterProducts(filters)
renderProducts(products, container)
```

## Responsive Design Breakpoints

- **Desktop**: Full layout with sidebar
- **Tablet** (≤768px): Adjusted grid columns
- **Mobile** (≤480px): Single column layout

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- Payment gateway (Stripe, PayPal)
- Email notifications
- Wishlist functionality
- Order history
- Product recommendations
- Admin dashboard
- Inventory management

## File Descriptions

### index.html
Main landing page featuring:
- Hero section with call-to-action
- Category showcase
- Featured products grid
- Newsletter subscription
- Complete footer

### products.html
Product catalog page with:
- Filterable product grid
- Category filters
- Price range slider
- Sorting options
- Product cards with images and prices

### product-detail.html
Individual product page featuring:
- Large product images
- Detailed specifications
- Color and size selection
- Quantity adjuster
- Customer reviews section
- Related products
- Share on social media

### cart.html
Shopping cart and checkout:
- Cart items list
- Order summary
- Promo code application
- Cart totals
- Suggested products
- Trust badges

### style.css
Complete styling (2400+ lines):
- CSS variables for theming
- Responsive grid layouts
- Modal styling
- Button styles
- Product card designs
- Mobile responsiveness

### script.js
Core functionality (400+ lines):
- Product database
- Cart operations
- User authentication
- Modal management
- Search functionality
- Product rendering
- Local storage management

## Notes

- All data is stored locally in browser (localStorage)
- No backend server required
- Images are placeholder elements (can be replaced with real images)
- Fully functional without external dependencies

## Customization

### Change Brand Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #2c1810;      /* Dark brown */
    --secondary-color: #d4af37;    /* Gold */
}
```

### Add More Products
Add to `productsDB` array in `script.js`:
```javascript
{
    id: 9,
    name: "Product Name",
    category: "jewelry",
    price: 999,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 50,
    image: "placeholder",
    description: "...",
    details: [...],
    colors: [...],
    sizes: [...],
    stock: 10
}
```

## License

Free to use and modify for personal and commercial projects.

---

**Created:** February 2026
**Brand:** AURELUX - Premium Luxury Marketplace
**Status:** Production Ready
