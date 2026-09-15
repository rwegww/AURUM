import React from 'react';
import mathStyles from '../../assets/math/styles.json';
import { renderTheoryMarkup, THEORY_CSS } from './theoryMarkup';

export default function TheoryContent({ modules }) {
  const html = React.useMemo(() => renderTheoryMarkup(modules), [modules]);
  return <div style={{ width: '100%', minWidth: 0 }}><style>{mathStyles + THEORY_CSS}</style><article className="aurum-theory" dangerouslySetInnerHTML={{ __html: html }} /></div>;
}
