import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { scaleLinear } from "d3-scale";
import './Statistics.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const mapStyles = {
  default: {
    fill: "#CBD5E1",
    stroke: "#64748B",
    strokeWidth: 0.75,
    outline: "none"
  },
  hover: {
    fill: "#94A3B8",
    stroke: "#64748B",
    strokeWidth: 0.75,
    outline: "none"
  },
  pressed: {
    fill: "#94A3B8",
    stroke: "#64748B",
    strokeWidth: 0.75,
    outline: "none"
  }
};

const darkMapStyles = {
  default: {
    fill: "#1E293B",
    stroke: "#334155",
    strokeWidth: 0.75,
    outline: "none"
  },
  hover: {
    fill: "#334155",
    stroke: "#334155",
    strokeWidth: 0.75,
    outline: "none"
  },
  pressed: {
    fill: "#334155",
    stroke: "#334155",
    strokeWidth: 0.75,
    outline: "none"
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', { 
    day: 'numeric',
    month: 'short'
  });
};

const Statistics = () => {
  const { linkId } = useParams();
  const [stats, setStats] = useState(null);
  const [dailyClicks, setDailyClicks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const [urlResponse, statsResponse, clicksResponse] = await Promise.all([
          fetch(`http://saloshort.com/api/v1/urls/${linkId}`, { headers }),
          fetch(`http://saloshort.com/api/v1/urls/${linkId}/statistics`, { headers }),
          fetch(`http://saloshort.com/api/v1/urls/${linkId}/clicks_per_day`, { headers })
        ]);

        if (!urlResponse.ok || !statsResponse.ok || !clicksResponse.ok) {
          throw new Error('Veriler alınamadı');
        }

        const urlData = await urlResponse.json();
        const statsData = await statsResponse.json();
        const clicksData = await clicksResponse.json();

        setStats({
          ...urlData.url,
          ...statsData.report
        });
        setDailyClicks(clicksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [linkId]);

  const handleMarkerClick = (event, marker) => {
    const rect = event.target.getBoundingClientRect();
    const mapContainer = document.querySelector('.map-container');
    const mapRect = mapContainer.getBoundingClientRect();
    
    setTooltipPosition({
      x: rect.left - mapRect.left + rect.width / 2,
      y: rect.top - mapRect.top
    });
    setSelectedMarker(marker);
  };

  if (loading || !stats) {
    return <div className="loading-message">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Tıklama sayılarına göre marker boyutunu hesapla (maksimum 15px)
  const maxClicks = Math.max(...(stats.geo_stats || []).map(stat => stat.total_clicks));
  const sizeScale = scaleLinear()
    .domain([0, maxClicks])
    .range([5, 15]);

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Link İstatistikleri</h2>
      </div>

      <div className="chart-card">
        <h3>Link Detayları</h3>
        <div className="link-details">
          <div className="detail-item">
            <span className="detail-label">Link İsmi:</span>
            <span className="detail-value">{stats.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Orijinal URL:</span>
            <a href={stats.original_url} target="_blank" rel="noopener noreferrer" className="detail-value link">{stats.original_url}</a>
          </div>
          <div className="detail-item">
            <span className="detail-label">Kısa URL:</span>
            <a href={`http://saloshort.com/${stats.short_url}`} target="_blank" rel="noopener noreferrer" className="detail-value link">{`http://saloshort.com/${stats.short_url}`}</a>
          </div>
          <div className="detail-item">
            <span className="detail-label">Oluşturulma Tarihi:</span>
            <span className="detail-value">{new Date(stats.created_at).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })}</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Toplam Tıklanma</h3>
          <div className="stat-value">{stats.total_clicks || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Ortalama Günlük Tıklanma</h3>
          <div className="stat-value">{(stats.average_daily_clicks || 0).toFixed(1)}</div>
        </div>
      </div>

      <div className="chart-card">
        <h3>Son 30 Gün Tıklanma Grafiği</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyClicks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                interval="preserveStartEnd"
              />
              <YAxis />
              <Tooltip 
                labelFormatter={formatDate}
                formatter={(value) => [`${value} tıklanma`]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#F53"
                strokeWidth={2}
                dot={{ r: 4, fill: "#F53" }}
                activeDot={{ r: 6, fill: "#F53" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card map-card">
        <h3>Coğrafi Dağılım</h3>
        <div className="map-container">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 100
            }}
          >
            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: mapStyles.default,
                        hover: mapStyles.hover,
                        pressed: mapStyles.pressed
                      }}
                    />
                  ))
                }
              </Geographies>
              {(stats.geo_stats || [])
                .filter(location => location.country && location.country.trim() !== '')
                .map((location) => (
                <Marker
                  key={`${location.country}-${location.cities[0].name}`}
                  coordinates={[location.longitude, location.latitude]}
                >
                  <circle
                    r={sizeScale(location.total_clicks)}
                    fill="#F53"
                    fillOpacity={0.6}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    onMouseEnter={(event) => handleMarkerClick(event, location)}
                    onMouseLeave={() => setSelectedMarker(null)}
                    style={{ cursor: 'pointer' }}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
          {selectedMarker && (
            <div 
              className="marker-tooltip"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y - 10
              }}
            >
              <h4>{selectedMarker.country}</h4>
              <div className="city-stats">
                {selectedMarker.cities.map(city => (
                  <div key={city.name} className="city-stat">
                    <span className="city-name">{city.name}</span>
                    <span className="city-clicks">{city.clicks} tıklama</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics; 