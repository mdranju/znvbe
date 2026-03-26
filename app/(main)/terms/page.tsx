import { BackButton } from "@/components/common/BackButton";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton className="mb-" />
      <h1 className="text-3xl font-black text-gray-900 mb-8">
        Terms and Conditions
      </h1>

      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="mb-6">
          Welcome to Believers Sign. These terms and conditions outline the
          rules and regulations for the use of our website.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          1. Acceptance of Terms
        </h2>
        <p className="mb-6">
          By accessing this website, we assume you accept these terms and
          conditions. Do not continue to use Believers Sign if you do not agree
          to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          2. Privacy Policy
        </h2>
        <p className="mb-6">
          Please review our Privacy Policy, which also governs your visit to our
          website, to understand our practices.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          3. Products and Pricing
        </h2>
        <p className="mb-6">
          All products listed on the website, their descriptions, and their
          prices are subject to change. We reserve the right to modify, suspend,
          or discontinue the sale of any product at any time without notice.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          4. Orders and Payment
        </h2>
        <p className="mb-6">
          We reserve the right to refuse any order you place with us. We may, in
          our sole discretion, limit or cancel quantities purchased per person,
          per household, or per order.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          5. Shipping and Delivery
        </h2>
        <p className="mb-6">
          Shipping costs and delivery times vary depending on your location. We
          are not responsible for any delays caused by the shipping carrier.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          6. Returns and Refunds
        </h2>
        <p className="mb-6">
          Please refer to our Refund and Returned policy for detailed
          information on how to return products and request refunds.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          7. Intellectual Property
        </h2>
        <p className="mb-6">
          All content included on this site, such as text, graphics, logos,
          images, and software, is the property of Believers Sign or its content
          suppliers and protected by international copyright laws.
        </p>
      </div>
    </div>
  );
}
