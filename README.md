# Lehman Fee Calculator

A modern, professional M&A advisory fee calculator based on the traditional **Lehman Formula**. Built with React, TypeScript, and Tailwind CSS.

🔗 **Live Demo:** [https://danherrski.github.io/lehmanfeecalculator/](https://danherrski.github.io/lehmanfeecalculator/)

## Features

✨ **Real-time Calculation** - See results instantly as you type
📊 **Fee Breakdown** - Detailed tier-by-tier breakdown
📱 **Mobile Responsive** - Works perfectly on all devices
🎨 **Modern UI** - Clean, professional interface
✅ **100% Test Coverage** - Fully tested calculation logic
🔒 **Type-Safe** - Built with TypeScript
⚡ **Fast** - Optimized Vite build

## What is the Lehman Formula?

The Lehman Formula is a traditional fee structure for M&A advisory services, calculated as a percentage of the Total Enterprise Value (TEV):

- **Tier 1:** 5% on the first $1 million
- **Tier 2:** 4% on the second $1 million
- **Tier 3:** 3% on the third $1 million
- **Tier 4:** 2% on the fourth $1 million
- **Tier 5:** 1% on amounts over $4 million

**Double Lehman** doubles these percentages (10-8-6-4-2%).

[Learn more on Wikipedia](https://en.wikipedia.org/wiki/Lehman_Formula)

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/DanHerrski/lehmanfeecalculator.git
cd lehmanfeecalculator

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

The app will be available at `http://localhost:5173`

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run lint         # Lint code
\`\`\`

## Project Structure

\`\`\`
lehmanfeecalculator/
├── src/
│   ├── components/
│   │   └── LehmanCalculator.tsx  # Main calculator component
│   ├── utils/
│   │   ├── lehmanCalculator.ts    # Calculation logic
│   │   └── lehmanCalculator.test.ts # Tests
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── legacy/                         # Original vanilla JS version
├── BUSINESS_PLAN.md               # Product roadmap
├── TRACKER.md                     # Development tracker
└── README.md
\`\`\`

## Technology Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 3.4
- **Testing:** Vitest + Testing Library
- **Deployment:** GitHub Pages

## Testing

The calculation logic has **100% test coverage**:

\`\`\`bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
\`\`\`

## Building for Production

\`\`\`bash
npm run build
\`\`\`

The build output will be in the `dist/` directory.

## Deployment

This project auto-deploys to GitHub Pages on every push to the main branch using GitHub Actions.

To deploy manually:

\`\`\`bash
npm run build
# Push the dist folder to gh-pages branch
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

**Dan Herr**
- Website: [DanHerr.com](http://www.danherr.com)
- Twitter: [@DanHerr](https://twitter.com/DanHerr)

## Roadmap

See [BUSINESS_PLAN.md](./BUSINESS_PLAN.md) for the complete product roadmap.

### Upcoming Features
- Visual fee tier charts
- Shareable calculation links
- PDF export
- Dark mode
- Calculation history
- Multi-scenario comparison

## Acknowledgments

- Lehman Formula from traditional investment banking practices
- Built with modern web technologies
- Designed for M&A professionals

---

Made with ❤️ for the M&A community
