import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Payment Policy",
  description: "Accepted payment methods, billing, and sales tax at GEMO Furniture.",
};

const LIST = "list-disc space-y-1.5 pl-5";

export default function PaymentPolicyPage() {
  return (
    <LegalDocument title="Payment Policy" lastUpdated="July 31, 2026">
      <LegalSection heading="1. Accepted Payment Methods">
        <p>We accept the following payment methods, processed securely through Stripe:</p>
        <ul className={LIST}>
          <li>Credit and debit cards (Visa, Mastercard, American Express, and Discover)</li>
          <li>Apple Pay</li>
          <li>Google Pay</li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. Currency">
        <p>
          All prices on the Site are listed and charged in U.S. Dollars (USD).
        </p>
      </LegalSection>

      <LegalSection heading="3. Sales Tax">
        <p>
          We are required to collect sales tax on orders shipped to states where GEMO has a tax
          collection obligation, currently California. Sales tax is calculated automatically at
          checkout based on your shipping address and shown as a separate line item before you
          complete payment. As GEMO&apos;s obligations expand to other states, this may change —
          the tax shown at checkout will always reflect the current rate for your address.
        </p>
      </LegalSection>

      <LegalSection heading="4. Payment Security">
        <p>
          Payment processing is handled entirely by Stripe, a PCI Level 1 certified payment
          processor. GEMO does not receive or store your full card number, CVC, or bank account
          details on our own servers.
        </p>
      </LegalSection>

      <LegalSection heading="5. When You're Charged">
        <p>
          Your payment method is charged in full at the time you place your order, once payment
          is authorized and your order is confirmed.
        </p>
      </LegalSection>

      <LegalSection heading="6. Declined or Failed Payments">
        <p>
          If your payment is declined, your order will not be placed. Please check with your
          card issuer or try an alternative payment method. Contact us at hello@gemofurniture.com
          if you continue to have trouble completing a purchase.
        </p>
      </LegalSection>

      <LegalSection heading="7. Pricing Errors">
        <p>
          In the event a product is listed at an incorrect price due to a typographical or
          technical error, we reserve the right to cancel the affected order and issue a full
          refund, even if the order has already been confirmed.
        </p>
      </LegalSection>

      <LegalSection heading="8. Questions">
        <p>Reach us anytime at hello@gemofurniture.com.</p>
      </LegalSection>
    </LegalDocument>
  );
}
