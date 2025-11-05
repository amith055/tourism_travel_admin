
import type { TouristPlace, CulturalEvent, Submission } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const getImage = (id: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  return img ? { url: img.imageUrl, hint: img.imageHint } : { url: 'https://picsum.photos/seed/default/600/400', hint: 'placeholder' };
}

const mockSubmissions: Submission[] = [
  { id: '9', name: 'Hidden Waterfall', city: 'Asheville', state: 'NC', submittedBy: 'user1@example.com', imageUrl: getImage('submission1').url, imageHint: getImage('submission1').hint, coordinates: "35.5951,-82.5515", landmarks: "Blue Ridge Mountains", infrastructure: "Hiking Trail" },
  { id: '10', name: 'Secret Beach', city: 'Malibu', state: 'CA', submittedBy: 'user2@example.com', imageUrl: getImage('submission2').url, imageHint: getImage('submission2').hint, coordinates: "34.0259,-118.7798", landmarks: "Pacific Coast Highway", infrastructure: "Limited Parking" },
  { id: '11', name: 'Desert Arch', city: 'Moab', state: 'UT', submittedBy: 'user3@example.com', imageUrl: getImage('submission3').url, imageHint: getImage('submission3').hint, coordinates: "38.5733,-109.5498", landmarks: "Arches National Park", infrastructure: "Campgrounds" },
];

// In a real application, these functions would fetch data from Firestore.
// For now, they return mock data with a delay to simulate network latency.

export const getDashboardStats = async () => {
  const touristPlaces = await getTouristPlaces();
  const culturalEvents = await getCulturalEvents();
  return new Promise<{ places: number; events: number; submissions: number }>(resolve =>
    setTimeout(() => {
      resolve({
        places: touristPlaces.length,
        events: culturalEvents.length,
        submissions: mockSubmissions.length,
      });
    }, 500)
  );
};

export const getTouristPlaces = async (): Promise<TouristPlace[]> => {
  const querySnapshot = await getDocs(collection(db, 'touristplaces'));
  const places: TouristPlace[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const placeHolder = getImage(data.imageHint) || { url: 'https://picsum.photos/seed/default/600/400', hint: 'placeholder' };
    places.push({
      id: doc.id,
      name: data.name,
      city: data.city,
      state: data.state,
      imageUrl: placeHolder.url,
      imageHint: placeHolder.hint,
      coordinates: data.coordinates,
      landmarks: data.landmarks,
      infrastructure: data.infrastructure
    });
  });
  return places;
};

export const getCulturalEvents = async (): Promise<CulturalEvent[]> => {
  const querySnapshot = await getDocs(collection(db, 'culturalfest'));
  const events: CulturalEvent[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const placeHolder = getImage(data.imageHint) || { url: 'https://picsum.photos/seed/default/600/400', hint: 'placeholder' };
    events.push({
      id: doc.id,
      name: data.name,
      city: data.city,
      state: data.state,
      imageUrl: placeHolder.url,
      imageHint: placeHolder.hint,
      coordinates: data.coordinates,
      landmarks: data.landmarks,
      infrastructure: data.infrastructure
    });
  });
  return events;
};

export const getSubmissions = async (): Promise<Submission[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockSubmissions), 500));
};
