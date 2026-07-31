import React from 'react';
import { 
  Droplet, Wind, Settings, Diamond, Hexagon, Square, Circle, 
  Shield, FlaskConical, Magnet, Flame, Zap, Star
} from 'lucide-react';

const iconMap = {
  'Droplet': Droplet,
  'Wind': Wind,
  'Settings': Settings,
  'Diamond': Diamond,
  'Hexagon': Hexagon,
  'Square': Square,
  'Circle': Circle,
  'Shield': Shield,
  'FlaskConical': FlaskConical,
  'Magnet': Magnet,
  'Flame': Flame,
  'Zap': Zap,
  'Star': Star
};

export const getIconComponent = (iconName) => {
  return iconMap[iconName] || FlaskConical; // fallback
};

export const RenderIcon = ({ iconName, className = "w-5 h-5", ...props }) => {
  // Try to use the component if iconName is found, otherwise try to render it directly if it's already a node
  if (typeof iconName === 'string' && iconMap[iconName]) {
    const IconComponent = iconMap[iconName];
    return <IconComponent className={className} {...props} />;
  } else if (typeof iconName === 'string') {
    // string not in map, fallback
    return <FlaskConical className={className} {...props} />;
  }
  
  // if it's somehow an emoji or react node passed directly, render it inside a span (though we shouldn't have emojis anymore)
  return <span className={className} {...props}>{iconName}</span>;
};
