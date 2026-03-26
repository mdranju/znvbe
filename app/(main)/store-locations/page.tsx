import { BackButton } from "@/components/common/BackButton";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";

const STORES = [
  {
    name: "Believers - Mirpur 10",
    address: "House 12, Road 5, Mirpur 10 Circle, Dhaka - 1216",
    phone: "01799-301290",
    hours: "Sat–Thu: 10AM–9PM, Fri: 2PM–9PM",
    maps: "https://maps.google.com",
  },
  {
    name: "Believers - Mohakhali",
    address: "Level 3, Block A, Mohakhali DOHS, Dhaka - 1212",
    phone: "09638-090000",
    hours: "Sat–Thu: 10AM–9PM, Fri: 2PM–9PM",
    maps: "https://maps.google.com",
  },
  {
    name: "Believers - Chittagong",
    address: "GEC Circle, Khulshi, Chittagong - 4225",
    phone: "09638-090000",
    hours: "Sat–Thu: 10AM–9PM, Fri: 2PM–9PM",
    maps: "https://maps.google.com",
  },
];

export default function StoreLocationsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton className="mb-6" />
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
          <MapPin size={16} />
          Find a Store
        </div>
        <h1 className="text-3xl font-black text-gray-900">Our Showrooms</h1>
        <p className="text-gray-500 mt-2">Visit us in person for the full Believers experience.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STORES.map((store) => (
          <div key={store.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-base mb-1">{store.name}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{store.address}</p>
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400 flex-shrink-0" />
                <a href={`tel:${store.phone.replace(/-/g, "")}`} className="hover:text-blue-600 transition-colors">
                  {store.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <span>{store.hours}</span>
              </div>
            </div>

            <a
              href={store.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              <Navigation size={14} />
              Get Directions
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
