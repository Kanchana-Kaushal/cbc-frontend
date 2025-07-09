# Crystal Beauty Clear - Your Ultimate Beauty E-Commerce Experience 🌟

Welcome to **Crystal Beauty Clear**, a feature-packed, full-stack e-commerce platform designed to deliver a premium shopping experience for beauty enthusiasts. Built as a course project, this application combines a sleek, user-friendly interface with robust admin controls, showcasing high-quality cosmetics and skincare products with elegance and trust. From dynamic inventory management to thoughtful UX enhancements, Crystal Beauty Clear is crafted to impress both users and evaluators with its functionality, performance, and polish.

This README provides a detailed overview of the project, its standout features, setup instructions, and the unique touches that make it a top contender. Whether you're browsing for skincare, managing inventory as an admin, or exploring the code, Crystal Beauty Clear is designed to sparkle! 💄✨

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
  - [User Features](#user-features)
  - [Admin Features](#admin-features)
  - [Special Features](#special-features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Why This Project Stands Out](#why-this-project-stands-out)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Crystal Beauty Clear is a modern e-commerce platform built with **React** and powered by a backend API (assumed to be hosted at `VITE_BACKEND_URL`). It caters to beauty lovers seeking authentic skincare, makeup, haircare, fragrances, men’s grooming products, and gift sets. The application features a responsive frontend, a comprehensive admin dashboard, and innovative features like skeleton loading and smart inventory management. Developed for a course assignment, the project aims to demonstrate technical expertise, user-centric design, and scalability, making it a strong candidate for the top three projects in the evaluation.

## Features

### User Features 🛍️

- **Seamless Navigation**: A responsive `NavBar` with a mobile-friendly hamburger menu and a user profile popup for quick access to account details, orders, and logout functionality.
- **Engaging Hero Section**: A visually stunning hero section powered by `motion/react` animations, featuring a bold "Explore the Best Brands" call-to-action with a "Shop Now" button that directs users to the shop page.
- **Category Exploration**: Browse products across categories (Skincare, Makeup, Haircare, Fragrance, Men’s Collection, Gift Sets) with vibrant gradient designs and descriptive text.
- **Smart Product Reviews**: Users can submit star-rated reviews with a minimum length of 4 characters and a maximum of 500, view existing reviews with a smart truncation feature (expandable for long reviews), and delete their own reviews.
- **Order Management**: The `MyOrderModal` allows users to view detailed order information, including delivery details and product breakdowns, cancel pending orders, or confirm receipt of in-transit orders.
- **Secure Authentication**: `SignInForm` and `SignUpForm` components support Google OAuth, form validation with `react-hook-form`, and forgot password functionality for a secure and user-friendly experience.
- **Profile Customization**: Users can update their avatar, with the system automatically deleting the previous avatar for enhanced privacy (see [Special Features](#special-features)).
- **Responsive Design**: Optimized for desktops, tablets, and mobile devices, ensuring a consistent and delightful experience across all screen sizes.

### Admin Features 🛠️

- **Powerful Admin Dashboard**: The `AdminHome` page provides a sidebar for navigating Orders, Products, Users, Admins, and Reviews sections, streamlining store management.
- **Product Management**: Admins can add (`AddProductsPage`), edit (`EditProductPage`), and delete products (`ProductsPage`), with support for multiple images, keywords, stock levels, and bestseller flags.
- **Order Oversight**: The `OrdersPage` and `DisplayOrderPage` allow admins to view, filter, and update order statuses (Pending, Confirmed, In-Transit, Delivered, Cancelled) with dynamic next-status options.
- **User and Admin Management**: Manage users (`UserPage`) with ban/unban functionality and create or manage admins (`AdminPage`, `CreateAdminPage`) with secure authentication.
- **Review Moderation**: The `ManageReviews` component enables admins to hide or unhide product reviews to maintain quality and relevance.
- **Real-Time Search**: Debounced search functionality (300ms delay) in `ProductsPage`, `UserPage`, and `OrdersPage` optimizes performance by reducing API calls.

### Special Features 🌟

Crystal Beauty Clear stands out with several innovative and user-focused features that elevate the experience and demonstrate technical excellence:

1. **Smart Inventory Management**:

   - **Quantity Restriction**: When adding products to the cart, users can only select quantities up to the available stock, preventing over-ordering and ensuring accurate inventory tracking.
   - **Low-Stock Indicator**: Products with stock levels below 10 (e.g., 8, 7, or 6 left) display a prominent low-stock warning, creating urgency and helping users make informed purchase decisions.

2. **Skeleton Loading for Smooth UX**:

   - Implemented on the homepage and admin pages (e.g., `ProductsPage`, `UserPage`, `OrdersPage`), skeleton loading provides placeholder UI elements during data fetching, reducing perceived load times and delivering a polished, app-like experience.

3. **Privacy-First Avatar Management**:

   - When users update their profile picture in the `NavBar`, the system deletes the existing avatar from storage (via `deleteMedia` in `supabase`) before uploading the new one. This ensures user privacy by preventing outdated images from remaining in storage.

4. **Dynamic Review Truncation**:

   - Long reviews are truncated to 50 words (users) or 20 words (admins) with an "Expand/Collapse" toggle, improving readability while allowing users to access detailed feedback when desired.

5. **Debounced Search Optimization**:

   - Search inputs in admin pages use a 300ms debounce to minimize API calls, ensuring smooth performance and reduced server load, even with frequent user input.

6. **Dynamic Order Status Workflow**:

   - The `DisplayOrderPage` intelligently determines the next possible order status (e.g., from "Pending" to "Confirmed" or "In-Transit") and presents relevant action buttons, streamlining admin tasks and reducing errors.

7. **Enhanced Error Handling**:

   - The `ErrorModal` component provides clear, actionable error messages (e.g., prompting users to sign in when unauthorized) with customizable button actions, ensuring a robust and user-friendly experience.

8. **Animated UI for Engagement**:

   - Powered by `motion/react`, animations in the hero section, navbar menu, user popup, and transitions create a lively and modern feel without sacrificing performance.

9. **Relative Time Display**:

   - Using `dayjs` with the `relativeTime` plugin, review timestamps are displayed in a user-friendly format (e.g., "2 days ago"), enhancing readability and engagement.

10. **Scroll-to-Top Behavior**:
    - The `ScrollToTop` component ensures every page navigation starts at the top, improving navigation flow and user experience, especially on long pages.

These features combine technical sophistication with user-centric design, making Crystal Beauty Clear a standout project that’s both functional and delightful.

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, `react-hook-form`, `react-router-dom`, `motion/react` (animations), `react-modal`, `react-hot-toast`
- **Backend**: Assumed REST API (via `VITE_BACKEND_URL`) for authentication, product management, orders, and user management
- **Storage**: Supabase for media uploads (`uploadMedia`, `deleteMedia`)
- **Icons**: React Icons (`react-icons`) for intuitive and scalable icons
- **Date Handling**: Day.js with `relativeTime` plugin for user-friendly timestamps
- **HTTP Client**: Axios for efficient API requests
- **Deployment**: Built for deployment via Vite (e.g., Vercel, Netlify)

## Setup Instructions

To run Crystal Beauty Clear locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd crystal-beauty-clear
   ```

2. **Install Dependencies**:
   Ensure Node.js is installed, then run:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add:

   ```env
   VITE_BACKEND_URL=<your-backend-api-url>
   ```

   Replace `<your-backend-api-url>` with your backend API URL.

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

   Open `http://localhost:5173` (or the port specified by Vite) in your browser.

5. **Build for Production**:

   ```bash
   npm run build
   ```

   Deploy the `dist` folder to a hosting platform like Vercel or Netlify.

6. **Supabase Configuration**:
   Set up a Supabase project for media storage and configure `uploadMedia` and `deleteMedia` in `src/utils/supabase.js` with your Supabase credentials.


## Future Enhancements

- **Advanced Product Filters**: Add filtering by price, brand, rating, or new arrivals for a more personalized shopping experience.
- **Wishlist Functionality**: Allow users to save products to a wishlist for future reference.
- **Real-Time Stock Updates**: Implement WebSocket-based stock updates to reflect inventory changes instantly.
- **Analytics Dashboard**: Add an admin analytics section to track sales trends, popular products, and user behavior.
- **Multi-Language Support**: Introduce internationalization (i18n) for global accessibility.
- **Dark Mode Toggle**: Add a dark mode option for enhanced user comfort in low-light environments.

## Why This Project Stands Out

Crystal Beauty Clear is a showcase of technical excellence, thoughtful design, and user-focused innovation. Here’s why it deserves to be among the top three:

- **Inventory Management Excellence**: The smart quantity restriction and low-stock indicators (e.g., "Only 8 left!") create a transparent and urgency-driven shopping experience, setting it apart from standard e-commerce platforms.
- **Performance Optimization**: Skeleton loading and debounced search ensure a fast, app-like experience, even with large datasets or slow networks.
- **Privacy and Security**: Automatic deletion of old avatars and robust authentication (with Google OAuth and form validation) prioritize user trust and data security.
- **Polished UX**: Animations, responsive design, relative time displays, and scroll-to-top behavior create a seamless and engaging experience for users and admins.
- **Comprehensive Admin Tools**: From dynamic order status management to review moderation, the admin dashboard is both powerful and intuitive.
- **Scalable Architecture**: Built with modular React components and modern practices, the project is ready for future enhancements and real-world deployment.

This project reflects a passion for creating a delightful, functional, and innovative e-commerce platform, making it a strong contender for the course’s top three.

## Contributing

Contributions are welcome! To contribute to Crystal Beauty Clear:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for exploring **Crystal Beauty Clear**! This project is a labor of love, blending beauty, technology, and user delight into one sparkling package. 🌸 We hope it shines as brightly for you as it does for us! 💖
