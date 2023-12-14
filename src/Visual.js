import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import './Visuals.css';

const DataVisualization = () => {
  useEffect(() => {
    const fetchDataAndDisplayCharts = async () => {
      await fetchAndDisplayCategoryData();
      await fetchAndDisplayRelevancyData();
      await fetchAndDisplayQueryResponseData();
      await fetchAndDisplayAvgResponseTimeByCategory();
      await fetchAndDisplayRelevantQueriesByCategory();
    };

    fetchDataAndDisplayCharts();

    return () => {
      destroyChart('categoryChart');
      destroyChart('relevancyChart');
      destroyChart('queryResponseChart');
      destroyChart('avgResponseTimeChart');
      destroyChart('relevantQueriesChart');
    };
  }, []);

  const destroyChart = (chartId) => {
    const chart = charts[chartId];
    if (chart) {
      chart.destroy();
      delete charts[chartId];
    }
  };

  const charts = {};

  async function createChart(chartId, type, data, options) {
    destroyChart(chartId);
    const ctx = document.getElementById(chartId).getContext('2d');
    charts[chartId] = new Chart(ctx, { type, data, options });
  }

  async function fetchAndDisplayCategoryData() {
    try {
      const response = await fetch('http://34.125.247.58:5000/category-distribution');
      const data = await response.json();

      const labels = data.map(item => item[0]);
      const counts = data.map(item => item[1]);

      createChart('categoryChart', 'pie', {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: [
            'red', 'orange', 'yellow', 'green', 'blue',
            'indigo', 'violet', 'purple', 'pink', 'silver',
            'gold', 'brown'
          ]
        }]
      }, {
        aspectRatio: 1,
        width: 1,
        height: 1
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchAndDisplayRelevancyData() {
    try {
      const response = await fetch('http://34.125.247.58:5000/relevancy-data');
      const data = await response.json();

      const labels = data.map(item => item[0]);
      const counts = data.map(item => item[1]);

      createChart('relevancyChart', 'bar', {
        labels: labels,
        datasets: [{
          label: 'Relevancy Count',
          data: counts,
          backgroundColor: ['red', 'orange']
        }]
      }, {
        scales: {
          y: {
            //beginAtZero: true,
            title: {
              display: true,
              text: 'Relevancy Count'
            }
          }
        },
        width: 50,
        height: 50,
      });
    } catch (error) {
      console.error('Error fetching relevancy data:', error);
    }
  }

  async function fetchAndDisplayQueryResponseData() {
    try {
      const response = await fetch('http://34.125.247.58:5000/query-length-response-time');
      const data = await response.json();

      const ctx = document.getElementById('queryResponseChart').getContext('2d');

      createChart('queryResponseChart', 'scatter', {
        datasets: [{
          label: 'Query Length vs Response Time',
          data: data.map(item => ({ x: item[0], y: item[1] })),
          backgroundColor: 'rgba(0, 123, 255, 0.5)'
        }]
      }, {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Query Length (No Spaces)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Response Time (seconds)'
            }
          }
        },
        width: 200,
        height: 200,
      });
    } catch (error) {
      console.error('Error fetching query length and response time data:', error);
    }
  }

  async function fetchAndDisplayAvgResponseTimeByCategory() {
    try {
      const response = await fetch('http://34.125.247.58:5000//average-response-time-by-category');
      const data = await response.json();

      const categories = data.map(item => item[0]);
      const avgResponseTimes = data.map(item => item[1]);

      createChart('avgResponseTimeChart', 'bar', {
        labels: categories,
        datasets: [{
          label: 'Average Response Time (seconds)',
          data: avgResponseTimes,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      }, {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Average Response Time (seconds)'
            }
          }
        },
        width: 200,
        height: 200,
      });
    } catch (error) {
      console.error('Error fetching average response time by category data:', error);
    }
  }

  async function fetchAndDisplayRelevantQueriesByCategory() {
    try {
      const response = await fetch('http://34.125.247.58:5000/relevant-queries-by-category');
      const data = await response.json();

      const categories = data.map(item => item[0]);
      const counts = data.map(item => item[1]);

      createChart('relevantQueriesChart', 'bar', {
        labels: categories,
        datasets: [{
          label: 'Number of Relevant Queries',
          data: counts,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      }, {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        width: 50,
        height: 50,
      });
    } catch (error) {
      console.error('Error fetching relevant queries by category data:', error);
    }
  }

  return (
    <div>
      <div className="row">
        <div className="column">
          <h2>Category Distribution</h2>
          <canvas id="categoryChart" className="chart"></canvas>
        </div>
        <div className="column">
          <h2>Relevancy Data</h2>
          <canvas id="relevancyChart" className="chart"></canvas>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <h2>Query Length vs Response Time</h2>
          <canvas id="queryResponseChart" className="chart"></canvas>
        </div>
        <div className="column">
          <h2>Average Response Time by Category</h2>
          <canvas id="avgResponseTimeChart" className="chart"></canvas>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <h2>Number of Relevant Queries by Category</h2>
          <canvas id="relevantQueriesChart" className="chart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;