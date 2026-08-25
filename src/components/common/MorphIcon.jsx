import React, { forwardRef } from 'react';
import { MorphIcon as BaseMorphIcon } from 'morphicons/react';
import * as LucideIcons from 'lucide';

/**
 * Enhanced MorphIcon Component
 * Combines spring-physics morphing animations with flexible icon resolution.
 *
 * @param {Array|string|Function|React.ReactElement} icon - Lucide IconNode, icon name string, or SVG path
 * @param {number|string} [size=24] - Size of the icon in pixels
 * @param {string} [className] - Tailwind / CSS classes (e.g. 'w-5 h-5 text-emerald-500')
 * @param {string} [color='currentColor'] - Stroke color
 * @param {number|string} [strokeWidth=2] - Stroke width
 * @param {string|object} [spring] - Spring physics preset or config
 * @param {string} [label] - Accessible label
 */
export const MorphIcon = forwardRef(function MorphIcon(
  {
    icon,
    size = 24,
    className = '',
    color = 'currentColor',
    strokeWidth = 2,
    spring,
    label,
    ...rest
  },
  ref
) {
  // If icon is already a rendered React element
  if (React.isValidElement(icon)) {
    return icon;
  }

  // If icon is a React component function (e.g. legacy Lucide component)
  if (typeof icon === 'function') {
    const CustomComponent = icon;
    return <CustomComponent size={size} className={className} color={color} strokeWidth={strokeWidth} {...rest} />;
  }

  // Resolve IconNode
  let resolvedIcon = icon;

  if (typeof icon === 'string' && icon.trim()) {
    const name = icon.trim();
    // 1. Exact match in lucide
    if (LucideIcons[name]) {
      resolvedIcon = LucideIcons[name];
    } else {
      // 2. PascalCase match
      const pascal = name.charAt(0).toUpperCase() + name.slice(1);
      if (LucideIcons[pascal]) {
        resolvedIcon = LucideIcons[pascal];
      } else if (!name.startsWith('M') && !name.startsWith('m')) {
        // Fallback default
        resolvedIcon = LucideIcons.Sparkles;
      }
    }
  }

  // If no valid icon found, fallback to Sparkles
  if (!resolvedIcon) {
    resolvedIcon = LucideIcons.Sparkles;
  }

  return (
    <BaseMorphIcon
      ref={ref}
      icon={resolvedIcon}
      size={size}
      className={className}
      color={color}
      strokeWidth={strokeWidth}
      spring={spring}
      label={label}
      {...rest}
    />
  );
});

export default MorphIcon;
