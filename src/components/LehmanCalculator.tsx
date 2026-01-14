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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Lehman Fee Calculator
          </h1>
          <p className="mt-3 text-gray-600">
            Calculate advisory fees based on the{' '}
            <a
              href="https://en.wikipedia.org/wiki/Lehman_Formula"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Lehman Formula
            </a>
            . Enter EBITDA and multiple to see real-time results.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="space-y-6">
            {/* Lehman Type Selector */}
            <div>
              <label
                htmlFor="lehman-type"
                className="block text-sm font-semibold text-gray-700"
              >
                Lehman Type
              </label>
              <select
                id="lehman-type"
                value={lehmanType}
                onChange={(e) => setLehmanType(e.target.value as LehmanType)}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single Lehman (5-4-3-2-1%)</option>
                <option value="double">Double Lehman (10-8-6-4-2%)</option>
              </select>
            </div>

            {/* EBITDA Input */}
            <div>
              <label
                htmlFor="ebitda"
                className="block text-sm font-semibold text-gray-700"
              >
                EBITDA ($ millions)
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  id="ebitda"
                  value={ebitdaInput}
                  onChange={(e) => setEbitdaInput(e.target.value)}
                  className={`block w-full rounded-md border ${
                    errors.ebitda ? 'border-red-300' : 'border-gray-300'
                  } py-3 pl-8 pr-4 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="3.0"
                />
              </div>
              {errors.ebitda && (
                <p className="mt-1 text-sm text-red-600">{errors.ebitda}</p>
              )}
            </div>

            {/* Multiple Input */}
            <div>
              <label
                htmlFor="multiple"
                className="block text-sm font-semibold text-gray-700"
              >
                EBITDA Multiple
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  id="multiple"
                  value={multipleInput}
                  onChange={(e) => setMultipleInput(e.target.value)}
                  className={`block w-full rounded-md border ${
                    errors.multiple ? 'border-red-300' : 'border-gray-300'
                  } py-3 pl-4 pr-12 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="5.0"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-gray-500">x</span>
                </div>
              </div>
              {errors.multiple && (
                <p className="mt-1 text-sm text-red-600">{errors.multiple}</p>
              )}
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* TEV Result */}
                <div className="rounded-lg bg-blue-50 p-6 text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Total Enterprise Value
                  </p>
                  <p className="mt-2 text-3xl font-bold text-blue-900">
                    ${result.formattedTev}M
                  </p>
                </div>

                {/* Fee Result */}
                <div className="rounded-lg bg-green-50 p-6 text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Your Fee ({lehmanType === 'single' ? 'Single' : 'Double'}{' '}
                    Lehman)
                  </p>
                  <p className="mt-2 text-3xl font-bold text-green-900">
                    ${result.formattedFee}
                  </p>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Fee Breakdown by Tier
                </h3>
                <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Tier
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Range ($M)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Rate
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          Fee
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {result.feeBreakdown.map((tier) => (
                        <tr
                          key={tier.tier}
                          className={tier.amount > 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                            Tier {tier.tier}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                            ${tier.rangeStart}M -{' '}
                            {tier.rangeEnd === Infinity
                              ? '∞'
                              : `$${tier.rangeEnd}M`}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                            {tier.percentage}%
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900">
                            ${(tier.amount * 1000000).toLocaleString('en-US', {
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-col items-center space-y-2">
            <a
              href="http://www.danherr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <img
                src="https://s.gravatar.com/avatar/18ea7e1919fa398e2f2bd3ccb1e15b4d?s=80"
                alt="Profile of Dan Herr"
                className="h-20 w-20 rounded-full border-2 border-white shadow-lg"
              />
            </a>
            <p className="text-sm text-gray-600">
              Created by{' '}
              <a
                href="https://twitter.com/DanHerr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                @DanHerr
              </a>
            </p>
            <a
              href="http://www.danherr.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              DanHerr.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
