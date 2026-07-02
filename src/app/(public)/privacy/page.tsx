import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="nexora-gradient text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
          <p className="text-white/70 text-sm">Last updated: 1 July 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 prose prose-gray max-w-none">
        <div className="space-y-8 text-gray-700">

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Introduction</h2>
            <p className="text-sm leading-relaxed">Nexora Academic (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard data when you use our platform at nexora-academic.vercel.app.</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Information We Collect</h2>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li><strong>Account data:</strong> Name, email address, phone number, and password when you register.</li>
              <li><strong>Profile data:</strong> For tutors — qualifications, subjects, teaching experience, documents uploaded for verification.</li>
              <li><strong>Usage data:</strong> Pages visited, searches performed, bookings made, and session duration.</li>
              <li><strong>Payment data:</strong> Processed securely by Paystack. We do not store card details.</li>
              <li><strong>Communications:</strong> Messages sent between users through our platform messaging system.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>To operate and improve the Nexora Academic platform.</li>
              <li>To verify tutor identities and qualifications.</li>
              <li>To match students with suitable tutors using our AI recommendation system.</li>
              <li>To process bookings and payments.</li>
              <li>To send service-related communications (confirmations, reminders, support).</li>
              <li>To generate anonymised analytics about platform usage.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. Data Sharing</h2>
            <p className="text-sm leading-relaxed mb-2">We do not sell your personal data. We share data only with:</p>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li><strong>Supabase</strong> — our secure database and authentication provider.</li>
              <li><strong>Paystack</strong> — for payment processing.</li>
              <li><strong>Resend</strong> — for transactional email delivery.</li>
              <li><strong>Anthropic (Claude API)</strong> — for AI-powered tutor matching and profile summaries. No personally identifiable data is sent.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">5. Data Retention</h2>
            <p className="text-sm leading-relaxed">We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by emailing <a href="mailto:hello@nexora.com" className="text-blue-600">hello@nexora.com</a>.</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">6. Your Rights</h2>
            <p className="text-sm leading-relaxed mb-2">Under applicable Nigerian and international data protection law, you have the right to:</p>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Object to certain processing of your data.</li>
              <li>Data portability (receive your data in a machine-readable format).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">7. Security</h2>
            <p className="text-sm leading-relaxed">We use industry-standard encryption, secure hosting on Vercel and Supabase, and row-level security policies to protect your data. All passwords are hashed and never stored in plain text.</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">8. Cookies</h2>
            <p className="text-sm leading-relaxed">We use essential session cookies to keep you logged in, and analytics cookies to understand how the platform is used. You may disable cookies in your browser settings, though some features may not function correctly.</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-3">9. Contact</h2>
            <p className="text-sm leading-relaxed">For any privacy-related enquiries, contact our Data Protection Officer at <a href="mailto:hello@nexora.com" className="text-blue-600">hello@nexora.com</a>.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
