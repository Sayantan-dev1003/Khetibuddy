import React, { useRef } from 'react';
import { X, CheckCircle, Download, Printer, MapPin, Mail, Phone } from 'lucide-react';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  // Extract subtotal (assuming tax is 5% and was calculated onto total)
  // total = subtotal * 1.05  => subtotal = total / 1.05
  const subtotal = order.total / 1.05;
  const tax = order.total - subtotal;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:block">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative print:max-w-none print:shadow-none print:w-full print:h-auto print:overflow-visible">
        
        {/* Header / Actions - Hidden on print */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10 rounded-t-3xl print:hidden">
          <h2 className="text-xl font-bold text-gray-800">Invoice Details</h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              title="Print / Save as PDF"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 sm:p-12" id="printable-invoice">
          
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12 pb-8 border-b-2 border-emerald-100">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🌾</div>
                <div>
                  <h1 className="text-2xl font-black text-emerald-700 tracking-tight">KhetiBuddy</h1>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Marketplace</p>
                </div>
              </div>
              <div className="text-gray-500 text-sm space-y-1">
                <p>KhetiBuddy Platform Ltd.</p>
                <p>Agritech Hub, Block C</p>
                <p>Pune, Maharashtra 411045</p>
                <p>support@khetibuddy.com</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tighter mb-2">INVOICE</h2>
              <div className="text-gray-600 text-sm space-y-1">
                <p><span className="font-semibold text-gray-400">Order Ref:</span> <span className="font-bold text-gray-800">{order.id}</span></p>
                <p><span className="font-semibold text-gray-400">Date:</span> {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><span className="font-semibold text-gray-400">Status:</span> 
                  <span className={`ml-2 inline-flex items-center gap-1 font-bold ${order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>
                    <CheckCircle size={14} /> {order.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-10 bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-4">Billed To</h3>
            {order.customer ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{order.customer.email}</p>
                      <p className="text-xs text-gray-500 uppercase">Contact Email</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{order.customer.phone}</p>
                      <p className="text-xs text-gray-500 uppercase">Phone Number</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium whitespace-pre-wrap">{order.customer.address}</p>
                    <p className="text-xs text-gray-500 uppercase mt-1">Delivery Address</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Guest user (No details provided)</p>
            )}
          </div>

          {/* Itemized Table */}
          <div className="mb-10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-emerald-100 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-4 pl-2">Item Description</th>
                    <th className="py-4 text-center">Qty</th>
                    <th className="py-4 text-right">Unit Price</th>
                    <th className="py-4 pr-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-5 pl-2">
                        <p className="font-bold text-gray-800">{item.name}</p>
                      </td>
                      <td className="py-5 text-center text-gray-600 font-medium">
                        {item.qty}
                      </td>
                      <td className="py-5 text-right text-gray-600 font-medium">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="py-5 pr-2 text-right font-bold text-gray-900">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end border-t-2 border-emerald-100 pt-6">
            <div className="w-full sm:w-1/2 md:w-1/3 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-medium text-emerald-600 font-bold tracking-wide">FREE</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 mt-2 pt-4">
                <span className="text-lg font-bold text-gray-800 uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black text-emerald-600">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-sm text-gray-400 border-t border-dashed border-gray-200 pt-8">
            <p>Thank you for shopping with KhetiBuddy Marketplace!</p>
            <p className="mt-1">For any support, please present this invoice document.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
