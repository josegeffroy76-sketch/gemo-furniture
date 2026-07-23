import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrderById, updateOrder } from "@/lib/orders-store";
import { getProductById } from "@/lib/products";
import { createShippingLabel } from "@/lib/shippo";
import type { Address, Product } from "@/lib/types";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.label?.url) {
    return NextResponse.json({ label: order.label });
  }

  const a = order.shippingAddress;
  if (!a?.line1 || !a.city || !a.state || !a.postalCode) {
    return NextResponse.json(
      {
        error:
          "This order doesn't have a complete saved address to ship to. Create the label manually in your Shippo dashboard using the address shown here.",
      },
      { status: 400 }
    );
  }
  if (order.lines.length === 0) {
    return NextResponse.json(
      {
        error:
          "This order doesn't have enough saved item info to build a shipping box automatically (it may predate this feature). Create the label manually in your Shippo dashboard.",
      },
      { status: 400 }
    );
  }

  const destination: Address = {
    name: order.customerName ?? "Customer",
    street1: a.line1,
    street2: a.line2 ?? undefined,
    city: a.city,
    state: a.state,
    zip: a.postalCode,
    country: a.country ?? "US",
    email: order.customerEmail ?? undefined,
  };

  const resolved = await Promise.all(
    order.lines.map(async (line) => {
      const product = await getProductById(line.productId);
      return product ? { product, quantity: line.quantity } : null;
    })
  );
  const items = resolved.filter((x): x is { product: Product; quantity: number } => x !== null);

  if (items.length === 0) {
    return NextResponse.json(
      {
        error:
          "None of this order's products still exist in the catalog, so a real box size can't be built automatically. Create the label manually in your Shippo dashboard using the address shown here.",
      },
      { status: 400 }
    );
  }

  try {
    const purchased = await createShippingLabel(destination, items, {
      carrier: order.shippingCarrier,
      serviceLevel: order.shippingServiceLevel,
    });

    const label = {
      url: purchased.url,
      trackingNumber: purchased.trackingNumber,
      trackingUrlProvider: purchased.trackingUrlProvider,
      carrier: purchased.carrier,
      serviceLevel: purchased.serviceLevel,
      createdAt: new Date().toISOString(),
    };

    await updateOrder(order.id, { label });

    return NextResponse.json({
      label,
      priceMismatch: !purchased.matchedExactly
        ? {
            originalCarrier: order.shippingCarrier,
            originalServiceLevel: order.shippingServiceLevel,
            purchasedAmount: purchased.amount,
          }
        : null,
    });
  } catch (err) {
    console.error("Label purchase error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Couldn't generate the label. Please try again." },
      { status: 502 }
    );
  }
}
