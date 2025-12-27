import React, { useState, useMemo, useEffect } from 'react';
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
import dayjs from 'dayjs';
import apiClient from '../../utils/apiClient';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const TABLE_BODY_HEIGHT = 380;

const LocationHdSummary = () => {
  // ✅ default = last 7 days
  const [dates, setDates] = useState([
    dayjs().subtract(6, 'day'),
    dayjs(),
  ]);

  const [chartMode, setChartMode] = useState('combined');
  const [data, setData] = useState([]);
  const [grandTotal, setGrandTotal] = useState({ lab: 0, rad: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const [from, to] = dates;

      const res = await apiClient.get('/reports/location-hd-summary', {
        params: {
          date_from: from.format('YYYY-MM-DD'),
          date_to: to.format('YYYY-MM-DD'),
        },
      });

      setData(res.data.rows || []);
      setGrandTotal(res.data.grandTotal || { lab: 0, rad: 0, total: 0 });
    } catch (err) {
      console.error(err);
      message.error('Failed to load Location & HD summary');
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     TABLE CONFIG
  ======================= */
  const columns = [
    { title: 'Centre', dataIndex: 'centre', key: 'centre', fixed: 'left', width: 260 },
    { title: 'LAB', dataIndex: 'lab', key: 'lab', align: 'right', width: 140, render: v => v?.toLocaleString() },
    { title: 'RAD', dataIndex: 'rad', key: 'rad', align: 'right', width: 140, render: v => v?.toLocaleString() },
    { title: 'TOTAL', dataIndex: 'total', key: 'total', align: 'right', width: 160, render: v => <strong>{v?.toLocaleString()}</strong> },
  ];

  /* =======================
     CHART DATA (MODES)
  ======================= */
  const chartData = useMemo(() => {
    if (!data.length) return { labels: [], datasets: [] };

    // Combined
    if (chartMode === 'combined') {
      return {
        labels: ['All Centres'],
        datasets: [
          { label: 'LAB', data: [grandTotal.lab], backgroundColor: 'rgba(54,162,235,0.7)' },
          { label: 'RAD', data: [grandTotal.rad], backgroundColor: 'rgba(255,99,132,0.7)' },
        ],
      };
    }

    // Top 10
    const rows =
      chartMode === 'top10'
        ? [...data].sort((a, b) => b.total - a.total).slice(0, 10)
        : data;

    return {
      labels: rows.map(r => r.centre),
      datasets: [
        {
          label: 'LAB',
          data: rows.map(r => r.lab),
          backgroundColor: 'rgba(54,162,235,0.7)',
          stack: 'total',
        },
        {
          label: 'RAD',
          data: rows.map(r => r.rad),
          backgroundColor: 'rgba(255,99,132,0.7)',
          stack: 'total',
        },
      ],
    };
  }, [data, chartMode, grandTotal]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { stacked: chartMode !== 'combined' },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Location & HD Wise Summary</Title>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={12} align="middle">
          <Col>
            <RangePicker value={dates} onChange={setDates} format="YYYY-MM-DD" />
          </Col>
          <Col>
            <Button type="primary" onClick={fetchReport} loading={loading}>
              Generate
            </Button>
          </Col>
         
        </Row>
      </Card>

      {/* TABLE FIRST */}
      <Card bodyStyle={{ padding: 0 }} style={{ marginBottom: 16 }}>
        {data.length === 0 && !loading ? (
          <Empty style={{ padding: 32 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(r, i) => i}
            bordered
            loading={loading}
            pagination={false}
            scroll={{ y: TABLE_BODY_HEIGHT, x: 'max-content' }}
            sticky
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell><strong>GRAND TOTAL</strong></Table.Summary.Cell>
                  <Table.Summary.Cell align="right"><strong>{grandTotal.lab.toLocaleString()}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell align="right"><strong>{grandTotal.rad.toLocaleString()}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell align="right"><strong>{grandTotal.total.toLocaleString()}</strong></Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        )}
      </Card>

      {/* CHART AFTER TABLE */}
     <Card
  title="Location & HD Chart"
 
  extra={ 
    <Select
      value={chartMode}
      onChange={setChartMode}
      size="small"
      style={{ minWidth: 200 }}
      options={[
        { value: 'combined', label: 'All Centres Combined' },
        { value: 'top10', label: 'Top 10 Centres' },
        { value: 'perCentre', label: 'Per Centre (All)' },
      ]}
    />
  }
>
  {data.length === 0 ? (
    <Empty description="No Data for Chart" />
  ) : (
    <div style={{ height: 320 }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  )}
</Card>

    </div>
  );
};

export default LocationHdSummary;
