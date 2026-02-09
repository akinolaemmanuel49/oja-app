import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Upload, Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

import type { PageComponent } from "@/types/storefront.design";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import { RichTextEditor } from "./RichTextEditor";

// ──────────────────────────────────────────────
// Main Editor
// ──────────────────────────────────────────────

interface ComponentEditorProps {
  component: PageComponent;
  onUpdate: (data: PageComponent["data"]) => void;
  onClose: () => void;
}

export function ComponentEditor({
  component,
  onUpdate,
  onClose,
}: ComponentEditorProps) {
  const updateData = (updates: Partial<PageComponent["data"]>) => {
    onUpdate({ ...component.data, ...updates } as PageComponent["data"]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h3 className="font-bold">Edit Component</h3>
          <p className="text-xs text-gray-600 capitalize">
            {component.type.replace("_", " ")}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {component.type === "hero" && (
          <HeroEditor data={component.data} onUpdate={updateData} />
        )}
        {component.type === "banner" && (
          <BannerEditor data={component.data} onUpdate={updateData} />
        )}
        {component.type === "text" && (
          <TextEditor data={component.data} onUpdate={updateData} />
        )}
        {component.type === "product_grid" && (
          <ProductGridEditor data={component.data} onUpdate={updateData} />
        )}
        {component.type === "product_carousel" && (
          <ProductCarouselEditor data={component.data} onUpdate={updateData} />
        )}
        {component.type === "image_gallery" && (
          <ImageGalleryEditor data={component.data} onUpdate={updateData} />
        )}
        {component.type === "spacer" && (
          <SpacerEditor data={component.data} onUpdate={updateData} />
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Individual Editors – strongly typed
// ──────────────────────────────────────────────

function HeroEditor({
  data,
  onUpdate,
}: {
  data: Extract<PageComponent, { type: "hero" }>["data"];
  onUpdate: (
    updates: Partial<Extract<PageComponent, { type: "hero" }>["data"]>,
  ) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onUpdate({ backgroundImage: url });
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>

      <div>
        <Label>Subtitle (optional)</Label>
        <Input
          value={data.subtitle ?? ""}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
        />
      </div>

      <div>
        <Label>Background Image</Label>
        {data.backgroundImage ? (
          <div className="mt-2 relative">
            <img
              src={data.backgroundImage}
              alt="Background"
              className="w-full h-32 object-cover rounded"
            />
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={() => onUpdate({ backgroundImage: undefined })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="mt-2 block">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="border-2 border-dashed rounded p-4 text-center cursor-pointer hover:bg-gray-50">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {uploading ? "Uploading..." : "Click to upload"}
              </p>
            </div>
          </label>
        )}
      </div>

      <div>
        <Label>Background Color</Label>
        <Input
          type="color"
          value={data.backgroundColor ?? "#ffffff"}
          onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
        />
      </div>

      <div>
        <Label>Text Color</Label>
        <Input
          type="color"
          value={data.textColor}
          onChange={(e) => onUpdate({ textColor: e.target.value })}
        />
      </div>

      <div>
        <Label>Height</Label>
        <Select
          value={data.height}
          onValueChange={(value) =>
            onUpdate({ height: value as typeof data.height })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (300px)</SelectItem>
            <SelectItem value="medium">Medium (500px)</SelectItem>
            <SelectItem value="large">Large (700px)</SelectItem>
            <SelectItem value="full">Full Screen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Text Alignment</Label>
        <Select
          value={data.textAlign}
          onValueChange={(value) =>
            onUpdate({ textAlign: value as typeof data.textAlign })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overlay */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <Label>Overlay</Label>
          <Switch
            checked={data.overlay?.enabled ?? false}
            onCheckedChange={(checked) =>
              onUpdate({
                overlay: {
                  ...data.overlay,
                  enabled: checked,
                  color: data.overlay?.color ?? "#000000",
                  opacity: data.overlay?.opacity ?? 50,
                },
              })
            }
          />
        </div>

        {data.overlay?.enabled && (
          <div className="space-y-2 mt-2">
            <div>
              <Label className="text-xs">Color</Label>
              <Input
                type="color"
                value={data.overlay.color}
                onChange={(e) =>
                  onUpdate({
                    overlay: { ...data.overlay!, color: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs">
                Opacity ({data.overlay.opacity}%)
              </Label>
              <Input
                type="range"
                min="0"
                max="100"
                value={data.overlay.opacity}
                onChange={(e) =>
                  onUpdate({
                    overlay: {
                      ...data.overlay!,
                      opacity: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <Label>Call to Action Button</Label>
          <Switch
            checked={data.cta?.enabled ?? false}
            onCheckedChange={(checked) =>
              onUpdate({
                cta: {
                  ...data.cta!,
                  enabled: checked,
                  text: data.cta?.text ?? "Shop Now",
                  url: data.cta?.url ?? "",
                }!,
              })
            }
          />
        </div>

        {data.cta?.enabled && (
          <div className="space-y-2 mt-2">
            <div>
              <Label className="text-xs">Button Text</Label>
              <Input
                value={data.cta.text}
                onChange={(e) =>
                  onUpdate({
                    cta: { ...data.cta!, text: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs">Button URL</Label>
              <Input
                value={data.cta.url ?? ""}
                onChange={(e) =>
                  onUpdate({
                    cta: { ...data.cta!, url: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────

function BannerEditor({
  data,
  onUpdate,
}: {
  data: Extract<PageComponent, { type: "banner" }>["data"];
  onUpdate: (
    updates: Partial<Extract<PageComponent, { type: "banner" }>["data"]>,
  ) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onUpdate({
        images: [...data.images, { url, alt: file.name }],
      });
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onUpdate({
      images: data.images.filter((_, i) => i !== index),
    });
  };

  const updateImageLink = (index: number, link: string) => {
    const updated = [...data.images];
    updated[index] = { ...updated[index], link };
    onUpdate({ images: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Images</Label>
        <div className="space-y-2 mt-2">
          {data.images.map((img, index) => (
            <Card key={index} className="p-2">
              <img
                src={img.url}
                alt={img.alt ?? ""}
                className="w-full h-20 object-cover rounded mb-2"
              />
              <Input
                placeholder="Click-through URL (optional)"
                value={img.link ?? ""}
                onChange={(e) => updateImageLink(index, e.target.value)}
                className="text-xs mb-2"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeImage(index)}
                className="w-full text-red-600"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Remove
              </Button>
            </Card>
          ))}

          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="border-2 border-dashed rounded p-4 text-center cursor-pointer hover:bg-gray-50">
              <Plus className="h-6 w-6 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-600">
                {uploading ? "Uploading..." : "Add Image"}
              </p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <Label>Height</Label>
        <Select
          value={data.height}
          onValueChange={(value) =>
            onUpdate({ height: value as typeof data.height })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (300px)</SelectItem>
            <SelectItem value="medium">Medium (500px)</SelectItem>
            <SelectItem value="large">Large (700px)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Auto-play</Label>
        <Switch
          checked={data.autoPlay}
          onCheckedChange={(checked) => onUpdate({ autoPlay: checked })}
        />
      </div>

      {data.autoPlay && (
        <div>
          <Label>Interval (seconds)</Label>
          <Input
            type="number"
            value={data.interval / 1000}
            onChange={(e) =>
              onUpdate({ interval: Number(e.target.value) * 1000 })
            }
            min="1"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label>Show Dots</Label>
        <Switch
          checked={data.showDots}
          onCheckedChange={(checked) => onUpdate({ showDots: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Show Arrows</Label>
        <Switch
          checked={data.showArrows}
          onCheckedChange={(checked) => onUpdate({ showArrows: checked })}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────

function TextEditor({
  data,
  onUpdate,
}: {
  data: Extract<PageComponent, { type: "text" }>["data"];
  onUpdate: (
    updates: Partial<Extract<PageComponent, { type: "text" }>["data"]>,
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Content</Label>
        <RichTextEditor
          value={data.content}
          onChange={(content) => onUpdate({ content })}
        />
      </div>

      <div>
        <Label>Max Width</Label>
        <Select
          value={data.maxWidth}
          onValueChange={(value) =>
            onUpdate({ maxWidth: value as typeof data.maxWidth })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Width</SelectItem>
            <SelectItem value="narrow">Narrow (640px)</SelectItem>
            <SelectItem value="medium">Medium (768px)</SelectItem>
            <SelectItem value="wide">Wide (1024px)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Text Alignment</Label>
        <Select
          value={data.textAlign}
          onValueChange={(value) =>
            onUpdate({ textAlign: value as typeof data.textAlign })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Background Color (optional)</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={data.backgroundColor ?? "#ffffff"}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
          />
          {data.backgroundColor && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdate({ backgroundColor: undefined })}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label>Padding</Label>
        <Select
          value={data.padding}
          onValueChange={(value) =>
            onUpdate({ padding: value as typeof data.padding })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────

function ProductGridEditor({
  data,
  onUpdate,
}: {
  data: Extract<PageComponent, { type: "product_grid" }>["data"];
  onUpdate: (
    updates: Partial<Extract<PageComponent, { type: "product_grid" }>["data"]>,
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Title (optional)</Label>
        <Input
          value={data.title ?? ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Featured Products"
        />
      </div>

      <div>
        <Label>Columns</Label>
        <Select
          value={String(data.columns)}
          onValueChange={(value) =>
            onUpdate({
              columns: Number(value) as 2 | 3 | 4 | 5 | 6 | undefined,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
            <SelectItem value="5">5 Columns</SelectItem>
            <SelectItem value="6">6 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Max Products</Label>
        <Input
          type="number"
          value={data.limit}
          onChange={(e) => onUpdate({ limit: Number(e.target.value) })}
          min="1"
          max="100"
        />
      </div>

      <div>
        <Label>Sort Order</Label>
        <Select
          value={data.sortOrder}
          onValueChange={(value) =>
            onUpdate({ sortOrder: value as typeof data.sortOrder })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest_first">Newest First</SelectItem>
            <SelectItem value="oldest_first">Oldest First</SelectItem>
            <SelectItem value="price_low_high">Price: Low to High</SelectItem>
            <SelectItem value="price_high_low">Price: High to Low</SelectItem>
            <SelectItem value="name_a_z">Name: A-Z</SelectItem>
            <SelectItem value="name_z_a">Name: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Card Style</Label>
        <Select
          value={data.cardStyle}
          onValueChange={(value) =>
            onUpdate({ cardStyle: value as typeof data.cardStyle })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="bordered">Bordered</SelectItem>
            <SelectItem value="shadow">Shadow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Spacing</Label>
        <Select
          value={data.spacing}
          onValueChange={(value) =>
            onUpdate({ spacing: value as typeof data.spacing })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="relaxed">Relaxed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Show Price</Label>
        <Switch
          checked={data.showPrice}
          onCheckedChange={(checked) => onUpdate({ showPrice: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Show SKU</Label>
        <Switch
          checked={data.showSku}
          onCheckedChange={(checked) => onUpdate({ showSku: checked })}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────

function ProductCarouselEditor({
  data,
  onUpdate,
}: {
  data: Extract<PageComponent, { type: "product_carousel" }>["data"];
  onUpdate: (
    updates: Partial<
      Extract<PageComponent, { type: "product_carousel" }>["data"]
    >,
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Title (optional)</Label>
        <Input
          value={data.title ?? ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="New Arrivals"
        />
      </div>

      <div>
        <Label>Max Products</Label>
        <Input
          type="number"
          value={data.limit}
          onChange={(e) => onUpdate({ limit: Number(e.target.value) })}
          min="1"
          max="50"
        />
      </div>

      <div>
        <Label>Items Per View</Label>
        <Select
          value={String(data.itemsPerView)}
          onValueChange={(value) =>
            onUpdate({
              itemsPerView: Number(value) as 2 | 3 | 4 | 5 | undefined,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Items</SelectItem>
            <SelectItem value="3">3 Items</SelectItem>
            <SelectItem value="4">4 Items</SelectItem>
            <SelectItem value="5">5 Items</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Sort Order</Label>
        <Select
          value={data.sortOrder}
          onValueChange={(value) =>
            onUpdate({ sortOrder: value as typeof data.sortOrder })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest_first">Newest First</SelectItem>
            <SelectItem value="oldest_first">Oldest First</SelectItem>
            <SelectItem value="price_low_high">Price: Low to High</SelectItem>
            <SelectItem value="price_high_low">Price: High to Low</SelectItem>
            <SelectItem value="name_a_z">Name: A-Z</SelectItem>
            <SelectItem value="name_z_a">Name: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Auto-play</Label>
        <Switch
          checked={data.autoPlay}
          onCheckedChange={(checked) => onUpdate({ autoPlay: checked })}
        />
      </div>

      {data.autoPlay && (
        <div>
          <Label>Interval (seconds)</Label>
          <Input
            type="number"
            value={data.interval / 1000}
            onChange={(e) =>
              onUpdate({ interval: Number(e.target.value) * 1000 })
            }
            min="1"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label>Show Price</Label>
        <Switch
          checked={data.showPrice}
          onCheckedChange={(checked) => onUpdate({ showPrice: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Show SKU</Label>
        <Switch
          checked={data.showSku}
          onCheckedChange={(checked) => onUpdate({ showSku: checked })}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────

function ImageGalleryEditor({
  data,
  onUpdate,
}: {
  data: Extract<PageComponent, { type: "image_gallery" }>["data"];
  onUpdate: (
    updates: Partial<Extract<PageComponent, { type: "image_gallery" }>["data"]>,
  ) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onUpdate({
        images: [...data.images, { url, alt: file.name }],
      });
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onUpdate({
      images: data.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Images</Label>
        <div className="space-y-2 mt-2">
          {data.images.map((img, index) => (
            <Card key={index} className="p-2">
              <img
                src={img.url}
                alt={img.alt ?? ""}
                className="w-full h-20 object-cover rounded mb-2"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeImage(index)}
                className="w-full text-red-600"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Remove
              </Button>
            </Card>
          ))}

          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="border-2 border-dashed rounded p-4 text-center cursor-pointer hover:bg-gray-50">
              <Plus className="h-6 w-6 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-600">
                {uploading ? "Uploading..." : "Add Image"}
              </p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <Label>Layout</Label>
        <Select
          value={data.layout}
          onValueChange={(value) =>
            onUpdate({ layout: value as typeof data.layout })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="masonry">Masonry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Columns</Label>
        <Select
          value={String(data.columns)}
          onValueChange={(value) =>
            onUpdate({ columns: Number(value) as 2 | 3 | 4 | undefined })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Gap</Label>
        <Select
          value={data.gap}
          onValueChange={(value) => onUpdate({ gap: value as typeof data.gap })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────

function SpacerEditor({
  data,
  onUpdate,
}: {
  data: Extract<PageComponent, { type: "spacer" }>["data"];
  onUpdate: (
    updates: Partial<Extract<PageComponent, { type: "spacer" }>["data"]>,
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Height</Label>
        <Select
          value={data.height}
          onValueChange={(value) =>
            onUpdate({ height: value as typeof data.height })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (1rem)</SelectItem>
            <SelectItem value="medium">Medium (2rem)</SelectItem>
            <SelectItem value="large">Large (4rem)</SelectItem>
            <SelectItem value="xlarge">X-Large (6rem)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
