import React from 'react';
import { 
  Droplet, Wind, Settings, Diamond, Hexagon, Square, Circle, 
  Shield, FlaskConical, Magnet, Flame, Zap, Star, Beaker,
  BookOpen, Hammer, Calculator, Scale, Atom, Microscope, Compass,
  Search, Trophy, Award, Gem, CheckCircle2, Clock, Mail, Phone,
  MapPin, User, Lock, Camera, RefreshCw, Play, Video, HelpCircle,
  Lightbulb, Sparkles, GraduationCap, Swords, Target, Grid,
  FileText, Package, Bookmark, Activity, Heart, Eye, BookOpenCheck
} from 'lucide-react';

const iconMap = {
  // Lucide Names Direct
  Droplet, Wind, Settings, Diamond, Hexagon, Square, Circle,
  Shield, FlaskConical, Magnet, Flame, Zap, Star, Beaker,
  BookOpen, Hammer, Calculator, Scale, Atom, Microscope, Compass,
  Search, Trophy, Award, Gem, CheckCircle2, Clock, Mail, Phone,
  MapPin, User, Lock, Camera, RefreshCw, Play, Video, HelpCircle,
  Lightbulb, Sparkles, GraduationCap, Swords, Target, Grid,
  FileText, Package, Bookmark, Activity, Heart, Eye, BookOpenCheck,

  // Module & Activity Key Mappings (Case-Insensitive Aliases)
  'reaction': Beaker,
  'reactions': Beaker,
  'lab': FlaskConical,
  'experiment': FlaskConical,
  'discovery': BookOpenCheck,
  'search': Search,
  'explore': Compass,
  'solver': FlaskConical,
  'solve': Sparkles,
  'crafting': Hammer,
  'craft': Hammer,
  'workbench': Hammer,
  'molecule': Atom,
  'element': Atom,
  'atom': Atom,
  'microscope': Microscope,
  'calculator': Calculator,
  'calculation': Calculator,
  'math': Scale,
  'scale': Scale,
  'lesson': BookOpen,
  'lessons': BookOpen,
  'theory': BookOpen,
  'book': BookOpen,
  'books': BookOpen,
  'bookopen': BookOpen,
  'periodic_table': Grid,
  'table': Grid,
  'arena': Swords,
  'battle': Swords,
  'match': Swords,
  'profile': User,
  'user': User,
  'account': User,
  'target': Target,
  'mission': Target,
  'task': Target,
  'phone': Phone,
  'hotline': Phone,
  'mappin': MapPin,
  'address': MapPin,
  'location': MapPin,
  'streak': Flame,
  'streak_light': Flame,
  'daily': Target,

  // Emoji Mappings
  '📚': BookOpen,
  '📘': BookOpen,
  '📗': BookOpen,
  '📙': BookOpen,
  '📖': BookOpen,
  '💎': Gem,
  '⚡': Zap,
  '⭐️': Star,
  '⭐': Star,
  '🌟': Star,
  '🔥': Flame,
  '🧪': Beaker,
  '⚛️': Atom,
  '⚛': Atom,
  '🔬': Microscope,
  '🏆': Trophy,
  '🏅': Award,
  '🎖️': Award,
  '🎯': Target,
  '🔨': Hammer,
  '🛠️': Hammer,
  '⚙️': Settings,
  '💧': Droplet,
  '🛡️': Shield,
  '⚔️': Swords,
  '👤': User,
  '🔒': Lock,
  '✨': Sparkles,
  '💡': Lightbulb,
  '🎓': GraduationCap
};

export const getIconComponent = (iconName) => {
  if (!iconName) return FlaskConical;
  if (typeof iconName === 'string') {
    const key = iconName.trim();
    return iconMap[key] || iconMap[key.toLowerCase()] || FlaskConical;
  }
  return FlaskConical;
};

export const RenderIcon = ({ iconName, className = "w-5 h-5", ...props }) => {
  // If iconName is already a valid React element/node, render directly
  if (React.isValidElement(iconName)) {
    return iconName;
  }

  // If component function passed directly
  if (typeof iconName === 'function') {
    const CustomIcon = iconName;
    return <CustomIcon className={className} {...props} />;
  }

  if (typeof iconName === 'string' && iconName.trim()) {
    const key = iconName.trim();
    const IconComponent = iconMap[key] || iconMap[key.toLowerCase()];
    if (IconComponent) {
      return <IconComponent className={className} {...props} />;
    }
  }

  // Smart fallback SVG icon so raw string text is never displayed inside icon boxes
  return <FlaskConical className={className} {...props} />;
};

