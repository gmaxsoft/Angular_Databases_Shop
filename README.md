# Database Shop

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/maxsoft/database-shop)
[![Author](https://img.shields.io/badge/author-Maxsoft-green.svg)](https://maxsoft.pl)

An online store specializing in database tools and solutions. The application offers a wide selection of database-related products, from management tools to analytical software.

## 🚀 Features

### 🛍️ Online Store
- Product and category browsing
- Full-featured shopping cart
- Order system and user account management
- Responsive design adapted for mobile devices

### 🌐 Internationalization (i18n)
- Full support for Polish and English languages
- Easy language switching via header menu
- All application texts are dynamically translated
- Selected language is preserved between sessions

### 📱 Technologies
- **Angular 20** - Modern framework for building web applications
- **Angular Material** - UI components following Material Design
- **Angular SSR** - Server-Side Rendering for improved SEO and performance
- **TypeScript** - Typed JavaScript for better code quality
- **SCSS** - Advanced CSS styles with variables and mixins
- **RxJS** - Reactive programming library for handling asynchronous operations
- **Express** - Web server framework for SSR implementation

## 📦 Installation and Running

### Prerequisites
- Node.js (version 18+)
- npm or yarn
- Angular CLI

### Installing Dependencies
```bash
npm install
```

### Running the Application
```bash
npm start
```

The application will be available at: `http://localhost:4200`

### Building for Production
```bash
npm run build
```

## 🏗️ Project Structure

```
database-shop/
├── src/
│   ├── app/
│   │   ├── components/          # Shared components
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── login/          # Login form
│   │   │   ├── register/       # Registration form
│   │   │   ├── user-profile/   # User profile
│   │   │   ├── order-details/  # Order details
│   │   │   └── ...
│   │   ├── services/           # Application services
│   │   │   ├── translation.service.ts  # Translation service
│   │   │   ├── cart.service.ts        # Cart management
│   │   │   ├── auth.service.ts        # Authentication
│   │   │   └── ...
│   │   ├── assets/i18n/       # Translation files
│   │   │   ├── pl.json        # Polish translations
│   │   │   └── en.json        # English translations
│   │   └── ...
├── public/                    # Static resources
└── ...
```

## 🌍 Internationalization

The application supports two languages:
- **Polish** (default)
- **English**

### Adding a New Language
1. Create an `xx.json` file in the `src/assets/i18n/` folder
2. Add translations following the structure of existing files
3. Update `TranslationService` to support the new language

## 🔧 Configuration

### Routing
All routes are defined in `app.routes.ts` without Polish characters and spaces for better URL compatibility.

### Meta Tags
Dynamic meta tags are automatically updated when the language and page content change.

## 📱 Responsiveness

The application is fully responsive and works correctly on:
- Desktop computers
- Tablets
- Smartphones

## 🤝 Contact

**Maxsoft** - [https://maxsoft.pl](https://maxsoft.pl)

Project created by Maxsoft - specialists in creating modern web applications and e-commerce solutions.
