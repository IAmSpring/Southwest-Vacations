import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const CheckoutPage: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="p-8">
              <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Payment Information</h2>

                <form id="payment-form">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="card-number"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="card-number"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiration"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Expiration
                        </label>
                        <input
                          type="text"
                          id="expiration"
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                          placeholder="MM/YY"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cvv"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="name-on-card"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="name-on-card"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="billing-zip"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Billing Zip Code
                      </label>
                      <input
                        type="text"
                        id="billing-zip"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Complete Payment
                    </button>
                  </div>
                </form>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Order Summary</h2>
                <div className="rounded-md bg-gray-50 p-4">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Booking Subtotal</span>
                    <span>$1,150.00</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 py-2">
                    <span>Taxes & Fees</span>
                    <span>$100.00</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total</span>
                    <span>$1,250.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
