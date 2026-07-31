import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "GEMO Furniture's 30-day return policy — return shipping and refund details.",
};

const LIST = "list-disc space-y-1.5 pl-5";

export default function ReturnPolicyPage() {
  return (
    <LegalDocument title="Return Policy" lastUpdated="July 31, 2026">
      <LegalSection heading="1. 30-Day Returns">
        <p>
          We want you to be happy with your GEMO Furniture purchase. You may return most items
          within <strong>30 days of delivery</strong>. Whether return shipping is free depends on
          the reason for the return — see &quot;Return Shipping&quot; below.
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
        <p>Whether return shipping is free depends on the reason for the return:</p>
        <ul className={LIST}>
          <li>
            <strong>Our error — free return shipping.</strong> If you receive an item that is
            different from what you ordered, or your order arrives with missing pieces, parts,
            or hardware, GEMO covers the full cost of return shipping. We will arrange pickup or
            provide a prepaid return label at no cost to you.
          </li>
          <li>
            <strong>Any other reason — return shipping is at your cost.</strong> For returns not
            caused by a GEMO error (for example, you changed your mind, the item doesn&apos;t fit
            your space, or you simply no longer want it), you are responsible for the cost of
            shipping the item back to us. We can provide a prepaid label and deduct its cost from
            your refund, or you may arrange your own return shipping.
          </li>
        </ul>
        <p>
          Please contact us before sending anything back so we can confirm your return and the
          shipping arrangement that applies.
        </p>
      </LegalSection>

      <LegalSection heading="5. Refunds">
        <p>
          Once we receive and inspect your returned item, we will issue a refund to your original
          payment method for the price paid for the item. If return shipping was your
          responsibility and we provided a prepaid label, its cost will be deducted from your
          refund. Please allow 5–10 business days after we receive the return for the refund to
          appear, depending on your bank or card issuer.
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
