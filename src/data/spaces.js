import raw from "./spaces.json";

export const SPACES = (raw ?? []).map((s) => ({
  id: String(s.id),
  name: s.name,
  location: s.location,
  price: Number(s.price),

  image: s.main_image,
  images: Array.isArray(s.images) ? s.images : [],

  description: s.description ?? "",
  amenities: Array.isArray(s.amenities) ? s.amenities : [],
  hours: s.hours ?? "",

  timeSlots: Array.isArray(s.time_slots) ? s.time_slots : [],
  status: s.status ?? "Available",
  tags: (s.amenities ?? []).slice(0, 2),
}));
