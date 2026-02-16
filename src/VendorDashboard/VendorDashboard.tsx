// // VendorDashboard.tsx
// import React, { useState } from 'react';
// import { 
//   BarChart3, 
//   Package, 
//   ShoppingBag, 
//   DollarSign, 
//   Users, 
//   Activity, 
//   Settings, 
//   HelpCircle, 
//   ChevronLeft, 
//   ChevronRight,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   Download,
//   FileText,
//   MessageSquare,
//   Star,
//   Calendar,
//   CreditCard,
//   File,
//   User,
//   Lock,
//   Bell,
//   Upload,
//   Mail,
//   Phone
// } from 'lucide-react';

// // Types (same as before)
// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   stock: number;
//   images: string[];
//   category: string;
//   status: 'active' | 'inactive';
// }

// interface Order {
//   id: string;
//   customerName: string;
//   total: number;
//   status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
//   date: string;
// }

// interface Earnings {
//   total: number;
//   withdrawable: number;
//   commissionRate: number;
// }

// interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   orders: number;
//   rating: number;
// }

// interface Review {
//   id: string;
//   customerName: string;
//   productId: string;
//   rating: number;
//   comment: string;
//   date: string;
// }

// // Mock data (same as before)
// const mockProducts: Product[] = [
//   { id: '1', name: 'Sample Product 1', price: 29.99, stock: 50, images: ['/img1.jpg'], category: 'Electronics', status: 'active' },
//   { id: '2', name: 'Sample Product 2', price: 19.99, stock: 20, images: ['/img2.jpg'], category: 'Clothing', status: 'inactive' },
// ];

// const mockOrders: Order[] = [
//   { id: '1', customerName: 'John Doe', total: 99.98, status: 'pending', date: '2025-12-10' },
//   { id: '2', customerName: 'Jane Smith', total: 49.99, status: 'shipped', date: '2025-12-12' },
// ];

// const mockEarnings: Earnings = { total: 1500, withdrawable: 1200, commissionRate: 0.15 };

// const mockCustomers: Customer[] = [
//   { id: '1', name: 'John Doe', email: 'john@example.com', orders: 3, rating: 4.5 },
//   { id: '2', name: 'Jane Smith', email: 'jane@example.com', orders: 1, rating: 5.0 },
// ];

// const mockReviews: Review[] = [
//   { id: '1', customerName: 'John Doe', productId: '1', rating: 4, comment: 'Great product!', date: '2025-12-10' },
// ];

// // Sub-components (updated with new icons and theme)

// const OverviewSection: React.FC = () => {
//   const chartData = { daily: [100, 150, 200], weekly: [500, 600, 700], monthly: [2000, 2200, 2500] };

//   return (
//     <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center"><BarChart3 className="mr-2 h-8 w-8 text-indigo-600" /> Overview</h2>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-indigo-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
//               <p className="text-4xl font-bold text-indigo-600">{mockProducts.length}</p>
//             </div>
//             <Package className="h-12 w-12 text-indigo-400" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
//               <p className="text-4xl font-bold text-green-600">{mockOrders.length}</p>
//             </div>
//             <ShoppingBag className="h-12 w-12 text-green-400" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-600">Total Sales</h3>
//               <p className="text-4xl font-bold text-purple-600">${mockEarnings.total}</p>
//             </div>
//             <DollarSign className="h-12 w-12 text-purple-400" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-red-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-600">Pending Orders</h3>
//               <p className="text-4xl font-bold text-red-600">2</p>
//             </div>
//             <ShoppingBag className="h-12 w-12 text-red-400" />
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-indigo-100">
//           <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center"><BarChart3 className="mr-2 h-5 w-5" /> Daily Revenue</h3>
//           <div className="h-40 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">Chart Placeholder: Daily - {chartData.daily.join(', ')}</div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
//           <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center"><BarChart3 className="mr-2 h-5 w-5" /> Weekly Revenue</h3>
//           <div className="h-40 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">Chart Placeholder: Weekly - {chartData.weekly.join(', ')}</div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
//           <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center"><BarChart3 className="mr-2 h-5 w-5" /> Monthly Revenue</h3>
//           <div className="h-40 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">Chart Placeholder: Monthly - {chartData.monthly.join(', ')}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProductManagementSection: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>(mockProducts);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ name: '', price: 0, stock: 0, images: [], category: '', status: 'active' });

//   const addProduct = () => {
//     const id = Date.now().toString();
//     setProducts([...products, { ...newProduct, id }]);
//     setNewProduct({ name: '', price: 0, stock: 0, images: [], category: '', status: 'active' });
//   };

//   const updateProduct = (id: string, updated: Partial<Product>) => {
//     setProducts(products.map(p => (p.id === id ? { ...p, ...updated } : p)));
//     setEditingId(null);
//   };

//   const deleteProduct = (id: string) => {
//     setProducts(products.filter(p => p.id !== id));
//   };

//   return (
//     <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center"><Package className="mr-2 h-8 w-8 text-indigo-600" /> Product Management</h2>
//       {/* Add Product Form */}
//       <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-indigo-100">
//         <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center"><Plus className="mr-2 h-5 w-5" /> Add New Product</h3>
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <input
//             type="text"
//             placeholder="Name"
//             value={newProduct.name}
//             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
//             className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           />
//           <input
//             type="number"
//             placeholder="Price"
//             value={newProduct.price}
//             onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
//             className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           />
//           <input
//             type="number"
//             placeholder="Stock"
//             value={newProduct.stock}
//             onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
//             className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           />
//           <input
//             type="text"
//             placeholder="Category"
//             value={newProduct.category}
//             onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
//             className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           />
//           <div className="flex space-x-2">
//             <select
//               value={newProduct.status}
//               onChange={e => setNewProduct({ ...newProduct, status: e.target.value as 'active' | 'inactive' })}
//               className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex-1"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//             <button onClick={addProduct} className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"><Plus className="h-4 w-4 mr-1" /></button>
//           </div>
//         </div>
//       </div>
//       {/* Product List */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
//             <tr>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {products.map(product => (
//               <tr key={product.id} className="hover:bg-indigo-50 transition-colors">
//                 <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-indigo-600">${product.price}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.stock}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.category}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {product.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                   <button onClick={() => setEditingId(product.id)} className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-100 transition-colors"><Edit className="h-4 w-4" /></button>
//                   <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="h-4 w-4" /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* Edit Modal Placeholder */}
//       {editingId && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
//           <div className="bg-white p-6 border rounded-xl shadow-2xl w-96">
//             <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
//             {/* Add edit form here */}
//             <button onClick={() => setEditingId(null)} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const OrderManagementSection: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>(mockOrders);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   const updateStatus = (id: string, status: Order['status']) => {
//     setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
//   };

//   return (
//     <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center"><ShoppingBag className="mr-2 h-8 w-8 text-indigo-600" /> Order Management</h2>
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-indigo-100">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
//             <tr>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {orders.map(order => (
//               <tr key={order.id} className="hover:bg-indigo-50 transition-colors">
//                 <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order.id}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-900">{order.customerName}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-indigo-600">${order.total}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <select
//                     value={order.status}
//                     onChange={e => updateStatus(order.id, e.target.value as Order['status'])}
//                     className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="delivered">Delivered</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-500">{order.date}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                   <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-100 transition-colors"><Eye className="h-4 w-4" /></button>
//                   <button className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-100 transition-colors"><Download className="h-4 w-4" /> Invoice</button>
//                   <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors"><Download className="h-4 w-4" /> Label</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
//           <div className="bg-white p-6 border rounded-xl shadow-2xl w-96">
//             <h3 className="text-xl font-semibold mb-4">Order Details: {selectedOrder.id}</h3>
//             <p className="text-gray-900 mb-2">Customer: {selectedOrder.customerName}</p>
//             <p className="text-indigo-600 mb-2">Total: ${selectedOrder.total}</p>
//             <p className="text-gray-900 mb-4">Status: {selectedOrder.status}</p>
//             <button onClick={() => setSelectedOrder(null)} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const EarningsSection: React.FC = () => {
//   const [paymentHistory] = useState([{ id: '1', amount: 500, date: '2025-12-01', status: 'completed' }]);

//   const requestWithdrawal = () => {
//     alert('Withdrawal requested!');
//   };

//   return (
//     <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center"><DollarSign className="mr-2 h-8 w-8 text-indigo-600" /> Earnings & Payments</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-600">Total Earnings</h3>
//               <p className="text-4xl font-bold text-green-600">${mockEarnings.total}</p>
//             </div>
//             <DollarSign className="h-12 w-12 text-green-400" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-600">Withdrawable Balance</h3>
//               <p className="text-4xl font-bold text-blue-600">${mockEarnings.withdrawable}</p>
//             </div>
//             <CreditCard className="h-12 w-12 text-blue-400" />
//           </div>
//           <button onClick={requestWithdrawal} className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"><DollarSign className="h-4 w-4 mr-2" /> Withdraw</button>
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-purple-100">
//         <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><FileText className="mr-2 h-5 w-5" /> Commission Details</h3>
//         <p className="text-gray-600">Rate: {mockEarnings.commissionRate * 100}%</p>
//       </div>
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
//         <h3 className="text-xl font-semibold p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center">Payment History <File className="ml-auto h-5 w-5 text-gray-400" /></h3>
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
//             <tr>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {paymentHistory.map(item => (
//               <tr key={item.id} className="hover:bg-indigo-50 transition-colors">
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.id}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-green-600">${item.amount}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.date}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                     {item.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const CustomersSection: React.FC = () => {
//   return (
//     <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center"><Users className="mr-2 h-8 w-8 text-indigo-600" /> Customers & Reviews</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
//           <h3 className="text-xl font-semibold p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center">Customer List <User className="ml-auto h-5 w-5 text-gray-400" /></h3>
//           <div className="p-6 divide-y divide-gray-200">
//             {mockCustomers.map(customer => (
//               <div key={customer.id} className="py-4 hover:bg-indigo-50 transition-colors">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold text-gray-900">{customer.name}</p>
//                     <p className="text-sm text-gray-600">{customer.email}</p>
//                   </div>
//                   <div className="text-right space-y-1">
//                     <p className="text-sm text-gray-500">Orders: {customer.orders}</p>
//                     <div className="flex items-center">
//                       <Star className="h-4 w-4 text-yellow-400 mr-1" />
//                       <p className="text-sm text-gray-500">{customer.rating}/5</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
//           <h3 className="text-xl font-semibold p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center">Reviews <Star className="ml-auto h-5 w-5 text-gray-400" /></h3>
//           <div className="p-6 divide-y divide-gray-200">
//             {mockReviews.map(review => (
//               <div key={review.id} className="py-4 hover:bg-indigo-50 transition-colors">
//                 <p className="font-semibold text-gray-900">{review.customerName} - {review.productId}</p>
//                 <div className="flex items-center mb-2">
//                   <Star className="h-4 w-4 text-yellow-400 mr-1" />
//                   <p className="text-sm text-gray-500">{review.rating}/5</p>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
//                 <p className="text-xs text-gray-400">{review.date}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       {/* Messages Placeholder */}
//       <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
//         <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><MessageSquare className="mr-2 h-5 w-5" /> Messages</h3>
//         <p className="text-gray-600">Messages section - Integrate with chat API</p>
//       </div>
//     </div>
//   );
// };

// const ReportsSection: React.FC = () => {
//   const [dateRange, setDateRange] = useState('monthly');

//   return (
//     <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center"><Activity className="mr-2 h-8 w-8 text-indigo-600" /> Reports & Analytics</h2>
//       <div className="mb-6 flex items-center">
//         <label className="mr-4 text-gray-700 font-semibold">Filter by:</label>
//         <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
//           <option value="daily">Daily</option>
//           <option value="weekly">Weekly</option>
//           <option value="monthly">Monthly</option>
//         </select>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><BarChart3 className="mr-2 h-5 w-5" /> Sales Reports</h3>
//           <div className="h-64 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">Sales Chart Placeholder</div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><BarChart3 className="mr-2 h-5 w-5" /> Product Performance</h3>
//           <div className="h-64 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">Performance Chart Placeholder</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProfileSection: React.FC = () => {
//   return (
//     <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center"><Settings className="mr-2 h-8 w-8 text-indigo-600" /> Vendor Profile & Settings</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><Package className="mr-2 h-5 w-5" /> Store Details</h3>
//           <input type="text" placeholder="Store Name" className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
//           <textarea placeholder="Description" className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" rows={3} />
//           <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">Save</button>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><CreditCard className="mr-2 h-5 w-5" /> Bank Details</h3>
//           <input type="text" placeholder="Account Number" className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
//           <input type="text" placeholder="IFSC" className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
//           <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">Save</button>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><File className="mr-2 h-5 w-5" /> KYC</h3>
//           <p className="text-gray-600 mb-3">Upload Documents</p>
//           <input type="file" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
//           <button className="mt-3 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">Upload</button>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><Lock className="mr-2 h-5 w-5" /> Password & Notifications</h3>
//           <input type="password" placeholder="New Password" className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
//           <label className="flex items-center mb-3">
//             <input type="checkbox" className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
//             <span className="text-gray-700">Email Notifications</span>
//           </label>
//           <label className="flex items-center mb-3">
//             <input type="checkbox" className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
//             <span className="text-gray-700">SMS Notifications</span>
//           </label>
//           <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">Update</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SupportSection: React.FC = () => {
//   const [tickets] = useState([{ id: '1', subject: 'Issue with payment', status: 'open', date: '2025-12-10' }]);

//   return (
//     <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center"><HelpCircle className="mr-2 h-8 w-8 text-indigo-600" /> Support</h2>
//       <div className="mb-6 flex items-center">
//         <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"><Plus className="h-4 w-4 mr-2" /> Create New Ticket</button>
//       </div>
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-indigo-100">
//         <h3 className="text-xl font-semibold p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">Support Tickets</h3>
//         <div className="p-6 divide-y divide-gray-200">
//           {tickets.map(ticket => (
//             <div key={ticket.id} className="py-4 hover:bg-indigo-50 transition-colors">
//               <p className="font-semibold text-gray-900 mb-1">{ticket.subject}</p>
//               <p className="text-sm text-gray-600 mb-1">Status: <span className={`px-2 py-1 rounded-full text-xs ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{ticket.status}</span></p>
//               <p className="text-xs text-gray-400">{ticket.date}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
//         <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center"><Bell className="mr-2 h-5 w-5" /> Announcements</h3>
//         <p className="text-gray-600">Latest announcements from platform...</p>
//       </div>
//     </div>
//   );
// };

// // Updated Sidebar with collapse functionality
// const Sidebar: React.FC<{ activeSection: string; setActiveSection: (section: string) => void; isOpen: boolean; toggleSidebar: () => void }> = ({ 
//   activeSection, 
//   setActiveSection, 
//   isOpen, 
//   toggleSidebar 
// }) => {
//   const sections = [
//     { key: 'overview', label: 'Overview', icon: BarChart3 },
//     { key: 'products', label: 'Products', icon: Package },
//     { key: 'orders', label: 'Orders', icon: ShoppingBag },
//     { key: 'earnings', label: 'Earnings', icon: DollarSign },
//     { key: 'customers', label: 'Customers', icon: Users },
//     { key: 'reports', label: 'Reports', icon: Activity },
//     { key: 'profile', label: 'Profile', icon: Settings },
//     { key: 'support', label: 'Support', icon: HelpCircle },
//   ];

//   return (
//     <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-indigo-700 to-purple-800 text-white transition-all duration-300 overflow-y-auto z-40 ${isOpen ? 'w-64' : 'w-16'}`}>
//       <div className="p-4 flex items-center justify-between">
//         {isOpen && <h1 className="text-2xl font-bold">Vendor Dashboard</h1>}
//         <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-indigo-600 transition-colors">
//           {isOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
//         </button>
//       </div>
//       <nav className="mt-4 space-y-2 px-2">
//         {sections.map(section => {
//           const Icon = section.icon;
//           return (
//             <button
//               key={section.key}
//               onClick={() => setActiveSection(section.key)}
//               className={`w-full text-left py-3 px-4 rounded-xl flex items-center space-x-3 hover:bg-white hover:bg-opacity-20 transition-colors ${
//                 activeSection === section.key ? 'bg-white bg-opacity-20' : ''
//               }`}
//             >
//               <Icon className="h-6 w-6 flex-shrink-0" />
//               {isOpen && <span className="text-sm font-medium">{section.label}</span>}
//             </button>
//           );
//         })}
//       </nav>
//     </div>
//   );
// };

// // Main Dashboard Component (updated with sidebar state)
// const VendorDashboard: React.FC = () => {
//   const [activeSection, setActiveSection] = useState('overview');
//   const [isOpen, setIsOpen] = useState(true);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   const renderSection = () => {
//     switch (activeSection) {
//       case 'overview':
//         return <OverviewSection />;
//       case 'products':
//         return <ProductManagementSection />;
//       case 'orders':
//         return <OrderManagementSection />;
//       case 'earnings':
//         return <EarningsSection />;
//       case 'customers':
//         return <CustomersSection />;
//       case 'reports':
//         return <ReportsSection />;
//       case 'profile':
//         return <ProfileSection />;
//       case 'support':
//         return <SupportSection />;
//       default:
//         return <OverviewSection />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
//       <Sidebar 
//         activeSection={activeSection} 
//         setActiveSection={setActiveSection} 
//         isOpen={isOpen} 
//         toggleSidebar={toggleSidebar} 
//       />
//       <div className={`transition-all duration-300 ${isOpen ? 'md:ml-64' : 'md:ml-16'}`}>
//         {renderSection()}
//       </div>
//     </div>
//   );
// };

// export default VendorDashboard;





































































import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, DollarSign, Package, Calendar, Star, Truck, LayoutDashboard, ShoppingBag,
  Box, BarChart3, Users, Bell, User, ChevronLeft, ChevronRight, Activity, FileText, Settings,
  Clock, Award, LineChart, Loader2, XCircle, Search, Plus, Edit3, Trash2, Filter, Eye, Send,
  Reply, Save, Upload, Download, CreditCard, MapPin, Phone, Mail, Image
} from 'lucide-react';

// Mock data fetch simulation
const fetchMockData = async (section) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = {
        dashboard: {
          stats: [
            { title: 'Total Orders', value: '1,456', icon: ShoppingCart, color: 'bg-blue-500' },
            { title: 'Total Revenue', value: '$24,500', icon: DollarSign, color: 'bg-green-500' },
            { title: 'Total Products', value: '89', icon: Package, color: 'bg-indigo-500' },
            { title: 'Orders This Month', value: '245', icon: Calendar, color: 'bg-yellow-500' },
            { title: 'Average Rating', value: '4.7', icon: Star, color: 'bg-purple-500' },
            { title: 'Pending Shipments', value: '12', icon: Truck, color: 'bg-red-500' }
          ],
          recentOrders: [
            { id: '#ORD001', customer: 'Jane Doe', status: 'Pending', payment: 'Paid', date: '2025-12-17', amount: '$150' },
            { id: '#ORD002', customer: 'John Smith', status: 'Shipped', payment: 'Paid', date: '2025-12-16', amount: '$89' },
            { id: '#ORD003', customer: 'Alice Johnson', status: 'Delivered', payment: 'Refunded', date: '2025-12-15', amount: '$200' }
          ],
          recentProducts: [
            { name: 'Wireless Headphones', stock: 15, price: '$99', status: 'Active' },
            { name: 'Smart Watch', stock: 0, price: '$199', status: 'Out of Stock' },
            { name: 'Laptop Bag', stock: 25, price: '$45', status: 'Active' }
          ],
          analytics: {
            salesData: [120, 190, 300, 500, 200, 300, 450],
            topProducts: ['Headphones', 'Watch', 'Bag'],
            revenueTrends: [5000, 7200, 6800, 9100, 7500]
          }
        },
        orders: {
          orders: [
            { id: '#ORD001', customer: 'Jane Doe', status: 'Pending', payment: 'Paid', date: '2025-12-17', amount: '$150' },
            { id: '#ORD002', customer: 'John Smith', status: 'Shipped', payment: 'Paid', date: '2025-12-16', amount: '$89' },
            { id: '#ORD003', customer: 'Alice Johnson', status: 'Delivered', payment: 'Refunded', date: '2025-12-15', amount: '$200' },
            { id: '#ORD004', customer: 'Bob Wilson', status: 'Pending', payment: 'Pending', date: '2025-12-14', amount: '$120' },
            { id: '#ORD005', customer: 'Carol Lee', status: 'Shipped', payment: 'Paid', date: '2025-12-13', amount: '$175' }
          ]
        },
        products: {
          products: [
            { id: 1, name: 'Wireless Headphones', stock: 15, price: '$99', status: 'Active' },
            { id: 2, name: 'Smart Watch', stock: 0, price: '$199', status: 'Out of Stock' },
            { id: 3, name: 'Laptop Bag', stock: 25, price: '$45', status: 'Active' },
            { id: 4, name: 'Phone Case', stock: 50, price: '$20', status: 'Active' },
            { id: 5, name: 'Charger', stock: 8, price: '$15', status: 'Low Stock' }
          ]
        },
        analytics: {
          monthlySales: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 75, 85],
          topProducts: ['Headphones (30%)', 'Watch (25%)', 'Bag (20%)'],
          revenueTrends: [5000, 7200, 6800, 9100, 7500]
        },
        customers: {
          customers: [
            { id: 1, name: 'Jane Doe', email: 'jane@example.com', orders: 5, lastOrder: '2025-12-17', totalSpent: '$450' },
            { id: 2, name: 'John Smith', email: 'john@example.com', orders: 3, lastOrder: '2025-12-16', totalSpent: '$267' },
            { id: 3, name: 'Alice Johnson', email: 'alice@example.com', orders: 7, lastOrder: '2025-12-15', totalSpent: '$890' }
          ]
        },
        notifications: {
          notifs: [
            { id: 1, type: 'order', title: 'New Order #ORD006', time: '1 hour ago', read: false },
            { id: 2, type: 'stock', title: 'Low Stock Alert: Charger', time: '2 days ago', read: true },
            { id: 3, type: 'refund', title: 'Refund Request for #ORD003', time: '3 days ago', read: false },
            { id: 4, type: 'payment', title: 'Payment Issue on #ORD004', time: '4 days ago', read: false }
          ]
        },
        profile: {
          vendor: {
            name: 'TechVendor Store',
            logo: '',
            category: 'Electronics',
            bankName: 'Bank of America',
            accountNumber: '****1234',
            contactEmail: 'vendor@techstore.com',
            phone: '+1-555-0123',
            address: '123 Vendor St, City, State 12345',
            preferences: { notifications: true, language: 'English', theme: 'Light' }
          }
        }
      };
      resolve(data[section] || {});
    }, 800);
  });
};

// Skeleton Component
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Sidebar Component
const Sidebar = ({ isOpen, onToggle, activeSection, onSectionChange }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard', active: activeSection === 'dashboard' },
    { icon: ShoppingBag, label: 'Orders', key: 'orders', active: activeSection === 'orders' },
    { icon: Box, label: 'Products', key: 'products', active: activeSection === 'products' },
    { icon: BarChart3, label: 'Analytics', key: 'analytics', active: activeSection === 'analytics' },
    { icon: Users, label: 'Customers', key: 'customers', active: activeSection === 'customers' },
    { icon: Bell, label: 'Notifications', key: 'notifications', active: activeSection === 'notifications' },
    { icon: User, label: 'Profile', key: 'profile', active: activeSection === 'profile' }
  ];

  return (
    <div className={`bg-gray-800 text-white fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} lg:translate-x-0 lg:w-${isOpen ? '64' : '20'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <h1 className={`${isOpen ? 'block' : 'hidden'} lg:hidden text-xl font-bold`}>Vendor Dashboard</h1>
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="mt-8 px-4 space-y-2">
        {menuItems.map((item, idx) => (
          <div key={idx} className="relative group">
            <button
              onClick={() => onSectionChange(item.key)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-700 ${
                item.active ? 'bg-indigo-600' : ''
              } ${isOpen ? 'justify-start' : 'justify-center'}`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className={`${isOpen ? 'block' : 'hidden'} text-sm font-medium`}>{item.label}</span>
            </button>
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

// StatsCard Component
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

// Dashboard Section
const DashboardSection = ({ loading, data }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const OrderRow = ({ order }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.payment}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
    </tr>
  );

  const ProductRow = ({ product }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.price}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          product.status === 'Out of Stock' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {product.status}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.stats?.map((stat, idx) => <StatsCard key={idx} {...stat} />) || []}
      </div>

      {/* Middle Section - Recent Orders & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center">
              <ShoppingBag size={20} className="mr-2 text-blue-600" />
              Recent Orders
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recentOrders?.map((order, idx) => <OrderRow key={idx} order={order} />) || []}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center">
              <Box size={20} className="mr-2 text-indigo-600" />
              Recent Products
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recentProducts?.map((product, idx) => <ProductRow key={idx} product={product} />) || []}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Section - Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <LineChart size={20} className="mr-2 text-purple-600" />
            Daily Sales
          </h3>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 italic">Placeholder for Line Chart</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 size={20} className="mr-2 text-green-600" />
            Top Products
          </h3>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 italic">Placeholder for Bar Chart</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Orders Section
const OrdersSection = ({ loading, data }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  // Filtered data logic here (simplified)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const OrderRow = ({ order }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.payment}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900"><Eye size={16} /></button>
          <button className="text-green-600 hover:text-green-900"><Truck size={16} /></button>
          <button className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Orders</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
            <Search size={18} className="text-gray-500" />
            <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="outline-none text-sm" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-white p-2 rounded-lg shadow-sm border">
            <option>All</option>
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
            <Plus size={18} />
            <span>New Order</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.orders?.filter(o => filter === 'All' || o.status === filter).map((order, idx) => <OrderRow key={idx} order={order} />) || []}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between">
          <button className="text-indigo-600 hover:text-indigo-800">Previous</button>
          <span>Page 1 of 3</span>
          <button className="text-indigo-600 hover:text-indigo-800">Next</button>
        </div>
      </div>
    </div>
  );
};

// Products Section (similar structure to Orders)
const ProductsSection = ({ loading, data }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const ProductRow = ({ product }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.price}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          product.status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
          product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {product.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900"><Eye size={16} /></button>
          <button className="text-green-600 hover:text-green-900"><Edit3 size={16} /></button>
          <button className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Products</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
            <Search size={18} className="text-gray-500" />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="outline-none text-sm" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-white p-2 rounded-lg shadow-sm border">
            <option>All</option>
            <option>Active</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.products?.filter(p => filter === 'All' || p.status === filter).map((product, idx) => <ProductRow key={idx} product={product} />) || []}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between">
          <button className="text-indigo-600 hover:text-indigo-800">Previous</button>
          <span>Page 1 of 2</span>
          <button className="text-indigo-600 hover:text-indigo-800">Next</button>
        </div>
      </div>
    </div>
  );
};

// Analytics Section
const AnalyticsSection = ({ loading, data }) => {
  const [dateFilter, setDateFilter] = useState('Monthly');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Analytics</h3>
        <div className="flex items-center space-x-4">
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-white p-2 rounded-lg shadow-sm border">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700">
            <Download size={18} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4">Sales Overview</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 italic">Placeholder for {dateFilter} Line Chart</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4">Top Products</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 italic">Placeholder for Bar Chart</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold mb-4">Revenue Trends</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          {data.revenueTrends?.map((trend, idx) => <li key={idx}>• Month {idx + 1}: ${trend}</li>) || []}
        </ul>
      </div>
    </div>
  );
};

// Customers Section
const CustomersSection = ({ loading, data }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const CustomerRow = ({ customer }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.orders}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.lastOrder}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${customer.totalSpent}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button className="text-blue-600 hover:text-blue-900"><Eye size={16} /></button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Customers</h3>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.customers?.map((customer, idx) => <CustomerRow key={idx} customer={customer} />) || []}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between">
          <button className="text-indigo-600 hover:text-indigo-800">Previous</button>
          <span>Page 1 of 1</span>
          <button className="text-indigo-600 hover:text-indigo-800">Next</button>
        </div>
      </div>
    </div>
  );
};

// Notifications Section
const NotificationsSection = ({ loading, data }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Notifications</h3>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">All Alerts</h4>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Mark All Read</button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {data.notifs?.map((notif) => (
            <div key={notif.id} className={`p-4 ${notif.read ? 'bg-white' : 'bg-blue-50'}`}>
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${
                  notif.type === 'order' ? 'bg-blue-100 text-blue-600' :
                  notif.type === 'stock' ? 'bg-yellow-100 text-yellow-600' :
                  notif.type === 'refund' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {notif.type === 'order' ? <ShoppingCart size={16} /> :
                   notif.type === 'stock' ? <Package size={16} /> :
                   notif.type === 'refund' ? <DollarSign size={16} /> : <CreditCard size={16} />}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{notif.title}</h5>
                  <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                </div>
                {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full self-start mt-1"></div>}
              </div>
            </div>
          )) || []}
        </div>
        {data.notifs?.length === 0 && (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
            <p className="text-gray-500">Stay tuned for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Profile Section
const ProfileSection = ({ loading, data }) => {
  const [editMode, setEditMode] = useState(false);
  const [vendor, setVendor] = useState(data.vendor || {});

  const handleSave = () => {
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="relative">
          <div className="w-32 h-32 bg-indigo-100 rounded-full mx-auto flex items-center justify-center">
            <Image size={48} className="text-indigo-600" />
          </div>
          {editMode && (
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg">
              <Upload size={16} className="text-gray-600" />
            </button>
          )}
        </div>
        <h3 className="text-2xl font-bold mt-4">{vendor.name}</h3>
        <p className="text-gray-500">{vendor.category}</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold">Vendor Details</h4>
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <Edit3 size={16} />
            <span>{editMode ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input
              type="text"
              value={vendor.name}
              onChange={(e) => setVendor({ ...vendor, name: e.target.value })}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={vendor.category}
              onChange={(e) => setVendor({ ...vendor, category: e.target.value })}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              type="text"
              value={vendor.bankName}
              onChange={(e) => setVendor({ ...vendor, bankName: e.target.value })}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              value={vendor.accountNumber}
              onChange={(e) => setVendor({ ...vendor, accountNumber: e.target.value })}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={vendor.contactEmail}
              onChange={(e) => setVendor({ ...vendor, contactEmail: e.target.value })}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={vendor.phone}
              onChange={(e) => setVendor({ ...vendor, phone: e.target.value })}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={vendor.address}
              onChange={(e) => setVendor({ ...vendor, address: e.target.value })}
              rows={2}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferences</label>
            <div className="space-y-2 mt-2">
              <label className={`flex items-center ${editMode ? '' : 'cursor-not-allowed'}`}>
                <input type="checkbox" checked={vendor.preferences.notifications} onChange={(e) => setVendor({ ...vendor, preferences: { ...vendor.preferences, notifications: e.target.checked } })} disabled={!editMode} className="mr-2" />
                Email Notifications
              </label>
              <label className={`flex items-center ${editMode ? '' : 'cursor-not-allowed'}`}>
                <input type="checkbox" checked={vendor.preferences.theme === 'Dark'} onChange={(e) => setVendor({ ...vendor, preferences: { ...vendor.preferences, theme: e.target.checked ? 'Dark' : 'Light' } })} disabled={!editMode} className="mr-2" />
                Dark Theme
              </label>
            </div>
          </div>
        </div>
        {editMode && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save size={18} className="mr-2 inline" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main VendorDashboard Component
const VendorDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [sectionData, setSectionData] = useState({});

  useEffect(() => {
    const loadSectionData = async () => {
      setLoading(true);
      const data = await fetchMockData(activeSection);
      setSectionData(data);
      setLoading(false);
    };

    loadSectionData();
  }, [activeSection]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection loading={loading} data={sectionData} />;
      case 'orders':
        return <OrdersSection loading={loading} data={sectionData} />;
      case 'products':
        return <ProductsSection loading={loading} data={sectionData} />;
      case 'analytics':
        return <AnalyticsSection loading={loading} data={sectionData} />;
      case 'customers':
        return <CustomersSection loading={loading} data={sectionData} />;
      case 'notifications':
        return <NotificationsSection loading={loading} data={sectionData} />;
      case 'profile':
        return <ProfileSection loading={loading} data={sectionData} />;
      default:
        return <DashboardSection loading={loading} data={sectionData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} activeSection={activeSection} onSectionChange={handleSectionChange} />
      
      {/* Overlay for mobile */}
      {!isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300" 
          onClick={() => setIsOpen(true)} 
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeSection}</h2>
          <div className="flex items-center space-x-4">
            <Bell size={20} className="text-gray-600 cursor-pointer hover:text-gray-900" />
            <User size={20} className="text-gray-600 cursor-pointer hover:text-gray-900" />
          </div>
        </header>

        <main className="p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;