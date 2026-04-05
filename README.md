# Zorvyn Finance Dashboard

A premium, high-performance personal finance tracking dashboard built with **Vanilla HTML, CSS, and JavaScript**.

## ✨ Features

- **Dashboard Overview**: 
  - Summary cards for Total Balance, Income, and Expenses.
  - Interactive **Balance History** line chart (Chart.js).
  - Categorical **Spending Breakdown** doughnut chart.
- **Transaction Management**:
  - Full-featured list view with Date, Description, Category, Amount, and Type.
  - Real-time **Search** and **Filter** (by Income/Expense).
  - Multi-column **Sorting** (Date, Amount).
  - Persistent data storage using `localStorage`.
- **Role-Based Access Control**:
  - **Admin**: Full access to add, edit, and delete transactions.
  - **Viewer**: Read-only access to the dashboard and transactions.
- **Smart Insights**:
  - Automatically identifies the highest spending category.
  - Budget health status indicator based on income-to-expense ratio.
- **Modern UI/UX**:
  - **Dark Glassmorphism** design with `backdrop-filter` and semi-transparent layers.
  - **Dark/Light Mode** toggle with persistence.
  - Hand-crafted responsive layout (CSS Grid & Flexbox).
  - Smooth micro-animations and transitions.
  - Accessible iconography using **Lucide Icons**.

## 🚀 How to Run

1.  **Clone or download** the project folder.
2.  Open `index.html` in any modern web browser.
3.  No build steps or installations required!

## 📂 Project Structure

```text
/
├── index.html          # Main entry point and dashboard structure
├── css/
│   └── style.css       # Design system, glassmorphism, and animations
├── js/
│   ├── app.js          # Application entry point (bootstrapper)
│   ├── state.js        # Centralized state management & persistence
│   ├── ui.js           # DOM manipulation and event orchestration
│   ├── charts.js       # Chart.js integration and config
│   └── utils.js        # Core helper functions (formatting/validation)
└── README.md           # Project documentation
```

## 🛠️ Technical Details

- **Technology Stack**: Vanilla HTML5, CSS3 (Flex/Grid), and ES6+ JavaScript.
- **External Libraries**: 
  - [Chart.js](https://www.chartjs.org/) for data visualization.
  - [Lucide Icons](https://lucide.dev/) for modern iconography.
- **State Pattern**: Uses a simple object-based state store with observer-like manual re-rendering for performance and simplicity.
- **Responsive Design**: Implemented with CSS media queries and a fluid layout system.

---
Built with ❤️ for a modern financial experience.
