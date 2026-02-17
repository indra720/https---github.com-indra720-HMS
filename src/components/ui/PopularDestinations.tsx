// import { destinations } from "@/data/mockData";
// import { motion } from "framer-motion";

// export default function PopularDestinations() {
//   return (
//     <section className="section-padding px-20 py-16 bg-muted/30">
//       <div className="container-custom">
//         <div className="text-center mb-12">
//           <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Popular Destinations</h2>
//           <p className="text-muted-foreground max-w-xl mx-auto">Explore our most loved travel destinations around the world</p>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           {destinations.map((d, i) => (
//             <motion.div
//               key={d.name}
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.08, duration: 0.4 }}
//               className="group cursor-pointer"
//             >
//               <div className="relative aspect-[3/4] rounded-2xl overflow-hidden card-elevated">
//                 <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
//                 <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
//                 <div className="absolute bottom-4 left-4 text-primary-foreground">
//                   <h3 className="font-heading font-semibold text-lg">{d.name}</h3>
//                   <p className="text-sm text-primary-foreground/80">From ₹{d.startingPrice.toLocaleString()}</p>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }



import { destinations } from "@/data/mockData";
import { motion } from "framer-motion";

export default function PopularDestinations() {
  return (
    <section className="section-padding p-20 bg-muted/10">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Popular Destinations</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Explore our most loved travel destinations around the world</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {destinations.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300 mb-3">
                <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-heading font-semibold text-sm">{d.name}</h3>
              <p className="text-xs text-muted-foreground">From ₹{d.startingPrice.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
