import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { FeatureCard } from "./components/FeatureCard";
import { FilterChip } from "./components/FilterChip";
import { FeedCard } from "./components/FeedCard";
import { CreationPage } from "./components/CreationPage";
import { RenderingQueueIndicator } from "./components/RenderingQueueIndicator";
import { MyPageContent } from "./components/MyPageContent";
import DesignSystemViewer from "./components/DesignSystemViewer";
import { Toaster } from "./components/ui/sonner";
import { Palette, Home, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import {
  RENDERING_TIMING,
  ANIMATION_TIMING,
  SLIDE_ANIMATION_CONFIG,
  MOBILE_VIEWPORT,
  TOAST_STYLES,
  FEED_CONSTANTS,
  FILTER_OPTIONS,
} from "./constants";
import { RenderingRequest, RenderingItem, CreationPageState } from "./types";

const { ROOM_TYPES: roomTypes, STYLES: styles, BUDGETS: budgets } = FILTER_OPTIONS;

const defaultImages = [
  "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNTY5NjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1610307522657-8c0304960189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NjA2NDEzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1641823911769-c55f23c25143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNjI2NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1723750290151-164cb19ebab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBkaW5pbmclMjByb29tfGVufDF8fHx8MTc2MDY3NzMxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1677553512940-f79af72efd1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXRocm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NjA2NjMwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1544140708-514b7837e6b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG9tZSUyMG9mZmljZXxlbnwxfHx8fDE3NjA2NDcyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjA2NDA1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1696254799702-b6cbe006b586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbGl2aW5nJTIwc3BhY2V8ZW58MXx8fHwxNzYwNjgwOTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNjU3NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBob21lJTIwZGVjb3J8ZW58MXx8fHwxNzYwNjgwOTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1758974835125-83ba4f9d7e25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwYXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNjgwOTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1706816365387-8eb6de07d3db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBob21lJTIwZGVzaWdufGVufDF8fHx8MTc2MDY4MDk1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNjM2NDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NjA2Nzk5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1547745204-40867833c0f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaG9tZSUyMGRlc2lnbnxlbnwxfHx8fDE3NjA1OTUzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1680210849773-f97a41c6b7ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwZGVzaWdufGVufDF8fHx8MTc2MDU3NjMyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1758977245854-b0ea036e0ce2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwc3BhY2V8ZW58MXx8fHwxNzYwNjgwOTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjA1OTEzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1758548157466-7c454382035a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwYmF0aHJvb20lMjBkZXNpZ258ZW58MXx8fHwxNzYwNjgwOTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzYwNjgwOTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

// Image sets for different filter combinations
const imagesByFilter: Record<string, string[]> = {
  "Living Room": [
    "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNTY5NjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NjA2Nzk5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1696254799702-b6cbe006b586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbGl2aW5nJTIwc3BhY2V8ZW58MXx8fHwxNzYwNjgwOTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Bedroom": [
    "https://images.unsplash.com/photo-1610307522657-8c0304960189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NjA2NDEzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNjM2NDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Kitchen": [
    "https://images.unsplash.com/photo-1641823911769-c55f23c25143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNjI2NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1680210849773-f97a41c6b7ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwZGVzaWdufGVufDF8fHx8MTc2MDU3NjMyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Bathroom": [
    "https://images.unsplash.com/photo-1677553512940-f79af72efd1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXRocm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NjA2NjMwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1758548157466-7c454382035a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwYmF0aHJvb20lMjBkZXNpZ258ZW58MXx8fHwxNzYwNjgwOTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Dining Room": [
    "https://images.unsplash.com/photo-1723750290151-164cb19ebab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBkaW5pbmclMjByb29tfGVufDF8fHx8MTc2MDY3NzMxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1758977245854-b0ea036e0ce2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwc3BhY2V8ZW58MXx8fHwxNzYwNjgwOTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Office": [
    "https://images.unsplash.com/photo-1544140708-514b7837e6b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG9tZSUyMG9mZmljZXxlbnwxfHx8fDE3NjA2NDcyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjA1OTEzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Modern": [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjA2NDA1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNTY5NjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Minimalist": [
    "https://images.unsplash.com/photo-1547745204-40867833c0f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaG9tZSUyMGRlc2lnbnxlbnwxfHx8fDE3NjA1OTUzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1610307522657-8c0304960189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NjA2NDEzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Industrial": [
    "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzYwNjgwOTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Scandinavian": [
    "https://images.unsplash.com/photo-1723750290151-164cb19ebab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBkaW5pbmclMjByb29tfGVufDF8fHx8MTc2MDY3NzMxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  "Contemporary": [
    "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBob21lJTIwZGVjb3J8ZW58MXx8fHwxNzYwNjgwOTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1641823911769-c55f23c25143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNjI2NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
};

type Page = "home" | "placeObject" | "interiorDesign" | "exteriorDesign";

type ViewMode = "flow" | "design-system";

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("flow");
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [displayedImages, setDisplayedImages] = useState<string[]>(defaultImages);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [renderingQueue, setRenderingQueue] = useState<RenderingRequest[]>([]);
  const [queueProgress, setQueueProgress] = useState<number>(0);
  const [completedRenderings, setCompletedRenderings] = useState<RenderingItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [previousPage, setPreviousPage] = useState<Page | null>(null);
  
  // Preserve creation page state for each page type
  const [creationPageStates, setCreationPageStates] = useState<Record<Page, CreationPageState>>({
    home: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
    placeObject: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
    interiorDesign: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
    exteriorDesign: { selectedSpace: "", selectedImage: "", showAnalysis: false, analysisCompleted: false },
  });

  // Add a rendering request to the queue
  const addRenderingRequest = useCallback((originalImage: string, roomType: string) => {
    const newRequest: RenderingRequest = {
      id: Date.now(),
      startTime: Date.now(),
      duration: RENDERING_TIMING.REQUEST_DURATION_MS,
      originalImage,
      roomType,
    };

    setRenderingQueue(prev => [...prev, newRequest]);

    // Show toast notification
    toast("Placing product in your room", {
      description: "Your request is being processed",
      action: {
        label: "Dismiss",
        onClick: () => {},
      },
      duration: ANIMATION_TIMING.TOAST_DURATION_MS,
    });

    // Remove request after duration and add to completed
    setTimeout(() => {
      setRenderingQueue(prev => prev.filter(req => req.id !== newRequest.id));
      
      // Add to completed renderings with a mock result image
      setCompletedRenderings(prev => [...prev, {
        id: newRequest.id,
        originalImage: newRequest.originalImage,
        resultImage: newRequest.originalImage, // In real app, this would be the AI-generated result
        progress: 100,
        isComplete: true,
        roomType: newRequest.roomType,
      }]);
    }, newRequest.duration);
  }, []);

  // Update progress for the oldest active request
  useEffect(() => {
    if (renderingQueue.length === 0) {
      setQueueProgress(0);
      return;
    }

    const oldestRequest = renderingQueue[0];
    const interval = setInterval(() => {
      const elapsed = Date.now() - oldestRequest.startTime;
      const progress = Math.min((elapsed / oldestRequest.duration) * 100, 100);
      setQueueProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, RENDERING_TIMING.PROGRESS_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [renderingQueue]);

  // Update images when filters change
  useEffect(() => {
    let filteredImages: string[] = [];

    // Prioritize filters: first check room type, then style, then show all
    if (selectedRoomType && imagesByFilter[selectedRoomType]) {
      filteredImages = [...imagesByFilter[selectedRoomType]];
    } else if (selectedStyle && imagesByFilter[selectedStyle]) {
      filteredImages = [...imagesByFilter[selectedStyle]];
    }

    // If we have filtered images, pad them to target count by repeating or adding defaults
    if (filteredImages.length > 0) {
      while (filteredImages.length < FEED_CONSTANTS.DISPLAYED_IMAGES_COUNT) {
        filteredImages.push(...filteredImages.slice(0, Math.min(FEED_CONSTANTS.PADDING_BATCH_SIZE, FEED_CONSTANTS.DISPLAYED_IMAGES_COUNT - filteredImages.length)));
      }
      setDisplayedImages(filteredImages.slice(0, FEED_CONSTANTS.DISPLAYED_IMAGES_COUNT));
    } else if (selectedRoomType || selectedStyle || selectedBudget) {
      // If any filter is selected but no specific images, shuffle the default images
      const shuffled = [...defaultImages].sort(() => Math.random() - 0.5);
      setDisplayedImages(shuffled);
    } else {
      // No filters selected, show default images
      setDisplayedImages(defaultImages);
    }
  }, [selectedRoomType, selectedStyle, selectedBudget]);

  const handleRoomTypeSelect = (value: string) => {
    setSelectedRoomType(value === selectedRoomType ? "" : value);
  };

  const handleStyleSelect = (value: string) => {
    setSelectedStyle(value === selectedStyle ? "" : value);
  };

  const handleBudgetSelect = (value: string) => {
    setSelectedBudget(value === selectedBudget ? "" : value);
  };

  const handleFeatureCardClick = (page: Page) => {
    setCurrentPage(page);
  };

  const handleBackToHome = () => {
    // Don't reset state - preserve it for when user returns
    // Only clear the previous page reference
    setCurrentPage("home");
    setPreviousPage(null);
  };

  const handleLikeToggle = (imageUrl: string) => {
    setLikedImages(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(imageUrl)) {
        newLiked.delete(imageUrl);
      } else {
        newLiked.add(imageUrl);
      }
      return newLiked;
    });
  };

  const handleRenderingIndicatorClick = () => {
    // Remember the current page if we're not already on home
    if (currentPage !== "home") {
      setPreviousPage(currentPage);
    }
    // Navigate to home page first, then switch to My Page tab
    setCurrentPage("home");
    setActiveTab("mypage");
  };

  const handleBackFromMyPage = () => {
    // Return to the previous page if it exists
    if (previousPage) {
      setCurrentPage(previousPage);
      setPreviousPage(null);
    }
    // Always return to home tab when going back
    setActiveTab("home");
  };

  // Update creation page state
  const updateCreationPageState = (page: Page, state: Partial<CreationPageState>) => {
    setCreationPageStates(prev => ({
      ...prev,
      [page]: { ...prev[page], ...state }
    }));
  };

  // Combine active and completed renderings for My Page
  // Note: queueProgress state from the effect at line 176 already triggers re-renders,
  // so no need for forceUpdate anti-pattern

  const allRenderingItems: RenderingItem[] = [
    ...renderingQueue.map(req => {
      const elapsed = Date.now() - req.startTime;
      const progress = Math.min((elapsed / req.duration) * 100, 100);
      return {
        id: req.id,
        originalImage: req.originalImage,
        progress,
        isComplete: false,
        roomType: req.roomType,
      };
    }),
    ...completedRenderings,
  ];

  const getPageTitle = (page: Page): string => {
    switch (page) {
      case "placeObject":
        return "Place an object";
      case "interiorDesign":
        return "Interior design";
      case "exteriorDesign":
        return "Exterior design";
      default:
        return "Ohouse ai";
    }
  };

  // Show design system viewer if in design-system mode
  if (viewMode === "design-system") {
    return (
      <div className="w-screen h-screen flex flex-col bg-white overflow-hidden">
        {/* View Mode Toggle Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-40 flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Ohouse AI Design System</h1>
          <button
            onClick={() => setViewMode("flow")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home size={18} />
            <span>Flow View</span>
          </button>
        </div>

        {/* Design System Viewer - Fills remaining space */}
        <div className="flex-1 overflow-auto">
          <DesignSystemViewer />
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex items-center justify-center bg-gray-100">
      {/* Toast Notifications */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            maxWidth: TOAST_STYLES.MAX_WIDTH,
            width: TOAST_STYLES.WIDTH,
          },
        }}
      />

      {/* View Mode Toggle Button */}
      <button
        onClick={() => setViewMode("design-system")}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 font-medium text-sm"
        title="Switch to Design System View"
      >
        <Zap size={18} className="text-purple-600" />
        <span>Design System</span>
      </button>

      {/* Mobile Screen Container */}
      <div
        className="w-[375px] h-[812px] bg-background flex flex-col overflow-hidden shadow-xl relative"
        style={{ width: MOBILE_VIEWPORT.WIDTH, height: MOBILE_VIEWPORT.HEIGHT }}
      >
        <AnimatePresence initial={false}>
          {currentPage === "home" ? (
            <motion.div
              key="home"
              initial={{ x: "-25%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-25%", opacity: 0.8 }}
              transition={SLIDE_ANIMATION_CONFIG}
              className="absolute inset-0 flex flex-col"
            >
              {/* iOS Top Navigation Bar */}
              <div className="h-[44px] bg-background flex items-center justify-center px-4 shrink-0 relative">
                {/* Back button for My Page when coming from creation flow */}
                {activeTab === "mypage" && previousPage && (
                  <button
                    onClick={handleBackFromMyPage}
                    className="absolute left-4 flex items-center gap-1 text-[17px] text-primary hover:opacity-70 transition-opacity active:opacity-50 cursor-pointer z-20"
                    aria-label={`Go back to ${getPageTitle(previousPage)}`}
                  >
                    <svg 
                      width="13" 
                      height="21" 
                      viewBox="0 0 13 21" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="relative -left-[2px]"
                    >
                      <path 
                        d="M10.5 3L3 10.5L10.5 18" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[17px]">{getPageTitle(previousPage)}</span>
                  </button>
                )}
                
                <h1 className="text-[17px] font-semibold tracking-[-0.41px]">
                  {activeTab === "mypage" && previousPage ? "My Page" : "Ohouse ai"}
                </h1>
                
                <div className="absolute right-4">
                  <RenderingQueueIndicator 
                    count={renderingQueue.length} 
                    progress={queueProgress}
                    completedCount={completedRenderings.length}
                    onClick={handleRenderingIndicatorClick}
                  />
                </div>
              </div>

              {/* Tabs Navigation and Content */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                {/* Tab Bar */}
                <TabsList className="h-[44px] w-full rounded-none bg-background border-b border-border p-0 shrink-0 gap-0">
                  <TabsTrigger 
                    value="home" 
                    className="flex-1 h-full rounded-none border-0 data-[state=active]:border-b-[2px] data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Home
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mypage" 
                    className="flex-1 h-full rounded-none border-0 data-[state=active]:border-b-[2px] data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    My Page
                  </TabsTrigger>
                </TabsList>

                {/* Tab Content Areas */}
                <TabsContent value="home" className="flex-1 m-0 overflow-y-auto">
                  {/* Creation Feature Entry Module */}
                  <div className="px-4 py-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      <FeatureCard 
                        title="Place an object in your room"
                        icon={<span className="text-lg">🪑</span>}
                        iconBgColor="#FFE5D9"
                        onClick={() => handleFeatureCardClick("placeObject")}
                      />
                      <FeatureCard 
                        title="Overall Interior design"
                        icon={<Palette className="size-4 text-purple-600" />}
                        iconBgColor="#E9D5FF"
                        onClick={() => handleFeatureCardClick("interiorDesign")}
                      />
                      <FeatureCard 
                        title="Exterior design"
                        icon={<Home className="size-4 text-blue-600" />}
                        iconBgColor="#DBEAFE"
                        onClick={() => handleFeatureCardClick("exteriorDesign")}
                      />
                    </div>
                  </div>

                  {/* Explore Feed Section */}
                  <div className="py-4">
                    <div className="flex items-center justify-between px-4 mb-2">
                      <h2>Explore Feed {(selectedRoomType || selectedStyle || selectedBudget) && <span className="text-xs text-gray-500 ml-2">({(selectedRoomType ? 1 : 0) + (selectedStyle ? 1 : 0) + (selectedBudget ? 1 : 0)} active)</span>}</h2>
                      {(selectedRoomType || selectedStyle || selectedBudget) && (
                        <button
                          onClick={() => {
                            setSelectedRoomType("");
                            setSelectedStyle("");
                            setSelectedBudget("");
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide mt-2">
                      <FilterChip
                        label="Room Type"
                        options={roomTypes}
                        selectedValue={selectedRoomType}
                        onSelect={handleRoomTypeSelect}
                      />
                      <FilterChip
                        label="Style"
                        options={styles}
                        selectedValue={selectedStyle}
                        onSelect={handleStyleSelect}
                      />
                      <FilterChip
                        label="Budget"
                        options={budgets}
                        selectedValue={selectedBudget}
                        onSelect={handleBudgetSelect}
                      />
                    </div>
                    
                    {/* Feed Grid */}
                    <div className="grid grid-cols-2 gap-[9px] px-4 mt-2 pb-4">
                      {displayedImages.map((imageUrl, index) => (
                        <FeedCard
                          key={`${imageUrl}-${index}`}
                          imageUrl={imageUrl}
                          isLiked={likedImages.has(imageUrl)}
                          onLikeToggle={() => handleLikeToggle(imageUrl)}
                          onClick={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mypage" className="flex-1 m-0 overflow-y-auto">
                  <div className="p-4">
                    <MyPageContent renderingItems={allRenderingItems} />
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              key="creation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={SLIDE_ANIMATION_CONFIG}
              className="absolute inset-0"
            >
              <CreationPage 
                title={getPageTitle(currentPage)} 
                onBack={handleBackToHome}
                onAddRenderingRequest={addRenderingRequest}
                renderingQueueCount={renderingQueue.length}
                renderingQueueProgress={queueProgress}
                completedCount={completedRenderings.length}
                onRenderingStatusClick={handleRenderingIndicatorClick}
                selectedSpace={creationPageStates[currentPage].selectedSpace}
                selectedImage={creationPageStates[currentPage].selectedImage}
                showAnalysis={creationPageStates[currentPage].showAnalysis}
                analysisCompleted={creationPageStates[currentPage].analysisCompleted}
                onStateChange={(state) => updateCreationPageState(currentPage, state)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
