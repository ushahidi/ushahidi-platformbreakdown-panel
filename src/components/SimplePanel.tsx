import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
// import { css, cx } from '@emotion/css';
// import { useStyles2, useTheme2 } from '@grafana/ui';
// import { PanelDataErrorView } from '@grafana/runtime';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const {
    title,
    subtitle,
    totalVoicesCount,
    platformVoicesCount,
    socialVoicesCount,
    fieldLanguage,
    fieldLanguagePercent,
    fieldCategory,
    fieldMentionsPercent,
    fieldMentionsCount,
    icon,
    iconColor,
  } = options;

  // Handle no data case
  if (!data.series.length) {
    return <div style={{ padding: 12 }}>No data to display</div>;
  }

  // Use the first series (Grafana data frame)
  const frame = data.series[0];

  // Extract rows
  const rows = Array.from({ length: frame.length || frame.fields[0].values.length }, (_, i) => {
    const get = (field?: string) => {
      const f = field ? frame.fields.find(f => f.name === field) : undefined;
      return f ? f.values.get(i) : undefined;
    };

    return {
      category: get(fieldCategory),
      mentionsPercent: get(fieldMentionsPercent),
      mentionsCount: get(fieldMentionsCount),
      voicesCount: get(totalVoicesCount),
      platformCount: get(platformVoicesCount),
      socialCount: get(socialVoicesCount),
      languages: get(fieldLanguage),
      languagesPercent: get(fieldLanguagePercent),
      icon: get(icon),
      iconColor: get(iconColor),
    };
  });

  return (
    <div
      style={{
        width,
        height,
        padding: 12,
        overflowY: 'auto',
      }}
    >
      <h2
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 8,
          overflowWrap: 'break-word',
        }}
      >
        {title}
      </h2>

      <h3
        style={{
          fontSize: 14,
          color: '#555',
          marginBottom: 12,
          overflowWrap: 'break-word',
        }}
      >
        {subtitle}
      </h3>

      <h2 style={{ marginTop: 20, marginBottom: 8, fontSize: 18, fontWeight: 'bold', overflowWrap: 'break-word' }}>Community Engagement</h2>

      <div
        style={{
          display: 'flex',
          flexDirection: width < 300 ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 24,
          marginBottom: 20,
          marginRight: 24,
          marginLeft: 24
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1B7E3C' }}>
            {rows[0]?.voicesCount ?? 0}
          </div>
          <div style={{ fontSize: 14, color: '#555' }}>Total Voices</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1B7E3C' }}>
            {rows[0]?.platformCount ?? 0}
          </div>
          <div style={{ fontSize: 14, color: '#555' }}>Platform Posts</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1B7E3C' }}>
            {rows[0]?.socialCount ?? 0}
          </div>
          <div style={{ fontSize: 14, color: '#555' }}>Social Media</div>
        </div>
      </div>
            
      <h2 style={{ marginBottom: 8, fontSize: 18, fontWeight: 'bold', overflowWrap: 'break-word' }}>Platform Breakdown</h2>

      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            border: '1px solid #ddd',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            background: 'white',
          }}
        >
        <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: row.iconColor ?? 'blue',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
               {row.icon?.startsWith('http') ? (
                <img
                  src={row.icon}
                  alt=""
                  style={{
                    width: 20,
                    height: 20,
                    objectFit: 'contain',
                  }}
                />
              ) : (
                row.icon ?? '⭐'
              )}
            </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              fontWeight: 500,
              display: 'flex',
              flexDirection: width < 300 ? 'column' : 'row',
              justifyContent: 'space-between',
            
            }}
          >
            <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 'bold',
              overflowWrap: 'break-word',
            }}
          >
            {options.showNumbering ? `${i + 1}. ` : ''}{row.category ?? 'category'}
          </h3>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap'}}>
            <div
            style={{
              padding: '2px 12px',
              background: '#F4F4F4',
              borderRadius: 20,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',  
            }}>
              {Number(row.mentionsPercent ?? '0').toFixed(options.decimalPlaces ?? 1)}%
            </div>
          </div>
            
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: '#444',
              wordWrap: 'break-word',
            }}
          >
            <strong>{row.mentionsCount ?? '0'} posts </strong>
          </p>
        </div>       
      ))}

      <h2 style={{ marginTop: 20, marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}>Language Distribution</h2>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              padding: '6px 12px',
              background: '#F4F4F4',
              borderRadius: 20,
              fontSize: 13,
            }}
          >
            {row.languages ?? 'language'} {row.languagesPercent ?? '0'}%
          </div>
        ))}
      </div>
    </div>
  );
};
