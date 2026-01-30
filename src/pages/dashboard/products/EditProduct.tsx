import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { updateProduct } from "@/api/products/updateProduct";
import { fetchProduct } from "@/api/products/fetchProduct";
import type { Product, ProductUpdate } from "@/types/product";

/**
 * Form data structure for editing - similar to create but with update/add/remove arrays
 * We use this intermediate structure to make form management easier with react-hook-form
 */
type ProductEditFormData = {
  name: string;
  description?: string;
  type: "simple" | "variable";
  // Simple product fields
  base_price?: number;
  sku?: string;
  stock_quantity?: number;
  re_order_level?: number;
  // For variable products: track which variants to add, update, or remove
  variants_to_add?: Array<{
    sku: string;
    price: number;
    stock_quantity: number;
    re_order_level: number;
    attributePairs: Array<{ key: string; value: string }>;
  }>;
  variants_to_update?: Array<{
    id: string;
    sku?: string;
    price?: number;
    stock_quantity?: number;
    re_order_level?: number;
    attributePairs: Array<{ key: string; value: string }>;
  }>;
  variants_to_remove?: string[];
};

/**
 * Helper: Convert form data with attributePairs into the API's expected format
 * Transforms the nested form structure into the flat ProductUpdate payload
 */
function transformEditFormToApiPayload(
  formData: ProductEditFormData,
): ProductUpdate {
  const payload: ProductUpdate = {
    name: formData.name,
    description: formData.description,
    type: formData.type,
  };

  // Simple product fields - only include if type is simple
  if (formData.type === "simple") {
    payload.base_price = formData.base_price;
    payload.sku = formData.sku;
    payload.stock_quantity = formData.stock_quantity;
    payload.re_order_level = formData.re_order_level;
  }

  // Variable product - handle variants
  if (formData.type === "variable") {
    // Transform variants_to_add: convert attributePairs array to attributes object
    if (formData.variants_to_add && formData.variants_to_add.length > 0) {
      payload.variants_to_add = formData.variants_to_add.map((variant) => ({
        sku: variant.sku,
        price: variant.price,
        stock_quantity: variant.stock_quantity,
        re_order_level: variant.re_order_level,
        attributes: variant.attributePairs.reduce(
          (acc, pair) => {
            if (pair.key.trim() && pair.value.trim()) {
              acc[pair.key.trim()] = pair.value.trim();
            }
            return acc;
          },
          {} as Record<string, string>,
        ),
      }));
    }

    // Transform variants_to_update: convert attributePairs array to attributes object
    if (formData.variants_to_update && formData.variants_to_update.length > 0) {
      payload.variants_to_update = formData.variants_to_update.map(
        (variant) => ({
          id: variant.id,
          sku: variant.sku,
          price: variant.price,
          stock_quantity: variant.stock_quantity,
          re_order_level: variant.re_order_level,
          attributes: variant.attributePairs.reduce(
            (acc, pair) => {
              if (pair.key.trim() && pair.value.trim()) {
                acc[pair.key.trim()] = pair.value.trim();
              }
              return acc;
            },
            {} as Record<string, string>,
          ),
        }),
      );
    }

    payload.variants_to_remove = formData.variants_to_remove;
  }

  return payload;
}

/**
 * Helper: Convert API product data (with attributes object) to form data (with attributePairs array)
 * This makes it easier to work with the form - we convert back to the API format on submit
 */
function transformProductToFormData(product: Product): ProductEditFormData {
  return {
    name: product.name,
    description: product.description ?? undefined,
    type: product.type,
    // Simple product fields - handle null values
    base_price: product.base_price ?? undefined,
    sku: product.sku ?? undefined,
    stock_quantity: product.stock_quantity ?? undefined,
    re_order_level: product.re_order_level ?? undefined,
    // Initialize empty arrays for variant operations
    variants_to_add: [],
    // Convert existing variants to the update format
    variants_to_update:
      product.variants?.map((v) => ({
        id: v.id,
        sku: v.sku ?? undefined, // Convert null to undefined for form
        price: v.price ?? undefined,
        stock_quantity: v.stock_quantity,
        re_order_level: v.re_order_level,
        // Convert attributes object to attributePairs array for easier form handling
        attributePairs: Object.entries(v.attributes || {}).map(
          ([key, value]) => ({
            key,
            value,
          }),
        ),
      })) ?? [],
    variants_to_remove: [],
  };
}

export default function EditProduct() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["products", productId!],
    queryFn: fetchProduct,
    enabled: !!productId,
  });

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <Alert variant="destructive">
          <AlertDescription>Product not found</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => navigate("/products")}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
        </Button>
      </div>
    );
  }

  return <EditProductForm key={product.id} product={product} />;
}

function EditProductForm({ product }: { product: Product }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductEditFormData>({
    defaultValues: transformProductToFormData(product),
  });

  // Field arrays for managing variants
  const {
    fields: addFields,
    append: addAppend,
    remove: addRemove,
  } = useFieldArray({
    control,
    name: "variants_to_add",
  });

  const { fields: updateFields } = useFieldArray({
    control,
    name: "variants_to_update",
  });

  const productType = watch("type");

  // Handle product type switching - this clears data for the type we're switching away from
  useEffect(() => {
    if (productType === "simple") {
      // Switching to simple: mark all existing variants for removal
      setValue("variants_to_add", []);
      setValue("variants_to_update", []);
      setValue("variants_to_remove", product.variants?.map((v) => v.id) ?? []);
    } else {
      // Switching to variable: clear simple product fields
      setValue("base_price", undefined);
      setValue("sku", undefined);
      setValue("stock_quantity", undefined);
      setValue("re_order_level", undefined);
    }
  }, [productType, setValue, product.variants]);

  const updateProductMutation = useMutation({
    mutationFn: (updateData: ProductUpdate) =>
      updateProduct(product.id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", product.id] });
      navigate("/products");
    },
  });

  const onSubmit = (data: ProductEditFormData) => {
    const apiPayload = transformEditFormToApiPayload(data);
    updateProductMutation.mutate(apiPayload);
  };

  // Helper to add a new variant with one empty attribute pair
  const addNewVariant = () => {
    addAppend({
      sku: "",
      price: 0,
      stock_quantity: 0,
      re_order_level: 0,
      attributePairs: [{ key: "", value: "" }],
    });
  };

  // Mark an existing variant for removal
  const markVariantForRemoval = (id: string) => {
    const removeList = watch("variants_to_remove") ?? [];
    setValue("variants_to_remove", [...removeList, id]);

    // Remove from the update fields list so it doesn't show in UI
    const updated = updateFields.filter((f) => f.id !== id);
    setValue("variants_to_update", updated);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/products")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
      </Button>

      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <Card>
        <CardHeader>
          <CardTitle>Product Settings</CardTitle>
          <CardDescription>Update product information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {updateProductMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {updateProductMutation.error instanceof Error
                    ? updateProductMutation.error.message
                    : "Failed to update product."}
                </AlertDescription>
              </Alert>
            )}

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                disabled={updateProductMutation.isPending}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                disabled={updateProductMutation.isPending}
                rows={4}
              />
            </div>

            {/* Product Type with confirmation dialog */}
            <div className="space-y-2">
              <Label htmlFor="type">Product Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(newValue) => {
                      // Only trigger if actually changing
                      if (newValue !== product.type) {
                        field.onChange(newValue);
                      }
                    }}
                    disabled={updateProductMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="simple">Simple Product</SelectItem>
                      <SelectItem value="variable">Variable Product</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {productType !== product.type && (
                <Alert>
                  <AlertDescription>
                    Switching type will migrate data. For variable to simple,
                    first variant data moves to product. For simple to variable,
                    a default variant is created.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Simple Product Fields */}
            {productType === "simple" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="base_price">Base Price (₦)</Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("base_price", { valueAsNumber: true })}
                    disabled={updateProductMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    {...register("sku")}
                    disabled={updateProductMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    min="0"
                    {...register("stock_quantity", { valueAsNumber: true })}
                    disabled={updateProductMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="re_order_level">Re-order Level</Label>
                  <Input
                    id="re_order_level"
                    type="number"
                    min="0"
                    {...register("re_order_level", { valueAsNumber: true })}
                    disabled={updateProductMutation.isPending}
                  />
                </div>
              </>
            )}

            {/* Variable Product - Variants Section */}
            {productType === "variable" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Variants</Label>
                  <Button
                    type="button"
                    onClick={addNewVariant}
                    disabled={updateProductMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Variant
                  </Button>
                </div>

                {/* Existing variants (to update) */}
                {updateFields.map((field, index) => (
                  <ExistingVariantCard
                    key={field.id}
                    variantIndex={index}
                    control={control}
                    register={register}
                    onRemove={() => markVariantForRemoval(field.id)}
                    isPending={updateProductMutation.isPending}
                  />
                ))}

                {/* New variants (to add) */}
                {addFields.map((field, index) => (
                  <NewVariantCard
                    key={field.id}
                    variantIndex={index}
                    control={control}
                    register={register}
                    errors={errors}
                    onRemove={() => addRemove(index)}
                    isPending={updateProductMutation.isPending}
                  />
                ))}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={updateProductMutation.isPending}
                className="flex-1"
              >
                {updateProductMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/products")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Card for editing an existing variant
 * Shows fields for updating variant properties and attributes
 */
type ExistingVariantCardProps = {
  variantIndex: number;
  control: any;
  register: any;
  onRemove: () => void;
  isPending: boolean;
};

function ExistingVariantCard({
  variantIndex,
  control,
  register,
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`variants_to_update.${variantIndex}.sku`}>SKU</Label>
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
          <Label htmlFor={`variants_to_update.${variantIndex}.stock_quantity`}>
            Stock Quantity
          </Label>
          <Input
            id={`variants_to_update.${variantIndex}.stock_quantity`}
            type="number"
            min="0"
            {...register(`variants_to_update.${variantIndex}.stock_quantity`, {
              valueAsNumber: true,
            })}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`variants_to_update.${variantIndex}.re_order_level`}>
            Re-order Level
          </Label>
          <Input
            id={`variants_to_update.${variantIndex}.re_order_level`}
            type="number"
            min="0"
            {...register(`variants_to_update.${variantIndex}.re_order_level`, {
              valueAsNumber: true,
            })}
            disabled={isPending}
          />
        </div>

        {/* Dynamic Attributes */}
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
              <Plus className="h-3 w-3 mr-1" /> Add Attribute
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
    </Card>
  );
}

/**
 * Card for creating a new variant
 * Shows fields for adding a new variant with validation
 */
type NewVariantCardProps = {
  variantIndex: number;
  control: any;
  register: any;
  errors: any;
  onRemove: () => void;
  isPending: boolean;
};

function NewVariantCard({
  variantIndex,
  control,
  register,
  errors,
  onRemove,
  isPending,
}: NewVariantCardProps) {
  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: `variants_to_add.${variantIndex}.attributePairs`,
  });

  return (
    <Card className="p-4 border-dashed">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">New Variant {variantIndex + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          onClick={onRemove}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`variants_to_add.${variantIndex}.sku`}>
            SKU <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`variants_to_add.${variantIndex}.sku`}
            {...register(`variants_to_add.${variantIndex}.sku`, {
              required: "SKU is required",
            })}
            disabled={isPending}
          />
          {errors.variants_to_add?.[variantIndex]?.sku && (
            <p className="text-sm text-red-500">
              {errors.variants_to_add[variantIndex].sku.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`variants_to_add.${variantIndex}.price`}>
            Price (₦) <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`variants_to_add.${variantIndex}.price`}
            type="number"
            step="0.01"
            min="0"
            {...register(`variants_to_add.${variantIndex}.price`, {
              required: "Price is required",
              valueAsNumber: true,
            })}
            disabled={isPending}
          />
          {errors.variants_to_add?.[variantIndex]?.price && (
            <p className="text-sm text-red-500">
              {errors.variants_to_add[variantIndex].price.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`variants_to_add.${variantIndex}.stock_quantity`}>
            Stock Quantity
          </Label>
          <Input
            id={`variants_to_add.${variantIndex}.stock_quantity`}
            type="number"
            min="0"
            {...register(`variants_to_add.${variantIndex}.stock_quantity`, {
              valueAsNumber: true,
            })}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`variants_to_add.${variantIndex}.re_order_level`}>
            Re-order Level
          </Label>
          <Input
            id={`variants_to_add.${variantIndex}.re_order_level`}
            type="number"
            min="0"
            {...register(`variants_to_add.${variantIndex}.re_order_level`, {
              valueAsNumber: true,
            })}
            disabled={isPending}
          />
        </div>

        {/* Dynamic Attributes */}
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
              <Plus className="h-3 w-3 mr-1" /> Add Attribute
            </Button>
          </div>

          {attributeFields.map((attrField, attrIndex) => (
            <div key={attrField.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  placeholder="Key (e.g., color)"
                  {...register(
                    `variants_to_add.${variantIndex}.attributePairs.${attrIndex}.key`,
                  )}
                  disabled={isPending}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Value (e.g., red)"
                  {...register(
                    `variants_to_add.${variantIndex}.attributePairs.${attrIndex}.value`,
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
            <p className="text-sm text-gray-500">
              No attributes added. Click "Add Attribute" to define variant
              properties.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
