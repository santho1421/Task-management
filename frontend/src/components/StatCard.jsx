import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderLeft: `3px solid ${color || 'var(--primary)'}`,
        background: 'var(--gradient-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {title}
          </span>
          <h3
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              marginTop: '0.2rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {value !== undefined ? value : 0}
          </h3>
        </div>

        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: color ? `${color}18` : 'var(--primary-light)',
            border: `1px solid ${color ? `${color}30` : 'var(--primary-border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color || 'var(--primary)',
            flexShrink: 0,
          }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
