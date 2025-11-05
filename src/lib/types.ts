export interface BaseLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  imageUrl: string;
  imageHint: string;
  coordinates?: string;
  landmarks?: string;
  infrastructure?: string;
}

export interface TouristPlace extends BaseLocation {}

export interface CulturalEvent extends BaseLocation {}

export interface Submission extends BaseLocation {
  submittedBy: string;
}
