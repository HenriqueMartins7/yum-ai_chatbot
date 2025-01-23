import { productListSchema } from "@/lib/schema"
import { stripe } from "@/lib/stripe"
import type Stripe from "stripe"

export async function getProducts(
  options: Pick<Stripe.ProductListParams, "limit"> = {
    limit: 6,
  },
) {
  const products = await stripe.products.list({
    limit: options.limit,
    active: true,
    expand: ["data.default_price"],
  })

  return productListSchema.parse({
    data: products.data.map((product) => {
      const price = 1//product.default_price as Stripe.Price
      const amount = 1//price.unit_amount ? price.unit_amount / 100 : 1

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        price: {
          id: price.id,
          amount,
          display_amount: amount?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
        },
      }
    }),
    has_more: products.has_more,
    starting_after: products.data[products.data.length - 1]?.id,
  })
}

