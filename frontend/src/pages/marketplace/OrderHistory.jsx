import React from 'react';
import { Package, Truck, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import InvoiceModal from './InvoiceModal';

export default function OrderHistory({ orders }) {
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 bg-gray-50 flex items-center justify-center rounded-full mb-6">
          <Package size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">When you place an order on the marketplace, it will appear here.</p>
        <PrimaryButton onClick={() => window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'shop' }))}>
          Start Shopping
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Package className="text-emerald-600" />
        Your Orders
      </h2>
      
      {orders.map((order, i) => (
        <Card key={order.id} className="border border-gray-100 shadow-sm p-6 overflow-hidden relative">
          <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-4 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full text-sm">
                  {order.id}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-gray-900">₹{order.total}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {order.status === 'Delivered' ? <CheckCircle2 size={14} /> : <Truck size={14} />}
                {order.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Items</h4>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="font-medium text-gray-800">{item.qty}x {item.name}</div>
                <div className="text-emerald-700 font-bold font-mono">₹{item.price * item.qty}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm">
            <div className="text-gray-500 flex items-center gap-2">
               <Truck size={16} className="text-emerald-500" />
               <span className="font-medium">{order.deliveryEstimate}</span>
            </div>
            
            <button 
              onClick={() => setSelectedOrder(order)}
              className="text-emerald-600 font-semibold hover:underline bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
            >
              View Invoice
            </button>
          </div>
        </Card>
      ))}

      {/* Invoice Modal Overlay */}
      {selectedOrder && (
        <InvoiceModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}
