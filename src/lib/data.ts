import type { TouristPlace, CulturalEvent, Submission } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  return img ? { url: img.imageUrl, hint: img.imageHint } : { url: 'https://picsum.photos/seed/default/600/400', hint: 'placeholder' };
}

const mockTouristPlaces: TouristPlace[] = [
  { id: '1', name: 'Eiffel Tower', city: 'Paris', state: 'Île-de-France', imageUrl: getImage('place1').url, imageHint: getImage('place1').hint, coordinates: "48.8584,2.2945", landmarks: "Champs de Mars, Seine River", infrastructure: "Metro, Restaurants, Hotels" },
  { id: '2', name: 'Statue of Liberty', city: 'New York', state: 'NY', imageUrl: getImage('place2').url, imageHint: getImage('place2').hint, coordinates: "40.6892,-74.0445", landmarks: "Ellis Island", infrastructure: "Ferry, Cafe" },
  { id: '3', name: 'Taj Mahal', city: 'Agra', state: 'Uttar Pradesh', imageUrl: getImage('place3').url, imageHint: getImage('place3').hint, coordinates: "27.1751,78.0421", landmarks: "Yamuna River, Agra Fort", infrastructure: "Hotels, Shops" },
  { id: '4', name: 'Golden Gate Bridge', city: 'San Francisco', state: 'CA', imageUrl: getImage('place4').url, imageHint: getImage('place4').hint, coordinates: "37.8199,-122.4783", landmarks: "Alcatraz Island, Bay Area", infrastructure: "Parking, Viewpoints" },
];

const mockCulturalEvents: CulturalEvent[] = [
  { id: '5', name: 'Diwali', city: 'Varanasi', state: 'Uttar Pradesh', imageUrl: getImage('event1').url, imageHint: getImage('event1').hint },
  { id: '6', name: 'Oktoberfest', city: 'Munich', state: 'Bavaria', imageUrl: getImage('event2').url, imageHint: getImage('event2').hint },
  { id: '7', name: 'Carnival', city: 'Rio de Janeiro', state: 'Rio de Janeiro', imageUrl: getImage('event3').url, imageHint: getImage('event3').hint },
  { id: '8', name: 'Holi', city: 'Mathura', state: 'Uttar Pradesh', imageUrl: getImage('event4').url, imageHint: getImage('event4').hint },
];

const mockSubmissions: Submission[] = [
  { id: '9', name: 'Hidden Waterfall', city: 'Asheville', state: 'NC', submittedBy: 'user1@example.com', imageUrl: getImage('submission1').url, imageHint: getImage('submission1').hint, coordinates: "35.5951,-82.5515", landmarks: "Blue Ridge Mountains", infrastructure: "Hiking Trail" },
  { id: '10', name: 'Secret Beach', city: 'Malibu', state: 'CA', submittedBy: 'user2@example.com', imageUrl: getImage('submission2').url, imageHint: getImage('submission2').hint, coordinates: "34.0259,-118.7798", landmarks: "Pacific Coast Highway", infrastructure: "Limited Parking" },
  { id: '11', name: 'Desert Arch', city: 'Moab', state: 'UT', submittedBy: 'user3@example.com', imageUrl: getImage('submission3').url, imageHint: getImage('submission3').hint, coordinates: "38.5733,-109.5498", landmarks: "Arches National Park", infrastructure: "Campgrounds" },
];

// In a real application, these functions would fetch data from Firestore.
// For now, they return mock data with a delay to simulate network latency.

export const getDashboardStats = async () => {
  return new Promise<{ places: number; events: number; submissions: number }>(resolve =>
    setTimeout(() => {
      resolve({
        places: mockTouristPlaces.length,
        events: mockCulturalEvents.length,
        submissions: mockSubmissions.length,
      });
    }, 500)
  );
};

export const getTouristPlaces = async (): Promise<TouristPlace[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockTouristPlaces), 500));
};

export const getCulturalEvents = async (): Promise<CulturalEvent[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockCulturalEvents), 500));
};

export const getSubmissions = async (): Promise<Submission[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockSubmissions), 500));
};
