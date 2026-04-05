/**
 * Chart.js Integration
 * Handles rendering and updating line/doughnut charts.
 */

export class DashboardCharts {
  constructor(stateRef) {
    this.state = stateRef;
    this.lineChart = null;
    this.doughnutChart = null;
    this.themeColors = {
        dark: {
            text: '#94a3b8',
            grid: 'rgba(255, 255, 255, 0.05)',
            accents: ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6']
        },
        light: {
            text: '#64748b',
            grid: 'rgba(0, 0, 0, 0.05)',
            accents: ['#4f46e5', '#059669', '#dc2626', '#d97706', '#2563eb', '#7c3aed']
        }
    };
  }

  init(lineCanvasId, doughnutCanvasId) {
    this.lineCtx = document.getElementById(lineCanvasId).getContext('2d');
    this.doughnutCtx = document.getElementById(doughnutCanvasId).getContext('2d');
    this.render();
  }

  render() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const colors = isDark ? this.themeColors.dark : this.themeColors.light;
    
    this.renderLineChart(colors);
    this.renderDoughnutChart(colors);
  }

  renderLineChart(theme) {
    if (this.lineChart) this.lineChart.destroy();

    const monthlyData = this.state.getMonthlyComparison();
    const sortedMonths = Object.keys(monthlyData).sort();
    const labels = sortedMonths.map(m => {
        const [year, month] = m.split('-');
        return new Date(year, month - 1).toLocaleDateString('default', { month: 'short' });
    });
    
    // Calculate cumulative balance trend
    let cumulative = 0;
    const balances = sortedMonths.map(m => {
        cumulative += (monthlyData[m].income - monthlyData[m].expense);
        return cumulative;
    });

    this.lineChart = new Chart(this.lineCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Balance Trend',
          data: balances,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#1e293b',
              titleColor: '#f8fafc',
              bodyColor: '#94a3b8',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: theme.text }
          },
          y: {
            grid: { color: theme.grid },
            ticks: { color: theme.text }
          }
        }
      }
    });
  }

  renderDoughnutChart(theme) {
    if (this.doughnutChart) this.doughnutChart.destroy();

    const breakdown = this.state.getCategoryBreakdown();
    const labels = Object.keys(breakdown);
    const data = Object.values(breakdown);

    this.doughnutChart = new Chart(this.doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: theme.accents,
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: theme.text,
              padding: 20,
              font: { size: 12, weight: '500' },
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
              titleColor: '#f8fafc',
              bodyColor: '#94a3b8',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1
          }
        }
      }
    });
  }

  update() {
    this.render();
  }
}
