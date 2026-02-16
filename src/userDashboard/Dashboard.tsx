// import React, { useState, useEffect } from 'react';
// import { 
//   LayoutDashboard, Hotel, Utensils, Settings, Clock, CreditCard, 
//   MapPin, Bed, Users, ChevronRight, Bell, Search, Menu, X, ChevronDown,
//   Shield, FileText
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// // --- Types ---
// type View = 'dashboard' | 'hotel' | 'restaurant' | 'settings' | 'history' | 'payment';

// interface HotelData {
//   id: number;
//   name: string;
//   location: string;
//   status: 'Available' | 'Full';
//   image: string;
// }

// interface RestaurantData {
//   id: number;
//   name: string;
//   location: string;
//   status: 'Open' | 'Closed';
//   image: string;
// }

// interface HistoryItem {
//   id: number;
//   type: 'hotel' | 'restaurant';
//   name: string;
//   location: string;
//   action: string;
//   timestamp: string;
// }

// interface PaymentItem {
//   id: number;
//   date: string;
//   amount: string;
//   description: string;
//   status: 'Completed' | 'Pending' | 'Failed';
//   transactionId: string;
// }

// // --- Mock Data ---
// const HOTELS: HotelData[] = [
//   { id: 1, name: "Grand Royale", location: "Mumbai", status: "Available", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80" },
//   { id: 2, name: "Ocean Breeze", location: "Goa", status: "Full", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=300&q=80" },
//   { id: 3, name: "Mountain View", location: "Shimla", status: "Available", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80" },
//   { id: 4, name: "Desert Oasis", location: "Jaisalmer", status: "Full", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=300&q=80" },
// ];

// const RESTAURANTS: RestaurantData[] = [
//   { id: 1, name: "Spice Haven", location: "Mumbai", status: "Open", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80" },
//   { id: 2, name: "Ocean Grill", location: "Goa", status: "Open", image: "https://images.unsplash.com/photo-1514320291840-2e0d8a6e0e6f?auto=format&fit=crop&w=300&q=80" },
//   { id: 3, name: "Alpine Bistro", location: "Shimla", status: "Closed", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=300&q=80" },
//   { id: 4, name: "Silk Route Cafe", location: "Jaisalmer", status: "Open", image: "https://images.unsplash.com/photo-1579586145102-8e19d5b1e05d?auto=format&fit=crop&w=300&q=80" },
// ];

// const HISTORY: HistoryItem[] = [
//   { id: 1, type: 'hotel', name: 'Grand Royale', location: 'Mumbai', action: 'Viewed Rooms', timestamp: '2 min ago' },
//   { id: 2, type: 'restaurant', name: 'Spice Haven', location: 'Mumbai', action: 'Reserved Table', timestamp: '5 min ago' },
//   { id: 3, type: 'hotel', name: 'Ocean Breeze', location: 'Goa', action: 'Checked Availability', timestamp: '10 min ago' },
//   { id: 4, type: 'restaurant', name: 'Ocean Grill', location: 'Goa', action: 'Viewed Menu', timestamp: '15 min ago' },
//   { id: 5, type: 'hotel', name: 'Mountain View', location: 'Shimla', action: 'Booked Room 201', timestamp: '20 min ago' },
// ];

// const PAYMENTS: PaymentItem[] = [
//   { id: 1, date: 'Dec 10, 2025', amount: '₹4,500', description: 'Room Booking - Grand Royale', status: 'Completed', transactionId: '#TXN123456' },
//   { id: 2, date: 'Dec 08, 2025', amount: '₹1,200', description: 'Table Reservation - Spice Haven', status: 'Completed', transactionId: '#TXN123457' },
//   { id: 3, date: 'Dec 05, 2025', amount: '₹3,200', description: 'Room Extension - Ocean Breeze', status: 'Pending', transactionId: '#TXN123458' },
//   { id: 4, date: 'Dec 02, 2025', amount: '₹800', description: 'Cancellation Fee - Alpine Bistro', status: 'Completed', transactionId: '#TXN123459' },
//   { id: 5, date: 'Nov 28, 2025', amount: '₹6,000', description: 'Full Stay - Mountain View', status: 'Completed', transactionId: '#TXN123460' },
// ];

// const Dashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<View>('dashboard');
//   const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
//   const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantData | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//     const [hotelList, setHotelList] = useState([]);
  
//   const accessToken = localStorage.getItem("accessToken");

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     if (!isMobile) {
//       setIsSidebarOpen(false);
//     }
//   }, [isMobile]);

//   const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  
//      const handleGetHotels = async() => {
//       try{
//       const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/`, {
//         method:"GET",
//         headers:{
//           Authorization:`Bearer ${accessToken}`
//         }
//       })
//         const data = await response.json();
//         console.log("data",data)
//         setHotelList(data)
//       }
//       catch(error){
//         console.log(error)
//         return 
//       }
//      }
  
//      useEffect(()=>{
//       handleGetHotels();
//      },[])

//   // Sidebar Component
//   const Sidebar = () => {
//     if (isMobile) {
//       return (
//         <motion.div 
//           initial={{ x: -256 }} 
//           animate={{ x: isSidebarOpen ? 0 : -256 }} 
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//           className={`${sidebarWidth} h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white p-2 md:p-6 fixed left-0 top-0 z-50 border-r border-white/10 shadow-2xl`}
//         >
//           <div className="flex items-center justify-between mb-6 md:mb-10 px-2">
//             <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : ''}`}>
//               <div className="w-8 h-8 bg-amber-500 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
//               <h1 className="text-xl font-bold tracking-tight">LUXE<span className="text-amber-500">MGMT</span></h1>
//             </div>
//             <button 
//               onClick={() => setIsSidebarOpen(false)} 
//               className="text-white hover:text-amber-500 transition-colors"
//             >
//               <X size={24} />
//             </button>
//           </div>
          
//           <nav className="space-y-2 mb-8">
//             {[
//               { id: 'dashboard' as View, icon: LayoutDashboard, label: 'Dashboard' },
//               { id: 'hotel' as View, icon: Hotel, label: 'Hotels' },
//               { id: 'restaurant' as View, icon: Utensils, label: 'Restaurants' },
//               { id: 'history' as View, icon: Clock, label: 'Recent History' },
//               { id: 'payment' as View, icon: CreditCard, label: 'Payment History' },
//               { id: 'settings' as View, icon: Settings, label: 'Settings' },
//             ].map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => { 
//                   setActiveTab(item.id); 
//                   setSelectedHotel(null); 
//                   setSelectedRestaurant(null);
//                   setIsSidebarOpen(false);
//                 }}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
//                   activeTab === item.id 
//                   ? 'bg-amber-500/20 text-amber-500 shadow-[inset_0_0_10px_rgba(245,158,11,0.2)] border-r-4 border-amber-500' 
//                   : 'text-gray-400 hover:bg-white/10 hover:text-white'
//                 }`}
//               >
//                 <item.icon size={20} className="group-hover:scale-110 transition-transform flex-shrink-0" />
//                 <span className="font-medium">{item.label}</span>
//               </button>
//             ))}
//           </nav>
//         </motion.div>
//       );
//     }

//     // Desktop version - no motion
//     return (
//       <div className={`${sidebarWidth} h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white p-2 md:p-6 fixed left-0 top-0 z-50 border-r border-white/10 shadow-2xl`}>
//         <div className="flex items-center justify-between mb-6 md:mb-10 px-2">
//           <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : ''}`}>
//             <div className="w-8 h-8 bg-amber-500 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
//             <h1 className="text-xl font-bold tracking-tight">LUXE<span className="text-amber-500">MGMT</span></h1>
//           </div>
//           <button 
//             onClick={() => setIsCollapsed(!isCollapsed)} 
//             className="p-1 rounded hover:bg-white/10 transition-colors"
//           >
//             <ChevronRight className={`${isCollapsed ? 'rotate-180' : ''}`} size={20} />
//           </button>
//         </div>
        
//         <nav className="space-y-2 mb-8">
//           {[
//             { id: 'dashboard' as View, icon: LayoutDashboard, label: 'Dashboard' },
//             { id: 'hotel' as View, icon: Hotel, label: 'Hotels' },
//             { id: 'restaurant' as View, icon: Utensils, label: 'Restaurants' },
//             { id: 'history' as View, icon: Clock, label: 'Recent History' },
//             { id: 'payment' as View, icon: CreditCard, label: 'Payment History' },
//             { id: 'settings' as View, icon: Settings, label: 'Settings' },
//           ].map((item) => (
//             <button
//               key={item.id}
//               onClick={() => { 
//                 setActiveTab(item.id); 
//                 setSelectedHotel(null); 
//                 setSelectedRestaurant(null);
//               }}
//               className={`w-full flex ${isCollapsed ? 'justify-center' : 'items-center gap-4'} px-4 py-3 rounded-xl transition-all duration-300 group ${
//                 activeTab === item.id 
//                 ? 'bg-amber-500/20 text-amber-500 shadow-[inset_0_0_10px_rgba(245,158,11,0.2)] border-r-4 border-amber-500' 
//                 : 'text-gray-400 hover:bg-white/10 hover:text-white'
//               }`}
//             >
//               <item.icon size={20} className="group-hover:scale-110 transition-transform flex-shrink-0" />
//               <span className={`font-medium transition-all ${isCollapsed ? 'hidden' : ''}`}>{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>
//     );
//   };

//   // Mobile Overlay
//   const Overlay = () => (
//     <motion.div 
//       initial={{ opacity: 0 }} 
//       animate={{ opacity: isSidebarOpen ? 1 : 0 }} 
//       onClick={() => setIsSidebarOpen(false)}
//       className="fixed inset-0 bg-black/50 z-40 md:hidden"
//     />
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-['Inter'] text-slate-800 flex">
//       <Sidebar />
//       {isSidebarOpen && <Overlay />}
      
//       {/* Main Content */}
//       <main className={`flex-1 p-2 md:p-4 relative z-10 ml-0 md:ml-${isCollapsed ? '16' : '64'}`}>
//         {/* Header */}
//         <header className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-3xl shadow-lg border border-white/50">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
//               className="md:hidden p-2 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors"
//             >
//               <Menu size={24} className="text-slate-700" />
//             </button>
//             <div>
//               <h2 className="text-sm text-slate-500 font-medium tracking-wide">WELCOME BACK,</h2>
//               <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Aryan Sharma</h1>
//             </div>
//           </div>
//           <div className="flex gap-4 items-center">
//             <div className="relative p-2 bg-white rounded-full shadow-md border border-slate-100 cursor-pointer hover:scale-105 transition-all">
//               <Bell size={20} className="text-slate-600" />
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
//             </div>
//             <img src="https://ui-avatars.com/api/?name=Aryan+Sharma&background=1e40af&color=fff&size=40" className="w-10 h-10 rounded-full border-2 border-slate-200 shadow-lg" alt="profile" />
//           </div>
//         </header>

//         <AnimatePresence mode="wait">
//           {activeTab === 'dashboard' && (
//             <motion.div 
//               key="dashboard"
//               initial={{ opacity: 0, y: 20 }} 
//               animate={{ opacity: 1, y: 0 }} 
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-6"
//             >
//               {/* Summary Cards */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {[
//                   { label: 'Total Hotels', value: '12', icon: Hotel, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
//                   { label: 'Restaurants', value: '08', icon: Utensils, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
//                   { label: 'Total Rooms', value: '142', icon: Bed, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
//                   { label: 'Tables', value: '64', icon: Users, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
//                 ].map((card, i) => (
//                   <motion.div 
//                     key={i} 
//                     whileHover={{ y: -5, scale: 1.02 }} 
//                     className={`bg-white p-4 rounded-2xl shadow-md border border-white/50 ${card.bg} hover:shadow-xl transition-all`}
//                   >
//                     <div className={`p-3 rounded-xl mb-3 bg-white/20 ${card.bg}`}>
//                       <card.icon size={24} className={`text-${card.color.split('-')[0]}-500`} />
//                     </div>
//                     <p className="text-slate-600 text-sm font-medium mb-2">{card.label}</p>
//                     <h3 className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>{card.value}</h3>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Analytics Section */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-md border border-white/50">
//                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
//                     Occupancy Trends <Bell size={16} className="text-amber-500" />
//                   </h3>
//                   <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-slate-400 italic border-dashed border-2 border-slate-200">
//                     [ Interactive Chart: Line graph showing 85% average occupancy this month ]
//                   </div>
//                 </div>
//                 <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-md border border-white/50">
//                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
//                     Revenue Overview <Search size={16} className="text-emerald-500" />
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex justify-between">
//                       <span className="text-slate-600">This Month</span>
//                       <span className="font-bold text-emerald-600">₹2.45L</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-slate-600">Last Month</span>
//                       <span className="font-bold text-slate-500">₹1.98L</span>
//                     </div>
//                     <div className="w-full bg-slate-200 rounded-full h-2">
//                       <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {activeTab === 'history' && (
//             <motion.div 
//               key="history"
//               initial={{ opacity: 0, x: -20 }} 
//               animate={{ opacity: 1, x: 0 }} 
//               exit={{ opacity: 0, x: 20 }}
//               className="space-y-6"
//             >
//               <h2 className="text-3xl font-bold mb-6 text-slate-900 flex items-center gap-3">
//                 <Clock size={32} className="text-amber-500" /> Recent History
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {HISTORY.map((item) => (
//                   <motion.div 
//                     key={item.id} 
//                     whileHover={{ y: -4 }} 
//                     className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-all"
//                   >
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className={`w-3 h-3 rounded-full ${item.type === 'hotel' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
//                       <div className="flex-1">
//                         <h3 className="font-bold text-slate-900">{item.name}</h3>
//                         <p className="text-sm text-slate-500">{item.location}</p>
//                       </div>
//                     </div>
//                     <p className="text-slate-600 mb-3">{item.action}</p>
//                     <p className="text-xs text-slate-400">{item.timestamp}</p>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {activeTab === 'payment' && (
//             <motion.div 
//               key="payment"
//               initial={{ opacity: 0, x: -20 }} 
//               animate={{ opacity: 1, x: 0 }} 
//               exit={{ opacity: 0, x: 20 }}
//               className="space-y-6"
//             >
//               <h2 className="text-3xl font-bold mb-6 text-slate-900 flex items-center gap-3">
//                 <CreditCard size={32} className="text-amber-500" /> Payment History
//               </h2>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 {PAYMENTS.map((payment) => (
//                   <motion.div 
//                     key={payment.id} 
//                     whileHover={{ y: -4 }} 
//                     className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-all"
//                   >
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="space-y-1">
//                         <h3 className="font-bold text-slate-900 text-lg">{payment.description}</h3>
//                         <p className="text-sm text-slate-500">Date: {payment.date}</p>
//                         <p className="text-xs text-slate-400">Transaction ID: {payment.transactionId}</p>
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                         payment.status === 'Completed' 
//                           ? 'bg-emerald-100 text-emerald-700' 
//                           : payment.status === 'Pending' 
//                           ? 'bg-amber-100 text-amber-700' 
//                           : 'bg-red-100 text-red-700'
//                       }`}>
//                         {payment.status}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center pt-4 border-t border-slate-100">
//                       <p className="text-slate-600">Amount</p>
//                       <h4 className="font-bold text-2xl text-emerald-600">{payment.amount}</h4>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {activeTab === 'hotel' && !selectedHotel && (
//             <motion.div 
//               key="hotels-list"
//               initial={{ opacity: 0, x: -20 }} 
//               animate={{ opacity: 1, x: 0 }} 
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
//             >
//               {HOTELS.map((hotel) => (
//                 <motion.div 
//                   key={hotel.id} 
//                   whileHover={{ y: -8, scale: 1.02 }} 
//                   className="bg-white rounded-2xl overflow-hidden shadow-lg border border-white/50 group hover:shadow-2xl transition-all duration-300"
//                 >
//                   <div className="relative h-48 overflow-hidden">
//                     <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                     <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${
//                       hotel.status === 'Available' 
//                         ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30' 
//                         : 'bg-red-500/20 text-red-700 border border-red-500/30'
//                     }`}>
//                       {hotel.status}
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <h3 className="text-xl font-bold mb-2 text-slate-900">{hotel.name}</h3>
//                     <div className="flex items-center text-slate-500 text-sm mb-6">
//                       <MapPin size={14} className="mr-1" /> {hotel.location}
//                     </div>
//                     <button 
//                       onClick={() => setSelectedHotel(hotel)}
//                       className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-600 transition-all flex items-center justify-center gap-2 group"
//                     >
//                       View Rooms <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}

//           {activeTab === 'hotel' && selectedHotel && (
//             <motion.div 
//               key="hotel-detail"
//               initial={{ opacity: 0, x: 20 }} 
//               animate={{ opacity: 1, x: 0 }}
//               className="space-y-6"
//             >
//               <button 
//                 onClick={() => setSelectedHotel(null)} 
//                 className="flex items-center gap-2 text-slate-600 hover:text-amber-600 font-medium transition-colors mb-6"
//               >
//                 <ChevronRight className="rotate-180" size={20} /> Back to Hotels
//               </button>
//               <h2 className="text-3xl font-bold mb-6 text-slate-900">Rooms in {selectedHotel.name}</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {[101, 102, 201, 202, 301, 302, 401].map(num => (
//                   <motion.div 
//                     key={num} 
//                     whileHover={{ y: -4 }} 
//                     className="bg-gradient-to-br from-white to-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all"
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white shadow-lg">
//                         <Bed size={24} />
//                       </div>
//                       <span className={`text-xs font-bold px-3 py-1 rounded-full ${
//                         num % 2 === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
//                       }`}>
//                         {num % 2 === 0 ? 'AVAILABLE' : 'BOOKED'}
//                       </span>
//                     </div>
//                     <h4 className="font-bold text-lg text-slate-900">Room {num}</h4>
//                     <p className="text-slate-500 text-sm mb-4">Deluxe Double Suite with Balcony</p>
//                     <div className="flex justify-between items-center pt-4 border-t border-slate-100">
//                       <span className="font-bold text-slate-900">₹4,500<span className="text-xs text-slate-500">/night</span></span>
//                       <button className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${
//                         num % 2 === 0 
//                           ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700' 
//                           : 'bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700'
//                       }`}>
//                         {num % 2 === 0 ? 'BOOK NOW' : 'VIEW'}
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {activeTab === 'restaurant' && !selectedRestaurant && (
//             <motion.div 
//               key="restaurants-list"
//               initial={{ opacity: 0, x: -20 }} 
//               animate={{ opacity: 1, x: 0 }} 
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
//             >
//               {RESTAURANTS.map((restaurant) => (
//                 <motion.div 
//                   key={restaurant.id} 
//                   whileHover={{ y: -8, scale: 1.02 }} 
//                   className="bg-white rounded-2xl overflow-hidden shadow-lg border border-white/50 group hover:shadow-2xl transition-all duration-300"
//                 >
//                   <div className="relative h-48 overflow-hidden">
//                     <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                     <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${
//                       restaurant.status === 'Open' 
//                         ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30' 
//                         : 'bg-red-500/20 text-red-700 border border-red-500/30'
//                     }`}>
//                       {restaurant.status}
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <h3 className="text-xl font-bold mb-2 text-slate-900">{restaurant.name}</h3>
//                     <div className="flex items-center text-slate-500 text-sm mb-6">
//                       <MapPin size={14} className="mr-1" /> {restaurant.location}
//                     </div>
//                     <button 
//                       onClick={() => setSelectedRestaurant(restaurant)}
//                       className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 group"
//                     >
//                       View Tables <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}

//           {activeTab === 'restaurant' && selectedRestaurant && (
//             <motion.div 
//               key="restaurant-detail"
//               initial={{ opacity: 0, x: 20 }} 
//               animate={{ opacity: 1, x: 0 }}
//               className="space-y-6"
//             >
//               <button 
//                 onClick={() => setSelectedRestaurant(null)} 
//                 className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors mb-6"
//               >
//                 <ChevronRight className="rotate-180" size={20} /> Back to Restaurants
//               </button>
//               <h2 className="text-3xl font-bold mb-6 text-slate-900">Tables in {selectedRestaurant.name}</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {[1, 2, 3, 4, 5, 6, 7].map(num => (
//                   <motion.div 
//                     key={num} 
//                     whileHover={{ y: -4 }} 
//                     className="bg-gradient-to-br from-white to-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all"
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
//                         <Users size={24} />
//                       </div>
//                       <span className={`text-xs font-bold px-3 py-1 rounded-full ${
//                         num % 3 !== 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
//                       }`}>
//                         {num % 3 !== 0 ? 'AVAILABLE' : 'OCCUPIED'}
//                       </span>
//                     </div>
//                     <h4 className="font-bold text-lg text-slate-900">Table {num}</h4>
//                     <p className="text-slate-500 text-sm mb-4">4-Seater Outdoor</p>
//                     <div className="flex justify-between items-center pt-4 border-t border-slate-100">
//                       <span className="font-bold text-slate-900">₹1,200<span className="text-xs text-slate-500">/reservation</span></span>
//                       <button className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${
//                         num % 3 !== 0 
//                           ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700' 
//                           : 'bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700'
//                       }`}>
//                         {num % 3 !== 0 ? 'RESERVE' : 'MANAGE'}
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {activeTab === 'settings' && (
//             <motion.div 
//               key="settings"
//               initial={{ opacity: 0, scale: 0.98 }} 
//               animate={{ opacity: 1, scale: 1 }} 
//               className="max-w-4xl mx-auto space-y-6"
//             >
//               <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
//                 <Settings size={32} className="text-amber-500" /> Account Settings
//               </h2>
              
//               {/* Profile Section */}
//               <motion.div 
//                 whileHover={{ y: -2 }} 
//                 className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 overflow-hidden relative"
//               >
//                 <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
//                 <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
//                   <div className="relative group">
//                     <img 
//                       src="https://ui-avatars.com/api/?name=Aryan+Sharma&background=1e40af&color=fff&size=128" 
//                       className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl transition-all group-hover:scale-105" 
//                       alt="Profile" 
//                     />
//                     <button className="absolute -bottom-3 -right-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-3 rounded-2xl shadow-lg hover:from-amber-500 hover:to-amber-600 transition-all">
//                       <Search size={16} />
//                     </button>
//                   </div>
                  
//                   <div className="flex-1 space-y-4 w-full">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-1">
//                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
//                         <input type="text" defaultValue="Aryan Sharma" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-medium" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
//                         <input type="email" defaultValue="aryan@luxe.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-medium" />
//                       </div>
//                     </div>
//                     <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all active:scale-95 w-full md:w-auto">
//                       Update Profile
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Security Section */}
//               <motion.div 
//                 whileHover={{ y: -2 }} 
//                 className="bg-white rounded-2xl p-6 shadow-lg border border-white/50"
//               >
//                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
//                   <div className="w-2 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
//                   Change Password
//                 </h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Password</label>
//                     <input 
//                       type="password" 
//                       placeholder="Enter current password" 
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">New Password</label>
//                     <input 
//                       type="password" 
//                       placeholder="New secure password" 
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Confirm Password</label>
//                     <input 
//                       type="password" 
//                       placeholder="Confirm new password" 
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
//                     />
//                   </div>
//                 </div>
                
//                 <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
//                   <p className="text-sm text-slate-500 italic">Last changed: 3 months ago</p>
//                   <button className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-3 rounded-xl font-bold text-sm hover:from-slate-800 hover:to-slate-700 transition-all active:scale-95 w-full sm:w-auto">
//                     Save Changes
//                   </button>
//                 </div>
//               </motion.div>

//               {/* Preferences */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {[
//                   { title: 'Email Notifications', desc: 'Receive weekly performance reports', icon: Bell, color: 'emerald', enabled: true },
//                   { title: 'Dark Mode', desc: 'Toggle dashboard theme', icon: Settings, color: 'slate', enabled: false },
//                   { title: 'Two-Factor Auth', desc: 'Enable extra security layer', icon: Shield, color: 'blue', enabled: false },
//                   { title: 'Auto Reports', desc: 'Generate monthly summaries', icon: FileText, color: 'purple', enabled: true },
//                 ].map((pref, i) => (
//                   <motion.div 
//                     key={i} 
//                     whileHover={{ y: -2 }} 
//                     className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 flex justify-between items-center shadow-sm hover:shadow-md transition-all"
//                   >
//                     <div className="flex items-center gap-3">
//                       <pref.icon size={20} className={`text-${pref.color}-500`} />
//                       <div>
//                         <h4 className="font-bold text-slate-900">{pref.title}</h4>
//                         <p className="text-xs text-slate-500">{pref.desc}</p>
//                       </div>
//                     </div>
//                     <div className={`w-12 h-6 bg-${pref.enabled ? 'emerald-500' : 'slate-200'} rounded-full relative cursor-pointer transition-colors`}>
//                       <motion.div 
//                         className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
//                         animate={{ x: pref.enabled ? '100%' : 0 }}
//                         transition={{ duration: 0.2 }}
//                       />
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;


















































import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Home, Coffee, Star, LayoutDashboard, Hotel, Utensils, FileText, User,
  ChevronLeft, ChevronRight, Loader2, XCircle, Search, Filter, Eye, BookOpen, Bed, Table,
  MapPin, Phone, Mail, Image, Edit3, Save, Upload, Bell, Globe, Moon
} from 'lucide-react';

// Mock data fetch simulation
const fetchMockData = async (section) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = {
        dashboard: {
          stats: [
            { title: 'Total Bookings', value: '12', icon: Calendar, color: 'bg-blue-500' },
            { title: 'Upcoming Reservations', value: '3', icon: Clock, color: 'bg-indigo-500' },
            { title: 'Total Hotels', value: '5', icon: Home, color: 'bg-green-500' },
            { title: 'Total Restaurants', value: '8', icon: Coffee, color: 'bg-yellow-500' },
            { title: 'Favorite Items', value: '7', icon: Star, color: 'bg-purple-500' }
          ],
          hotels: [
            { id: 1, name: 'Grand Hotel Luxe', location: 'Downtown', rooms: 150, status: 'Available', image: 'https://picsum.photos/300/200?random=1' },
            { id: 2, name: 'Beachside Resort', location: 'Coastal Area', rooms: 200, status: 'Booked', image: 'https://picsum.photos/300/200?random=2' },
            { id: 3, name: 'City Inn', location: 'Urban Center', rooms: 80, status: 'Occupied', image: 'https://picsum.photos/300/200?random=3' }
          ],
          restaurants: [
            { id: 1, name: 'Italian Bistro', location: 'Main Street', tables: 20, status: 'Available', image: 'https://picsum.photos/300/200?random=4' },
            { id: 2, name: 'Sushi Spot', location: 'Harbor View', tables: 15, status: 'Occupied', image: 'https://picsum.photos/300/200?random=5' },
            { id: 3, name: 'Vegan Cafe', location: 'Park District', tables: 25, status: 'Available', image: 'https://picsum.photos/300/200?random=6' }
          ],
          roomsExample: [
            { id: 1, type: 'Deluxe Room', capacity: 2, price: '$150/night', amenities: 'WiFi, AC', status: 'Available', image: 'https://picsum.photos/150/100?random=7' },
            { id: 2, type: 'Suite', capacity: 4, price: '$300/night', amenities: 'Balcony, Kitchen', status: 'Booked', image: 'https://picsum.photos/150/100?random=8' }
          ],
          tablesExample: [
            { id: 1, type: 'Table for 2', capacity: 2, price: '$20/booking', status: 'Available', image: 'https://picsum.photos/150/100?random=9' },
            { id: 2, type: 'Booth for 4', capacity: 4, price: '$40/booking', status: 'Occupied', image: 'https://picsum.photos/150/100?random=10' }
          ],
          recentActivity: [
            { id: 1, type: 'Hotel Booking', details: 'Grand Hotel Luxe - Deluxe Room', date: '2025-12-20', status: 'Confirmed' },
            { id: 2, type: 'Restaurant Reservation', details: 'Italian Bistro - Table for 2', date: '2025-12-19', status: 'Upcoming' },
            { id: 3, type: 'Order', details: 'Delivery from Sushi Spot', date: '2025-12-18', status: 'Delivered' }
          ]
        },
        hotel: {
          hotels: [
            { id: 1, name: 'Grand Hotel Luxe', location: 'Downtown', rooms: 150, status: 'Available', rating: 4.8, image: 'https://picsum.photos/300/200?random=1' },
            { id: 2, name: 'Beachside Resort', location: 'Coastal Area', rooms: 200, status: 'Booked', rating: 4.5, image: 'https://picsum.photos/300/200?random=2' },
            { id: 3, name: 'City Inn', location: 'Urban Center', rooms: 80, status: 'Occupied', rating: 4.2, image: 'https://picsum.photos/300/200?random=3' },
            { id: 4, name: 'Mountain Lodge', location: 'Hillside', rooms: 120, status: 'Available', rating: 4.7, image: 'https://picsum.photos/300/200?random=11' }
          ],
          rooms: [
            { id: 1, type: 'Deluxe Room', capacity: 2, price: '$150/night', amenities: 'WiFi, AC', status: 'Available', image: 'https://picsum.photos/150/100?random=7' },
            { id: 2, type: 'Suite', capacity: 4, price: '$300/night', amenities: 'Balcony, Kitchen', status: 'Booked', image: 'https://picsum.photos/150/100?random=8' },
            { id: 3, type: 'Standard Room', capacity: 2, price: '$100/night', amenities: 'Basic', status: 'Occupied', image: 'https://picsum.photos/150/100?random=12' }
          ]
        },
        restaurant: {
          restaurants: [
            { id: 1, name: 'Italian Bistro', location: 'Main Street', tables: 20, status: 'Available', rating: 4.6, image: 'https://picsum.photos/300/200?random=4' },
            { id: 2, name: 'Sushi Spot', location: 'Harbor View', tables: 15, status: 'Occupied', rating: 4.9, image: 'https://picsum.photos/300/200?random=5' },
            { id: 3, name: 'Vegan Cafe', location: 'Park District', tables: 25, status: 'Available', rating: 4.3, image: 'https://picsum.photos/300/200?random=6' },
            { id: 4, name: 'Steak House', location: 'Downtown', tables: 30, status: 'Booked', rating: 4.7, image: 'https://picsum.photos/300/200?random=13' }
          ],
          tables: [
            { id: 1, type: 'Table for 2', capacity: 2, price: '$20/booking', status: 'Available', image: 'https://picsum.photos/150/100?random=9' },
            { id: 2, type: 'Booth for 4', capacity: 4, price: '$40/booking', status: 'Occupied', image: 'https://picsum.photos/150/100?random=10' },
            { id: 3, type: 'Outdoor Table for 6', capacity: 6, price: '$60/booking', status: 'Available', image: 'https://picsum.photos/150/100?random=14' }
          ]
        },
        orders: {
          orders: [
            { id: '#ORD001', type: 'Hotel', details: 'Grand Hotel Luxe', date: '2025-12-20', status: 'Confirmed', amount: '$150' },
            { id: '#ORD002', type: 'Restaurant', details: 'Italian Bistro', date: '2025-12-19', status: 'Upcoming', amount: '$50' },
            { id: '#ORD003', type: 'Delivery', details: 'Sushi Spot', date: '2025-12-18', status: 'Delivered', amount: '$35' },
            { id: '#ORD004', type: 'Hotel', details: 'Beachside Resort', date: '2025-12-25', status: 'Pending', amount: '$300' }
          ]
        },
        profile: {
          user: {
            name: 'Alex User',
            avatar: '',
            email: 'alex@example.com',
            preferences: { notifications: true, language: 'English', theme: 'Light' },
            bookingHistory: [
              { id: 1, type: 'Hotel', date: '2025-12-15', details: 'City Inn', cost: '$100' },
              { id: 2, type: 'Restaurant', date: '2025-12-10', details: 'Vegan Cafe', cost: '$25' }
            ]
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
    { icon: Hotel, label: 'Hotel', key: 'hotel', active: activeSection === 'hotel' },
    { icon: Utensils, label: 'Restaurant', key: 'restaurant', active: activeSection === 'restaurant' },
    { icon: FileText, label: 'Orders', key: 'orders', active: activeSection === 'orders' },
    { icon: User, label: 'Profile', key: 'profile', active: activeSection === 'profile' }
  ];

  return (
    <div className={`bg-gray-800 text-white fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} lg:translate-x-0 lg:w-${isOpen ? '64' : '20'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <h1 className={`${isOpen ? 'block' : 'hidden'} lg:hidden text-xl font-bold`}>User Dashboard</h1>
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

// Hotel/Restaurant Item Component - Updated Attractive Card
const HotelItem = ({ hotel, onClick }) => (
  <div 
    className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden cursor-pointer border border-gray-200" 
    onClick={() => onClick(hotel)}
  >
    <div className="relative overflow-hidden rounded-t-2xl">
      <img 
        src={hotel.image} 
        alt={hotel.name} 
        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute top-3 right-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
          hotel.status === 'Available' ? 'bg-green-500 text-white' :
          hotel.status === 'Booked' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {hotel.status}
        </span>
      </div>
    </div>
    <div className="p-5">
      <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{hotel.name}</h4>
      <p className="text-sm text-gray-600 mb-2 flex items-center">
        <MapPin size={14} className="mr-1" /> {hotel.location}
      </p>
      <p className="text-sm text-gray-700 mb-3">Rooms: {hotel.rooms}</p>
      <div className="flex space-x-2">
        <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md">Book Now</button>
        <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
          <Eye size={16} />
        </button>
      </div>
    </div>
  </div>
);

const RestaurantItem = ({ restaurant, onClick }) => (
  <div 
    className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden cursor-pointer border border-gray-200" 
    onClick={() => onClick(restaurant)}
  >
    <div className="relative overflow-hidden rounded-t-2xl">
      <img 
        src={restaurant.image} 
        alt={restaurant.name} 
        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute top-3 right-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
          restaurant.status === 'Available' ? 'bg-green-500 text-white' :
          restaurant.status === 'Booked' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {restaurant.status}
        </span>
      </div>
    </div>
    <div className="p-5">
      <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">{restaurant.name}</h4>
      <p className="text-sm text-gray-600 mb-2 flex items-center">
        <MapPin size={14} className="mr-1" /> {restaurant.location}
      </p>
      <p className="text-sm text-gray-700 mb-3">Tables: {restaurant.tables}</p>
      <div className="flex space-x-2">
        <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-md">Reserve Table</button>
        <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
          <Eye size={16} />
        </button>
      </div>
    </div>
  </div>
);

// Room/Table Item - Updated Attractive Card
const RoomItem = ({ room }) => (
  <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-200">
    <div className="relative overflow-hidden rounded-t-xl">
      <img 
        src={room.image} 
        alt={room.type} 
        className="w-full h-28 object-cover transition-transform duration-300 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent" />
    </div>
    <div className="p-4">
      <h5 className="font-bold text-gray-900 mb-1">{room.type}</h5>
      <p className="text-xs text-gray-600 mb-2">Capacity: {room.capacity} • {room.price}</p>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{room.amenities}</p>
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        room.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {room.status}
      </span>
    </div>
  </div>
);

const TableItem = ({ table }) => (
  <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-200">
    <div className="relative overflow-hidden rounded-t-xl">
      <img 
        src={table.image} 
        alt={table.type} 
        className="w-full h-28 object-cover transition-transform duration-300 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent" />
    </div>
    <div className="p-4">
      <h5 className="font-bold text-gray-900 mb-1">{table.type}</h5>
      <p className="text-xs text-gray-600 mb-3">Capacity: {table.capacity} • {table.price}</p>
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        table.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {table.status}
      </span>
    </div>
  </div>
);

// Dashboard Section
const DashboardSection = ({ loading, data }) => {
  const [activeTab, setActiveTab] = useState('hotel');
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="space-y-6">
          <Skeleton className="h-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48" />)}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const filteredActivity = data.recentActivity?.filter(item => 
    filter === 'All' || item.type === filter
  ) || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.stats?.map((stat, idx) => <StatsCard key={idx} {...stat} />) || []}
      </div>

      {/* Middle Section - Hotel & Restaurant Overview */}
      <div>
        <div className="flex space-x-4 mb-4">
          <button onClick={() => { setActiveTab('hotel'); setSelectedItem(null); }} className={`px-4 py-2 rounded-lg ${activeTab === 'hotel' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
            Hotel
          </button>
          <button onClick={() => { setActiveTab('restaurant'); setSelectedItem(null); }} className={`px-4 py-2 rounded-lg ${activeTab === 'restaurant' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
            Restaurant
          </button>
        </div>
        {!selectedItem ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'hotel' ? (
              data.hotels?.map((hotel, idx) => <HotelItem key={idx} hotel={hotel} onClick={setSelectedItem} />) || []
            ) : (
              data.restaurants?.map((restaurant, idx) => <RestaurantItem key={idx} restaurant={restaurant} onClick={setSelectedItem} />) || []
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6">
            <button onClick={() => setSelectedItem(null)} className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
              <ChevronLeft size={16} /> <span>Back</span>
            </button>
            <h3 className="text-xl font-semibold mb-4">{selectedItem.name}</h3>
            {activeTab === 'hotel' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.roomsExample?.map((room, idx) => <RoomItem key={idx} room={room} />) || []}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.tablesExample?.map((table, idx) => <TableItem key={idx} table={table} />) || []}
              </div>
            )}
          </div>
        )}
        {(!selectedItem && ((activeTab === 'hotel' && data.hotels?.length === 0) || (activeTab === 'restaurant' && data.restaurants?.length === 0))) && (
          <div className="text-center py-12">
            <XCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No {activeTab} Available</h3>
            <p className="text-gray-500">Check back soon for new options.</p>
          </div>
        )}
      </div>

      {/* Bottom Section - Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
              <Search size={16} className="text-gray-500" />
              <input type="text" placeholder="Search activity..." value={search} onChange={(e) => setSearch(e.target.value)} className="outline-none text-sm bg-transparent" />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-gray-100 p-2 rounded">
              <option>All</option>
              <option>Hotel</option>
              <option>Restaurant</option>
              <option>Order</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          {filteredActivity.filter(item => item.details.toLowerCase().includes(search.toLowerCase())).map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'Hotel Booking' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'Restaurant Reservation' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {activity.type === 'Hotel Booking' ? <Bed size={16} /> : activity.type === 'Restaurant Reservation' ? <Table size={16} /> : <BookOpen size={16} />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.details}</p>
                <p className="text-sm text-gray-500">{activity.date} • {activity.status}</p>
              </div>
            </div>
          ))}
        </div>
        {filteredActivity.length === 0 && (
          <div className="text-center py-12">
            <XCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No recent activity found.</p>
          </div>
        )}
        <div className="mt-6 text-center">
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">Load More</button>
        </div>
      </div>
    </div>
  );
};

// Hotel Section
const HotelSection = ({ loading, data }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Hotels</h3>
      {!selectedItem ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.hotels?.map((hotel, idx) => (
            <HotelItem key={idx} hotel={hotel} onClick={setSelectedItem} />
          )) || []}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6">
          <button onClick={() => setSelectedItem(null)} className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
            <ChevronLeft size={16} /> <span>Back</span>
          </button>
          <h3 className="text-xl font-semibold mb-4">{selectedItem.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.rooms?.map((room, idx) => <RoomItem key={idx} room={room} />) || []}
          </div>
        </div>
      )}
      {(!selectedItem && data.hotels?.length === 0) && (
        <div className="text-center py-12">
          <Home size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Hotels Found</h3>
          <p className="text-gray-500">Explore new destinations.</p>
        </div>
      )}
    </div>
  );
};

// Restaurant Section
const RestaurantSection = ({ loading, data }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Restaurants</h3>
      {!selectedItem ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.restaurants?.map((restaurant, idx) => (
            <RestaurantItem key={idx} restaurant={restaurant} onClick={setSelectedItem} />
          )) || []}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6">
          <button onClick={() => setSelectedItem(null)} className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
            <ChevronLeft size={16} /> <span>Back</span>
          </button>
          <h3 className="text-xl font-semibold mb-4">{selectedItem.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.tables?.map((table, idx) => <TableItem key={idx} table={table} />) || []}
          </div>
        </div>
      )}
      {(!selectedItem && data.restaurants?.length === 0) && (
        <div className="text-center py-12">
          <Coffee size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Restaurants Found</h3>
          <p className="text-gray-500">Discover new dining spots.</p>
        </div>
      )}
    </div>
  );
};

// Orders Section
const OrdersSection = ({ loading, data }) => {
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

  const filteredOrders = data.orders?.filter(order => 
    (filter === 'All' || order.type === filter) && order.details.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Orders & Bookings</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
            <Search size={18} className="text-gray-500" />
            <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="outline-none text-sm" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-white p-2 rounded-lg shadow-sm border">
            <option>All</option>
            <option>Hotel</option>
            <option>Restaurant</option>
            <option>Delivery</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.details}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
                </tr>
              ))}
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

// Profile Section
const ProfileSection = ({ loading, data }) => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(data.user || {});

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
            <User size={48} className="text-indigo-600" />
          </div>
          {editMode && (
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg">
              <Upload size={16} className="text-gray-600" />
            </button>
          )}
        </div>
        <h3 className="text-2xl font-bold mt-4">{user.name}</h3>
        <p className="text-gray-500">{user.email}</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold">Account Settings</h4>
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
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className={`w-full p-3 border rounded-lg ${editMode ? 'border-gray-300 focus:border-indigo-500' : 'bg-gray-50'}`}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferences</label>
            <div className="space-y-2 mt-2">
              <label className={`flex items-center ${editMode ? '' : 'cursor-not-allowed'}`}>
                <input type="checkbox" checked={user.preferences.notifications} onChange={(e) => setUser({ ...user, preferences: { ...user.preferences, notifications: e.target.checked } })} disabled={!editMode} className="mr-2" />
                Email Notifications
              </label>
              <label className={`flex items-center ${editMode ? '' : 'cursor-not-allowed'}`}>
                <select value={user.preferences.language} onChange={(e) => setUser({ ...user, preferences: { ...user.preferences, language: e.target.value } })} disabled={!editMode} className="mr-2">
                  <option>English</option>
                  <option>Spanish</option>
                </select>
                Language
              </label>
              <label className={`flex items-center ${editMode ? '' : 'cursor-not-allowed'}`}>
                <input type="checkbox" checked={user.preferences.theme === 'Dark'} onChange={(e) => setUser({ ...user, preferences: { ...user.preferences, theme: e.target.checked ? 'Dark' : 'Light' } })} disabled={!editMode} className="mr-2" />
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
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold mb-4">Booking History</h4>
        <div className="space-y-3">
          {user.bookingHistory?.map((booking, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{booking.type}: {booking.details}</p>
                <p className="text-sm text-gray-500">{booking.date}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">${booking.cost}</p>
            </div>
          )) || []}
        </div>
      </div>
    </div>
  );
};

// Main UserDashboard Component
const UserDashboard = () => {
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
      case 'hotel':
        return <HotelSection loading={loading} data={sectionData} />;
      case 'restaurant':
        return <RestaurantSection loading={loading} data={sectionData} />;
      case 'orders':
        return <OrdersSection loading={loading} data={sectionData} />;
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

export default UserDashboard;