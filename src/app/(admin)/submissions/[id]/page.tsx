'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, doc, getDocs, updateDoc, addDoc, setDoc, getDoc , deleteDoc} from 'firebase/firestore';

import { db } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface PlaceData {
  name: string;
  city: string;
  state: string;
  district: string;
  town: string;
  latitude: number;
  longitude: number;
  description: string;
  entrance_fees?: string;
  start_date?: string;
  end_date?: string;
  best_season?: string;
  time_needed_to_visit?: string;
  useremail: string;
  verified: boolean;
  area: string;
  isguide?: boolean;
  videourl?: string;
}

export default function SubmissionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [data, setData] = useState<PlaceData | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'usersubmittedplaces', id as string);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const placeData = snapshot.data() as PlaceData;
          setData(placeData);

          const imagesRef = collection(
            db,
            'usersubmittedplaces',
            id as string,
            'images'
          );
          const imagesSnap = await getDocs(imagesRef);
          const imageUrls = imagesSnap.docs
            .map((doc) => doc.data().url)
            .filter(Boolean);
          setImages(imageUrls);
        } else {
          toast({
            title: 'Error',
            description: 'Submission not found',
            variant: 'destructive',
          });
          router.push('/submissions');
        }
      } catch (err) {
        console.error(err);
        toast({
          title: 'Error',
          description: 'Failed to fetch data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router, toast]);

  // ✅ Send email using API route
  const sendEmail = async (
    to: string,
    placeName: string,
    status: boolean,
    reason?: string
  ) => {
    try {
      const res = await fetch('/api/contributor/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, placeName, status, reason }),
      });
      if (!res.ok) throw new Error('Email sending failed');
      console.log('✅ Email sent to', to);
    } catch (error) {
      console.error('❌ Error sending email:', error);
      toast({
        title: 'Email Error',
        description: 'Failed to send notification email',
        variant: 'destructive',
      });
    }
  };

  const handleApprove = async () => {
  if (!id || !data) return;
  setUpdating(true);

  try {
    // ✅ 1. Mark submission as verified
    const placeRef = doc(db, 'usersubmittedplaces', id as string);
    await updateDoc(placeRef, { verified: true });

    // ✅ 2. Determine which collection to move the place into
    const area = data.area?.toLowerCase();
    let targetCollection = '';
    if (area === 'cultural') targetCollection = 'culturalfest';
    else if (area === 'tourist') targetCollection = 'touristplaces';
    else targetCollection = 'othersubmissions'; // fallback if needed

    // ✅ 3. Prepare data for the new collection
    const newPlaceData =
      area === 'cultural'
        ? {
            name: data.name,
            town: data.town,
            city: data.city,
            district: data.district,
            longitude: data.longitude,
            latitude: data.latitude,
            date_of_organizing: data.start_date
              ? new Date(data.start_date)
              : null,
            date_of_ending: data.end_date ? new Date(data.end_date) : null,
            description: data.description,
            zone: data.state || '', // assuming state ≈ zone, adjust if zone stored separately
            type: 'Cultural Event',
          }
        : {
            // For tourism places, include all available fields
            name: data.name,
            town: data.town,
            city: data.city,
            district: data.district,
            state: data.state,
            longitude: data.longitude,
            latitude: data.latitude,
            description: data.description,
            entrance_fees: data.entrance_fees ?? '',
            best_season: data.best_season ?? '',
            time_needed_to_visit: data.time_needed_to_visit ?? '',
            isguide: data.isguide ?? false,
            videourl: data.videourl ?? '',
          };

    // ✅ 4. Add document to target collection
    const newPlaceRef = doc(collection(db, targetCollection));
    await updateDoc(placeRef, { placeLinked: newPlaceRef.id });
    await setDoc(newPlaceRef, newPlaceData);
    // ✅ 5. Move all images from subcollection → global images collection
    const subImagesRef = collection(
      db,
      'usersubmittedplaces',
      id as string,
      'images'
    );
    const subImagesSnap = await getDocs(subImagesRef);

    for (const imageDoc of subImagesSnap.docs) {
      const imgData = imageDoc.data();
      await addDoc(collection(db, 'images'), {
        imageUrl: imgData.url,
        placeId: newPlaceRef.id,
        uploadedAt: imgData.uploadedAt ?? new Date(),
      });
    }

    // ✅ 6. Send email notification
    await sendEmail(data.useremail, data.name, true);

    toast({
      title: 'Approved',
      description: 'Place has been verified and added successfully.',
    });

    router.push('/submissions');
  } catch (err) {
    console.error('❌ Error approving place:', err);
    toast({
      title: 'Error',
      description: 'Failed to approve and move place data',
      variant: 'destructive',
    });
  } finally {
    setUpdating(false);
  }
};

  const confirmReject = async () => {
    if (!id || !data) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'usersubmittedplaces', id as string), {
        rejected: true,
      });
      await sendEmail(data.useremail, data.name, false, rejectReason);
      toast({
        title: 'Rejected',
        description: 'Submission has been rejected.',
      });
      setShowRejectDialog(false);
      router.push('/submissions');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to reject place',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !data) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete "${data.name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setUpdating(true);
    try {
      await deleteDoc(doc(db, 'usersubmittedplaces', id as string));
      toast({
        title: 'Deleted',
        description: `"${data.name}" has been successfully deleted.`,
      });
      router.push('/submissions');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to delete place',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="h-screen overflow-y-auto">
      <div className="container mx-auto max-w-5xl py-10 px-4 space-y-10">
        {/* 📍 Basic Details */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Basic Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Name:</strong> {data.name}
            </p>
            <p>
              <strong>Town:</strong> {data.town}
            </p>
            <p>
              <strong>City:</strong> {data.city}
            </p>
            <p>
              <strong>District:</strong> {data.district}
            </p>
            <p>
              <strong>State:</strong> {data.state}
            </p>
            <p>
              <strong>Latitude:</strong> {data.latitude}
            </p>
            <p>
              <strong>Longitude:</strong> {data.longitude}
            </p>
          </div>
        </section>

        {/* 🧾 Information Section */}
        <section className="border-t pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Information
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Description:</strong> {data.description}
            </p>
            <p>
              <strong>Entrance Fees:</strong> {data.entrance_fees ?? 'N/A'}
            </p>

            {data.area === 'cultural' ? (
              <>
                <p>
                  <strong>Start Date:</strong> {data.start_date ?? 'N/A'}
                </p>
                <p>
                  <strong>End Date:</strong> {data.end_date ?? 'N/A'}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Best Season:</strong> {data.best_season ?? 'N/A'}
                </p>
                <p>
                  <strong>Time Needed to Visit:</strong>{' '}
                  {data.time_needed_to_visit ?? 'N/A'}
                </p>
              </>
            )}

            {data.isguide && (
              <p className="text-blue-600 font-semibold">
                🧭 Guide services available
              </p>
            )}

            <p>
              <strong>Submitted By:</strong> {data.useremail}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={
                  data.verified ? 'text-green-600' : 'text-yellow-600'
                }
              >
                {data.verified ? 'Verified' : 'Pending'}
              </span>
            </p>
          </div>
        </section>

        {/* ✅ Action Buttons */}
        <section className="border-t pt-6 flex justify-end gap-4">
          {!data.verified ? (
            <>
              <Button
                variant="destructive"
                disabled={updating}
                onClick={() => setShowRejectDialog(true)}
                className="px-5"
              >
                {updating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Reject'
                )}
              </Button>
              <Button
                disabled={updating}
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 px-5"
              >
                {updating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Approve'
                )}
              </Button>
            </>
          ) : (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={updating}
              className="bg-red-600 hover:bg-red-700 px-5"
            >
              {updating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Delete Place'
              )}
            </Button>
          )}
        </section>

        {/* 🏞️ Images Section */}
        <section className="border-t pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Images</h2>
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-full h-60 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-200"
                >
                  <Image
                    src={img}
                    alt={`${data.name}-${i}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No images available.</p>
          )}
        </section>

        {/* 🎥 Video Section */}
        <section className="border-t pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Video Preview
          </h2>
          {data.videourl ? (
            <div className="w-full max-w-3xl mx-auto">
              <video
                src={data.videourl}
                controls
                className="rounded-lg shadow-md w-full aspect-video bg-black"
              />
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No video available for this place.
            </p>
          )}
        </section>
      </div>

      {/* ❌ Reject Reason Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Enter Rejection Reason
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border rounded-md p-2 h-24 text-gray-700"
              placeholder="Specify reason for rejection..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={updating || !rejectReason.trim()}
                onClick={confirmReject}
                className="bg-red-600 hover:bg-red-700"
              >
                {updating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Reject'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
