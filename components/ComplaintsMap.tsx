'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { PollutionComplaint } from '@/lib/types';

export function ComplaintsMap({ complaints }: { complaints: PollutionComplaint[] }) {
  return (
    <MapContainer center={[41.3111, 69.2797]} zoom={10} className="h-72 w-full rounded-2xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {complaints.map((item) => (
        <Marker key={item.id} position={[item.lat, item.lng]}>
          <Popup>
            <p className="font-semibold">{item.district}</p>
            <p>{item.note}</p>
            <p>👍 {item.upvotes}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
