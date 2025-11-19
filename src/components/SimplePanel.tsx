import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import './SimplePanel.css';
// import { css, cx } from '@emotion/css';
// import { useStyles2, useTheme2 } from '@grafana/ui';
// import { PanelDataErrorView } from '@grafana/runtime';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const {
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
    statColor
  } = options;

  // Handle no data case
  if (!data.series.length) {
    return <div className="panel-container">No data to display</div>;
  }

  // Use the first series (Grafana data frame)
  const frame = data.series[0];
  
  //responsive breakpoint helper
  const isNarrow = width < 300;

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
      statColor: get(statColor),
    };
  });

  return (
    <div className="panel-container" style={{ width, height }}>

      <h2 className="panel-section-header">Community Engagement</h2>

      <div className={`panel-stats-row ${isNarrow ? 'is-narrow' : ''}`}
        style={{ color: options.statColor }}
      >
        <div className="panel-stat-item">
          <div className="panel-stat-value">{rows[0]?.voicesCount ?? 0}</div>
          <div className="panel-stat-label">Total Voices</div>
        </div>

        <div className="panel-stat-item">
          <div className="panel-stat-value">{rows[0]?.platformCount ?? 0}</div>
          <div className="panel-stat-label">Platform Posts</div>
        </div>

        <div className="panel-stat-item">
          <div className="panel-stat-value">{rows[0]?.socialCount ?? 0}</div>
          <div className="panel-stat-label">Social Media</div>
        </div>
      </div>

      <h2 className="panel-section-header top-spacing">Platform Breakdown</h2>

      {rows.map((row, i) => (
        <div key={i} className="panel-card">
          {/* row wrapper for icon and details */}
          <div className={`panel-card-inner ${isNarrow ? 'is-narrow' : ''}`}>
            <div
              className="panel-card-icon-wrapper"
              style={{ background: row.iconColor ?? '#ddd' }}
            >
              {row.icon?.startsWith('http') ? (
                <img src={row.icon} alt="" className="panel-card-icon-img" />
              ) : (
                row.icon ?? '↓'
              )}
            </div>

            <div className="panel-card-content">
              {/* category and percentage pill row */}
              <div className={`panel-card-header-row ${isNarrow ? 'is-narrow' : ''}`}>
                <h3 className="panel-category-title">
                  {options.showNumbering ? `${i + 1}. ` : ''}
                  {row.category ?? 'category'}
                </h3>

                <div className="panel-percent-pill">
                  {Number(row.mentionsPercent ?? '0').toFixed(
                    options.decimalPlaces ?? 1
                  )}%
                </div>
              </div>

              {/* posts count row */}
              <p className={`panel-card-posts-count ${isNarrow ? 'is-narrow' : ''}`}>
                <strong>{row.mentionsCount ?? '0'} posts</strong>
              </p>
            </div>
          </div>
        </div>
      ))}

      <h2 className="panel-section-header top-spacing">Language Distribution</h2>
      <div className="panel-lang-container">
        {rows.map((row, i) => (
          <div key={i} className="panel-lang-pill">
            {row.languages ?? 'language'} {Number(row.languagesPercent ?? '0').toFixed(
              options.decimalPlaces ?? 1)}%
          </div>
        ))}
      </div>
    </div>
  );
};
