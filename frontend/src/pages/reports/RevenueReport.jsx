import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Table,
  DatePicker,
  Button,
  message,
  Card,
  Empty,
  Row,
  Col,
  Select,
  Typography,
} from 'antd';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import dayjs from 'dayjs';
import apiClient from '../../utils/apiClient';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const RevenueReport = () => {
  const [data, setData] = useState([]);
  const [dateColumns, setDateColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([dayjs().startOf('month'), dayjs()]);
  const [viewMode, setViewMode] = useState('combined'); // ✅ NEW: View mode toggle
  const chartRef = useRef(null);

  // 🧹 Clean up chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, []);

  // ✅ Fetch report data
  const fetchReport = async () => {
    try {
      setLoading(true);
      const [from, to] = dates;

      const res = await apiClient.get('/reports/revenue-report', {
        params: {
          from: from.format('YYYY-MM-DD'),
          to: to.format('YYYY-MM-DD'),
        },
      });

      if (!res?.data?.success) {
        throw new Error(res.data?.message || 'Invalid API response');
      }

      setData(res.data.data || []);
      setDateColumns(res.data.dateColumns || []);
    } catch (error) {
      console.error('❌ RevenueReport Error:', error);
      message.error(error.message || 'Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // 🧩 Table columns
  const columns = useMemo(
    () => [
      { title: 'Centre', dataIndex: 'Centre', key: 'Centre', fixed: 'left' },
      { title: 'BD Head', dataIndex: 'BDHead', key: 'BDHead', fixed: 'left' },
      ...dateColumns.map((date) => ({
        title: date,
        dataIndex: date,
        key: date,
        align: 'right',
        render: (val) => (val ? val.toLocaleString() : '-'),
      })),
      { title: 'Total', dataIndex: 'Total', key: 'Total', align: 'right', fixed: 'right' },
    ],
    [dateColumns]
  );

  // 🎨 Random color generator (consistent for each centre)
  const colorMap = useMemo(() => {
    const map = {};
    data.forEach((row, idx) => {
      const hash = Array.from(row.Centre || '')
        .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
        .toString(16);
      map[row.Centre] = `#${hash.slice(0, 6)}`;
    });
    return map;
  }, [data]);

  // 🧠 Build chart data dynamically based on view mode
  const chartData = useMemo(() => {
    if (!dateColumns.length || !data.length) {
      return { labels: [], datasets: [] };
    }

    const labels = dateColumns;
    const validRows = data.filter((row) => row.Centre && !/total/i.test(row.Centre.trim()));

    // ✅ Mode 1: All Centres Combined
    if (viewMode === 'combined') {
      const totals = labels.map((date) =>
        validRows.reduce((sum, row) => sum + (Number(row[date]) || 0), 0)
      );
      return {
        labels,
        datasets: [
          {
            label: 'Total Revenue (All Centres)',
            data: totals,
            backgroundColor: 'rgba(24, 144, 255, 0.6)',
            borderColor: 'rgba(24, 144, 255, 1)',
            borderWidth: 1,
          },
        ],
      };
    }

    // ✅ Mode 2: Top 10 Centres
    if (viewMode === 'top10') {
      // Sort by total revenue descending and pick top 10
      const sorted = [...validRows].sort((a, b) => (b.Total || 0) - (a.Total || 0)).slice(0, 10);
      const datasets = sorted.map((row) => ({
        label: row.Centre,
        data: labels.map((date) => Number(row[date]) || 0),
        backgroundColor: colorMap[row.Centre] || 'rgba(75,192,192,0.4)',
        borderColor: colorMap[row.Centre] || 'rgba(75,192,192,1)',
        borderWidth: 1,
      }));
      return { labels, datasets };
    }

    // ✅ Mode 3: Per Centre (all)
    const datasets = validRows.map((row) => ({
      label: row.Centre,
      data: labels.map((date) => Number(row[date]) || 0),
      backgroundColor: colorMap[row.Centre] || 'rgba(153,102,255,0.4)',
      borderColor: colorMap[row.Centre] || 'rgba(153,102,255,1)',
      borderWidth: 1,
    }));
    return { labels, datasets };
  }, [data, dateColumns, viewMode, colorMap]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 15 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `₹ ${ctx.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => `₹${v}` },
        },
        x: {
          ticks: { autoSkip: true, maxRotation: 45, minRotation: 0 },
        },
      },
    }),
    []
  );

  return (
    <div
      style={{
        padding: 24,
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto',
        backgroundColor: '#fff',
        borderRadius: 8,
      }}
    >
      <Title level={3} style={{ marginBottom: 16 }}>
        Revenue Report
      </Title>

      {/* ✅ Filter Controls */}
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <RangePicker
          value={dates}
          onChange={setDates}
          format="YYYY-MM-DD"
          style={{ minWidth: 260 }}
        />
        <Button type="primary" onClick={fetchReport} loading={loading}>
          Generate Report
        </Button>

        <Select
          value={viewMode}
          onChange={setViewMode}
          style={{ minWidth: 220 }}
          options={[
            { value: 'combined', label: 'All Centres Combined' },
            { value: 'top10', label: 'Top 10 Centres' },
            { value: 'perCentre', label: 'Per Centre (All)' },
          ]}
        />
      </div>

      {data.length === 0 ? (
        <Empty description="No Data Found" />
      ) : (
        <Row gutter={[16, 16]}>
          {/* ✅ Chart Area */}
          <Col xs={24} lg={24}>
            <Card
              style={{
                marginBottom: 24,
                width: '100%',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
              bodyStyle={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'clamp(300px, 40vh, 600px)', // ✅ Dynamic height
                }}
              >
                <Bar ref={chartRef} data={chartData} options={chartOptions} />
              </div>
            </Card>
          </Col>

          {/* ✅ Table Area */}
          <Col xs={24} lg={24}>
            <Table
              columns={columns}
              dataSource={data}
              rowKey={(r, i) => i}
              bordered
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '25', '50', '100'],
                showTotal: (total) => `Total ${total} records`,
              }}
              scroll={{ x: 'max-content' }}
              style={{
                width: '100%',
                backgroundColor: '#fff',
              }}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default RevenueReport;
