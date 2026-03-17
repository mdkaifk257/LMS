'use client';

import React from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseTitle: string;
  price: number;
}

export default function PaymentModal({ isOpen, onClose, onConfirm, courseTitle, price }: PaymentModalProps) {
  if (!isOpen) return null;

  const upiId = "learnflow@upi";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    alert('UPI ID copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Secure Payment</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-500 dark:text-gray-400 mb-1">Paying for</p>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{courseTitle}</h4>
            <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-500">₹{price}</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-lg shadow-sm mb-4 border border-gray-200">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${upiId}%26pn=LearnFlow%26am=${price}%26cu=INR`} 
                  alt="Payment QR Code" 
                  className="w-32 h-32"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Scan QR code to pay via any UPI app</p>
              
              <div className="w-full">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 text-center">Or Pay to UPI ID</p>
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3">
                  <span className="font-mono text-gray-700 dark:text-gray-300">{upiId}</span>
                  <button onClick={copyToClipboard} className="text-blue-600 hover:text-blue-700 p-1">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onConfirm}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              I have completed the payment
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              By clicking "Confirm", you verify that you have successfully sent the payment of ₹{price} to the specified UPI ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
