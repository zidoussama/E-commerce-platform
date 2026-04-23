import React, { useState, useEffect, useRef } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  LinearProgress,
  useTheme,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  AddBox as AddBoxIcon,
  Chat as ChatIcon,
  Favorite as FavoriteIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';

// Styled components with reduced spacing
const StyledCard = styled(Card)({
  borderRadius: '8px',
  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
  padding: '8px',
  background: '#fff',
  border: '1px solid #e0e0e0',
  transition: 'border-color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    borderColor: 'rgba(0, 196, 180, 0.3)',
    transform: 'scale(1.01)',
  },
});

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  alignItems: 'center',
  padding: '4px',
});

const StyledIconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'rgba(0, 196, 180, 0.1)',
  marginRight: '8px',
  color: '#00C4B4',
});

const StyledTypography = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: 600,
  color: '#00C4B4',
  marginBottom: '8px',
  fontFamily: 'Georgia, serif',
});

const ChartContainer = styled(Box)({
  background: '#fff',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  padding: '12px',
  marginTop: '12px',
  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(0, 196, 180, 0.3)',
  },
});

const StyledDivider = styled(Divider)({
  borderColor: '#e0e0e0',
  margin: '8px 0',
});

const ProgressWrapper = styled(Box)({
  marginTop: '8px',
  marginBottom: '4px',
});

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    comments: 0,
    likes: 0,
    customers: 0,
  });
  const [salesStats, setSalesStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [engagementTrend, setEngagementTrend] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [topProductsByLikes, setTopProductsByLikes] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [avgOrderValueOverTime, setAvgOrderValueOverTime] = useState([]);
  const [totalIncomeOverTime, setTotalIncomeOverTime] = useState([]);
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [weeklyOrders, setWeeklyOrders] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState(0);
  const [salesConversionRate, setSalesConversionRate] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [includeCancelled, setIncludeCancelled] = useState(true);

  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const likesBarChartRef = useRef(null);
  const salesBarChartRef = useRef(null);
  const avgOrderLineChartRef = useRef(null);
  const incomeLineChartRef = useRef(null);
  const revenueBarChartRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, commentsRes, likesRes, usersRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/products`),
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/orders/all`),
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/comments/all`),
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/likes`),
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/users`),
        ]);

        if (!productsRes.ok || !ordersRes.ok || !commentsRes.ok || !likesRes.ok || !usersRes.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const [productsData, ordersData, commentsData, likesData, usersData] = await Promise.all([
          productsRes.json(),
          ordersRes.json(),
          commentsRes.json(),
          likesRes.json(),
          usersRes.json(),
        ]);

        console.log('productsData:', productsData);
        console.log('ordersData:', ordersData);
        console.log('likesData:', likesData);
        console.log('usersData:', usersData);
        console.log('Include Cancelled Orders:', includeCancelled);

        setStats({
          products: productsData.length,
          orders: ordersData.length,
          comments: commentsData.length,
          likes: likesData.length,
          customers: usersData.length,
        });

        const today = new Date();
        const oneDayAgo = new Date(today);
        oneDayAgo.setDate(today.getDate() - 1);
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setDate(today.getDate() - 30);

        const dailySales = ordersData
          .filter(order => {
            if (!includeCancelled && order.status === 'CANCELLED') return false;
            return new Date(order.createdAt) >= oneDayAgo;
          })
          .reduce((sum, order) => sum + (order.total || 0), 0);

        const weeklySales = ordersData
          .filter(order => {
            if (!includeCancelled && order.status === 'CANCELLED') return false;
            return new Date(order.createdAt) >= oneWeekAgo;
          })
          .reduce((sum, order) => sum + (order.total || 0), 0);

        const monthlySales = ordersData
          .filter(order => {
            if (!includeCancelled && order.status === 'CANCELLED') return false;
            return new Date(order.createdAt) >= oneMonthAgo;
          })
          .reduce((sum, order) => sum + (order.total || 0), 0);

        setSalesStats({
          daily: dailySales,
          weekly: weeklySales,
          monthly: monthlySales,
        });

        const commentsByMonth = {};
        const likesByMonth = {};
        const ordersByMonth = {};
        const priceByMonth = {};
        const totalIncomeByMonth = {};
        for (let i = 11; i >= 0; i--) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthStr = date.toLocaleString('default', { month: 'short' });
          commentsByMonth[monthStr] = 0;
          likesByMonth[monthStr] = 0;
          ordersByMonth[monthStr] = 0;
          priceByMonth[monthStr] = 0;
          totalIncomeByMonth[monthStr] = 0;
        }

        commentsData.forEach(comment => {
          const date = new Date(comment.createdAt);
          const monthStr = date.toLocaleString('default', { month: 'short' });
          if (commentsByMonth[monthStr] !== undefined) {
            commentsByMonth[monthStr]++;
          }
        });

        likesData.forEach(like => {
          const date = new Date(like.createdAt);
          const monthStr = date.toLocaleString('default', { month: 'short' });
          if (likesByMonth[monthStr] !== undefined) {
            likesByMonth[monthStr]++;
          }
        });

        ordersData.forEach(order => {
          const date = new Date(order.createdAt);
          const monthStr = date.toLocaleString('default', { month: 'short' });
          if (!includeCancelled && order.status === 'CANCELLED') return;
          if (ordersByMonth[monthStr] !== undefined) {
            ordersByMonth[monthStr]++;
            const orderTotal = order.total || 0;
            priceByMonth[monthStr] += orderTotal;
            totalIncomeByMonth[monthStr] += orderTotal;
          }
        });

        const formattedEngagementTrend = Object.keys(commentsByMonth).map(month => ({
          month,
          comments: commentsByMonth[month],
          likes: likesByMonth[month],
        }));
        setEngagementTrend(formattedEngagementTrend);

        const formattedAvgOrderValue = Object.keys(ordersByMonth).map(month => ({
          month,
          avgOrderValue: ordersByMonth[month] > 0 ? priceByMonth[month] / ordersByMonth[month] : 0,
        }));
        setAvgOrderValueOverTime(formattedAvgOrderValue);

        const formattedTotalIncome = Object.keys(totalIncomeByMonth).map(month => ({
          month,
          totalIncome: totalIncomeByMonth[month],
        }));
        setTotalIncomeOverTime(formattedTotalIncome);

        const revenueByDayData = {};
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dayStr = date.toLocaleDateString('default', { day: 'numeric', month: 'short' });
          revenueByDayData[dayStr] = 0;
        }

        ordersData.forEach(order => {
          if (!includeCancelled && order.status === 'CANCELLED') return;
          const date = new Date(order.createdAt);
          const dayStr = date.toLocaleDateString('default', { day: 'numeric', month: 'short' });
          if (revenueByDayData[dayStr] !== undefined) {
            revenueByDayData[dayStr] += order.total || 0;
          }
        });

        const formattedRevenueByDay = Object.keys(revenueByDayData).map(day => ({
          day,
          revenue: revenueByDayData[day],
        }));
        setRevenueByDay(formattedRevenueByDay);

        const ENGAGEMENT_COLORS = ['#00C4B4', '#FF7777'];
        const engagement = [
          { name: 'Comments', value: commentsData.length, fill: ENGAGEMENT_COLORS[0] },
          { name: 'Likes', value: likesData.length, fill: ENGAGEMENT_COLORS[1] },
        ].filter(item => item.value > 0);
        setEngagementData(engagement);

        const productsWithLikes = productsData.map(product => {
          const productId = product._id?.$oid || product._id || product.id;
          const productLikes = likesData.filter(like => {
            const likeProductId = like.product?.$oid || like.product;
            return likeProductId === productId;
          });
          return {
            name: product.name,
            likes: productLikes.length,
          };
        });
        const sortedProductsByLikes = productsWithLikes
          .filter(product => product.likes > 0)
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 5);
        setTopProductsByLikes(
          sortedProductsByLikes.length > 0 ? sortedProductsByLikes : productsWithLikes.slice(0, 5)
        );

        const productSales = {};
        ordersData.forEach(order => {
          if (order.status !== 'Delivered' && !(includeCancelled && order.status === 'CANCELLED')) return;
          order.items.forEach(item => {
            const productId = item.product?.$oid || item.product;
            const product = productsData.find(p => (p._id?.$oid || p._id) === productId);
            if (product) {
              if (!productSales[productId]) {
                productSales[productId] = { name: product.name, unitsSold: 0 };
              }
              productSales[productId].unitsSold += item.quantity || 1;
            }
          });
        });

        const topSelling = Object.keys(productSales)
          .map(productId => ({
            name: productSales[productId].name,
            unitsSold: productSales[productId].unitsSold,
          }))
          .sort((a, b) => b.unitsSold - a.unitsSold)
          .slice(0, 5);
        setTopSellingProducts(topSelling);

        const weekly = ordersData.filter(order => {
          if (!includeCancelled && order.status === 'CANCELLED') return false;
          return new Date(order.createdAt) >= oneWeekAgo;
        }).length;
        const monthly = ordersData.filter(order => {
          if (!includeCancelled && order.status === 'CANCELLED') return false;
          return new Date(order.createdAt) >= oneMonthAgo;
        }).length;
        setWeeklyOrders(weekly);
        setMonthlyOrders(monthly);

        const usersWithOrders = new Set(ordersData.map(order => order.user?._id)).size;
        const conversionRate =
          usersData.length > 0 ? (usersWithOrders / usersData.length) * 100 : 0;
        setSalesConversionRate(conversionRate);

        const lowStockThreshold = 5;
        const lowStock = productsData
          .filter(product => product.stock < lowStockThreshold)
          .map(product => ({
            name: product.name,
            stock: product.stock,
          }));
        setLowStockProducts(lowStock);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();

    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
        lineChartRef.current = null;
      }
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
        pieChartRef.current = null;
      }
      if (likesBarChartRef.current) {
        likesBarChartRef.current.destroy();
        likesBarChartRef.current = null;
      }
      if (salesBarChartRef.current) {
        salesBarChartRef.current.destroy();
        salesBarChartRef.current = null;
      }
      if (avgOrderLineChartRef.current) {
        avgOrderLineChartRef.current.destroy();
        avgOrderLineChartRef.current = null;
      }
      if (incomeLineChartRef.current) {
        incomeLineChartRef.current.destroy();
        incomeLineChartRef.current = null;
      }
      if (revenueBarChartRef.current) {
        revenueBarChartRef.current.destroy();
        revenueBarChartRef.current = null;
      }
    };
  }, [includeCancelled]);

  const lineData = {
    labels: engagementTrend.map(item => item.month),
    datasets: [
      {
        label: 'Comments',
        data: engagementTrend.map(item => item.comments),
        borderColor: '#00C4B4',
        backgroundColor: 'rgba(0, 196, 180, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Likes',
        data: engagementTrend.map(item => item.likes),
        borderColor: '#FF7777',
        backgroundColor: 'rgba(255, 119, 119, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: engagementData.map(item => item.name),
    datasets: [
      {
        data: engagementData.map(item => item.value),
        backgroundColor: engagementData.map(item => item.fill),
        borderColor: engagementData.map(item => item.fill),
        borderWidth: 1,
      },
    ],
  };

  const likesBarData = {
    labels: topProductsByLikes.map(item => item.name),
    datasets: [
      {
        label: 'Likes',
        data: topProductsByLikes.map(item => item.likes),
        backgroundColor: '#00C4B4',
        borderColor: '#00C4B4',
        borderWidth: 1,
      },
    ],
  };

  const salesBarData = {
    labels: topSellingProducts.map(item => item.name),
    datasets: [
      {
        label: 'Units Sold',
        data: topSellingProducts.map(item => item.unitsSold),
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
        borderWidth: 1,
      },
    ],
  };

  const revenueBarData = {
    labels: revenueByDay.map(item => item.day),
    datasets: [
      {
        label: 'Revenue ($)',
        data: revenueByDay.map(item => item.revenue),
        backgroundColor: '#00C4B4',
        borderColor: '#00C4B4',
        borderWidth: 1,
      },
    ],
  };

  const avgOrderLineData = {
    labels: avgOrderValueOverTime.map(item => item.month),
    datasets: [
      {
        label: 'Average Order Value ($)',
        data: avgOrderValueOverTime.map(item => item.avgOrderValue),
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const incomeLineData = {
    labels: totalIncomeOverTime.map(item => item.month),
    datasets: [
      {
        label: 'Revenue ($)',
        data: totalIncomeOverTime.map(item => item.totalIncome),
        borderColor: '#00C4B4',
        backgroundColor: 'rgba(0, 196, 180, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const totalEngagement = stats.comments + stats.likes;
  const satisfaction = totalEngagement > 0 ? (stats.likes / totalEngagement) * 100 : 0;
  const previousSatisfaction = 85;
  const trend = satisfaction - previousSatisfaction;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: theme.palette.text.secondary, font: { size: 10 } } },
      y: { ticks: { color: theme.palette.text.secondary, font: { size: 10 } } },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: theme.palette.text.primary, font: { size: 10 } },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? '#2a3b4c' : '#ffffff',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.border,
        borderWidth: 1,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: theme.palette.text.primary, font: { size: 10 } },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? '#2a3b4c' : '#ffffff',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.border,
        borderWidth: 1,
      },
    },
  };

  const avgOrderLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: theme.palette.text.secondary, font: { size: 10 } } },
      y: {
        ticks: { color: theme.palette.text.secondary, font: { size: 10 } },
        title: {
          display: true,
          text: 'Avg Order Value ($)',
          color: theme.palette.text.primary,
          font: { size: 10 },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: theme.palette.text.primary, font: { size: 10 } },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? '#2a3b4c' : '#ffffff',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.border,
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            return `Avg Order Value: $${value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
  };

  const incomeLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: theme.palette.text.secondary, font: { size: 10 } } },
      y: {
        ticks: { color: theme.palette.text.secondary, font: { size: 10 } },
        title: {
          display: true,
          text: 'Revenue ($)',
          color: theme.palette.text.primary,
          font: { size: 10 },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: theme.palette.text.primary, font: { size: 10 } },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? '#2a3b4c' : '#ffffff',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.border,
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            return `Revenue: $${value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
  };

  if (loading) {
    return React.createElement(
      Box,
      { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' } },
      React.createElement(CircularProgress, { style: { color: theme.palette.primary.main } })
    );
  }

  if (error) {
    return React.createElement(
      Box,
      { style: { padding: '16px', textAlign: 'center' } },
      React.createElement(
        Typography,
        { variant: 'h6', style: { color: theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252', fontWeight: 500 } },
        error
      )
    );
  }

  return React.createElement(
    Box,
    { style: { padding: '12px' } },


    React.createElement(
      Grid,
      { container: true, spacing: 1 },
      React.createElement(
        Grid,
        { item: true, xs: 12, sm: 6, md: 2 },
        React.createElement(
          StyledCard,
          null,
          React.createElement(
            StyledCardContent,
            null,
            React.createElement(StyledIconWrapper, null, React.createElement(AddBoxIcon, { fontSize: 'medium' })),
            React.createElement(
              Box,
              null,
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.primary', fontFamily: 'Georgia, serif' } },
                'Total Products'
              ),
              React.createElement(
                Typography,
                { variant: 'h5', style: { color: 'primary.main', fontWeight: 600 } },
                stats.products.toLocaleString()
              )
            )
          )
        )
      ),
      React.createElement(
        Grid,
        { item: true, xs: 12, sm: 6, md: 2 },
        React.createElement(
          StyledCard,
          null,
          React.createElement(
            StyledCardContent,
            null,
            React.createElement(StyledIconWrapper, null, React.createElement(ShoppingCartIcon, { fontSize: 'medium' })),
            React.createElement(
              Box,
              null,
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.primary', fontFamily: 'Georgia, serif' } },
                'Total Orders'
              ),
              React.createElement(
                Typography,
                { variant: 'h5', style: { color: 'primary.main', fontWeight: 600 } },
                stats.orders.toLocaleString()
              )
            )
          )
        )
      ),
      React.createElement(
        Grid,
        { item: true, xs: 12, sm: 6, md: 2 },
        React.createElement(
          StyledCard,
          null,
          React.createElement(
            StyledCardContent,
            null,
            React.createElement(StyledIconWrapper, null, React.createElement(PeopleIcon, { fontSize: 'medium' })),
            React.createElement(
              Box,
              null,
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.primary', fontFamily: 'Georgia, serif' } },
                'Total Customers'
              ),
              React.createElement(
                Typography,
                { variant: 'h5', style: { color: 'primary.main', fontWeight: 600 } },
                stats.customers.toLocaleString()
              )
            )
          )
        )
      ),
      React.createElement(
        Grid,
        { item: true, xs: 12, sm: 6, md: 2 },
        React.createElement(
          StyledCard,
          null,
          React.createElement(
            StyledCardContent,
            null,
            React.createElement(StyledIconWrapper, null, React.createElement(ChatIcon, { fontSize: 'medium' })),
            React.createElement(
              Box,
              null,
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.primary', fontFamily: 'Georgia, serif' } },
                'Total Comments'
              ),
              React.createElement(
                Typography,
                { variant: 'h5', style: { color: 'primary.main', fontWeight: 600 } },
                stats.comments.toLocaleString()
              )
            )
          )
        )
      ),
      React.createElement(
        Grid,
        { item: true, xs: 12, sm: 6, md: 2 },
        React.createElement(
          StyledCard,
          null,
          React.createElement(
            StyledCardContent,
            null,
            React.createElement(StyledIconWrapper, null, React.createElement(FavoriteIcon, { fontSize: 'medium' })),
            React.createElement(
              Box,
              null,
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.primary', fontFamily: 'Georgia, serif' } },
                'Total Likes'
              ),
              React.createElement(
                Typography,
                { variant: 'h5', style: { color: 'primary.main', fontWeight: 600 } },
                stats.likes.toLocaleString()
              )
            )
          )
        )
      ),
      React.createElement(
        Grid,
        { item: true, xs: 12, sm: 6, md: 2 },
        React.createElement(
          StyledCard,
          null,
          React.createElement(
            StyledCardContent,
            null,
            React.createElement(StyledIconWrapper, null, React.createElement(MonetizationOnIcon, { fontSize: 'medium' })),
            React.createElement(
              Box,
              null,
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.primary', fontFamily: 'Georgia, serif' } },
                'Total Sales'
              ),
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.secondary' } },
                `Daily: $${salesStats.daily.toLocaleString()}`
              ),
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.secondary' } },
                `Weekly: $${salesStats.weekly.toLocaleString()}`
              ),
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.secondary' } },
                `Monthly: $${salesStats.monthly.toLocaleString()}`
              )
            )
          )
        )
      )
    ),

    React.createElement(StyledDivider, null),

    React.createElement(
      Grid,
      { container: true, spacing: 1 },
      React.createElement(
        Grid,
        { item: true, xs: 12, md: 8 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Engagement Trend (Last 12 Months)'
          ),
          React.createElement(
            Box,
            { style: { height: 200 } },
            React.createElement(Line, {
              ref: chart => {
                if (chart) {
                  if (lineChartRef.current) {
                    lineChartRef.current.destroy();
                  }
                  lineChartRef.current = chart.chartInstance;
                }
              },
              data: lineData,
              options: chartOptions,
            })
          )
        )
      ),

      React.createElement(
        Grid,
        { item: true, xs: 12, md: 4 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Engagement Satisfaction'
          ),
          React.createElement(
            Typography,
            { variant: 'h5', style: { color: 'primary.main', fontWeight: 600, textAlign: 'center' } },
            satisfaction.toFixed(2) + '%'
          ),
          React.createElement(
            ProgressWrapper,
            null,
            React.createElement(LinearProgress, {
              variant: 'determinate',
              value: satisfaction,
              style: {
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.mode === 'dark' ? '#455a64' : '#e0e0e0',
              },
              sx: {
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            })
          ),
          React.createElement(
            Box,
            { style: { display: 'flex', justifyContent: 'space-between', marginTop: '4px' } },
            React.createElement(
              Typography,
              { variant: 'body2', style: { color: 'text.secondary' } },
              'Previous: ' + previousSatisfaction + '%'
            ),
            React.createElement(
              Typography,
              { variant: 'body2', style: { color: trend >= 0 ? 'green' : 'red' } },
              (trend >= 0 ? '+' : '') + trend.toFixed(2) + '%'
            )
          )
        )
      ),

      React.createElement(
        Grid,
        { item: true, xs: 12, md: 4 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Sales Conversion Rate'
          ),
          React.createElement(
            Typography,
            { variant: 'h5', style: { color: 'primary.main', fontWeight: 600, textAlign: 'center' } },
            salesConversionRate.toFixed(2) + '%'
          ),
          React.createElement(
            ProgressWrapper,
            null,
            React.createElement(LinearProgress, {
              variant: 'determinate',
              value: Math.min(salesConversionRate, 100),
              style: {
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.mode === 'dark' ? '#455a64' : '#e0e0e0',
              },
              sx: {
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            })
          ),
          React.createElement(
            Typography,
            { variant: 'body2', style: { color: 'text.secondary', textAlign: 'center' } },
            `Based on ${stats.orders} orders and ${stats.customers} customers`
          )
        )
      ),

      React.createElement(
        Grid,
        { item: true, xs: 12, md: 4 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Engagement by Type'
          ),
          engagementData.length > 0
            ? React.createElement(
                Box,
                { style: { height: 150 } },
                React.createElement(Pie, {
                  ref: chart => {
                    if (chart) {
                      if (pieChartRef.current) {
                        pieChartRef.current.destroy();
                      }
                      pieChartRef.current = chart.chartInstance;
                    }
                  },
                  data: pieData,
                  options: pieOptions,
                })
              )
            : React.createElement(
                Typography,
                { style: { color: 'text.secondary', textAlign: 'center', padding: '16px 0' } },
                'No engagement data available.'
              )
        )
      ),

      React.createElement(
        Grid,
        { item: true, xs: 12, md: 4 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Top 5 Products by Likes'
          ),
          topProductsByLikes.length > 0
            ? React.createElement(
                Box,
                { style: { height: 150 } },
                React.createElement(Bar, {
                  ref: chart => {
                    if (chart) {
                      if (likesBarChartRef.current) {
                        likesBarChartRef.current.destroy();
                      }
                      likesBarChartRef.current = chart.chartInstance;
                    }
                  },
                  data: likesBarData,
                  options: chartOptions,
                })
              )
            : React.createElement(
                Typography,
                { style: { color: 'text.secondary', textAlign: 'center', padding: '16px 0' } },
                'No product data available.'
              )
        )
      ),

      React.createElement(
        Grid,
        { item: true, xs: 12, md: 4 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Top 5 Selling Products'
          ),
          topSellingProducts.length > 0
            ? React.createElement(
                Box,
                { style: { height: 150 } },
                React.createElement(Bar, {
                  ref: chart => {
                    if (chart) {
                      if (salesBarChartRef.current) {
                        salesBarChartRef.current.destroy();
                      }
                      salesBarChartRef.current = chart.chartInstance;
                    }
                  },
                  data: salesBarData,
                  options: chartOptions,
                })
              )
            : React.createElement(
                Typography,
                { style: { color: 'text.secondary', textAlign: 'center', padding: '16px 0' } },
                'No sales data available.'
              )
        )
      ),

      React.createElement(
        Grid,
        { item: true, xs: 12, md: 4 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Order Statistics'
          ),
          React.createElement(
            Box,
            { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
            React.createElement(
              Box,
              null,
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.secondary', fontFamily: 'Georgia, serif' } },
                'Weekly Orders'
              ),
              React.createElement(
                Typography,
                { variant: 'h6', style: { color: 'primary.main', fontWeight: 600 } },
                weeklyOrders.toLocaleString()
              )
            ),
            React.createElement(
              Box,
              null,
              React.createElement(
                Typography,
                { variant: 'body2', style: { color: 'text.secondary', fontFamily: 'Georgia, serif' } },
                'Monthly Orders'
              ),
              React.createElement(
                Typography,
                { variant: 'h6', style: { color: 'primary.main', fontWeight: 600 } },
                monthlyOrders.toLocaleString()
              )
            )
          )
        )
      ),

      React.createElement(
        Grid,
        { item: true, xs: 12, md: 4 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Revenue by Day (Last 7 Days)'
          ),
          revenueByDay.length > 0
            ? React.createElement(
                Box,
                { style: { height: 150 } },
                React.createElement(Bar, {
                  ref: chart => {
                    if (chart) {
                      if (revenueBarChartRef.current) {
                        revenueBarChartRef.current.destroy();
                      }
                      revenueBarChartRef.current = chart.chartInstance;
                    }
                  },
                  data: revenueBarData,
                  options: chartOptions,
                })
              )
            : React.createElement(
                Typography,
                { style: { color: 'text.secondary', textAlign: 'center', padding: '16px 0' } },
                'No revenue data available.'
              )
        )
      ),

      React.createElement(
        Grid,
        { item: true, xs: 12, md: 4 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Inventory Warnings (Low Stock)'
          ),
          lowStockProducts.length > 0
            ? React.createElement(
                List,
                { dense: true },
                lowStockProducts.map(product =>
                  React.createElement(
                    ListItem,
                    { key: product.name },
                    React.createElement(WarningIcon, { style: { color: '#FF5252', marginRight: '4px' } }),
                    React.createElement(
                      ListItemText,
                      {
                        primary: `${product.name}`,
                        secondary: `Stock: ${product.stock}`,
                        primaryTypographyProps: { color: 'text.primary', style: { fontSize: '0.8rem' } },
                        secondaryTypographyProps: { color: 'text.secondary', style: { fontSize: '0.7rem' } },
                      }
                    )
                  )
                )
              )
            : React.createElement(
                Typography,
                { style: { color: 'text.secondary', textAlign: 'center', padding: '16px 0' } },
                'No low stock alerts.'
              )
        )
      ),

      React.createElement(
        Grid,
        { item: true, xs: 12, md: 6 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Average Order Value Over Time'
          ),
          avgOrderValueOverTime.length > 0
            ? React.createElement(
                Box,
                { style: { height: 200 } },
                React.createElement(Line, {
                  ref: chart => {
                    if (chart) {
                      if (avgOrderLineChartRef.current) {
                        avgOrderLineChartRef.current.destroy();
                      }
                      avgOrderLineChartRef.current = chart.chartInstance;
                    }
                  },
                  data: avgOrderLineData,
                  options: avgOrderLineOptions,
                })
              )
            : React.createElement(
                Typography,
                { style: { color: 'text.secondary', textAlign: 'center', padding: '16px 0' } },
                'No order data available.'
              )
        )
      ),

      React.createElement(
        Grid,
        { item: true, xs: 12, md: 6 },
        React.createElement(
          ChartContainer,
          null,
          React.createElement(
            Typography,
            { variant: 'body1', style: { color: 'text.primary', marginBottom: '8px', fontFamily: 'Georgia, serif' } },
            'Revenue Over Time (Last 12 Months)'
          ),
          totalIncomeOverTime.length > 0
            ? React.createElement(
                Box,
                { style: { height: 200 } },
                React.createElement(Line, {
                  ref: chart => {
                    if (chart) {
                      if (incomeLineChartRef.current) {
                        incomeLineChartRef.current.destroy();
                      }
                      incomeLineChartRef.current = chart.chartInstance;
                    }
                  },
                  data: incomeLineData,
                  options: incomeLineOptions,
                })
              )
            : React.createElement(
                Typography,
                { style: { color: 'text.secondary', textAlign: 'center', padding: '16px 0' } },
                'No revenue data available.'
              )
        )
      )
    )
  );
};

export default Dashboard;