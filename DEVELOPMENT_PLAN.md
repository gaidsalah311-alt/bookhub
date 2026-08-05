# BookHub Development Plan

This document outlines the detailed development plan for the BookHub platform, integrating the user's requirements with the capabilities of the provided web-db-user template. The plan is structured into phases, each focusing on a set of related features.

## 1. Project Setup and Initial Configuration

**Objective:** Ensure the project environment is correctly set up and basic configurations are in place.

### 1.1. Database Schema Implementation
- **Status:** Completed. The `drizzle/schema.ts` has been updated with all required tables (users, categories, authors, publishers, bookstores, books, advertisements, subscriptionPlans, userSubscriptions, orders, reviews) and relationships. The migration SQL has been generated and applied.
- **Next Steps:**
    - Verify database connection and schema integrity.
    - Update `server/db.ts` with initial query helpers for new tables.

### 1.2. Art Deco Design System Integration
- **Objective:** Implement the Art Deco visual direction with a high-contrast color palette (deep black, metallic gold), bold serif fonts, and geometric motifs.
- **Implementation Details:**
    - **Colors:** Define a custom color palette in `client/src/index.css` using CSS variables for deep black, metallic gold, and complementary neutral tones. Ensure `bg-background` and `text-foreground` are set appropriately for both light and dark themes (if switchable).
    - **Typography:** Import elegant serif fonts (e.g., via Google Fonts in `client/index.html`) for headings and a readable sans-serif for body text. Configure Tailwind CSS to use these fonts.
    - **Components:** Customize existing shadcn/ui components or create new ones to reflect Art Deco aesthetics (e.g., using subtle geometric patterns, sharp angles, and metallic accents for borders and shadows).
    - **Global Styling:** Update `client/src/index.css` for global theming and base styles.

## 2. Core Platform Development

**Objective:** Establish the fundamental functionalities including user authentication, role management, and basic UI layout.

### 2.1. User Authentication and Role Management
- **Status:** Basic Manus OAuth is integrated. User roles (`reader`, `author`, `publisher`, `bookstore`, `admin`) are defined in `drizzle/schema.ts`.
- **Implementation Details:**
    - **Role-Based Access Control (RBAC):** Implement `protectedProcedure` and `adminOnlyProcedure` in `server/routers.ts` to restrict access based on user roles. Extend this to other roles as needed (e.g., `authorOnlyProcedure`).
    - **User Profile:** Enhance `useAuth()` hook to fetch and display extended user profile information (bio, profileImage, isVerified).
    - **Login/Logout UI:** Design and implement elegant login/logout buttons and flows consistent with the Art Deco theme.

### 2.2. Global Layout and Navigation
- **Objective:** Create a cohesive and visually appealing layout for the entire platform.
- **Implementation Details:**
    - **App.tsx:** Configure main routes and layout shells. Utilize `DashboardLayout` for admin and potentially author/publisher dashboards, and custom layouts for public-facing pages.
    - **Header/Footer:** Design and implement a luxurious header with navigation links, search bar, and user authentication controls. Create a matching footer.
    - **Responsive Design:** Ensure all layouts are fully responsive and adapt gracefully to various screen sizes.

## 3. Book Catalog and Search Functionality

**Objective:** Develop a comprehensive book catalog with advanced search and filtering capabilities.

### 3.1. Book Listing and Detail Pages
- **Implementation Details:**
    - **Book Data:** Implement tRPC procedures in `server/routers.ts` to fetch book data (title, description, cover, author, publisher, category, price, etc.).
    - **Book Cards:** Design Art Deco-inspired book cards for listings, displaying essential information and cover images.
    - **Detail Page:** Create a dedicated book detail page with all book information, reviews, and options to purchase or add to a wishlist.
    - **Image Storage (S3):** Integrate `manus-upload-file --webdev` for uploading book covers to S3 and referencing them in the database.

### 3.2. Search and Filtering
- **Implementation Details:**
    - **Search Bar:** Implement a prominent search bar on the homepage and throughout the site.
    - **Filtering UI:** Develop advanced filtering options by category, author, publisher, language, and price range. Use shadcn/ui components customized for the Art Deco theme.
    - **Backend Search:** Implement tRPC procedures to handle complex search queries and return paginated results.

## 4. User Profiles (Authors, Publishers, Bookstores)

**Objective:** Create dedicated profile pages and management interfaces for different user roles.

### 4.1. Profile Pages
- **Implementation Details:**
    - **Author/Publisher/Bookstore Profiles:** Design unique profile pages for each role, displaying their books, bios, social links, and verification status.
    - **User Profile:** Allow users to manage their basic profile information and view their subscriptions/orders.
    - **Image Upload:** Implement S3 integration for profile images.

## 5. Advertising and Featured Listings

**Objective:** Develop a system for promoting books through advertisements and featured listings.

### 5.1. Ad Management
- **Implementation Details:**
    - **Ad Creation:** Build an interface for authors/publishers to create and manage advertisements (title, description, image, type, duration, target book).
    - **Ad Display:** Integrate ad display components on the homepage, category pages, and book detail pages, styled to fit the Art Deco theme.
    - **Payment Integration:** Connect ad creation with Stripe for paid advertisements.

## 6. Admin Dashboard

**Objective:** Provide a comprehensive dashboard for administrators to manage the platform.

### 6.1. Dashboard Modules
- **Implementation Details:**
    - **User Management:** Interface to view, edit, and manage all users, including role changes and verification status.
    - **Book Management:** Tools to add, edit, delete, and publish books.
    - **Category Management:** Interface to manage book categories.
    - **Advertisement Management:** Oversee all active and pending advertisements.
    - **Reports:** Basic reporting on user activity, book performance, and revenue.
    - **Subscription Management:** Manage subscription plans and user subscriptions.

## 7. Payment and Subscriptions

**Objective:** Implement secure payment processing for subscriptions and paid services.

### 7.1. Stripe Integration
- **Status:** Stripe integration needs to be set up.
- **Implementation Details:**
    - **Subscription Plans:** Create tRPC procedures to manage subscription plans (creation, update, deletion).
    - **User Subscriptions:** Implement logic for users to subscribe to plans, handle recurring payments, and manage their subscriptions.
    - **Payment Flow:** Integrate Stripe Checkout for a seamless payment experience for subscriptions and paid advertisements.
    - **Webhooks:** Set up Stripe webhooks to handle asynchronous events (e.g., successful payments, failed payments, subscription cancellations).

## 8. Testing and Optimization

**Objective:** Ensure the platform is robust, performant, and secure.

### 8.1. Testing
- **Implementation Details:**
    - **Unit Tests:** Write Vitest unit tests for all critical backend logic (e.g., authentication, database operations, payment processing).
    - **Integration Tests:** Implement integration tests for tRPC API endpoints.
    - **End-to-End Tests:** (Considered for later phases) Use tools like Playwright or Cypress for end-to-end testing of key user flows.

### 8.2. Optimization
- **Implementation Details:**
    - **Performance:** Optimize database queries, API responses, and frontend rendering for speed.
    - **Security:** Conduct security audits, implement input validation, and ensure proper authorization checks.
    - **SEO:** Implement basic SEO best practices for public-facing pages.

## 9. Deployment and GitHub Integration

**Objective:** Prepare the project for deployment and maintain version control.

### 9.1. Version Control
- **Status:** Repository cloned from GitHub.
- **Implementation Details:**
    - **Regular Commits:** Commit changes regularly with descriptive messages.
    - **Checkpointing:** Use `webdev_save_checkpoint` at major milestones.
    - **GitHub Push:** Push changes to the GitHub repository.

## Visual Design Guidelines (Art Deco)

### Color Palette
- **Primary:** Deep Black (`#1A1A1A`)
- **Accent:** Metallic Gold (`#B8860B`)
- **Secondary:** Dark Gray (`#333333`)
- **Highlight:** Cream/Off-White (`#F5F5DC`)

### Typography
- **Headings:** Bold Serif (e.g., 'Playfair Display', 'Bebas Neue' - will import from Google Fonts)
- **Body Text:** Clean Sans-serif (e.g., 'Montserrat', 'Lato')

### Geometric Motifs
- **Borders:** Use thin, sharp lines, often in metallic gold, for borders and dividers.
- **Frames:** Implement subtle rectangular or angular frames around content blocks or images.
- **Patterns:** Incorporate repeating geometric patterns (e.g., chevrons, sunbursts) as background elements or subtle textures.

### Layout and Spacing
- **Symmetry:** Emphasize symmetrical layouts where appropriate, especially for hero sections and prominent content blocks.
- **Negative Space:** Utilize ample negative space to enhance the sense of luxury and reduce visual clutter.
- **Hierarchy:** Establish clear visual hierarchy using size, color, and placement of elements.

### Imagery
- **Book Covers:** Display book covers prominently, perhaps with a subtle golden border or shadow effect.
- **Icons:** Use minimalist, geometric icons that complement the Art Deco style.

This plan will be updated iteratively as development progresses.
