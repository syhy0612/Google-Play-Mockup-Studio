import React from 'react';
import { 
  Star, 
  Search, 
  MoreVertical, 
  ArrowLeft, 
  Share2, 
  ShieldCheck, 
  ChevronRight,
  Download,
  Database,
  User,
  Image as ImageIcon,
  Smartphone,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  Edit3,
  Settings,
  Wifi,
  Battery,
  Signal,
  Menu,
  Save,
  Check,
  Box,
  Upload,
  Home,
  Gamepad2,
  Mic,
  LayoutGrid,
  BookOpen
} from 'lucide-react';

export const StarRating = ({ rating }: { rating: string }) => (
  <div className="flex items-center space-x-0.5">
    <span className="font-medium text-sm mr-1">{rating}</span>
    <Star className="w-3 h-3 text-gray-700 fill-current" />
  </div>
);

export { 
  Search, 
  MoreVertical, 
  ArrowLeft, 
  Share2, 
  ShieldCheck, 
  ChevronRight, 
  Download, 
  Database, 
  User, 
  ImageIcon, 
  Smartphone, 
  Star, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Edit3, 
  Settings, 
  Wifi, 
  Battery, 
  Signal, 
  Menu, 
  Save, 
  Check,
  Box,
  Upload,
  Home,
  Gamepad2,
  Mic,
  LayoutGrid,
  BookOpen
};