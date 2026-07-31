import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Where GEMO Furniture ships, how rates are calculated, and delivery timelines.",
};

const LIST = "list-disc space-y-1.5 pl-5";

export default function ShippingPolicyPage() {
  return (
    <LegalDocument title="Shipping Policy" lastUpdated="July 31, 2026">
      <LegalSection heading="1. Where We Ship">
        <p>
          We currently ship to addresses within the United States only. We do not offer
          international shipping at this time.
        </p>
      </LegalSection>

      <LegalSection heading="2. Carriers">
        <p>
          Orders ship via USPS, UPS, or FedEx — whichever carrier offers the best available rate
          and service for your address and item at checkout. All shipments leave from our
          warehouse in Orange, California.
        </p>
      </LegalSection>

      <LegalSection heading="3. Shipping Rates and Delivery Estimates">
        <p>
          Shipping costs are calculated in real time at checkout based on your delivery address
          and the items in your cart, and are shown before you complete your purchase. Estimated
          delivery times vary by carrier and shipping method and are also shown at checkout;
          most orders ship within 1–3 business days of being placed, with delivery afterward
          depending on the carrier and destination.
        </p>
      </LegalSection>

      <LegalSection heading="4. Sales Tax">
        <p>
          Applicable sales tax is calculated at checkout based on your shipping address. See our{" "}
          <a href="/payment-policy" className="text-brand-600 underline">
            Payment Policy
          </a>{" "}
          for details.
        </p>
      </LegalSection>

      <LegalSection heading="5. Order Tracking">
        <p>
          Once your order ships, we will provide tracking information so you can follow its
          progress. If you haven&apos;t received tracking details and would like an update,
          contact us at hello@gemofurniture.com with your order number.
        </p>
      </LegalSection>

      <LegalSection heading="6. Shipping Address Accuracy">
        <p>
          Please double-check your shipping address at checkout. We are not responsible for
          delays or non-delivery caused by an incorrect or incomplete address provided at
          checkout, though we&apos;ll do our best to help resolve the issue with the carrier.
        </p>
      </LegalSection>

      <LegalSection heading="7. Lost or Damaged in Transit">
        <p>
          If your package is lost or arrives damaged, contact us within 48 hours of the expected
          or actual delivery date at hello@gemofurniture.com with your order number (and photos,
          for damage). We&apos;ll work with the carrier and make it right with a replacement or
          refund.
        </p>
        <ul className={LIST}>
          <li>See our Return Policy for how refunds for damaged items are processed</li>
        </ul>
      </LegalSection>

      <LegalSection heading="8. Questions">
        <p>Reach us anytime at hello@gemofurniture.com.</p>
      </LegalSection>
    </LegalDocument>
  );
}
