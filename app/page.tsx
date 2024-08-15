"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const getInitialValue = (key: string, defaultValue: number): number => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem(key)) || defaultValue;
    }
    return defaultValue;
  };

  const [equitySwap, setEquitySwap] = useState(() => getInitialValue('equitySwap', 0));
  const [hoursPerWeek, setHoursPerWeek] = useState(() => getInitialValue('hoursPerWeek', 20));
  const [weeksPerYear, setWeeksPerYear] = useState(() => getInitialValue('weeksPerYear', 30));
  const [cash, setCash] = useState(0);
  const [cashBonus, setCashBonus] = useState(0);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(() => getInitialValue('hourlyRate', 100));
  const [shareValue, setShareValue] = useState(() => getInitialValue('shareValue', 10));
  const [optionStrikePrice, setOptionStrikePrice] = useState(() => getInitialValue('optionStrikePrice', 4));

  const [vestedOptions, setVestedOptions] = useState(0);
  const [dividendPerShare, setDividendPerShare] = useState(() => getInitialValue('dividendPerShare', 1));

  useEffect(() => {
    const totalHours = hoursPerWeek * weeksPerYear;
    const maxAnnualBilling = totalHours * hourlyRate;

    const actualCash = maxAnnualBilling * (1 - equitySwap / 100);
    const equityValue = maxAnnualBilling * (equitySwap / 100);

    const optionsVested = Math.round(equityValue / shareValue);
    setVestedOptions(optionsVested);
    setCash(Math.round(actualCash));
    setCashBonus(Math.round(optionsVested * optionStrikePrice)); // Cash bonus is equal to exercise price

    // Save to localStorage
    localStorage.setItem('equitySwap', equitySwap.toString());
    localStorage.setItem('hoursPerWeek', hoursPerWeek.toString());
    localStorage.setItem('weeksPerYear', weeksPerYear.toString());
    localStorage.setItem('hourlyRate', hourlyRate.toString());
    localStorage.setItem('shareValue', shareValue.toString());
    localStorage.setItem('optionStrikePrice', optionStrikePrice.toString());
    localStorage.setItem('dividendPerShare', dividendPerShare.toString());
  }, [equitySwap, hoursPerWeek, weeksPerYear, hourlyRate, shareValue, optionStrikePrice, dividendPerShare]);

  const annualDividend = vestedOptions * dividendPerShare;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Equity-Cash Swap Calculator
        </h1>
        
        <div className="mb-6">
          <label htmlFor="equity-swap" className="block text-sm font-medium text-gray-700 mb-2">
            How much of your hourly rate would you like to swap for equity?
          </label>
          <div className="flex items-center">
            <input
              type="range"
              id="equity-swap"
              className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              min="0"
              max="80"
              step="1"
              value={equitySwap}
              onChange={(e) => setEquitySwap(Number(e.target.value))}
            />
            <div className="flex items-center ml-4 w-24">
              <input
                type="number"
                className="w-16 p-1 text-right border border-gray-300 rounded text-gray-900 font-medium"
                min="0"
                max="80"
                value={equitySwap}
                onChange={(e) => setEquitySwap(Number(e.target.value))}
              />
              <span className="ml-1 text-gray-900">%</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="hours-per-week" className="block text-sm font-medium text-gray-700 mb-2">
            How many hours per week will you work?
          </label>
          <div className="flex items-center">
            <input
              type="range"
              id="hours-per-week"
              className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              min="10"
              max="35"
              step="1"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            />
            <div className="flex items-center ml-4 w-24">
              <input
                type="number"
                className="w-16 p-1 text-right border border-gray-300 rounded text-gray-900 font-medium"
                min="10"
                max="35"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              />
              <span className="ml-1 text-gray-900">hrs</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="weeks-per-year" className="block text-sm font-medium text-gray-700 mb-2">
            How many weeks a year will you work?
          </label>
          <div className="flex items-center">
            <input
              type="range"
              id="weeks-per-year"
              className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              min="20"
              max="44"
              step="1"
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(Number(e.target.value))}
            />
            <div className="flex items-center ml-4 w-24">
              <input
                type="number"
                className="w-16 p-1 text-right border border-gray-300 rounded text-gray-900 font-medium"
                min="20"
                max="44"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(Number(e.target.value))}
              />
              <span className="ml-1 text-gray-900">wks</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Vested Options</span>
            <span className="text-sm text-gray-900">{vestedOptions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Cash</span>
            <span className="text-sm text-gray-900">${cash.toLocaleString()} / year</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Cash bonus to exercise options</span>
            <span className="text-sm text-gray-900">${cashBonus.toLocaleString()} / year</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Annual Dividend</span>
            <span className="text-sm text-gray-900">${annualDividend.toLocaleString()} / year</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Total cash</span>
            <span className="text-sm font-semibold text-gray-900">${(cash + cashBonus + annualDividend).toLocaleString()} / year</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
            onClick={() => setShowAssumptions(!showAssumptions)}
          >
            {showAssumptions ? 'Hide Assumptions' : 'Show Assumptions'}
          </button>
          {showAssumptions && (
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="hourly-rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  id="hourly-rate"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="share-value" className="block text-sm font-medium text-gray-700 mb-1">
                  Share Value ($)
                </label>
                <input
                  type="number"
                  id="share-value"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={shareValue}
                  onChange={(e) => setShareValue(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="option-strike-price" className="block text-sm font-medium text-gray-700 mb-1">
                  Option Strike Price ($)
                </label>
                <input
                  type="number"
                  id="option-strike-price"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={optionStrikePrice}
                  onChange={(e) => setOptionStrikePrice(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="dividend-per-share" className="block text-sm font-medium text-gray-700 mb-1">
                  Dividend Per Share ($)
                </label>
                <input
                  type="number"
                  id="dividend-per-share"
                  className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  value={dividendPerShare}
                  onChange={(e) => setDividendPerShare(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}