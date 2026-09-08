'use client'

import React from 'react'

export interface FilterState {
  minDeposit: string
  freeSpinsOnly: boolean
  cryptoOnly: boolean
  paymentMethod: string
  sortBy: 'rating' | 'bonus' | 'newest'
}

interface CasinoFilterBarProps {
  filters: FilterState
  onChange: (newFilters: FilterState) => void
  totalCount: number
}

export const CasinoFilterBar: React.FC<CasinoFilterBarProps> = ({
  filters,
  onChange,
  totalCount,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left Status */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900">
            Showing <span className="text-[#0157ff] font-extrabold">{totalCount}</span> Verified Casinos
          </span>
          <span className="hidden sm:inline-block text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            ● Live Rates September 2026
          </span>
        </div>

        {/* Filters Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Min Deposit Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Min Deposit:</label>
            <select
              value={filters.minDeposit}
              onChange={(e) => onChange({ ...filters, minDeposit: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2 font-medium focus:ring-[#0157ff] focus:border-[#0157ff]"
            >
              <option value="all">All Amounts</option>
              <option value="1">$1 Deposit Only</option>
              <option value="10">Under $10</option>
              <option value="20">Under $20</option>
              <option value="30">Under $30</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Payment:</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => onChange({ ...filters, paymentMethod: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2 font-medium focus:ring-[#0157ff] focus:border-[#0157ff]"
            >
              <option value="all">All Payment Methods</option>
              <option value="Interac">Interac</option>
              <option value="Bitcoin">Bitcoin / Crypto</option>
              <option value="PayPal">PayPal</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="Visa">Visa / MasterCard</option>
            </select>
          </div>

          {/* Quick Toggles */}
          <button
            type="button"
            onClick={() => onChange({ ...filters, freeSpinsOnly: !filters.freeSpinsOnly })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
              filters.freeSpinsOnly
                ? 'bg-[#0157ff] text-white border-[#0157ff]'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            🎁 Free Spins Included
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...filters, cryptoOnly: !filters.cryptoOnly })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
              filters.cryptoOnly
                ? 'bg-amber-500 text-black border-amber-500'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            ⚡ Crypto Friendly
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 ml-auto lg:ml-2">
            <label className="text-xs font-semibold text-gray-500">Sort:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2 font-bold focus:ring-[#0157ff] focus:border-[#0157ff]"
            >
              <option value="rating">Highest Rated</option>
              <option value="bonus">Biggest Bonus ($)</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  )
}
