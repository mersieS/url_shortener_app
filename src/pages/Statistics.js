import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Statistics.css';

const Statistics = () => {
  const { linkId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, [linkId]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/urls/${linkId}/statistics`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      } else {
        throw new Error(data.error || 'İstatistikler yüklenirken bir hata oluştu');
      }
    } catch (err) {
      setError(err.message || 'İstatistikler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-message">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!stats) return null;

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Link İstatistikleri</h2>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Toplam Tıklanma</h3>
          <div className="stat-value">{stats.totalClicks}</div>
        </div>
        
        <div className="stat-card">
          <h3>Toplam Kazanç</h3>
          <div className="stat-value">{stats.totalEarnings}₺</div>
        </div>
        
        <div className="stat-card">
          <h3>Ortalama Günlük Tıklanma</h3>
          <div className="stat-value">{stats.averageDailyClicks}</div>
        </div>
        
        <div className="stat-card">
          <h3>Dönüşüm Oranı</h3>
          <div className="stat-value">{stats.conversionRate}%</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Günlük Tıklanma Grafiği</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyClicks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#667eea"
                  name="Tıklanma"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Günlük Kazanç Grafiği</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyEarnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="earnings"
                  fill="#48bb78"
                  name="Kazanç (₺)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Referans Kaynakları</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.referrers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#667eea"
                  name="Tıklanma Sayısı"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Coğrafi Dağılım</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.countries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="clicks"
                  fill="#48bb78"
                  name="Tıklanma Sayısı"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 