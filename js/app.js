/**
 * Main Application Entry Point
 * Bootstraps state, charts, and UI controller.
 */
import { state } from './state.js';
import { UIController } from './ui.js';
import { DashboardCharts } from './charts.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize logic
    const charts = new DashboardCharts(state);
    const ui = new UIController(state, charts);

    // 2. Initial Render
    ui.render();
    
    // 3. Initialize Charts
    charts.init('balanceChart', 'categoryChart');

    // 4. Handle window resize for charts
    window.addEventListener('resize', () => {
        charts.update();
    });

    console.log('Finance Dashboard Initialized 🚀');
    console.log('Current Role:', state.role);
});
