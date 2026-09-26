import type { Metadata } from "next";
import { LegalShell } from "@/components/layout/LegalShell";
import { INSTAGRAM_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply when you book cinematic event or automotive videography services with SV22.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "26 September 2026";

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="SV22 / LEGAL"
      title="Terms & Conditions."
      updated={UPDATED}
    >
      <h2>Introduction</h2>
      <p>
        These Terms & Conditions (&ldquo;Terms&rdquo;) govern your use of the
        SV22 website and any videography services you book with SV22
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;SV22&rdquo;). By
        submitting a booking request or engaging our services, you agree to
        these Terms.
      </p>

      <h2>Booking requests</h2>
      <p>
        Booking requests are made through the &ldquo;Start Your Booking&rdquo;
        form on this website, which opens a pre-filled WhatsApp message for
        you to send to SV22, or by messaging us directly on WhatsApp or
        Instagram. A booking request is not a confirmed booking — it is the
        start of a conversation in which we confirm details with you
        directly.
      </p>

      <h2>Booking confirmation & availability</h2>
      <p>
        A booking is only confirmed once SV22 has explicitly confirmed it
        with you (for example, via WhatsApp message). Submitting the booking
        form does not guarantee availability for your requested date or
        location. We recommend reaching out as early as possible, especially
        during busier periods.
      </p>

      <h2>Payment & deposit terms</h2>
      <p>
        Pricing, deposit requirements, and payment terms are discussed and
        agreed directly with you at the time of booking, and are not
        processed through this website. Any deposit or payment terms will be
        communicated to you clearly before your booking is confirmed.
      </p>

      <h2>Cancellation</h2>
      <p>
        If you need to cancel a confirmed booking, please let us know as soon
        as possible via WhatsApp or Instagram. Any cancellation terms
        (including whether a deposit is refundable) will be as agreed with
        you individually at the time of booking.
      </p>

      <h2>Rescheduling & event postponement</h2>
      <p>
        If your event date changes or is postponed, contact SV22 as soon as
        possible. We will do our best to accommodate a new date, but
        rescheduling is subject to our availability and cannot be guaranteed.
      </p>

      <h2>Client responsibilities</h2>
      <p>By booking with SV22, you agree to:</p>
      <ul>
        <li>
          Provide accurate information in your booking request (name, phone
          number, date, address, and requirements)
        </li>
        <li>
          Respond promptly to confirm details so we can plan the shoot
          properly
        </li>
        <li>
          Ensure SV22 has safe, reasonable access to the agreed event
          location
        </li>
      </ul>

      <h2>Event-day requirements</h2>
      <p>
        Please share any specific access, timing, or venue requirements
        ahead of your event so SV22 can plan accordingly. Delays or access
        issues on the day that are outside SV22&apos;s control may affect
        what can be captured.
      </p>

      <h2>Service limitations</h2>
      <p>
        SV22 films are shot entirely on iPhone as part of our signature
        style. While we take every care to deliver a premium cinematic
        result, outcomes can be affected by factors outside our control,
        including but not limited to weather, lighting conditions, venue
        restrictions, and time constraints on the day.
      </p>

      <h2>Reel / video delivery</h2>
      <p>
        Delivery timelines depend on the scope of your booking and will be
        discussed and agreed with you directly after your shoot. We aim to
        keep you informed of progress if a delivery is taking longer than
        expected.
      </p>

      <h2>Revision requests</h2>
      <p>
        If you&apos;d like changes to your delivered reel, get in touch with
        us via WhatsApp or Instagram. Revisions are handled on a
        case-by-case basis and any limits on the number of revisions
        included will be communicated to you at the time of booking.
      </p>

      <h2>Music & audio</h2>
      <p>
        If you request a specific song or audio track, we will let you know
        whether it can be used, taking into account platform requirements
        and music licensing considerations. Where a requested track cannot
        be used, we will discuss suitable alternatives with you.
      </p>

      <h2>Client-provided content</h2>
      <p>
        If you provide SV22 with any photos, footage, music, or other
        materials to include in your film, you confirm that you have the
        right to share and use that material, and you grant SV22 permission
        to use it solely for producing your booked film.
      </p>

      <h2>Ownership & intellectual property</h2>
      <p>
        SV22 retains ownership of the raw and edited footage it creates.
        Once delivered, you receive a personal license to use, share, and
        post your final reel for personal (non-commercial) purposes unless
        otherwise agreed in writing.
      </p>

      <h2>Portfolio & social media usage</h2>
      <p>
        Unless you tell us otherwise, SV22 may use stills and clips from
        completed work in our portfolio, website, and social media
        (including Instagram) to showcase our services. If you would prefer
        your film not be used this way, let us know when booking, or at any
        point afterward, and we will respect that request going forward.
      </p>

      <h2>Third-party platform limitations</h2>
      <p>
        Where your film is shared or delivered via third-party platforms
        (such as WhatsApp, Instagram, or a cloud file-sharing service),
        SV22 is not responsible for outages, compression, formatting changes,
        or content policies applied by those platforms.
      </p>

      <h2>Force majeure</h2>
      <p>
        SV22 is not liable for any failure or delay in performing our
        services where that failure or delay results from circumstances
        beyond our reasonable control, including but not limited to extreme
        weather, natural disasters, illness, accidents, or government
        restrictions.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, SV22&apos;s liability for
        any claim arising from our services is limited to the amount you
        paid for the specific booking in question. SV22 is not liable for
        indirect, incidental, or consequential losses.
      </p>

      <h2>Changes to services or these Terms</h2>
      <p>
        We may update these Terms or the services we offer from time to
        time. The &ldquo;Last updated&rdquo; date at the top of this page
        reflects the most recent revision. Continuing to use our services
        after changes are posted means you accept the updated Terms.
      </p>

      <h2>Contact</h2>
      <p>
        For any questions about these Terms, message SV22 via the booking
        form on this site or on{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        .
      </p>
    </LegalShell>
  );
}
