import React, { useState } from "react";

const experiences = [
  {
    name: "Maldives",
    img: "https://assets.anantara.com/image/upload/q_auto,f_auto,c_limit,w_1920/media/minor/anantara/images/anantara-dhigu-maldives-resort/gallery/dining/anantara_dhigu_gulhifushi_food_truck_1920x1037.jpg",
    price: "₹ 68,499",
    type: "International",
    desc: "Starting @",
  },
  {
    name: "Russia",
    img: "https://media.gettyimages.com/id/2157688569/photo/09-june-2024-russia-moskau-the-kremlin-and-st-basils-cathedral-on-red-square-photo-ulf-mauder.jpg?s=612x612&w=0&k=20&c=DgtvuAsuJFqSc5Kz-Oq7C0Yrn4EGhP7AaxaOjeMGHvk=",
    price: "₹ 1,20,999",
    type: "International",
    desc: "Starting @",
  },
  {
    name: "Jammu and Kashmir",
    img: "https://media.istockphoto.com/id/1049714270/photo/jammu-kashmir-sonmarg.jpg?s=612x612&w=0&k=20&c=aPemQYz6huIMkzBEc3x3roWHMLablqCQOsdLdB-GgSo=",
    price: "₹ 18,299",
    type: "Domestic",
    desc: "Starting @",
  },
  {
    name: "Leh Ladakh",
    img: "https://media.gettyimages.com/id/682315470/photo/scenic-of-leh-palace-with-colorful-omani-prayer-flag-with-dramatic-sky-in-leh-ladakh-india.jpg?s=612x612&w=0&k=20&c=nLoe9P3mkjJeewgGxqxXwqYZbNhtI3qj-lCWc4oC0qA=",
    price: "₹ 24,999",
    type: "Domestic",
    desc: "Starting @",
  },
];

const expList = [
  // International
  {
    name: "Honeymoon",
    img: "/Auli9.jpg",
    places: "Maldives | Seychelles | Kashmir | Himachal Pradesh",
    price: "19,700",
    type: "International",
  },
  {
    name: "Adventure",
    img: "/Darjeeling7.jpg",
    places: "Dubai | Malaysia | Kashmir | Himachal Pradesh",
    price: "13,000",
    type: "International",
  },
  {
    name: "Food",
    img: "/goa...jpg",
    places: "Dubai | Malaysia | Singapore | Bali",
    price: "17,352",
    type: "International",
  },
  {
    name: "Family with Kids Friendly",
    img: "/Mussoorie.jpg",
    places: "Dubai | Malaysia | Kashmir | Himachal Pradesh",
    price: "14,700",
    type: "International",
  },
  {
    name: "Shopping",
    img: "/ladhak...jpg",
    places: "Dubai | Malaysia | Kashmir | Himachal Pradesh",
    price: "14,100",
    type: "International",
  },
  {
    name: "Wellness and Spa",
    img: "/Ranikhet3.jpg",
    places: "Maldives | Bali",
    price: "17,872",
    type: "International",
  },
  {
    name: "Luxury",
    img: "/Udaipur.jpg",
    places: "Dubai | Malaysia | Kashmir | Himachal Pradesh",
    price: "18,880",
    type: "International",
  },
  {
    name: "Ski",
    img: "/Gulmarg8.jpg",
    places: "Dubai | Switzerland",
    price: "35,279",
    type: "International",
  },
  {
    name: "Beach",
    img: "/Auli9.jpg",
    places: "Maldives | Seychelles | Andaman | Kerala",
    price: "8,000",
    type: "International",
  },
  {
    name: "All Inclusive",
    img: "/Munnar2.jpg",
    places:
      "Dubai | Malaysia | Singapore | Bali | Srilanka |Thailand | Mauritius | Maldives",
    price: "19,777",
    type: "International",
  },
  {
    name: "Multi-Country",
    img: "/Gulmarg8.jpg",
    places:
      "Dubai | Mauritius | Reunion | Southafrica | Singapore | Malaysia | Bali |Seyselles |Madagascar| Srilanka",
    price: "31,039",
    type: "International",
  },
  {
    name: "City Breaks",
    img: "/goa...jpg",
    places:
      "Dubai | Malaysia | Singapore | Bali | Srilanka |Thailand | Mauritius | Maldives",
    price: "22,549",
    type: "International",
  },
  // Domestic
  {
    name: "Shopping",
    img: "/Gulmarg8.jpg",
    places: "Kashmir | Himachal Pradesh | Uttarakhand | Sikkim",
    price: "14,100",
    type: "Domestic",
  },
  {
    name: "Luxury",
    img: "/Munnar2.jpg",
    places: "Kashmir | Himachal Pradesh | Uttarakhand | Sikkim",
    price: "18,880",
    type: "Domestic",
  },
  {
    name: "Beach",
    img: "/Mussoorie.jpg",
    places: "Andaman | Kerala | Goa",
    price: "8,000",
    type: "Domestic",
  },
];

const Browse_exp = () => {
  const [activeTab, setActiveTab] = useState<"International" | "Domestic">(
    "International"
  );

  // Filter expList based on activeTab
  const filteredExpList = expList.filter((item) => item.type === activeTab);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f7f7fa] py-8">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className=" text-2xl sm:text-4xl font-light mb-4 md:mb-0">
            Browse by <strong className="font-bold">Experience</strong>
          </h2>
          <div className="flex gap-8 sm:text-lg font-semibold">
            <span
              className={`cursor-pointer ${activeTab === "International"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
                }`}
              onClick={() => setActiveTab("International")}
            >
              INTERNATIONAL
            </span>
            <span
              className={`cursor-pointer ${activeTab === "Domestic"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
                }`}
              onClick={() => setActiveTab("Domestic")}
            >
              DOMESTIC
            </span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Experiences grid (always show 4 boxes as before) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            {experiences.map((exp) => (
              <div
                key={exp.name}
                className="relative rounded-xl overflow-hidden shadow-lg group h-64 flex items-end cursor-pointer"
              >
                {/* Image as proper <img> tag – yeh trick hai jo overflow ko 0 karta hai */}
                <img
                  src={exp.img}
                  alt={exp.name}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="relative z-10 p-5">
                  <div className="text-2xl font-bold text-white drop-shadow">
                    {exp.name}
                  </div>
                  <div className="text-lg text-white mt-1">
                    {exp.desc} <span className="font-bold">{exp.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Right: Experience List (scrolling, changes on tab) */}
          <div className="bg-white rounded-xl shadow p-6 w-full lg:w-[420px] flex flex-col gap-4 max-h-[480px] overflow-y-auto border">
            <div className="flex justify-end pr-2 pb-2">
              <span className="text-xs font-bold text-gray-500 tracking-wider">
                STARTS FROM
              </span>
            </div>
            {filteredExpList.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-2 py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className=" space-y-1 lg:flex justify-between lg:min-w-[298px]">
                    <div>
                      <div className="font-semibold sm:text-lg text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-gray-500 text-sm">{item.places}</div>
                    </div>
                    <div>
                      <span className="bg-gray-100 rounded-full px-4 md:py-1 text-gray-700 font-semibold text-sm">
                        ₹{item.price}/-
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse_exp;
