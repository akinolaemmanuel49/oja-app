import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { createProduct } from "@/api/products/createProduct";
import type { CreateProduct } from "@/types/product";

/**
 * Form data structure that handles attributes as key-value pairs
 * We'll convert this to the final CreateProduct shape before submission
 */
type ProductFormData = {
  name: string;
  description: string;
  type: "simple" | "variable";
  simple?: {
    base_price: number;
    sku: string;
    stock_quantity: number;
    re_order_level: number;
  };
  variants?: Array<{
    sku: string;
    price: number;
    stock_quantity: number;
    re_order_level: number;
    // Instead of a JSON object, we use an array of key-value pairs for easier form management
    attributePairs: Array<{ key: string; value: string }>;
  }>;
};

/**
 * Helper: Convert form data with attributePairs into the API's expected format
 * This transforms [{key: "color", value: "red"}] into {color: "red"}
 * For simple products, we flatten the nested simple object into top-level fields
 */
function transformFormDataToApiPayload(
  formData: ProductFormData,
): CreateProduct {
  const payload: CreateProduct = {
    name: formData.name,
    description: formData.description || undefined,
    type: formData.type,
  };

  // Simple products: flatten the simple object into top-level fields
  if (formData.type === "simple" && formData.simple) {
    payload.base_price = formData.simple.base_price;
    payload.sku = formData.simple.sku;
    payload.stock_quantity = formData.simple.stock_quantity;
    payload.re_order_level = formData.simple.re_order_level;
  }

  // Variable products: convert attributePairs array to attributes object for each variant
  if (formData.type === "variable" && formData.variants) {
    payload.variants = formData.variants.map((variant) => ({
      sku: variant.sku,
      price: variant.price,
      stock_quantity: variant.stock_quantity,
      re_order_level: variant.re_order_level,
      // Transform [{key, value}] into {key: value} object
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

  return payload;
}

export default function CreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      type: "simple",
      simple: { base_price: 0, sku: "", stock_quantity: 0, re_order_level: 0 },
      variants: [],
    },
  });

  // Manage the array of variants
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const productType = watch("type");

  // When switching product type, clear the opposite type's data
  useEffect(() => {
    if (productType === "simple") {
      setValue("variants", []);
    } else {
      setValue("simple", undefined);
    }
  }, [productType, setValue]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
  });

  const onSubmit = (data: ProductFormData) => {
    // Validate variable products have at least one variant
    if (
      data.type === "variable" &&
      (!data.variants || data.variants.length === 0)
    ) {
      return;
    }

    // Transform form data into API payload format
    const apiPayload = transformFormDataToApiPayload(data);
    createMutation.mutate(apiPayload);
  };

  // Helper to add a new variant with one empty attribute pair to start
  const addNewVariant = () => {
    append({
      sku: "",
      price: 0,
      stock_quantity: 0,
      re_order_level: 0,
      attributePairs: [{ key: "", value: "" }],
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <p className="text-gray-600 mt-2">Add a new product to your catalog</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Enter the basic information for your new product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error alert */}
            {createMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {createMutation.error instanceof Error
                    ? createMutation.error.message
                    : "Failed to create product. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Cotton T-Shirt"
                {...register("name", { required: "Product name is required" })}
                disabled={createMutation.isPending}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Product Type Selector */}
            <div className="space-y-2">
              <Label htmlFor="type">
                Product Type <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={createMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="simple">Simple Product</SelectItem>
                      <SelectItem value="variable">Variable Product</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief product description..."
                {...register("description")}
                disabled={createMutation.isPending}
                rows={4}
              />
            </div>

            {/* Simple Product Fields */}
            {productType === "simple" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="simple.base_price">
                    Base Price (₦) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="simple.base_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register("simple.base_price", {
                      required: "Base price is required for simple products",
                      valueAsNumber: true,
                    })}
                    disabled={createMutation.isPending}
                  />
                  {errors.simple?.base_price && (
                    <p className="text-sm text-red-500">
                      {errors.simple.base_price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="simple.sku">
                    SKU <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="simple.sku"
                    placeholder="e.g., TSH-BLU-001"
                    {...register("simple.sku", {
                      required: "SKU is required for simple products",
                    })}
                    disabled={createMutation.isPending}
                  />
                  {errors.simple?.sku && (
                    <p className="text-sm text-red-500">
                      {errors.simple.sku.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="simple.stock_quantity">Stock Quantity</Label>
                  <Input
                    id="simple.stock_quantity"
                    type="number"
                    min="0"
                    {...register("simple.stock_quantity", {
                      valueAsNumber: true,
                    })}
                    disabled={createMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="simple.re_order_level">Re-order Level</Label>
                  <Input
                    id="simple.re_order_level"
                    type="number"
                    min="0"
                    {...register("simple.re_order_level", {
                      valueAsNumber: true,
                    })}
                    disabled={createMutation.isPending}
                  />
                </div>
              </>
            )}

            {/* Variable Product - Variants Section */}
            {productType === "variable" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>
                    Variants <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    onClick={addNewVariant}
                    disabled={createMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Variant
                  </Button>
                </div>

                {/* Render each variant */}
                {fields.map((field, variantIndex) => (
                  <VariantCard
                    key={field.id}
                    variantIndex={variantIndex}
                    control={control}
                    register={register}
                    errors={errors}
                    onRemove={() => remove(variantIndex)}
                    isPending={createMutation.isPending}
                  />
                ))}

                {fields.length === 0 && (
                  <p className="text-sm text-red-500">
                    At least one variant required for variable products
                  </p>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center gap-4 pt-6">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/products")}
                disabled={createMutation.isPending}
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
 * Variant Card Component
 * Encapsulates the UI for a single product variant including:
 * - Basic fields (SKU, price, stock)
 * - Dynamic attribute key-value pairs
 */
type VariantCardProps = {
  variantIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  onRemove: () => void;
  isPending: boolean;
};

function VariantCard({
  variantIndex,
  control,
  register,
  errors,
  onRemove,
  isPending,
}: VariantCardProps) {
  // Manage the array of attribute key-value pairs for this variant
  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: `variants.${variantIndex}.attributePairs`,
  });

  return (
    <Card className="p-4">
      {/* Variant Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Variant {variantIndex + 1}</h4>
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
        {/* SKU Field */}
        <div className="space-y-2">
          <Label htmlFor={`variants.${variantIndex}.sku`}>
            SKU <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`variants.${variantIndex}.sku`}
            placeholder="e.g., TSH-RED-M"
            {...register(`variants.${variantIndex}.sku`, {
              required: "SKU is required",
            })}
            disabled={isPending}
          />
          {errors.variants?.[variantIndex]?.sku && (
            <p className="text-sm text-red-500">
              {errors.variants[variantIndex].sku.message}
            </p>
          )}
        </div>

        {/* Price Field */}
        <div className="space-y-2">
          <Label htmlFor={`variants.${variantIndex}.price`}>
            Price (₦) <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`variants.${variantIndex}.price`}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register(`variants.${variantIndex}.price`, {
              required: "Price is required",
              valueAsNumber: true,
            })}
            disabled={isPending}
          />
          {errors.variants?.[variantIndex]?.price && (
            <p className="text-sm text-red-500">
              {errors.variants[variantIndex].price.message}
            </p>
          )}
        </div>

        {/* Stock Quantity */}
        <div className="space-y-2">
          <Label htmlFor={`variants.${variantIndex}.stock_quantity`}>
            Stock Quantity
          </Label>
          <Input
            id={`variants.${variantIndex}.stock_quantity`}
            type="number"
            min="0"
            {...register(`variants.${variantIndex}.stock_quantity`, {
              valueAsNumber: true,
            })}
            disabled={isPending}
          />
        </div>

        {/* Re-order Level */}
        <div className="space-y-2">
          <Label htmlFor={`variants.${variantIndex}.re_order_level`}>
            Re-order Level
          </Label>
          <Input
            id={`variants.${variantIndex}.re_order_level`}
            type="number"
            min="0"
            {...register(`variants.${variantIndex}.re_order_level`, {
              valueAsNumber: true,
            })}
            disabled={isPending}
          />
        </div>

        {/* Dynamic Attributes Section */}
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

          {/* Render each attribute key-value pair */}
          {attributeFields.map((attrField, attrIndex) => (
            <div key={attrField.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  placeholder="Key (e.g., color)"
                  {...register(
                    `variants.${variantIndex}.attributePairs.${attrIndex}.key`,
                  )}
                  disabled={isPending}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Value (e.g., red)"
                  {...register(
                    `variants.${variantIndex}.attributePairs.${attrIndex}.value`,
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
              properties like color, size, etc.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
