import { BackButton } from "@/components/common/BackButton";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="relative h-[40vh] bg-[#0B1221] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/30 to-[#0B1221] opacity-80" />
        
        <div className="absolute top-8 left-8 z-20">
          <BackButton className="bg-white/10 text-white backdrop-blur-md border-white/10 hover:bg-white/20" />
        </div>

        <div className="relative z-10 text-center px-6 mt-12">
          <p className="text-rose-400 text-[10px] sm:text-xs font-black tracking-[0.5em] md:tracking-[0.8em] uppercase mb-4 md:mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Policies
          </p>
          <h1 className="hero-display text-4xl md:text-6xl text-white uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Refund Policy.
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 -mt-12 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="text-xl font-medium text-[#0B1221] leading-relaxed mb-12 pb-10 border-b border-gray-100">
              At Avlora Wear, we strive to ensure that you are completely satisfied with your purchase. If for any reason you are not satisfied, we offer a straightforward return and refund policy.
            </p>

            <div className="space-y-12">
              <section className="bg-rose-50/30 p-8 rounded-3xl border border-rose-100/50">
                <h2 className="text-lg font-black text-rose-600 uppercase tracking-widest mt-0 mb-6">1. Eligibility for Returns</h2>
                <p className="text-base mb-4 text-gray-700">To be eligible for a return, your item must be:</p>
                <ul className="list-none pl-0 space-y-3 m-0">
                  <li className="flex gap-3 items-start"><span className="text-rose-400 mt-1">✦</span> <span className="text-gray-700">Unused and in the same condition that you received it.</span></li>
                  <li className="flex gap-3 items-start"><span className="text-rose-400 mt-1">✦</span> <span className="text-gray-700">In the original packaging with all tags attached.</span></li>
                  <li className="flex gap-3 items-start"><span className="text-rose-400 mt-1">✦</span> <span className="text-gray-700">Returned within 7 days of the delivery date.</span></li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0B1221] mt-0 mb-4">2. Non-Returnable Items</h2>
                <p className="text-base mb-4 leading-loose">Several types of goods are exempt from being returned:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-gray-600">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">Perishable goods (food, flowers)</div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">Intimate or sanitary goods</div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">Hazardous materials or gases</div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">Gift cards & Software</div>
                </div>
              </section>

              <section className="border-l-4 border-gray-200 pl-6 my-8">
                <h2 className="text-xl font-bold text-[#0B1221] mt-0 mb-3">3. How to Initiate a Return</h2>
                <p className="text-base leading-loose m-0 text-gray-600">
                  Contact our customer service team at <a href="mailto:contact@avlorawear.com" className="text-blue-600 font-bold no-underline">contact@avlorawear.com</a> with your order number and details. We will respond quickly with instructions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0B1221] mt-0 mb-4">4. Refunds & Exchanges</h2>
                <div className="space-y-6 text-base leading-loose text-gray-600">
                  <p className="m-0">
                    Once your return is inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to the original method of payment automatically.
                  </p>
                  <p className="m-0">
                    <strong>Late Refunds:</strong> Check your bank account, contact your credit card company, then contact your bank. If still unresolved, email us.
                  </p>
                  <p className="m-0">
                    <strong>Exchanges:</strong> We only replace items if they are defective or damaged.
                  </p>
                </div>
              </section>

              <section className="bg-gray-900 text-white p-8 rounded-3xl">
                <h2 className="text-lg font-black text-white uppercase tracking-widest mt-0 mb-4">5. Shipping Costs</h2>
                <p className="text-sm leading-loose text-gray-300 m-0">
                  You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
