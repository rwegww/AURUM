import React, { forwardRef } from 'react';
import { MorphIcon } from './MorphIcon';
import * as LucideData from 'lucide';

// Brand icon nodes fallback (SVG stroke-based IconNode structure)
const BRAND_ICONS = {
  Facebook: [
    ['path', { d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' }]
  ],
  Instagram: [
    ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5' }],
    ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' }],
    ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5' }]
  ],
  Youtube: [
    ['path', { d: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17' }],
    ['path', { d: 'm10 15 5-3-5-3z' }]
  ]
};

export const createIcon = (name, customNode) => {
  const node = customNode || BRAND_ICONS[name] || LucideData[name];
  const Component = forwardRef(function CreatedIcon(props, ref) {
    return <MorphIcon ref={ref} icon={node || name} {...props} />;
  });
  Component.displayName = name;
  return Component;
};

// Re-export core MorphIcon
export { MorphIcon };
export default MorphIcon;

// Explicit exports for all icons used across AURUM:
export const Activity = createIcon('Activity');
export const AlertCircle = createIcon('AlertCircle');
export const AlertTriangle = createIcon('AlertTriangle');
export const ArrowDown = createIcon('ArrowDown');
export const ArrowDownRight = createIcon('ArrowDownRight');
export const ArrowLeft = createIcon('ArrowLeft');
export const ArrowRight = createIcon('ArrowRight');
export const ArrowRightLeft = createIcon('ArrowRightLeft');
export const ArrowUp = createIcon('ArrowUp');
export const ArrowUpDown = createIcon('ArrowUpDown');
export const ArrowUpRight = createIcon('ArrowUpRight');
export const Atom = createIcon('Atom');
export const Award = createIcon('Award');
export const Backpack = createIcon('Backpack');
export const BarChart2 = createIcon('BarChart2');
export const BarChart3 = createIcon('BarChart3');
export const Beaker = createIcon('Beaker');
export const Bell = createIcon('Bell');
export const BookOpen = createIcon('BookOpen');
export const BookOpenCheck = createIcon('BookOpenCheck');
export const Bookmark = createIcon('Bookmark');
export const Calculator = createIcon('Calculator');
export const CalendarRange = createIcon('CalendarRange');
export const Camera = createIcon('Camera');
export const Check = createIcon('Check');
export const CheckCircle = createIcon('CheckCircle');
export const CheckCircle2 = createIcon('CheckCircle2');
export const ChevronDown = createIcon('ChevronDown');
export const ChevronLeft = createIcon('ChevronLeft');
export const ChevronRight = createIcon('ChevronRight');
export const ChevronUp = createIcon('ChevronUp');
export const Circle = createIcon('Circle');
export const Clipboard = createIcon('Clipboard');
export const ClipboardList = createIcon('ClipboardList');
export const Clock = createIcon('Clock');
export const Clock3 = createIcon('Clock3');
export const CloudUpload = createIcon('CloudUpload');
export const Compass = createIcon('Compass');
export const Copy = createIcon('Copy');
export const Database = createIcon('Database');
export const Diamond = createIcon('Diamond');
export const Dna = createIcon('Dna');
export const DoorOpen = createIcon('DoorOpen');
export const Download = createIcon('Download');
export const Droplet = createIcon('Droplet');
export const ExternalLink = createIcon('ExternalLink');
export const Eye = createIcon('Eye');
export const EyeOff = createIcon('EyeOff');
export const Facebook = createIcon('Facebook');
export const FileCheck = createIcon('FileCheck');
export const FileText = createIcon('FileText');
export const Filter = createIcon('Filter');
export const Flame = createIcon('Flame');
export const FlaskConical = createIcon('FlaskConical');
export const Folder = createIcon('Folder');
export const Gamepad2 = createIcon('Gamepad2');
export const Gauge = createIcon('Gauge');
export const Gem = createIcon('Gem');
export const Gift = createIcon('Gift');
export const GraduationCap = createIcon('GraduationCap');
export const Grid = createIcon('Grid');
export const GripVertical = createIcon('GripVertical');
export const Hammer = createIcon('Hammer');
export const Hand = createIcon('Hand');
export const Heart = createIcon('Heart');
export const HelpCircle = createIcon('HelpCircle');
export const Hexagon = createIcon('Hexagon');
export const History = createIcon('History');
export const Hourglass = createIcon('Hourglass');
export const Image = createIcon('Image');
export const Inbox = createIcon('Inbox');
export const Instagram = createIcon('Instagram');
export const Layers = createIcon('Layers');
export const LayoutDashboard = createIcon('LayoutDashboard');
export const Leaf = createIcon('Leaf');
export const Lightbulb = createIcon('Lightbulb');
export const Loader2 = createIcon('Loader2');
export const LoaderCircle = createIcon('LoaderCircle');
export const Lock = createIcon('Lock');
export const LockKeyhole = createIcon('LockKeyhole');
export const LogOut = createIcon('LogOut');
export const Magnet = createIcon('Magnet');
export const Mail = createIcon('Mail');
export const Map = createIcon('Map');
export const MapPin = createIcon('MapPin');
export const Menu = createIcon('Menu');
export const MessageCircle = createIcon('MessageCircle');
export const MessageSquare = createIcon('MessageSquare');
export const Microscope = createIcon('Microscope');
export const Minus = createIcon('Minus');
export const MoreVertical = createIcon('MoreVertical');
export const NotebookPen = createIcon('NotebookPen');
export const Package = createIcon('Package');
export const PackageOpen = createIcon('PackageOpen');
export const PenLine = createIcon('PenLine');
export const Pencil = createIcon('Pencil');
export const Phone = createIcon('Phone');
export const Play = createIcon('Play');
export const Plus = createIcon('Plus');
export const Radiation = createIcon('Radiation');
export const RefreshCcw = createIcon('RefreshCcw');
export const RefreshCw = createIcon('RefreshCw');
export const Reply = createIcon('Reply');
export const Rocket = createIcon('Rocket');
export const RotateCcw = createIcon('RotateCcw');
export const Save = createIcon('Save');
export const Scale = createIcon('Scale');
export const School = createIcon('School');
export const Search = createIcon('Search');
export const Send = createIcon('Send');
export const Settings = createIcon('Settings');
export const Shield = createIcon('Shield');
export const ShieldCheck = createIcon('ShieldCheck');
export const Sparkles = createIcon('Sparkles');
export const Sprout = createIcon('Sprout');
export const Square = createIcon('Square');
export const Star = createIcon('Star');
export const Swords = createIcon('Swords');
export const Target = createIcon('Target');
export const Trash2 = createIcon('Trash2');
export const TrendingUp = createIcon('TrendingUp');
export const Trophy = createIcon('Trophy');
export const Undo2 = createIcon('Undo2');
export const Unlock = createIcon('Unlock');
export const Upload = createIcon('Upload');
export const UploadCloud = createIcon('UploadCloud');
export const User = createIcon('User');
export const Users = createIcon('Users');
export const Video = createIcon('Video');
export const Wind = createIcon('Wind');
export const X = createIcon('X');
export const XCircle = createIcon('XCircle');
export const Youtube = createIcon('Youtube');
export const Zap = createIcon('Zap');
