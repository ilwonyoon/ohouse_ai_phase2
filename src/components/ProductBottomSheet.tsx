import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: number;
  brand: string;
  title: string;
  price: string;
  imageUrl: string;
}

interface ProductBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  onPlaceProduct: () => void;
  isRendering?: boolean;
}

// Mock product data for different categories
const productsByCategory: Record<string, Product[]> = {
  "Sofa": [
    {
      id: 1,
      brand: "West Elm",
      title: "Mid-Century Modern Sofa",
      price: "$1,299",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      brand: "Article",
      title: "Sven Charme Tan Sofa",
      price: "$1,799",
      imageUrl: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      brand: "CB2",
      title: "Piazza Apartment Sofa",
      price: "$999",
      imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      brand: "IKEA",
      title: "Kivik Sectional Sofa",
      price: "$849",
      imageUrl: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      brand: "Burrow",
      title: "Nomad Leather Sofa",
      price: "$2,195",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    },
  ],
  "Coffee Table": [
    {
      id: 1,
      brand: "CB2",
      title: "Smart Round Marble Top Coffee Table",
      price: "$599",
      imageUrl: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      brand: "West Elm",
      title: "Industrial Storage Coffee Table",
      price: "$499",
      imageUrl: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      brand: "Article",
      title: "Seno Walnut Coffee Table",
      price: "$449",
      imageUrl: "https://images.unsplash.com/photo-1565183997392-2f8145e0c5a5?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      brand: "IKEA",
      title: "Lack Coffee Table",
      price: "$49",
      imageUrl: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      brand: "Crate & Barrel",
      title: "Lounge II Coffee Table",
      price: "$799",
      imageUrl: "https://images.unsplash.com/photo-1633505586555-42923b0a48b5?w=400&h=400&fit=crop",
    },
  ],
  "Rug": [
    {
      id: 1,
      brand: "Rugs USA",
      title: "Moroccan Blythe Area Rug",
      price: "$199",
      imageUrl: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      brand: "West Elm",
      title: "Distressed Arabesque Wool Rug",
      price: "$549",
      imageUrl: "https://images.unsplash.com/photo-1615875221248-d3f2d4573d8f?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      brand: "Ruggable",
      title: "Washable Vintage Rug",
      price: "$299",
      imageUrl: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      brand: "IKEA",
      title: "Lohals Jute Rug",
      price: "$129",
      imageUrl: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      brand: "Article",
      title: "Andes Brindle Rug",
      price: "$399",
      imageUrl: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&h=400&fit=crop",
    },
  ],
  "Floor Lamp": [
    {
      id: 1,
      brand: "West Elm",
      title: "Arc Floor Lamp",
      price: "$299",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      brand: "CB2",
      title: "Big Dipper Arc Floor Lamp",
      price: "$449",
      imageUrl: "https://images.unsplash.com/photo-1534105615926-0f5da6f2c9e5?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      brand: "IKEA",
      title: "Not Floor Lamp",
      price: "$59",
      imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      brand: "Article",
      title: "Veld Floor Lamp",
      price: "$249",
      imageUrl: "https://images.unsplash.com/photo-1550980643-adb5c37f8a85?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      brand: "Target",
      title: "Threshold Tripod Floor Lamp",
      price: "$129",
      imageUrl: "https://images.unsplash.com/photo-1573621729334-6d58d7732ab1?w=400&h=400&fit=crop",
    },
  ],
};

export function ProductBottomSheet({ isOpen, onClose, category, onPlaceProduct, isRendering = false }: ProductBottomSheetProps) {
  const products = productsByCategory[category] || [];
  const [renderingProductId, setRenderingProductId] = useState<number | null>(null);

  const handlePlaceProduct = (product: Product) => {
    if (!renderingProductId) {
      setRenderingProductId(product.id);
      onPlaceProduct();

      // Reset after rendering completes (5 seconds based on constants)
      setTimeout(() => {
        setRenderingProductId(null);
      }, 5000);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[500px] rounded-t-[20px] p-0 w-[375px] !left-1/2 !-translate-x-1/2 !right-auto"
        hideOverlay={true}
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-left">Recommended {category}</SheetTitle>
          <SheetDescription className="sr-only">
            Browse recommended {category} products for your space
          </SheetDescription>
        </SheetHeader>
        
        <div className="overflow-y-auto h-[calc(500px-80px)] px-6 py-4">
          <div className="space-y-4">
            {products.map((product) => (
              <div 
                key={product.id}
                className="flex gap-4 cursor-pointer hover:bg-accent/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                {/* 1:1 Square Product Thumbnail */}
                <div className="size-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={product.imageUrl}
                    alt={product.title}
                    className="size-full object-cover"
                  />
                </div>
                
                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-center gap-1">
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <p className="text-sm line-clamp-1">{product.title}</p>
                  <p className="text-sm">{product.price}</p>
                </div>

                {/* Place it Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaceProduct(product);
                  }}
                  disabled={renderingProductId === product.id}
                  className={`self-center shrink-0 h-[32px] px-4 rounded-[6px] text-sm font-medium transition-all ${
                    renderingProductId === product.id
                      ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-border text-gray-900 hover:bg-gray-50 active:bg-gray-100 active:border-gray-400'
                  }`}
                >
                  {renderingProductId === product.id ? 'Rendering...' : 'Place it'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
