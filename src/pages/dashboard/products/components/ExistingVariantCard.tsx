import { useFieldArray } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";

import { ImageUploader } from "@/components/ImageUploader";

/**
 * ExistingVariantCard (for edit mode)
 */
type ExistingVariantCardProps = {
  variantIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  onRemove: () => void;
  isPending: boolean;
};

export function ExistingVariantCard({
  variantIndex,
  control,
  register,
  watch,
  setValue,
  onRemove,
  isPending,
}: ExistingVariantCardProps) {
  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: `variants_to_update.${variantIndex}.attributePairs`,
  });

  const handleVariantImagesChange = (urls: string[], mainUrl?: string) => {
    setValue(`variants_to_update.${variantIndex}.image_urls`, urls);
    setValue(`variants_to_update.${variantIndex}.main_image_url`, mainUrl);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Existing Variant {variantIndex + 1}</h4>
        <AlertDialog>
          <AlertDialogAction asChild>
            <Button type="button" variant="ghost" disabled={isPending}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogAction>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Variant?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The variant will be permanently
                deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onRemove}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left side - Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`variants_to_update.${variantIndex}.sku`}>
              SKU
            </Label>
            <Input
              id={`variants_to_update.${variantIndex}.sku`}
              {...register(`variants_to_update.${variantIndex}.sku`)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`variants_to_update.${variantIndex}.price`}>
              Price (₦)
            </Label>
            <Input
              id={`variants_to_update.${variantIndex}.price`}
              type="number"
              step="0.01"
              min="0"
              {...register(`variants_to_update.${variantIndex}.price`, {
                valueAsNumber: true,
              })}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`variants_to_update.${variantIndex}.stock_quantity`}
            >
              Stock Quantity
            </Label>
            <Input
              id={`variants_to_update.${variantIndex}.stock_quantity`}
              type="number"
              min="0"
              {...register(
                `variants_to_update.${variantIndex}.stock_quantity`,
                {
                  valueAsNumber: true,
                },
              )}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`variants_to_update.${variantIndex}.re_order_level`}
            >
              Re-order Level
            </Label>
            <Input
              id={`variants_to_update.${variantIndex}.re_order_level`}
              type="number"
              min="0"
              {...register(
                `variants_to_update.${variantIndex}.re_order_level`,
                {
                  valueAsNumber: true,
                },
              )}
              disabled={isPending}
            />
          </div>

          {/* Attributes */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Attributes</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendAttribute({ key: "", value: "" })}
                disabled={isPending}
              >
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            {attributeFields.map((attrField, attrIndex) => (
              <div key={attrField.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Key"
                    {...register(
                      `variants_to_update.${variantIndex}.attributePairs.${attrIndex}.key`,
                    )}
                    disabled={isPending}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Value"
                    {...register(
                      `variants_to_update.${variantIndex}.attributePairs.${attrIndex}.value`,
                    )}
                    disabled={isPending}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttribute(attrIndex)}
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {attributeFields.length === 0 && (
              <p className="text-sm text-gray-500">No attributes defined</p>
            )}
          </div>
        </div>

        {/* Right side - Images */}
        <div>
          <ImageUploader
            existingImages={
              watch(`variants_to_update.${variantIndex}.image_urls`) ?? []
            }
            mainImageUrl={watch(
              `variants_to_update.${variantIndex}.main_image_url`,
            )}
            onImagesChange={handleVariantImagesChange}
            maxImages={8}
            uploaderId={`variant-update-${variantIndex}-images`}
          />
        </div>
      </div>
    </Card>
  );
}
