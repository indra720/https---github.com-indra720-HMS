
// import React, { useState } from 'react';
// import { 
//   User, 
//   Calendar, 
//   Bell, 
//   CheckCircle, 
//   Clock, 
//   FileText, 
//   Package, 
//   MessageCircle, 
//   ShoppingBag, 
//   Database, 
//   LogIn , 
//   FileBarChart, 
//   Settings, 
//   Mail, 
//   Home,
//   ChevronRight,
//   ChevronLeft,
//   Menu,
//   X,
//   ChevronDown
// } from 'lucide-react';

// // Types
// interface Task {
//   id: string;
//   title: string;
//   status: 'pending' | 'in-progress' | 'completed';
//   deadline: string;
//   comments?: string;
//   attachments?: string[];
// }

// interface Order {
//   id: string;
//   customer: string;
//   status: 'pending' | 'packed' | 'shipped' | 'delivered';
//   details: string;
//   invoice?: string;
//   label?: string;
// }

// interface Ticket {
//   id: string;
//   customer: string;
//   issue: string;
//   status: 'open' | 'resolved';
//   messages: string[];
// }

// interface InventoryItem {
//   id: string;
//   name: string;
//   stock: number;
//   lowStock: boolean;
// }

// interface Attendance {
//   date: string;
//   clockIn: string;
//   clockOut?: string;
//   status: 'present' | 'absent' | 'leave';
// }

// interface Role {
//   name: string;
//   permissions: string[];
// }

// // Sample dummy data (expanded for all sections)
// const sampleTasks: Task[] = [
//   { id: '1', title: 'Review client proposal for Project Alpha', status: 'pending', deadline: '2025-12-20', comments: 'Needs urgent feedback from team lead', attachments: ['proposal.pdf'] },
//   { id: '2', title: 'Update inventory records for Q4', status: 'in-progress', deadline: '2025-12-18', comments: 'Halfway done, checking discrepancies' },
//   { id: '3', title: 'Ship order #123 to warehouse', status: 'completed', deadline: '2025-12-15' },
//   { id: '4', title: 'Prepare monthly sales report', status: 'pending', deadline: '2025-12-22' },
// ];

// const sampleOrders: Order[] = [
//   { id: '123', customer: 'John Doe', status: 'packed', details: 'Electronics kit - iPhone accessories', invoice: '/invoice-123.pdf', label: '/label-123.pdf' },
//   { id: '124', customer: 'Jane Smith', status: 'pending', details: 'Clothing bundle - Winter collection' },
//   { id: '125', customer: 'Mike Johnson', status: 'shipped', details: 'Books - Technical manuals', invoice: '/invoice-125.pdf' },
//   { id: '126', customer: 'Sarah Lee', status: 'delivered', details: 'Gadgets - Smart home devices' },
// ];

// const sampleTickets: Ticket[] = [
//   { id: '1', customer: 'Alice Brown', issue: 'Payment gateway error during checkout', status: 'open', messages: ['Initial query: Card declined unexpectedly', 'Follow-up: Tried alternate card, same issue'] },
//   { id: '2', customer: 'Bob Wilson', issue: 'Delivery delay on order #124', status: 'resolved', messages: ['Resolved via chat: Shipped via express', 'Customer confirmed receipt'] },
//   { id: '3', customer: 'Carol Davis', issue: 'Product defect in received item', status: 'open', messages: ['Photo attached for verification'] },
// ];

// const sampleInventory: InventoryItem[] = [
//   { id: '1', name: 'Wireless Headphones Pro', stock: 5, lowStock: true },
//   { id: '2', name: 'Laptop Charger 65W', stock: 50, lowStock: false },
//   { id: '3', name: 'USB-C Cable 2m', stock: 12, lowStock: true },
//   { id: '4', name: 'Mouse Pad XL', stock: 100, lowStock: false },
// ];

// const sampleAttendance: Attendance[] = [
//   { date: '2025-12-14', clockIn: '09:00', clockOut: '17:00', status: 'present' },
//   { date: '2025-12-15', clockIn: '09:00', clockOut: '18:30', status: 'present' },
//   { date: '2025-12-16', clockIn: '09:15', status: 'present' }, // Ongoing
//   { date: '2025-12-13', clockIn: '09:00', clockOut: '16:45', status: 'leave' },
// ];

// const sampleReports = [
//   { id: '1', title: 'Daily Work Report - Dec 15', content: 'Completed 5 tasks, 2 hours overtime.' },
//   { id: '2', title: 'Performance Summary - Q4', content: 'Achieved 95% target, top performer in sales.' },
// ];

// const sampleAnnouncements = [
//   { id: '1', title: 'Team Meeting Tomorrow at 10 AM', content: 'All staff required. Agenda: Q4 review and holiday plans.' },
//   { id: '2', title: 'New Policy Update', content: 'Remote work guidelines revised effective Jan 1.' },
//   { id: '3', title: 'Holiday Bonus Announcement', content: 'Eligible staff to receive 10% bonus by Dec 25.' },
// ];

// interface StaffDashboardProps {
//   role: Role;
//   user: { name: string; email: string; avatar?: string };
// }

// // Navigation Item
// const NavItem: React.FC<{ icon: React.ElementType; label: string; active?: boolean; collapsed: boolean; onClick?: () => void }> = ({ icon: Icon, label, active, collapsed, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 w-full relative group ${
//       active
//         ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
//         : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:text-emerald-600'
//     }`}
//   >
//     <Icon className="w-5 h-5 flex-shrink-0" />
//     {!collapsed && <span className="whitespace-nowrap">{label}</span>}
//     {collapsed && (
//       <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//         {label}
//       </span>
//     )}
//   </button>
// );

// // Sidebar Component
// const Sidebar: React.FC<{ activeSection: string; onSectionChange: (section: string) => void; role: Role; collapsed: boolean; onToggle: () => void }> = ({ activeSection, onSectionChange, role, collapsed, onToggle }) => {
//   const navItems = [
//     { icon: Home, label: 'Overview', key: 'overview' },
//     { icon: CheckCircle, label: 'Tasks', key: 'tasks' },
//     { icon: Package, label: 'Orders', key: 'orders' },
//     ...(role.permissions.includes('support') ? [{ icon: MessageCircle, label: 'Support', key: 'support' }] : []),
//     ...(role.permissions.includes('inventory') ? [{ icon: Database, label: 'Inventory', key: 'inventory' }] : []),
//     { icon: LogIn , label: 'Attendance', key: 'attendance' },
//     { icon: FileBarChart, label: 'Reports', key: 'reports' },
//     { icon: Settings, label: 'Profile', key: 'profile' },
//     { icon: Mail, label: 'Communication', key: 'communication' },
//   ];

//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   return (
//     <>
//       {/* Mobile Menu Button - Top Left */}
//       <button
//         onClick={() => setIsMobileOpen(!isMobileOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg"
//       >
//         {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed lg:static inset-y-0 left-0 z-40 lg:z-auto bg-white lg:bg-transparent w-64 lg:w-16 h-full lg:h-auto shadow-xl lg:shadow-none transform transition-all duration-300 overflow-y-auto overflow-x-hidden ${
//           isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//         } ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}
//       >
//         {/* Header with Toggle Button in Top Right */}
//         <div className="p-4 border-b border-gray-200 flex justify-between items-center relative">
//           <div className="flex items-center space-x-3">
//             {!collapsed ? (
//               <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Staff Hub</h1>
//             ) : (
//               <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded" />
//             )}
//           </div>
//           <button
//             onClick={onToggle}
//             className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl hover:from-emerald-200 hover:to-teal-200 transition-all duration-200 lg:block hidden absolute top-4 right-4"
//             style={{ position: 'absolute', top: '1rem', right: '1rem' }}
//           >
//             <ChevronLeft className={`w-5 h-5 text-emerald-600 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="p-2 space-y-1">
//           {navItems.map((item) => (
//             <NavItem
//               key={item.key}
//               icon={item.icon}
//               label={item.label}
//               active={activeSection === item.key}
//               collapsed={collapsed}
//               onClick={() => {
//                 onSectionChange(item.key);
//                 setIsMobileOpen(false);
//               }}
//             />
//           ))}
//         </nav>
//       </div>

//       {/* Mobile Overlay */}
//       {isMobileOpen && <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30" onClick={() => setIsMobileOpen(false)} />}

//       {/* Desktop Toggle Button Fallback - If needed, but now it's in sidebar top right */}
//     </>
//   );
// };

// // Overview Section
// const OverviewSection: React.FC<{ user: { name: string; email: string; avatar?: string } }> = ({ user }) => (
//   <div className="space-y-6">
//     <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
//       <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl mb-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-600">Welcome Back</p>
//             <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{user.name}</p>
//           </div>
//           <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
//             <User className="w-6 h-6 text-white" />
//           </div>
//         </div>
//         <p className="text-sm text-gray-500 mt-1">{user.email}</p>
//       </div>
//     </div>

//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 group hover:shadow-xl transition-shadow">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-600">Assigned Tasks</p>
//             <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">12</p>
//           </div>
//           <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//             <Calendar className="w-6 h-6 text-white" />
//           </div>
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100 group hover:shadow-xl transition-shadow">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-600">Pending Work</p>
//             <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">3</p>
//           </div>
//           <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//             <Clock className="w-6 h-6 text-white" />
//           </div>
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 group hover:shadow-xl transition-shadow">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-600">Daily Activity</p>
//             <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">85%</p>
//           </div>
//           <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//             <CheckCircle className="w-6 h-6 text-white" />
//           </div>
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 group hover:shadow-xl transition-shadow">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-600">Notifications</p>
//             <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">4</p>
//           </div>
//           <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//             <Bell className="w-6 h-6 text-white" />
//           </div>
//         </div>
//       </div>
//     </div>

//     <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
//       <h3 className="font-semibold mb-4 flex items-center text-emerald-600"><Bell className="w-5 h-5 mr-2" /> Recent Notifications</h3>
//       <ul className="space-y-3">
//         <li className="flex items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
//           <Bell className="w-4 h-4 text-emerald-500 mr-3" />
//           <span className="text-sm text-gray-700">New task assigned: Project Alpha review</span>
//         </li>
//         <li className="flex items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
//           <Clock className="w-4 h-4 text-orange-500 mr-3" />
//           <span className="text-sm text-gray-700">Low stock alert: Wireless Headphones (5 left)</span>
//         </li>
//         <li className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
//           <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
//           <span className="text-sm text-gray-700">Order #123 shipped successfully</span>
//         </li>
//       </ul>
//     </div>
//   </div>
// );

// // Task Management Section
// const TaskSection: React.FC = () => (
//   <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
//     <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Task Management</h2>
//     <div className="overflow-x-auto rounded-xl border border-gray-200">
//       <table className="w-full table-auto">
//         <thead>
//           <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
//             <th className="px-6 py-4 text-left font-semibold text-gray-700">Task</th>
//             <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
//             <th className="px-6 py-4 text-left font-semibold text-gray-700">Deadline</th>
//             <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sampleTasks.map((task) => (
//             <tr key={task.id} className="border-t hover:bg-emerald-50 transition-colors">
//               <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
//               <td className="px-6 py-4">
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                   task.status === 'completed' ? 'bg-green-100 text-green-800' :
//                   task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
//                 }`}>
//                   {task.status.replace('-', ' ').toUpperCase()}
//                 </span>
//               </td>
//               <td className="px-6 py-4 text-gray-600">{task.deadline}</td>
//               <td className="px-6 py-4">
//                 {task.comments && <button className="text-emerald-600 hover:underline mr-3 text-sm">Comments ({task.comments.length})</button>}
//                 {task.attachments && <button className="text-teal-600 hover:underline mr-3 text-sm">Files ({task.attachments.length})</button>}
//                 <button className="text-green-600 hover:underline text-sm">Update Status</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

// // Order Handling Section
// const OrderSection: React.FC = () => (
//   <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
//     <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Order / Work Handling</h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {sampleOrders.map((order) => (
//         <div key={order.id} className="border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow bg-gradient-to-b from-white to-emerald-50">
//           <h3 className="font-bold text-lg mb-2">Order #{order.id}</h3>
//           <p className="text-gray-600 mb-2">{order.customer}</p>
//           <p className="text-sm text-gray-500 mb-3">{order.details}</p>
//           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//             order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//             order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//             order.status === 'packed' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'
//           }`}>
//             {order.status.toUpperCase()}
//           </span>
//           <div className="mt-4 space-x-4">
//             {order.invoice && <a href={order.invoice} className="text-emerald-600 hover:underline text-sm font-medium">Invoice</a>}
//             {order.label && <a href={order.label} className="text-teal-600 hover:underline text-sm font-medium">Label</a>}
//             <button className="text-green-600 hover:underline text-sm">Update Status</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// // Support Section (Conditional)
// const SupportSection: React.FC = () => (
//   <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
//     <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Customer Support</h2>
//     <div className="space-y-4">
//       {sampleTickets.map((ticket) => (
//         <div key={ticket.id} className="border-l-4 border-emerald-500 pl-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
//           <h3 className="font-semibold text-gray-900">{ticket.customer} - {ticket.issue}</h3>
//           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//             ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//             {ticket.status.toUpperCase()}
//           </span>
//           <p className="text-sm text-gray-600 mt-2">Messages: {ticket.messages.length}</p>
//           <div className="mt-2 text-xs text-gray-500 space-y-1">
//             {ticket.messages.map((msg, idx) => (
//               <p key={idx}>- {msg}</p>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// // Inventory Section (Conditional)
// const InventorySection: React.FC = () => (
//   <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
//     <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Inventory Access</h2>
//     <ul className="space-y-3">
//       {sampleInventory.map((item) => (
//         <li key={item.id} className={`flex justify-between items-center p-4 rounded-xl ${
//           item.lowStock ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50 border border-gray-200'
//         }`}>
//           <span className="font-medium text-gray-900">{item.name}</span>
//           <div className="flex items-center space-x-2">
//             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//               item.lowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//             }`}>
//               {item.stock}
//             </span>
//             {item.lowStock && <Bell className="w-4 h-4 text-red-500" />}
//           </div>
//         </li>
//       ))}
//     </ul>
//   </div>
// );

// // Attendance Section
// const AttendanceSection: React.FC = () => {
//   const [clockedIn, setClockedIn] = useState(false);
//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 space-y-6">
//       <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Attendance & Time Tracking</h2>
//       <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl">
//         <button
//           onClick={() => setClockedIn(!clockedIn)}
//           className={`w-full px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
//             clockedIn ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl'
//           }`}
//         >
//           <LogIn  size={20} />
//           <span>{clockedIn ? 'Clock Out' : 'Clock In'}</span>
//         </button>
//       </div>
//       <div>
//         <h3 className="font-semibold mb-3 text-gray-900 flex items-center"><Calendar className="w-5 h-5 mr-2 text-emerald-600" /> Recent History</h3>
//         <ul className="space-y-3">
//           {sampleAttendance.map((att) => (
//             <li key={att.date} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
//               <span className="font-medium">{att.date}</span>
//               <span className="text-sm text-gray-600">{att.clockIn} - {att.clockOut || 'Ongoing'}</span>
//               <span className={`px-2 py-1 rounded-full text-xs ${
//                 att.status === 'present' ? 'bg-green-100 text-green-800' :
//                 att.status === 'leave' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {att.status}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// // Reports Section
// const ReportsSection: React.FC = () => (
//   <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 space-y-6">
//     <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Reports & Activity Logs</h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div className="p-6 bg-gradient-to-b from-emerald-50 to-teal-50 rounded-xl">
//         <h3 className="font-semibold mb-3 text-emerald-600">Daily Work Reports</h3>
//         {sampleReports.slice(0, 2).map((report) => (
//           <div key={report.id} className="mb-3 p-3 bg-white rounded-lg border-l-4 border-emerald-500">
//             <h4 className="font-medium">{report.title}</h4>
//             <p className="text-sm text-gray-600">{report.content}</p>
//           </div>
//         ))}
//       </div>
//       <div className="p-6 bg-gradient-to-b from-green-50 to-emerald-50 rounded-xl">
//         <h3 className="font-semibold mb-3 text-green-600">Performance Summary</h3>
//         <ul className="space-y-2">
//           <li className="text-sm text-gray-700">Q4 Target Achievement: 95%</li>
//           <li className="text-sm text-gray-700">Tasks Completed: 45/50</li>
//           <li className="text-sm text-gray-700">Average Rating: 4.8/5</li>
//         </ul>
//         <button className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow">Download Full Report</button>
//       </div>
//     </div>
//   </div>
// );

// // Profile Section
// const ProfileSection: React.FC<{ user: { name: string; email: string } }> = ({ user }) => (
//   <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 space-y-6">
//     <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//       Profile & Settings
//     </h2>

//     <div className="space-y-6">
//       {/* Inputs */}
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
//           <input
//             type="text"
//             defaultValue={user.name}
//             className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-colors"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
//           <input
//             type="email"
//             defaultValue={user.email}
//             className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-colors"
//           />
//         </div>
//       </div>

//       {/* Role & Permissions */}
//       <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
//         <h3 className="font-semibold text-emerald-600 mb-2">Role & Permissions</h3>
//         <p className="text-sm text-gray-600">Staff - Full Access</p>
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-col space-y-3">
//         <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-shadow">
//           Update Password
//         </button>
//         <button className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-shadow">
//           Notification Preferences
//         </button>
//       </div>
//     </div>
//   </div>
// );


// // Communication Section
// const CommunicationSection: React.FC = () => (
//   <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 space-y-6">
//     <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Company Communication</h2>
//     <div className="space-y-4">
//       {sampleAnnouncements.map((ann) => (
//         <div key={ann.id} className="border-l-4 border-emerald-500 pl-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
//           <h3 className="font-semibold text-gray-900 mb-1">{ann.title}</h3>
//           <p className="text-gray-600 mb-3">{ann.content}</p>
//           <button className="text-emerald-600 hover:underline text-sm">Read More</button>
//         </div>
//       ))}
//     </div>
//     <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
//       <h3 className="font-semibold text-blue-600 mb-2">Internal Messages</h3>
//       <p className="text-sm text-gray-600">No new messages. Check inbox for updates.</p>
//     </div>
//   </div>
// );

// // Main Dashboard Component
// const StaffDashboard = ({ 
//   role = { name: 'Staff', permissions: [] }, 
//   user = { name: 'User', email: 'user@example.com' } 
// }) => {
//   const [activeSection, setActiveSection] = useState('overview');
//   const [collapsed, setCollapsed] = useState(false);

//   const renderSection = () => {
//     switch (activeSection) {
//       case 'overview':
//         return <OverviewSection user={user} />;
//       case 'tasks':
//         return <TaskSection />;
//       case 'orders':
//         return <OrderSection />;
//       case 'support':
//         return role.permissions.includes('support') ? <SupportSection /> : <div className="text-center p-8 text-gray-500">Support access not available for your role.</div>;
//       case 'inventory':
//         return role.permissions.includes('inventory') ? <InventorySection /> : <div className="text-center p-8 text-gray-500">Inventory access not available for your role.</div>;
//       case 'attendance':
//         return <AttendanceSection />;
//       case 'reports':
//         return <ReportsSection />;
//       case 'profile':
//         return <ProfileSection user={user} />;
//       case 'communication':
//         return <CommunicationSection />;
//       default:
//         return <OverviewSection user={user} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
//       <div className={`flex transition-all duration-300 `}>
//         <Sidebar 
//           activeSection={activeSection} 
//           onSectionChange={setActiveSection} 
//           role={role} 
//           collapsed={collapsed} 
//           onToggle={() => setCollapsed(!collapsed)} 
//         />
//         <main className="flex-1 p-4 lg:p-6 overflow-auto">
//           <div className="max-w-7xl mx-auto">
//             {renderSection()}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default StaffDashboard;

























































import React, { useState, useEffect } from 'react';
import {
  BarChart3, MessageCircle, TrendingUp, Users, Calendar, CheckCircle, AlertCircle,
  Bell, User, ChevronLeft, ChevronRight, Star, LayoutDashboard, Mail, Activity,
  FileText, Settings, Clock, Award, LineChart, Loader2, XCircle, Search, Plus,
  Edit3, Trash2, Filter, Eye, Send, Reply, Save, Upload, Download
} from 'lucide-react';

// Mock data fetch simulation
const fetchMockData = async (section) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = {
        dashboard: {
          stats: [
            { title: 'Overall Rating', value: '4.8', icon: Star, color: 'bg-blue-500' },
            { title: 'Total Reviews', value: '1,234', icon: MessageCircle, color: 'bg-indigo-500' },
            { title: 'This Month', value: '+12%', icon: TrendingUp, color: 'bg-green-500' },
            { title: 'Response Rate', value: '98%', icon: Users, color: 'bg-yellow-500' }
          ],
          communications: [
            { id: 1, sender: 'John Doe', message: 'Follow up on project X', time: '2 hours ago', type: 'email' },
            { id: 2, sender: 'Jane Smith', message: 'Meeting rescheduled', time: '1 day ago', type: 'chat' },
            { id: 3, sender: 'Team Lead', message: 'Review feedback', time: '3 days ago', type: 'notification' }
          ],
          meetings: [
            { id: 1, title: 'Team Sync', time: 'Tomorrow 10 AM', status: 'Upcoming' },
            { id: 2, title: 'Client Call', time: 'Next Week', status: 'Pending' }
          ],
          tasks: [
            { id: 1, title: 'Complete Report', status: 'In Progress', badge: 'primary' },
            { id: 2, title: 'Update Docs', status: 'Completed', badge: 'success' },
            { id: 3, title: 'Bug Fix', status: 'Pending', badge: 'warning' }
          ]
        },
        communications: {
          messages: [
            { id: 1, from: 'John Doe', subject: 'Project Update', body: 'Hi, just checking in on the progress...', time: '2 hours ago', unread: true },
            { id: 2, from: 'Jane Smith', subject: 'Meeting Notes', body: 'Here are the notes from yesterday...', time: '1 day ago', unread: false },
            { id: 3, from: 'Team Lead', subject: 'Feedback Requested', body: 'Please review the attached file...', time: '3 days ago', unread: true },
            { id: 4, from: 'Client', subject: 'Invoice Query', body: 'Could you clarify the charges?', time: '5 days ago', unread: false }
          ]
        },
        meetings: {
          events: [
            { id: 1, title: 'Team Sync', start: '2025-12-19T10:00', end: '2025-12-19T11:00', attendees: 5, status: 'Upcoming' },
            { id: 2, title: 'Client Call', start: '2025-12-25T14:00', end: '2025-12-25T15:00', attendees: 3, status: 'Scheduled' },
            { id: 3, title: 'Weekly Review', start: '2025-12-22T09:00', end: '2025-12-22T10:00', attendees: 8, status: 'In Progress' }
          ]
        },
        tasks: {
          tasks: [
            { id: 1, title: 'Complete Report', description: 'Finalize Q4 financial report', due: '2025-12-20', priority: 'High', status: 'In Progress' },
            { id: 2, title: 'Update Docs', description: 'Revise user manual', due: '2025-12-18', priority: 'Medium', status: 'Completed' },
            { id: 3, title: 'Bug Fix', description: 'Resolve login issue', due: '2025-12-21', priority: 'High', status: 'Pending' },
            { id: 4, title: 'Client Follow-up', description: 'Send proposal email', due: '2025-12-19', priority: 'Low', status: 'Pending' }
          ]
        },
        analytics: {
          monthlyData: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 75, 85],
          weeklyData: [20, 25, 18, 30, 22, 35, 28]
        },
        notifications: {
          notifs: [
            { id: 1, type: 'message', title: 'New Message from John', time: '2 hours ago', read: false },
            { id: 2, type: 'meeting', title: 'Meeting Reminder: Team Sync', time: '1 day ago', read: true },
            { id: 3, type: 'task', title: 'Task Overdue: Bug Fix', time: '3 days ago', read: false },
            { id: 4, type: 'review', title: 'New Review Received', time: '5 days ago', read: false }
          ]
        },
        profile: {
          user: {
            name: 'John Doe',
            email: 'john.doe@company.com',
            role: 'Staff Member',
            avatar: '',
            bio: 'Experienced developer with 5+ years in web development.'
          }
        }
      };
      resolve(data[section] || {});
    }, 800); // Reduced delay for better UX
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
    { icon: Mail, label: 'Communications', key: 'communications', active: activeSection === 'communications' },
    { icon: Calendar, label: 'Meetings', key: 'meetings', active: activeSection === 'meetings' },
    { icon: FileText, label: 'Tasks', key: 'tasks', active: activeSection === 'tasks' },
    { icon: BarChart3, label: 'Analytics', key: 'analytics', active: activeSection === 'analytics' },
    { icon: Bell, label: 'Notifications', key: 'notifications', active: activeSection === 'notifications' },
    { icon: User, label: 'Profile', key: 'profile', active: activeSection === 'profile' }
  ];

  return (
    <div className={`bg-gray-800 text-white fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} lg:translate-x-0 lg:w-${isOpen ? '64' : '20'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <h1 className={`${isOpen ? 'block' : 'hidden'} lg:hidden text-xl font-bold`}>Staff Dashboard</h1>
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

// Dashboard Section
const DashboardSection = ({ loading, data }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

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

  const RecentCommunications = ({ data }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Activity size={20} className="mr-2 text-indigo-600" />
        Recent Communications
      </h3>
      <div className="space-y-4">
        {data.map((comm) => (
          <div key={comm.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className={`p-2 rounded-full ${comm.type === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
              {comm.type === 'email' ? <Mail size={16} /> : <MessageCircle size={16} />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{comm.message}</p>
              <p className="text-sm text-gray-500">{comm.sender} • {comm.time}</p>
            </div>
          </div>
        ))}
      </div>
      {data.length > 0 && (
        <div className="mt-6 flex justify-between">
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">Back Communications</button>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">View All Communications</button>
        </div>
      )}
    </div>
  );

  const MeetingsCard = ({ data }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar size={20} className="mr-2 text-green-600" />
        Upcoming Meetings
      </h3>
      <div className="space-y-3">
        {data.map((meeting) => (
          <div key={meeting.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{meeting.title}</p>
              <p className="text-sm text-gray-500">{meeting.time}</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{meeting.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const TasksList = ({ data }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileText size={20} className="mr-2 text-yellow-600" />
        Tasks
      </h3>
      <div className="space-y-3">
        {data.map((task) => (
          <div key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-500">{task.status}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              task.badge === 'primary' ? 'bg-indigo-100 text-indigo-800' :
              task.badge === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>{task.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats?.map((stat, idx) => <StatsCard key={idx} {...stat} />) || []}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCommunications data={data.communications || []} />
        <div className="space-y-6">
          <MeetingsCard data={data.meetings || []} />
          <TasksList data={data.tasks || []} />
        </div>
      </div>

      {/* Bottom Section - Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <LineChart size={20} className="mr-2 text-purple-600" />
            Monthly Performance
          </h3>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 italic">Placeholder for Line Chart</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 size={20} className="mr-2 text-purple-600" />
            Weekly Overview
          </h3>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 italic">Placeholder for Bar Chart</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Communications Section
const CommunicationsSection = ({ loading, data }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Communications</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
            <Search size={18} className="text-gray-500" />
            <input type="text" placeholder="Search messages..." className="outline-none text-sm" />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors">
            <Plus size={18} />
            <span>New Message</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4 text-sm font-medium text-gray-500">
            <button className="flex items-center space-x-1 text-indigo-600 border-b-2 border-indigo-600 pb-1">
              <Mail size={16} /> <span>Inbox</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-700">Sent</button>
            <button className="flex items-center space-x-1 hover:text-gray-700">Drafts</button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {data.messages?.map((msg) => (
            <div key={msg.id} className={`p-4 hover:bg-gray-50 transition-colors ${msg.unread ? 'bg-blue-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{msg.from}</h4>
                      <p className="text-sm text-gray-600">{msg.subject}</p>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{msg.body}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-gray-500">{msg.time}</p>
                  {msg.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mx-auto"></div>}
                </div>
              </div>
            </div>
          )) || []}
        </div>
      </div>
      {data.messages?.length === 0 && (
        <div className="text-center py-12">
          <Mail size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
          <p className="text-gray-500">Start a conversation to get things moving.</p>
        </div>
      )}
    </div>
  );
};

// Meetings Section
const MeetingsSection = ({ loading, data }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Meetings</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
          <Plus size={18} />
          <span>Schedule New</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold mb-4">Upcoming Events</h4>
        <div className="space-y-4">
          {data.events?.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{event.title}</h5>
                <p className="text-sm text-gray-500">
                  {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{event.attendees} attendees</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                event.status === 'Upcoming' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {event.status}
              </span>
            </div>
          )) || []}
        </div>
        {data.events?.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Meetings Scheduled</h3>
            <p className="text-gray-500">Your calendar looks free. Schedule something?</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Tasks Section
const TasksSection = ({ loading, data }) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e) => {
    if (e.key === 'Enter' && newTask.trim()) {
      // Simulate add task
      setNewTask('');
    }
  };

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
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Tasks</h3>
        <div className="flex items-center space-x-4">
          <Filter size={18} className="text-gray-500 cursor-pointer" />
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-yellow-700 transition-colors">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleAddTask}
            placeholder="Add a new task..."
            className="w-full p-3 border rounded-lg outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-3">
          {data.tasks?.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{task.title}</h5>
                <p className="text-sm text-gray-500">{task.description}</p>
                <p className="text-xs text-gray-400">Due: {task.due} • Priority: {task.priority}</p>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-green-600 hover:bg-green-100 rounded">
                  <CheckCircle size={16} />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                  <Edit3 size={16} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )) || []}
        </div>
        {data.tasks?.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tasks</h3>
            <p className="text-gray-500">Add your first task to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Analytics Section
const AnalyticsSection = ({ loading, data }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Analytics</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4">Monthly Performance</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 italic">Interactive Line Chart Placeholder</p>
            <p className="text-xs text-gray-400 mt-2">Data points: {data.monthlyData?.length || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4">Weekly Metrics</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 italic">Interactive Bar Chart Placeholder</p>
            <p className="text-xs text-gray-400 mt-2">Data points: {data.weeklyData?.length || 0}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold mb-4">Key Insights</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Performance up 15% from last month</li>
          <li>• Response time averaged 2.1 hours</li>
          <li>• Top channel: Email (65% of interactions)</li>
        </ul>
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
            <h4 className="text-lg font-semibold">All Notifications</h4>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Mark All Read</button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {data.notifs?.map((notif) => (
            <div key={notif.id} className={`p-4 ${notif.read ? 'bg-white' : 'bg-blue-50'}`}>
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${notif.type === 'message' ? 'bg-blue-100 text-blue-600' : notif.type === 'meeting' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {notif.type === 'message' ? <MessageCircle size={16} /> : notif.type === 'meeting' ? <Calendar size={16} /> : <Bell size={16} />}
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
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Profile Section
const ProfileSection = ({ loading, data }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(data.user || {});

  const handleSave = () => {
    // Simulate save
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
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
            <User size={48} className="text-indigo-600" />
          </div>
          {editMode && (
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg">
              <Upload size={16} className="text-gray-600" />
            </button>
          )}
        </div>
        <h3 className="text-2xl font-bold mt-4">{profile.name}</h3>
        <p className="text-gray-500">{profile.role}</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold">Profile Details</h4>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
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

// Main StaffDashboard Component
const StaffDashboard = () => {
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
      case 'communications':
        return <CommunicationsSection loading={loading} data={sectionData} />;
      case 'meetings':
        return <MeetingsSection loading={loading} data={sectionData} />;
      case 'tasks':
        return <TasksSection loading={loading} data={sectionData} />;
      case 'analytics':
        return <AnalyticsSection loading={loading} data={sectionData} />;
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

export default StaffDashboard;