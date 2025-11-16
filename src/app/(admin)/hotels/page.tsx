'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Hotel {
  id: string;
  basicInfo: {
    name: string;
    address: string;
    city: string;
    contactEmail: string;
    type: string;
  };
  ownerInfo: {
    name: string;
    contact: string;
    email: string;
    idProofUrl: string;
  };
  documents: {
    licenseUrl: string;
    safetyCertUrl: string;
  };
  bankDetails: {
    accountName: string;
    accountNo: string;
    ifsc: string;
  };
  photos: {
    exterior: string[];
    dining: string[];
    rooms: string[];
  };
  status: boolean;
}

export default function VerifiedHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const q = query(collection(db, 'hotels'), where('status', '==', true));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Hotel[];
        setHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Verified Hotels</h1>
        <Button
          onClick={() => router.push('/hotels/pending')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
        >
          Pending Verifications
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center mt-16 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          Loading verified hotels...
        </div>
      ) : hotels.length === 0 ? (
        <p className="text-center text-gray-500 mt-20 text-lg">
          No verified hotels available.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="bg-white shadow-md border border-gray-200 rounded-xl hover:shadow-lg transition p-3"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {hotel.basicInfo.name}
                </CardTitle>
                <p className="text-sm text-gray-500">{hotel.basicInfo.city}</p>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                {/* Basic Info */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Basic Info</h3>
                  <p><strong>Type:</strong> {hotel.basicInfo.type}</p>
                  <p><strong>Address:</strong> {hotel.basicInfo.address}</p>
                  <p><strong>Email:</strong> {hotel.basicInfo.contactEmail}</p>
                </div>

                {/* Owner Info */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Owner Information</h3>
                  <p><strong>Name:</strong> {hotel.ownerInfo.name}</p>
                  <p><strong>Contact:</strong> {hotel.ownerInfo.contact}</p>
                  <p><strong>Email:</strong> {hotel.ownerInfo.email}</p>
                  <a
                    href={hotel.ownerInfo.idProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View ID Proof
                  </a>
                </div>

                {/* Photos */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Photos</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {hotel.photos?.exterior?.[0] && (
                      <img
                        src={hotel.photos.exterior[0]}
                        alt="Exterior"
                        className="rounded-md h-24 w-full object-cover"
                      />
                    )}
                    {hotel.photos?.dining?.[0] && (
                      <img
                        src={hotel.photos.dining[0]}
                        alt="Dining"
                        className="rounded-md h-24 w-full object-cover"
                      />
                    )}
                    {hotel.photos?.rooms?.[0] && (
                      <img
                        src={hotel.photos.rooms[0]}
                        alt="Room"
                        className="rounded-md h-24 w-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
