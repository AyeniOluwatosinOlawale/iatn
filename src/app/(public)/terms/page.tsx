import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="nexora-gradient text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
          <p className="text-white/70 text-sm">Last updated: 1 July 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-8 text-gray-700">

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed">By accessing or using Nexora Academic (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. User Accounts</h2>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>You must provide accurate and truthful information when registering.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You may not create multiple accounts or impersonate another person.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Tutor Responsibilities</h2>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Tutors must provide truthful qualification and experience information.</li>
              <li>All uploaded documents must be genuine and belong to the registering tutor.</li>
              <li>Tutors must honour confirmed bookings or cancel with adequate notice.</li>
              <li>Tutors may not solicit students to pay outside the platform to avoid commission.</li>
              <li>Tutors must maintain professional conduct at all times.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. Student & Parent Responsibilities</h2>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Students and parents must treat tutors with respect.</li>
              <li>Bookings must be cancelled at least 24 hours in advance to avoid forfeiting payment.</li>
              <li>Reviews must be honest and based on genuine experiences.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">5. Payments & Refunds</h2>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>All payments are processed securely by Paystack in Nigerian Naira (NGN).</li>
              <li>Nexora Academic retains a platform commission on each booking.</li>
              <li>Refunds may be requested within 24 hours of a completed session if there is a genuine dispute.</li>
              <li>Refund decisions are at the sole discretion of Nexora Academic after review.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">6. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">All platform content, branding, and code is the intellectual property of Nexora Academic. Resources uploaded by tutors remain their property, but by uploading you grant Nexora a non-exclusive licence to display and distribute them on the platform.</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">7. Prohibited Conduct</h2>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Uploading false qualifications or fraudulent documents.</li>
              <li>Harassment, discrimination, or abusive behaviour toward other users.</li>
              <li>Attempting to circumvent platform payments.</li>
              <li>Scraping platform data or reverse-engineering our systems.</li>
              <li>Posting spam, misleading listings, or false reviews.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">Nexora Academic is a marketplace connecting tutors with students and does not guarantee specific academic outcomes. We are not liable for the quality of tuition or for disputes between users beyond facilitating the dispute resolution process.</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">9. Changes to Terms</h2>
            <p className="text-sm leading-relaxed">We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify registered users of significant changes via email.</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">10. Governing Law</h2>
            <p className="text-sm leading-relaxed">These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved under Nigerian jurisdiction.</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">11. Contact</h2>
            <p className="text-sm leading-relaxed">Questions about these Terms? Email us at <a href="mailto:hello@nexora.com" className="text-blue-600">hello@nexora.com</a>.</p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
