import { useState } from 'react';
import type { ValidationResult, ValidationItem } from './types';

interface OgResultsProps {
  validation: ValidationResult;
}

export default function OgResults({ validation }: OgResultsProps) {
  const { score, passed, warnings, errors } = validation;
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    errors: true,
    warnings: true,
    passed: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getScoreColor = () => {
    if (score >= 90) return 'var(--color-success)';
    if (score >= 70) return 'var(--theme-accent)';
    if (score >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div className="og-results">
      {/* Score Display */}
      <div className="score-section">
        <div className="score-circle" style={{ borderColor: getScoreColor() }}>
          <span className="score-value" style={{ color: getScoreColor() }}>{score}</span>
          <span className="score-label">{getScoreLabel()}</span>
        </div>
        <div className="score-summary">
          <p><span className="count error-count">{errors.length}</span> errors</p>
          <p><span className="count warning-count">{warnings.length}</span> warnings</p>
          <p><span className="count passed-count">{passed.length}</span> passed</p>
        </div>
      </div>

      {/* Errors Section */}
      {errors.length > 0 && (
        <section className="validation-section errors">
          <button
            className="section-header"
            onClick={() => toggleSection('errors')}
            aria-expanded={expandedSections.errors}
          >
            <span className="section-icon">✗</span>
            <span className="section-title">Errors ({errors.length})</span>
            <span className="toggle-icon">{expandedSections.errors ? '−' : '+'}</span>
          </button>
          {expandedSections.errors && (
            <ul className="validation-list">
              {errors.map((item, i) => (
                <ValidationItemRow key={i} item={item} type="error" />
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <section className="validation-section warnings">
          <button
            className="section-header"
            onClick={() => toggleSection('warnings')}
            aria-expanded={expandedSections.warnings}
          >
            <span className="section-icon">⚠</span>
            <span className="section-title">Warnings ({warnings.length})</span>
            <span className="toggle-icon">{expandedSections.warnings ? '−' : '+'}</span>
          </button>
          {expandedSections.warnings && (
            <ul className="validation-list">
              {warnings.map((item, i) => (
                <ValidationItemRow key={i} item={item} type="warning" />
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Passed Section */}
      {passed.length > 0 && (
        <section className="validation-section passed">
          <button
            className="section-header"
            onClick={() => toggleSection('passed')}
            aria-expanded={expandedSections.passed}
          >
            <span className="section-icon">✓</span>
            <span className="section-title">Passed ({passed.length})</span>
            <span className="toggle-icon">{expandedSections.passed ? '−' : '+'}</span>
          </button>
          {expandedSections.passed && (
            <ul className="validation-list">
              {passed.map((item, i) => (
                <ValidationItemRow key={i} item={item} type="passed" />
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

function ValidationItemRow({ item, type }: { item: ValidationItem; type: 'error' | 'warning' | 'passed' }) {
  return (
    <li className={`validation-item ${type}`}>
      <div className="item-header">
        <code className="tag-name">{item.tag}</code>
        {item.value && <span className="tag-value">{item.value}</span>}
      </div>
      <p className="item-message">{item.message}</p>
    </li>
  );
}
