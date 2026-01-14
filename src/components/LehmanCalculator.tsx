import { useState, useEffect } from 'react';
import {
  calculateLehmanFee,
  validateInput,
  type LehmanType,
  type CalculationResult,
} from '../utils/lehmanCalculator';

export function LehmanCalculator() {
  const [ebitdaInput, setEbitdaInput] = useState('3');
  const [multipleInput, setMultipleInput] = useState('5');
  const [lehmanType, setLehmanType] = useState<LehmanType>('single');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<{
    ebitda?: string;
    multiple?: string;
  }>({});

  // Real-time calculation whenever inputs change
  useEffect(() => {
    const ebitdaValidation = validateInput(ebitdaInput);
    const multipleValidation = validateInput(multipleInput);

    const newErrors: typeof errors = {};

    if (!ebitdaValidation.isValid) {
      newErrors.ebitda = ebitdaValidation.error;
    }

    if (!multipleValidation.isValid) {
      newErrors.multiple = multipleValidation.error;
    }

    setErrors(newErrors);

    // Only calculate if both inputs are valid
    if (
      ebitdaValidation.isValid &&
      multipleValidation.isValid &&
      ebitdaValidation.numericValue !== undefined &&
      multipleValidation.numericValue !== undefined
    ) {
      try {
        const calculatedResult = calculateLehmanFee({
          ebitda: ebitdaValidation.numericValue,
          multiple: multipleValidation.numericValue,
          lehmanType,
        });
        setResult(calculatedResult);
      } catch (error) {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [ebitdaInput, multipleInput, lehmanType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-6 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header - Compact */}
        <div className="mb-6 text-center md:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Lehman Fee Calculator
          </h1>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            Calculate M&A advisory fees based on the{' '}
            <a
              href="https://en.wikipedia.org/wiki/Lehman_Formula"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Lehman Formula
            </a>
            . <span className="font-semibold">Just remember: 5-4-3-2-1%</span>
          </p>
        </div>

        {/* Main Layout - Side by Side on Desktop */}
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          {/* Left: Calculator */}
          <div className="space-y-4">
            {/* Calculator Card - Compact */}
            <div className="rounded-xl bg-white p-6 shadow-lg md:p-8">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Lehman Type */}
                <div>
                  <label
                    htmlFor="lehman-type"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Type
                  </label>
                  <select
                    id="lehman-type"
                    value={lehmanType}
                    onChange={(e) =>
                      setLehmanType(e.target.value as LehmanType)
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="single">Single (5-4-3-2-1%)</option>
                    <option value="double">Double (10-8-6-4-2%)</option>
                  </select>
                </div>

                {/* EBITDA Input */}
                <div>
                  <label
                    htmlFor="ebitda"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    EBITDA ($M)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-sm text-gray-500">$</span>
                    </div>
                    <input
                      type="text"
                      id="ebitda"
                      value={ebitdaInput}
                      onChange={(e) => setEbitdaInput(e.target.value)}
                      className={`block w-full rounded-lg border ${
                        errors.ebitda ? 'border-red-300' : 'border-gray-300'
                      } py-2.5 pl-7 pr-3 text-sm text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="3.0"
                    />
                  </div>
                  {errors.ebitda && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.ebitda}
                    </p>
                  )}
                </div>

                {/* Multiple Input */}
                <div>
                  <label
                    htmlFor="multiple"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Multiple
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="multiple"
                      value={multipleInput}
                      onChange={(e) => setMultipleInput(e.target.value)}
                      className={`block w-full rounded-lg border ${
                        errors.multiple ? 'border-red-300' : 'border-gray-300'
                      } py-2.5 pl-3 pr-9 text-sm text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="5.0"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm text-gray-500">x</span>
                    </div>
                  </div>
                  {errors.multiple && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.multiple}
                    </p>
                  )}
                </div>
              </div>

              {/* Results - Inline */}
              {result && (
                <div className="mt-6 grid gap-3 border-t border-gray-200 pt-6 md:grid-cols-2">
                  {/* TEV */}
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-900">
                      Total Enterprise Value
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-900">
                      ${result.formattedTev}M
                    </p>
                  </div>

                  {/* Fee */}
                  <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-green-900">
                      Your Fee
                    </p>
                    <p className="mt-1 text-2xl font-bold text-green-900">
                      ${result.formattedFee}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Fee Breakdown - Collapsible/Compact */}
            {result && (
              <details className="group rounded-xl bg-white shadow-lg">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-semibold text-gray-900 transition hover:bg-gray-50">
                  <span className="text-sm">📊 Fee Breakdown by Tier</span>
                  <svg
                    className="h-5 w-5 transition group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="border-t border-gray-100 p-4">
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                            Tier
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                            Range ($M)
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                            Rate
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium uppercase text-gray-500">
                            Fee
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {result.feeBreakdown.map((tier) => (
                          <tr
                            key={tier.tier}
                            className={
                              tier.amount > 0
                                ? 'bg-white'
                                : 'bg-gray-50 text-gray-400'
                            }
                          >
                            <td className="whitespace-nowrap px-3 py-2 font-medium">
                              {tier.tier}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              ${tier.rangeStart}M-
                              {tier.rangeEnd === Infinity
                                ? '∞'
                                : `$${tier.rangeEnd}M`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {tier.percentage}%
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                              $
                              {(tier.amount * 1000000).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>
            )}
          </div>

          {/* Right: Creator Card - Prominent */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-xl bg-white shadow-xl">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                  Created By
                </h3>
              </div>

              {/* Profile */}
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <img
                    src="https://s.gravatar.com/avatar/18ea7e1919fa398e2f2bd3ccb1e15b4d?s=120"
                    alt="Dan Herr - Deal Sourcing Engineer"
                    className="h-24 w-24 rounded-full border-4 border-blue-100 shadow-lg"
                  />
                  <h4 className="mt-4 text-xl font-bold text-gray-900">
                    Dan Herr
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    The Deal Sourcing Engineer | CEO of{' '}
                    <a
                      href="https://www.tahoeequity.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Tahoe Equity
                    </a>{' '}
                    &{' '}
                    <a
                      href="https://www.acqwired.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Acqwired
                    </a>{' '}
                    | Unlocking non-linear growth in Private Equity
                  </p>

                  {/* Social Links */}
                  <div className="mt-6 flex w-full flex-col gap-2">
                    <a
                      href="https://www.linkedin.com/in/danielherr/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004182]"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      Connect on LinkedIn
                    </a>

                    <a
                      href="https://twitter.com/DanHerr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Follow @DanHerr
                    </a>

                    <a
                      href="http://www.danherr.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-center text-xs text-gray-500 transition hover:text-blue-600 hover:underline"
                    >
                      Visit DanHerr.com →
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
                <p className="text-center text-xs text-gray-500">
                  Free tool for M&A professionals
                </p>
              </div>
            </div>

            {/* Quick Reference Card */}
            <div className="mt-4 rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <h5 className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-900">
                📝 Quick Reference
              </h5>
              <div className="space-y-3 text-xs">
                {/* Formula */}
                <div>
                  <p className="font-semibold text-blue-900">
                    Single Lehman: 5-4-3-2-1%
                  </p>
                  <p className="font-semibold text-blue-900">
                    Double Lehman: 10-8-6-4-2%
                  </p>
                  <p className="mt-1 text-blue-700">
                    On 1st $1M, 2nd $1M, 3rd $1M, 4th $1M, $1M+
                  </p>
                </div>

                {/* Mental Math Shortcuts */}
                <div className="border-t border-blue-200 pt-3">
                  <p className="mb-2 font-semibold text-blue-900">
                    💡 Mental Math Shortcuts:
                  </p>
                  <ul className="ml-4 list-disc space-y-1 text-blue-800">
                    <li>
                      <span className="font-medium">$150k</span> for first $5M
                      TEV + <span className="font-medium">1%</span> of balance
                    </li>
                    <li>
                      <span className="font-medium">$200k</span> for first $10M
                      TEV + <span className="font-medium">1%</span> of balance
                    </li>
                  </ul>
                </div>

                {/* Future Features */}
                <div className="border-t border-blue-200 pt-3">
                  <p className="text-blue-700">
                    Want flat % or Reverse Lehman options?{' '}
                    <a
                      href="http://danherr.com/2015/12/18/lehman-fee-calculator/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 underline hover:text-blue-800"
                    >
                      Let me know! →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
