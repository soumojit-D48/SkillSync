# SkillSync Frontend

A modern web application built with Next.js, TypeScript, and Tailwind CSS, designed to provide a seamless user experience for skill development and tracking.

## 🚀 Features

- **Modern Stack**: Built with Next.js 13+ (App Router), TypeScript, and Tailwind CSS
- **State Management**: Redux Toolkit for global state management
- **UI Components**: Customizable components with Radix UI and class-variance-authority
- **Data Visualization**: Interactive charts with Chart.js
- **Animations**: Smooth animations powered by Framer Motion
- **Icons**: Comprehensive icon set with Lucide React
- **Authentication**: Secure authentication flow

## 🛠️ Tech Stack

- **Framework**: Next.js 13+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI, class-variance-authority
- **Data Visualization**: Chart.js, react-chartjs-2
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Form Handling**: React Hook Form
- **Routing**: Next.js App Router

## 📁 Project Structure

```
src/
├── app/                  # App router pages and layouts
│   ├── (dashboard)/      # Dashboard routes (protected)
│   ├── auth/             # Authentication routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   └── ...               # Other component categories
├── lib/                  # Utility functions and configs
├── providers/            # Context providers
├── store/                # Redux store configuration
├── styles/               # Global styles and themes
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Copy `.env.example` to `.env.local` and update the environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Development

- Run the development server:
  ```bash
  npm run dev
  ```
- Lint your code:
  ```bash
  npm run lint
  ```
- Build for production:
  ```bash
  npm run build
  ```
- Start production server:
  ```bash
  npm start
  ```

## 📦 Dependencies

- **Core**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, class-variance-authority, tailwind-merge
- **UI**: Radix UI, Lucide Icons
- **State Management**: Redux Toolkit, React Redux
- **Data Visualization**: Chart.js, react-chartjs-2
- **Animations**: Framer Motion

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Radix UI Documentation](https://www.radix-ui.com/)
