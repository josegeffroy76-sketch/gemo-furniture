import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GEMO Furniture collects, uses, and protects your personal information.",
};

const LIST = "list-disc space-y-1.5 pl-5";

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument title="Privacy Policy" lastUpdated="July 31, 2026">
      <LegalSection heading="1. Introduction">
        <p>
          This Privacy Policy explains how GEMO LLC, doing business as{" "}
          <strong>GEMO Furniture</strong> (&quot;GEMO,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;), collects, uses, discloses, and protects information when you visit
          gemofurniture.com or make a purchase from us (together, the &quot;Site&quot;). By using
          the Site, you agree to the collection and use of information in accordance with this
          policy.
        </p>
      </LegalSection>

      <LegalSection heading="2. Information We Collect">
        <p>
          <strong>Information you provide to us.</strong> When you place an order, create a
          review, or contact us, we may collect your name, email address, phone number, and
          shipping and billing address.
        </p>
        <p>
          <strong>Payment information.</strong> Payments are processed by Stripe, Inc. We do not
          collect or store your full card number, CVC, or bank account details on our own
          servers — Stripe handles that data directly under its own security standards and
          privacy policy.
        </p>
        <p>
          <strong>Information collected automatically.</strong> Like most websites, our hosting
          and infrastructure providers automatically log standard technical information such as
          IP address, browser type, device information, pages visited, and timestamps, for
          security and troubleshooting purposes.
        </p>
        <p>
          <strong>Cookies.</strong> The Site does not currently use advertising or analytics
          cookies. A single functional session cookie is used to keep GEMO staff signed in to
          the internal admin dashboard — it is not set for ordinary shoppers and does not track
          you across the web. If we add analytics or marketing cookies in the future, we will
          update this section first.
        </p>
      </LegalSection>

      <LegalSection heading="3. How We Use Your Information">
        <ul className={LIST}>
          <li>To process and fulfill your orders, including calculating shipping and sales tax</li>
          <li>To communicate with you about your order, including confirmations and shipment tracking</li>
          <li>To respond to customer service requests and questions</li>
          <li>To detect, investigate, and prevent fraud or abuse</li>
          <li>To improve the Site and the products and services we offer</li>
          <li>To comply with legal obligations, such as tax recordkeeping</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. How We Share Your Information">
        <p>
          We do not sell your personal information. We share information only with service
          providers who need it to help us run the Site and fulfill your order, including:
        </p>
        <ul className={LIST}>
          <li>
            <strong>Stripe</strong> — payment processing and sales tax calculation
          </li>
          <li>
            <strong>Shippo</strong> — calculating shipping rates and generating shipping labels
            with our carriers (USPS, UPS, and FedEx)
          </li>
          <li>
            <strong>Resend</strong> — sending transactional emails (e.g., review requests)
          </li>
          <li>
            <strong>Google</strong> — address autocomplete at checkout (Google Places API)
          </li>
          <li>
            <strong>Vercel and Upstash</strong> — website hosting and secure data storage
          </li>
        </ul>
        <p>
          We may also disclose information if required by law, or to protect the rights,
          property, or safety of GEMO, our customers, or others.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data Retention">
        <p>
          We retain order and customer information for as long as needed to fulfill the purposes
          described in this policy, including complying with tax, accounting, and legal record-
          keeping requirements.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your Privacy Rights">
        <p>
          Depending on where you live, you may have the right to request access to, correction
          of, or deletion of your personal information, or to opt out of certain uses of it.
        </p>
        <p>
          <strong>California residents.</strong> Under the California Consumer Privacy Act
          (CCPA), as amended by the CPRA, California residents have the right to know what
          personal information we collect, request deletion or correction of it, and opt out of
          the &quot;sale&quot; or &quot;sharing&quot; of personal information. GEMO does not sell
          or share personal information for cross-context behavioral advertising. To exercise
          any of these rights, contact us using the details below.
        </p>
      </LegalSection>

      <LegalSection heading="7. Children's Privacy">
        <p>
          The Site is not directed to children under 13, and we do not knowingly collect
          personal information from children under 13. If you believe a child has provided us
          with personal information, please contact us so we can delete it.
        </p>
      </LegalSection>

      <LegalSection heading="8. Security">
        <p>
          We use reasonable administrative and technical safeguards to protect your information.
          However, no method of transmission over the internet or electronic storage is 100%
          secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes take effect when posted
          to this page, and we will update the &quot;Last updated&quot; date above.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contact Us">
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
