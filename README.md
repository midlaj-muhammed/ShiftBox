# 🚀 ShiftBox

A modern file sharing application built with React, TypeScript, and Supabase that allows users to securely upload, manage, and share files with customizable access controls and subscription-based file limits.

🌐 **[Live Demo](https://shift-box.vercel.app/)**

## ✨ Features

### ⚡ Core Functionality
- 📤 Drag-and-drop file uploads with progress tracking
- 🔒 Secure file storage with Supabase Storage
- 🔗 Instant file sharing via public URLs
- 🗂️ File management dashboard
- 📏 100MB file size limit per upload

### 👤 User Management
- 🔑 Complete authentication system (signup, login, password reset)
- 📝 User profile management
- 🪙 Subscription tiers with different file limits
- 💳 Payment processing integration with Stripe

### 🎨 UI/UX
- 🖌️ Modern, responsive design using Tailwind CSS
- 🧩 Polished component library with shadcn/ui
- 🔔 Toast notifications for user feedback
- 🖱️ Drag-and-drop interface for intuitive file uploads

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (Authentication, Storage, Database)
- **State Management**: React Context API, React Query
- **Routing**: React Router Dom v6
- **Build Tools**: Vite
- **Form Handling**: React Hook Form with Zod validation
- **Payments**: Stripe integration via Supabase Functions

## ℹ️ Project Info

## 🚦 Getting Started

### 📋 Prerequisites
- Node.js 18+ & npm (recommended: install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Supabase account (for backend services)
- Stripe account (optional, for payment processing)
### ⚙️ Environment Setup
Create a `.env` file in the project root with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 💾 Installation
Clone the repository and install dependencies:
```sh
git clone https://github.com/midlaj-muhammed/ShiftBox
cd file-share-now
npm install
```

### ▶️ Running the Application
Start the development server with auto-reloading and instant preview:
```sh
npm run dev
```
The application will be available at http://localhost:5173 by default.

## 📁 Usage

### ⬆️ Upload Files
1. Navigate to the Dashboard
2. Select the "Upload" tab
3. Drag & drop files or click to browse
4. Files up to 100MB are supported

### 🔗 Share Files
1. After uploading, copy the generated sharing link
2. Share the link with anyone who needs access to the file
3. Recipients can download the file directly without creating an account

## 🗂️ Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui component library
│   ├── FileCard.tsx  # File display component
│   ├── FileUpload.tsx # File upload interface
│   ├── Navbar.tsx    # Application navigation
│   └── UploadAndShare.tsx # Combined upload interface
├── contexts/         # React Context Providers
│   ├── AuthContext.tsx # Authentication state management
│   └── FileContext.tsx # File operations and state
├── hooks/            # Custom React hooks
├── integrations/     # Third-party service integrations
│   └── supabase/     # Supabase client and types
├── pages/            # Application routes
│   ├── DashboardPage.tsx # User dashboard with file management
│   ├── DownloadPage.tsx  # Public file download page
│   ├── LoginPage.tsx     # User authentication
│   └── SubscriptionPage.tsx # Plan management
├── store/            # State management
└── types/            # TypeScript type definitions
```

## 🛡️ Supabase Configuration

This application uses Supabase for:

1. **Authentication** - User signup, login, and session management
2. **Storage** - File storage with public/private access controls
3. **Database** - Storing user subscription and plan information
4. **Edge Functions** - Handling Stripe payment processing

To configure your own Supabase instance:
1. Create a project at [supabase.com](https://supabase.com)
2. Enable authentication and storage services
3. Create a storage bucket named "user-files" with appropriate policies
4. Update your environment variables with your Supabase credentials

## Deployment

The application can be deployed to various hosting platforms:

### 🌐 Netlify/Vercel Deployment

1. Build the production version:
   ```sh
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your preferred hosting service

3. Configure environment variables in your hosting dashboard

## ✏️ Editing the Code
You can edit the application in several ways:

- **Use your preferred IDE:** Clone this repo, make changes locally, and push updates.
- **Edit directly in GitHub:** Navigate to the desired file(s) and click the "Edit" button (pencil icon) at the top right of the file view.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

Please ensure your code adheres to the existing style and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📬 Contact & Support

- For support or questions, please open an issue in the GitHub repository

## 🧑‍💻 Technology Stack Details

This project leverages the following technologies:

### 🏗️ Core Framework
- **React 18** - Modern UI library with hooks for efficient state management
- **TypeScript** - Static typing for improved developer experience and code quality
- **Vite** - Next-generation frontend build tool with fast HMR (Hot Module Replacement)

### 🎨 UI Framework
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality React components built with Radix UI and Tailwind
- **Lucide React** - Beautiful, consistent icon set

### 🗄️ Backend Services
- **Supabase** - Open-source Firebase alternative providing:
  - Authentication with multiple providers
  - PostgreSQL database
  - Storage for file management
  - Edge Functions for serverless compute

### 🔄 State Management
- **React Context API** - For application-wide state management
- **TanStack React Query** - For server state management and data fetching

### 📝 Forms & Validation
- **React Hook Form** - Performance-focused form handling
- **Zod** - Schema validation with TypeScript integration

### 🛣️ Routing
- **React Router Dom v6** - Declarative routing for React applications

## 🚚 Deployment Options

### ⚡ Standard Deployment

1. Build the production version:
   ```sh
   npm run build
   ```

2. Deploy the `dist` directory to any static hosting provider:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

3. Set up environment variables for your Supabase credentials

### Custom Domain Setup

Most hosting providers allow you to configure custom domains:
1. Purchase a domain from a domain registrar (like Namecheap, GoDaddy, Google Domains)
2. Configure the DNS settings to point to your hosting provider
3. Set up SSL certificates for secure HTTPS connections
