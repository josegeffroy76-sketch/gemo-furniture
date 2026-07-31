import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "GEMO Furniture's 30-day return policy — free return shipping, full refund.",
};

const LIST = "list-disc space-y-1.5 pl-5";

export default function ReturnPolicyPage() {
  return (
    <LegalDocument title="Return Policy" lastUpdated="July 31, 2026">
      <LegalSection heading="1. 30-Day Returns">
        <p>
          We want you to be happy with your GEMO Furniture purchase. You may return most items
          within <strong>30 days of delivery</strong> for a full refund.
        </p>
      </LegalSection>

      <LegalSection heading="2. Return Eligibility">
        <p>To be eligible for a return, an item must be:</p>
        <ul className={LIST}>
          <li>Unused, unassembled (or reassembled to its original packaged condition), and free of damage</li>
          <li>In its original packaging, with all included parts, hardware, and accessories</li>
          <li>Returned within 30 days of the delivery date shown on your shipment tracking</li>
        </ul>
        <p>
          Items marked as final sale or clearance at the time of purchase are not eligible for
          return unless they arrive damaged or defective.
        </p>
      </LegalSection>

      <LegalSection heading="3. How to Start a Return">
        <p>
          Email us at{" "}
          <a href="mailto:hello@gemofurniture.com" className="text-brand-600 underline">
            hello@gemofurniture.com
          </a>{" "}
          with your order number and the item(s) you&apos;d like to return. We&apos;ll confirm
          your return and provide next steps.
        </p>
      </LegalSection>

      <LegalSection heading="4. Return Shipping">
        <p>
          GEMO covers the cost of return shipping for eligible returns started within the 30-day
          window. We will arrange pickup or provide a prepaid return label — please do not send
          an item back before we&apos;ve confirmed your return, so we can make sure it&apos;s
          shipped correctly.
        </p>
      </LegalSection>

      <LegalSection heading="5. Refunds">
        <p>
          Once we receive and inspect your returned item, we will issue a refund to your original
          payment method. Please allow 5–10 business days after we receive the return for the
          refund to appear, depending on your bank or card issuer.
        </p>
      </LegalSection>

      <LegalSection heading="6. Damaged or Defective Items">
        <p>
          If your item arrives damaged or defective, please contact us within 48 hours of
          delivery with photos of the damage and your order number. We will arrange a
          replacement or a full refund, including shipping costs, at no charge to you.
        </p>
      </LegalSection>

      <LegalSection heading="7. Exchanges">
        <p>
          We don&apos;t currently process direct exchanges. If you&apos;d like a different item,
          please start a return for the original item and place a new order for the item you
          want.
        </p>
      </LegalSection>

      <LegalSection heading="8. Questions">
        <p>
          Reach us anytime at{" "}
          <a href="mailto:hello@gemofurniture.com" className="text-brand-600 underline">
            hello@gemofurniture.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
