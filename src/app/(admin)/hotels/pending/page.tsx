'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
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
  status: boolean | string;
}

export default function PendingHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [reason, setReason] = useState('');
  const [sending, setSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const q = query(collection(db, 'hotels'), where('status', '==', false));
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

  const sendEmail = async (to: string, hotelName: string, approved: boolean, reasonText?: string) => {
    await fetch('/api/hotel/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        hotelName,
        status: approved,
        reason: reasonText,
      }),
    });
  };

  const handleApprove = async (hotel: Hotel) => {
    try {
      await updateDoc(doc(db, 'hotels', hotel.id), { status: true });
      await sendEmail(hotel.ownerInfo.email, hotel.basicInfo.name, true);
      setHotels(prev => prev.filter(h => h.id !== hotel.id));
      router.refresh();
    } catch (error) {
      console.error('Error approving hotel:', error);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedHotel) return;
    setSending(true);
    try {
      await updateDoc(doc(db, 'hotels', selectedHotel.id), { status: 'rejected' });
      await sendEmail(selectedHotel.ownerInfo.email, selectedHotel.basicInfo.name, false, reason);
      setHotels(prev => prev.filter(h => h.id !== selectedHotel.id));
      setSelectedHotel(null);
      setReason('');
      router.refresh();
    } catch (error) {
      console.error('Error rejecting hotel:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Pending Hotel Verifications
        </h1>
        <Button
          onClick={() => router.push('/hotels')}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Back to Verified Hotels
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-20 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          Loading pending hotels...
        </div>
      ) : hotels.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No pending hotels found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl"
            >
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-800">
                  {hotel.basicInfo.name}
                </CardTitle>
                <p className="text-sm text-gray-500">{hotel.basicInfo.city}</p>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Basic Info</h3>
                  <p><strong>Type:</strong> {hotel.basicInfo.type}</p>
                  <p><strong>Address:</strong> {hotel.basicInfo.address}</p>
                  <p><strong>Email:</strong> {hotel.basicInfo.contactEmail}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Owner Info</h3>
                  <p><strong>Name:</strong> {hotel.ownerInfo.name}</p>
                  <p><strong>Contact:</strong> {hotel.ownerInfo.contact}</p>
                  <p><strong>Email:</strong> {hotel.ownerInfo.email}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  {hotel.photos?.exterior?.[0] && (
                    <img
                      src={hotel.photos.exterior[0]}
                      alt="Exterior"
                      className="rounded-md h-20 w-full object-cover border"
                    />
                  )}
                  {hotel.photos?.dining?.[0] && (
                    <img
                      src={hotel.photos.dining[0]}
                      alt="Dining"
                      className="rounded-md h-20 w-full object-cover border"
                    />
                  )}
                  {hotel.photos?.rooms?.[0] && (
                    <img
                      src={hotel.photos.rooms[0]}
                      alt="Room"
                      className="rounded-md h-20 w-full object-cover border"
                    />
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                  <Button
                    onClick={() => setSelectedHotel(hotel)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(hotel)}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium"
                  >
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Reject {selectedHotel.basicInfo.name}
            </h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring-2 focus:ring-red-400 outline-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                className="border-gray-300"
                onClick={() => {
                  setSelectedHotel(null);
                  setReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectSubmit}
                disabled={sending || reason.trim() === ''}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {sending ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
