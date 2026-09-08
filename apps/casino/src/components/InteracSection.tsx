export function InteracSection() {
  return (
    <section className="bg-[#0d1221] border-y border-gray-800 py-16" id="interac">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge badge-blue mb-4 inline-block">🏦 Why Interac?</span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              The #1 Payment Method for Canadian Casino Players
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Interac is Canada&apos;s bank network, used by every major bank in the country (RBC, TD, Scotiabank, BMO, CIBC). At online casinos, Interac e-Transfer means instant CAD deposits with no currency conversion fees and fast 1–3 day withdrawals straight to your bank account.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                Instant deposits — no waiting or credit card blocks
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                All transactions in Canadian dollars (CAD)
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                Zero currency conversion fees or hidden charges
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                Withdrawals direct to your Canadian bank account
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                Available at every chartered bank in Canada
              </li>
            </ul>

            <a className="btn-primary" href="/#top10">
              See All Interac Casinos →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5 text-center card-hover">
              <div className="text-4xl mb-2">🎰</div>
              <p className="text-white font-bold text-base">Spin Casino</p>
              <p className="text-xs text-gray-400 mt-1">1–3 days via Interac</p>
              <span className="badge badge-blue text-[10px] mt-3 inline-block">Interac ✓</span>
            </div>

            <div className="glass-card rounded-xl p-5 text-center card-hover">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-white font-bold text-base">Jackpot City</p>
              <p className="text-xs text-gray-400 mt-1">1–5 days via Interac</p>
              <span className="badge badge-blue text-[10px] mt-3 inline-block">Interac ✓</span>
            </div>

            <div className="glass-card rounded-xl p-5 text-center card-hover">
              <div className="text-4xl mb-2">🦁</div>
              <p className="text-white font-bold text-base">LeoVegas</p>
              <p className="text-xs text-gray-400 mt-1">24 hours via Interac</p>
              <span className="badge badge-blue text-[10px] mt-3 inline-block">Interac ✓</span>
            </div>

            <div className="glass-card rounded-xl p-5 text-center card-hover">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-white font-bold text-base">bet365 Casino</p>
              <p className="text-xs text-gray-400 mt-1">24 hours via Interac</p>
              <span className="badge badge-blue text-[10px] mt-3 inline-block">Interac ✓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
