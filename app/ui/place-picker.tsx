'use client'

import GoogleMapsLoader from './google-maps-loader';
import PlaceSelector from './place-selector';
import { PlaceData } from '../lib/cookies';

interface PlacePickerProps {
  apiKey: string;
  onPlaceSelect?: (place: PlaceData) => void;
}

export default function PlacePicker({ apiKey, onPlaceSelect }: PlacePickerProps) {
  return (
    <GoogleMapsLoader apiKey={apiKey}>
      <PlaceSelector onPlaceSelect={onPlaceSelect} />
    </GoogleMapsLoader>
  );
}