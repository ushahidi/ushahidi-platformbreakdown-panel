import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import './SimplePanel.css';
import ushahidiIcon from '../img/ushahidi.svg';
import facebookIcon from '../img/facebook.svg';
import twitterIcon from '../img/twitter.svg';
import youtubeIcon from '../img/youtube.svg';

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
    statColor
  } = options;

  const getCategoryStyle = (categoryName: string) => {
    const normalized = categoryName?.toLowerCase().trim() || '';
    switch (normalized) {
      case 'platform':
        return { icon: ushahidiIcon, color: '#EFC44C' };
      
      case 'facebook':
        return { icon: facebookIcon, color: '#8B9DC3' };
      
      case 'twitter':
        return { icon: twitterIcon, color: '#1DA1F2' };

      case 'youtube':
        return { icon: youtubeIcon, color: '#CC181E' };

      default:
        return { icon: '', color: '#8e8e8e' };
    }
  };

  if (!data.series.length) {
    return <div className="panel-container">No data to display</div>
  }

  // Use the first series (Grafana data frame)
  const frame = data.series[0];

  const length = frame.length || frame.fields[0].values.length;
    
    // helper to get value at specific index
    const getValue = (fieldName: string | undefined, index: number) => {
      if (!fieldName) {return undefined;}
      const field = frame.fields.find(f => f.name === fieldName);
      return field ? field.values[index] : undefined;
    };

    // extract KPI stats from the first row
    const stats = {
      voicesCount: getValue(totalVoicesCount, 0),
      platformCount: getValue(platformVoicesCount, 0),
      socialCount: getValue(socialVoicesCount, 0),
    };

    // extract platform Rows and apply icon logic
    const platformRows = [];
    for (let i = 0; i < length; i++) {
      const category = getValue(fieldCategory, i);

      // only add to list if category exists
      if (category) {
        const style = getCategoryStyle(category);

        platformRows.push({
          category: category,
          mentionsPercent: getValue(fieldMentionsPercent, i),
          mentionsCount: getValue(fieldMentionsCount, i),
          icon: style.icon,
          iconColor: style.color,
        });
      }
    }

    // extract language rows; filter out empty languages
    const languageRows = [];
    for (let i = 0; i < length; i++) {
      const lang = getValue(fieldLanguage, i);

      // only add to list if language exists
      if (lang) {
        languageRows.push({
          language: lang,
          percent: getValue(fieldLanguagePercent, i),
        });
      }
    }
  
  //responsive breakpoint helper
  const isNarrow = width < 300;

  return (
    <div className="panel-container" style={{ width, height }}>

      <h2 className="panel-section-header">Community Engagement</h2>

      <div className={`panel-stats-row ${isNarrow ? 'is-narrow' : ''}`}
        style={{ color: statColor }}
      >
        <div className="panel-stat-item">
          <div className="panel-stat-value">{stats.voicesCount ?? 0}</div>
          <div className="panel-stat-label">Total Voices</div>
        </div>

        <div className="panel-stat-item">
          <div className="panel-stat-value">{stats.platformCount ?? 0}</div>
          <div className="panel-stat-label">Platform Posts</div>
        </div>

        <div className="panel-stat-item">
          <div className="panel-stat-value">{stats.socialCount ?? 0}</div>
          <div className="panel-stat-label">Social Media</div>
        </div>
      </div>

      <h2 className="panel-section-header top-spacing">Platform Breakdown</h2>

      {platformRows.map((row, i) => (
        <div key={i} className="panel-card">
          {/* row wrapper for icon and details */}
          <div className={`panel-card-inner ${isNarrow ? 'is-narrow' : ''}`}>
            <div
              className="panel-card-icon-wrapper"
              style={{ background: row.iconColor }}
            >
              {/* if it looks like a url, render img, else text */}
              {row.icon?.startsWith('http') || row.icon?.startsWith('/') ? (
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
                  {row.category}
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

        {languageRows.map((row, i) => (
          <div key={i} className="panel-lang-pill">
            {row.language} {Number(row.percent ?? '0').toFixed(
              options.decimalPlaces ?? 1)}%
          </div>
        ))}
      </div>
    </div>
  );
};
