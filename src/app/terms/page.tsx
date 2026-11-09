import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "../components/legal/LegalPage";

export const metadata: Metadata = {
    title: "Terms of Use",
    description: "The rules for using Cybox.",
};

export default function TermsPage() {
    return (
        <LegalPage
            eyebrow="Legal"
            title="Terms of Use"
            intro={
                <p>
                    These terms are an agreement between you and <strong className="text-white">Adapto Software House Inc.</strong>
                    (&quot;Adapto&quot;, &quot;we&quot;), the company that builds and runs Cybox. By creating an account or using Cybox, you agree to them.
                </p>
            }
        >
            <LegalSection n={1} title="The service">
                <p>
                    Cybox helps teams organize assets by department (&quot;rooms&quot;), group them into categories, invite people with roles,
                    and estimate what each asset is worth over time using straight-line depreciation.
                </p>
            </LegalSection>

            <LegalSection n={2} title="Your account">
                <ul>
                    <li>You must give accurate information and keep your password safe.</li>
                    <li>You&apos;re responsible for what happens under your account.</li>
                    <li>If you use Cybox for an organization, you confirm you&apos;re allowed to accept these terms on its behalf.</li>
                </ul>
            </LegalSection>

            <LegalSection n={3} title="Rooms, roles and invites">
                <p>
                    The person who creates a room is its owner. Owners and admins can change the room&apos;s details and invite code; only the
                    owner can delete the room. Anyone with a valid invite code or link can join a room as a member, so share codes only with
                    people you trust and create a new code if one leaks.
                </p>
            </LegalSection>

            <LegalSection n={4} title="Your data">
                <p>
                    You own the information you put in Cybox. You give us permission to store and process it only to provide the service to
                    you and your team. How we handle personal information is described in our <Link href="/privacy">Privacy Policy</Link>.
                </p>
            </LegalSection>

            <LegalSection n={5} title="Values are estimates">
                <p>
                    Values shown in Cybox are calculated from the purchase price, purchase date and annual rate you enter. They are estimates
                    to help you organize and plan, <strong>not accounting, tax or financial advice</strong>. Check with a qualified professional
                    before relying on them for financial statements or tax filings.
                </p>
            </LegalSection>

            <LegalSection n={6} title="Acceptable use">
                <p>Don&apos;t use Cybox to:</p>
                <ul>
                    <li>break the law or infringe anyone&apos;s rights;</li>
                    <li>access rooms or accounts you weren&apos;t invited to;</li>
                    <li>interfere with the service, probe it for weaknesses or overload it;</li>
                    <li>store content that is unlawful or that you don&apos;t have the right to share.</li>
                </ul>
            </LegalSection>

            <LegalSection n={7} title="Plans and pricing">
                <p>
                    Prices for paid plans are listed on our website. The specific terms of a paid plan, including billing and cancellation,
                    will be presented to you before you subscribe.
                </p>
            </LegalSection>

            <LegalSection n={8} title="Demo mode">
                <p>
                    The demo uses sample data and is read-only. It&apos;s provided for evaluation and may change or be unavailable at any time.
                </p>
            </LegalSection>

            <LegalSection n={9} title="Availability and changes">
                <p>
                    We work to keep Cybox running smoothly, but the service is provided &quot;as is&quot;, without guarantees that it will
                    always be available or error-free. We may improve, change or discontinue features over time.
                </p>
            </LegalSection>

            <LegalSection n={10} title="Liability">
                <p>
                    To the extent the law allows, Adapto isn&apos;t liable for indirect or consequential losses, or for decisions made based on
                    values shown in Cybox. Nothing in these terms limits rights you have under consumer protection law that can&apos;t be limited.
                </p>
            </LegalSection>

            <LegalSection n={11} title="Ending your use">
                <p>
                    You can stop using Cybox at any time and ask us to delete your account. We may suspend accounts that break these terms or
                    put the service or other users at risk.
                </p>
            </LegalSection>

            <LegalSection n={12} title="Governing law and contact">
                <p>
                    These terms are governed by the laws of British Columbia and the federal laws of Canada that apply there. If we update them,
                    we&apos;ll change the date at the top of this page. Questions? Contact Adapto Software House Inc. at{" "}
                    <a href="mailto:contact@adapto-sh.com">contact@adapto-sh.com</a>.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
