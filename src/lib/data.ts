import type { TouristPlace, CulturalEvent, Submission } from './types';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from './firebase';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  return img ? { url: img.imageUrl, hint: img.imageHint } : { url: 'https://picsum.photos/seed/default/600/400', hint: 'placeholder' };
};

const mockSubmissions: Submission[] = [
  { id: '9', name: 'Hidden Waterfall', city: 'Asheville', state: 'NC', submittedBy: 'user1@example.com', imageUrl: getImage('submission1').url, imageHint: getImage('submission1').hint, coordinates: "35.5951,-82.5515", landmarks: "Blue Ridge Mountains", infrastructure: "Hiking Trail" },
  { id: '10', name: 'Secret Beach', city: 'Malibu', state: 'CA', submittedBy: 'user2@example.com', imageUrl: getImage('submission2').url, imageHint: getImage('submission2').hint, coordinates: "34.0259,-118.7798", landmarks: "Pacific Coast Highway", infrastructure: "Limited Parking" },
  { id: '11', name: 'Desert Arch', city: 'Moab', state: 'UT', submittedBy: 'user3@example.com', imageUrl: getImage('submission3').url, imageHint: getImage('submission3').hint, coordinates: "38.5733,-109.5498", landmarks: "Arches National Park", infrastructure: "Campgrounds" },
];

// Get one image from "images" collection based on placeid
const getPlaceImage = async (placeId: string) => {
  try {
    const imagesRef = collection(db, 'images');
    const q = query(imagesRef, where('placeId', '==', placeId), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return { url: data.imageUrl || 'https://picsum.photos/seed/default/600/400', hint: 'fetched' };
    } else {
      return { url: 'https://picsum.photos/seed/default/600/400', hint: 'no-image' };
    }
  } catch (err) {
    console.error('Error fetching image:', err);
    return { url: 'https://picsum.photos/seed/default/600/400', hint: 'error' };
  }
};

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

  for (const doc of querySnapshot.docs) {
    const data = doc.data();
    const image = await getPlaceImage(doc.id); 
    places.push({
      id: doc.id,
      name: data.name,
      city: data.city,
      state: data.state,
      imageUrl: image.url,
      imageHint: image.hint,
      coordinates: data.coordinates,
      landmarks: data.landmarks,
      infrastructure: data.infrastructure,
    });
  }

  return places;
};

export const getCulturalEvents = async (): Promise<CulturalEvent[]> => {
  const querySnapshot = await getDocs(collection(db, 'culturalfest'));
  const events: CulturalEvent[] = [];

  for (const doc of querySnapshot.docs) {
    const data = doc.data();
    const image = await getPlaceImage(doc.id); // optional: fetch event image similarly

    events.push({
      id: doc.id,
      name: data.name,
      city: data.city,
      state: data.state,
      imageUrl: image.url,
      imageHint: image.hint,
      coordinates: data.coordinates,
      landmarks: data.landmarks,
      infrastructure: data.infrastructure,
    });
  }

  return events;
};

export const getSubmissions = async (): Promise<Submission[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockSubmissions), 500));
};
