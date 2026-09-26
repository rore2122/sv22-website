import type { Metadata } from "next";
import { LegalShell } from "@/components/layout/LegalShell";
import { INSTAGRAM_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SV22 collects, uses, and protects the information you share through the booking form.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "26 September 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalShell eyebrow="SV22 / LEGAL" title="Privacy Policy." updated={UPDATED}>
      <h2>Overview</h2>
      <p>
        This Privacy Policy explains what information SV22 (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, &ldquo;SV22&rdquo;) collects through this website,
        why we collect it, and how it is used. It applies to
        streetvideographer.sv22.workers.dev and any pages that link back to
        this policy.
      </p>

      <h2>Information we collect</h2>
      <p>
        The only personal information this website actively collects is what
        you choose to submit through the booking form (&ldquo;Start Your
        Booking&rdquo;). That form asks for:
      </p>
      <ul>
        <li>Your name</li>
        <li>Your phone number</li>
        <li>Your preferred event date</li>
        <li>Your event address / location</li>
        <li>Any requirements or notes you add about the shoot</li>
      </ul>
      <p>
        We do not ask for payment details, government ID, or other sensitive
        information through this website.
      </p>

      <h2>How the booking form actually works</h2>
      <p>
        When you submit the booking form, this website does not send your
        details to an SV22 server or database. Instead, it opens WhatsApp
        with a pre-filled message containing the details you entered, ready
        for you to review and send from your own WhatsApp account. Your
        information is only received by SV22 once you choose to send that
        message. From that point on, the conversation and any information in
        it is handled within WhatsApp, which is operated by Meta and governed
        by{" "}
        <a
          href="https://www.whatsapp.com/legal/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp&apos;s own privacy policy
        </a>
        .
      </p>

      <h2>Why we collect this information</h2>
      <p>We use the details you share with us to:</p>
      <ul>
        <li>Understand your booking request and respond to it</li>
        <li>Confirm availability, timing, and location for your shoot</li>
        <li>
          Communicate with you before, during, and after your booking
          regarding the service you&apos;ve requested
        </li>
      </ul>
      <p>
        We do not use the information you submit for advertising, and we do
        not sell or rent it to third parties.
      </p>

      <h2>How your information is stored</h2>
      <p>
        Because booking details are sent to us as a WhatsApp message rather
        than through a website database, they are stored within WhatsApp on
        the devices and accounts involved in that conversation, subject to
        WhatsApp&apos;s own storage and security practices. This website
        itself does not maintain a customer database.
      </p>

      <h2>Hosting-level information</h2>
      <p>
        This site is hosted on Cloudflare&apos;s infrastructure. Like most
        hosting providers, Cloudflare may automatically log basic technical
        information for every visitor — such as IP address, browser type,
        and request timestamps — for the purpose of running, securing, and
        monitoring the website. This is standard infrastructure-level
        logging, not something SV22 configures or accesses individually.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        This website does not currently use cookies for tracking, and no
        third-party analytics or advertising scripts (such as Google
        Analytics or Meta Pixel) are integrated into the site at this time.
        If that changes in the future — for example, to add privacy-respecting
        analytics to understand site usage — this policy will be updated to
        reflect it before any such tool goes live.
      </p>

      <h2>Third-party sharing</h2>
      <p>
        We do not share the information you submit with third-party
        marketing or data companies. The only &ldquo;third party&rdquo;
        involved in the booking process is WhatsApp itself, since it is the
        channel you use to actually send us your request. Links to our
        Instagram profile are provided for your convenience and are governed
        by Instagram&apos;s own privacy policy once you leave this site.
      </p>

      <h2>Data security</h2>
      <p>
        We take reasonable care to keep the systems behind this website
        secure. Because booking information travels through WhatsApp rather
        than a custom backend, its security in transit and at rest is
        primarily governed by WhatsApp&apos;s own encryption and security
        practices.
      </p>

      <h2>Your rights and requests</h2>
      <p>
        You can ask us what information we hold about you from your booking
        conversations, ask us to delete it from our side of that
        conversation, or ask us not to contact you again. To make a request,
        message SV22 on WhatsApp or via{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>{" "}
        and we will respond as soon as we can.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        This website and SV22&apos;s services are intended for adults booking
        videography services and are not directed at children. We do not
        knowingly collect information from children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time as the website or
        our practices change. The &ldquo;Last updated&rdquo; date at the top
        of this page reflects the most recent revision.
      </p>

      <h2>Contact us</h2>
      <p>
        For any privacy-related question or request, reach out to SV22 on
        WhatsApp via the booking form on this site, or message us on{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        .
      </p>
    </LegalShell>
  );
}
