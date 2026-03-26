import { BackButton } from "@/components/common/BackButton";

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton className="mb-" />
      <h1 className="text-3xl font-black text-gray-900 mb-8">
        Refund and Returned
      </h1>

      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="mb-6">
          At Believers Sign, we strive to ensure that you are completely
          satisfied with your purchase. If for any reason you are not satisfied,
          we offer a straightforward return and refund policy.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          1. Eligibility for Returns
        </h2>
        <p className="mb-4">To be eligible for a return, your item must be:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Unused and in the same condition that you received it.</li>
          <li>In the original packaging with all tags attached.</li>
          <li>Returned within 7 days of the delivery date.</li>
        </ul>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          2. Non-Returnable Items
        </h2>
        <p className="mb-4">
          Several types of goods are exempt from being returned:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Perishable goods such as food or flowers.</li>
          <li>Intimate or sanitary goods.</li>
          <li>Hazardous materials, or flammable liquids or gases.</li>
          <li>Gift cards.</li>
          <li>Downloadable software products.</li>
          <li>Some health and personal care items.</li>
        </ul>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          3. How to Initiate a Return
        </h2>
        <p className="mb-6">
          To initiate a return, please contact our customer service team at
          cc.believerssign@gmail.com with your order number and details about
          the product you would like to return. We will respond quickly with
          instructions for how to return items from your order.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">4. Refunds</h2>
        <p className="mb-6">
          Once your return is received and inspected, we will send you an email
          to notify you that we have received your returned item. We will also
          notify you of the approval or rejection of your refund. If you are
          approved, then your refund will be processed, and a credit will
          automatically be applied to your credit card or original method of
          payment, within a certain amount of days.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          5. Late or Missing Refunds
        </h2>
        <p className="mb-6">
          If you haven’t received a refund yet, first check your bank account
          again. Then contact your credit card company, it may take some time
          before your refund is officially posted. Next contact your bank. There
          is often some processing time before a refund is posted. If you’ve
          done all of this and you still have not received your refund yet,
          please contact us at cc.believerssign@gmail.com.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          6. Exchanges
        </h2>
        <p className="mb-6">
          We only replace items if they are defective or damaged. If you need to
          exchange it for the same item, send us an email at
          cc.believerssign@gmail.com.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">
          7. Shipping Costs
        </h2>
        <p className="mb-6">
          You will be responsible for paying for your own shipping costs for
          returning your item. Shipping costs are non-refundable. If you receive
          a refund, the cost of return shipping will be deducted from your
          refund.
        </p>
      </div>
    </div>
  );
}
