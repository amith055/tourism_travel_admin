// lib/submissions.ts
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export interface Submission {
  id: string;
  name: string;
  city: string;
  state: string;
  district?: string;
  verified: boolean;
  imageUrl?: string;
  imageHint?: string;
  submittedBy?: string;
}

export const getSubmissions = async (): Promise<Submission[]> => {
  const submissionsRef = collection(db, "usersubmittedplaces");
  const q = query(submissionsRef, orderBy("created_at", "desc"));
  const querySnapshot = await getDocs(q);

  const submissions: Submission[] = [];

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();

    // 🔹 Fetch one image from subcollection
    let imageUrl;
    try {
      const imagesSnap = await getDocs(
        collection(db, "usersubmittedplaces", docSnap.id, "images")
      );
      if (!imagesSnap.empty) {
        imageUrl = imagesSnap.docs[0].data().url;
      }
    } catch (err) {
      console.error("Error fetching image:", err);
    }

    submissions.push({
      id: docSnap.id,
      name: data.name || "Unnamed",
      city: data.city || "Unknown City",
      state: data.state,
      district: data.district,
      verified: data.verified ?? false,
      submittedBy: data.useremail || "unknown",
      imageUrl,
    
    });
  }

  return submissions;
};
