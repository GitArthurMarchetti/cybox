import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "../components/legal/LegalPage";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "What Cybox collects, why, and the choices you have.",
};

export default function PrivacyPage() {
    return (
        <LegalPage
            eyebrow="Legal"
            title="Privacy Policy"
            intro={
                <p>
                    Cybox is built and operated by <strong className="text-white">Adapto Software House Inc.</strong> (&quot;Adapto&quot;, &quot;we&quot;),
                    based in Vancouver, British Columbia, Canada. This policy explains what we collect when you use Cybox, why we collect it, and
                    what you can do about it. We handle personal information in line with Canada&apos;s Personal Information Protection and
                    Electronic Documents Act (PIPEDA).
                </p>
            }
        >
            <LegalSection n={1} title="What we collect">
                <ul>
                    <li><strong>Account details:</strong> your name, email address and password. Passwords are stored only as a one-way hash, never in plain text.</li>
                    <li><strong>Google sign-in:</strong> if you choose &quot;Continue with Google&quot;, we receive your Google account ID, name and email address from Google.</li>
                    <li><strong>Account activity:</strong> when you last logged in, failed login attempts (to protect your account from guessing attacks) and whether your email is confirmed.</li>
                    <li><strong>What you put in Cybox:</strong> rooms, categories and assets, including names, descriptions, locations, codes, purchase prices, purchase dates and depreciation rates.</li>
                    <li><strong>Team information:</strong> who belongs to each room, their role, and the email addresses you send invites to.</li>
                </ul>
            </LegalSection>

            <LegalSection n={2} title="How we use it">
                <ul>
                    <li>To run the service: sign you in, show your rooms and calculate what your assets are worth.</li>
                    <li>To send the emails the service needs: email confirmation, room invites and password resets.</li>
                    <li>To keep accounts secure, for example by temporarily locking sign-in after repeated failed attempts.</li>
                </ul>
                <p>We don&apos;t sell your information, and we don&apos;t use it for advertising.</p>
            </LegalSection>

            <LegalSection n={3} title="Cookies and browser storage">
                <p>
                    Cybox uses one essential cookie to keep you signed in. We don&apos;t use analytics, advertising or tracking cookies.
                    The demo mode also stores a small flag in your browser&apos;s session storage so the welcome message only shows once.
                </p>
            </LegalSection>

            <LegalSection n={4} title="Who we share it with">
                <p>We share information only with the providers we need to run Cybox, and only for that purpose:</p>
                <ul>
                    <li>our hosting and database providers, which store the service and its data;</li>
                    <li>our email provider, which delivers confirmation, invite and password reset emails;</li>
                    <li>Google, if you choose to sign in with Google.</li>
                </ul>
                <p>
                    People in a room can see that room&apos;s assets and the name and email of its other members. We may also disclose
                    information when the law requires it.
                </p>
            </LegalSection>

            <LegalSection n={5} title="How long we keep it">
                <p>
                    We keep your information while your account is active. When you delete a room, category or asset, it is hidden from
                    everyone straight away and marked as deleted in our database. If you want your account or any of this data permanently
                    erased, email us and we&apos;ll take care of it.
                </p>
            </LegalSection>

            <LegalSection n={6} title="Your choices and rights">
                <ul>
                    <li>You can update your name, email and password in your account settings at any time.</li>
                    <li>You can ask us for a copy of your personal information, to correct it, or to delete it.</li>
                    <li>You can withdraw consent by closing your account, though we may keep what the law requires us to keep.</li>
                </ul>
            </LegalSection>

            <LegalSection n={7} title="Demo mode">
                <p>
                    The demo lets you explore Cybox with sample data and no account. Nothing you do in the demo is saved, and the demo
                    doesn&apos;t ask for any personal information.
                </p>
            </LegalSection>

            <LegalSection n={8} title="Security">
                <p>
                    We use reasonable safeguards to protect your information, including hashed passwords, encrypted connections and
                    access checks on every room. No system is perfectly secure, so please use a strong, unique password.
                </p>
            </LegalSection>

            <LegalSection n={9} title="Changes and contact">
                <p>
                    If we change this policy, we&apos;ll update the date at the top of this page. For any privacy question or request, contact
                    Adapto Software House Inc. at <a href="mailto:contact@adapto-sh.com">contact@adapto-sh.com</a>. See also our{" "}
                    <Link href="/terms">Terms of Use</Link>.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
