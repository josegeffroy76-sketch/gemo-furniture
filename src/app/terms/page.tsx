import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, LegalSection } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions that govern your use of gemofurniture.com.",
};

const LIST = "list-disc space-y-1.5 pl-5";

export default function TermsPage() {
  return (
    <LegalDocument title="Terms & Conditions" lastUpdated="July 31, 2026">
      <LegalSection heading="1. Agreement to Terms">
        <p>
          These Terms & Conditions (&quot;Terms&quot;) form a binding agreement between you and
          GEMO LLC, doing business as <strong>GEMO Furniture</strong> (&quot;GEMO,&quot;
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), governing your use of
          gemofurniture.com and any purchase you make from us (together, the &quot;Site&quot;).
          By using the Site or placing an order, you agree to these Terms. If you do not agree,
          please do not use the Site.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility">
        <p>
          You must be at least 18 years old, or the age of majority in your jurisdiction, and
          able to form a binding contract, to place an order on the Site.
        </p>
      </LegalSection>

      <LegalSection heading="3. Products and Pricing">
        <p>
          All prices are listed in U.S. Dollars and are subject to change without notice.
          Applicable sales tax is calculated at checkout based on your shipping address (see our{" "}
          <Link href="/payment-policy" className="text-brand-600 underline">
            Payment Policy
          </Link>
          ). We make reasonable efforts to display accurate product information, pricing, and
          images, but colors, dimensions, and finishes may vary slightly from what is shown due
          to display settings, lighting, and manufacturing variation.
        </p>
      </LegalSection>

      <LegalSection heading="4. Orders">
        <p>
          When you place an order, you are making an offer to purchase the item(s) in your cart.
          We reserve the right to refuse, cancel, or limit any order for any reason, including
          suspected fraud, pricing or listing errors, or unavailable inventory. If we cancel an
          order after payment has been charged, we will issue a full refund to your original
          payment method.
        </p>
      </LegalSection>

      <LegalSection heading="5. Payment">
        <p>
          Payments are processed securely through Stripe. See our{" "}
          <Link href="/payment-policy" className="text-brand-600 underline">
            Payment Policy
          </Link>{" "}
          for accepted payment methods and billing details.
        </p>
      </LegalSection>

      <LegalSection heading="6. Shipping">
        <p>
          We currently ship within the United States only. See our{" "}
          <Link href="/shipping" className="text-brand-600 underline">
            Shipping Policy
          </Link>{" "}
          for carriers, rates, and estimated delivery times.
        </p>
      </LegalSection>

      <LegalSection heading="7. Returns and Refunds">
        <p>
          We want you to love your furniture. See our{" "}
          <Link href="/returns" className="text-brand-600 underline">
            Return Policy
          </Link>{" "}
          for our 30-day return window and how refunds are handled.
        </p>
      </LegalSection>

      <LegalSection heading="8. Intellectual Property">
        <p>
          All content on the Site — including text, graphics, logos, product photography, and
          the GEMO Furniture name and branding — is owned by or licensed to GEMO and is
          protected by copyright and trademark law. You may not copy, reproduce, or use it
          without our prior written permission.
        </p>
      </LegalSection>

      <LegalSection heading="9. Customer Reviews and Content">
        <p>
          If you submit a review or other content to the Site, you grant GEMO a non-exclusive,
          royalty-free, worldwide license to use, display, and reproduce that content in
          connection with operating and promoting the Site. Please do not submit content that is
          false, defamatory, or infringes on someone else&apos;s rights — we reserve the right to
          remove any content at our discretion.
        </p>
      </LegalSection>

      <LegalSection heading="10. Prohibited Uses">
        <p>You agree not to:</p>
        <ul className={LIST}>
          <li>Use the Site for any unlawful purpose or in violation of these Terms</li>
          <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
          <li>Interfere with or disrupt the Site&apos;s operation or security features</li>
          <li>Use automated means (bots, scrapers) to access the Site without our permission</li>
        </ul>
      </LegalSection>

      <LegalSection heading="11. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, GEMO shall not be liable for any indirect,
          incidental, special, or consequential damages arising from your use of the Site or
          purchase of our products. Our total liability for any claim relating to an order will
          not exceed the amount you paid for that order.
        </p>
      </LegalSection>

      <LegalSection heading="12. Indemnification">
        <p>
          You agree to indemnify and hold GEMO harmless from any claims, damages, or expenses
          arising from your violation of these Terms or your misuse of the Site.
        </p>
      </LegalSection>

      <LegalSection heading="13. Governing Law">
        <p>
          These Terms are governed by the laws of the State of California, without regard to its
          conflict-of-law principles, and any dispute arising from these Terms or the Site will
          be resolved in the state or federal courts located in California, unless applicable
          consumer protection law provides otherwise.
        </p>
      </LegalSection>

      <LegalSection heading="14. Changes to These Terms">
        <p>
          We may update these Terms from time to time. Continued use of the Site after changes
          are posted constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection heading="15. Contact Us">
        <p>
          GEMO LLC (d/b/a GEMO Furniture)
          <br />
          1063 N Glassell St, Orange, CA 92867
          <br />
          Email: hello@gemofurniture.com
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
