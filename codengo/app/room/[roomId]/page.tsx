import { use } from 'react';
import RoomPageClient from './RoomPageClient';

export default function Page(promise: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(promise.params); // ✅ properly unwrap params

  return <RoomPageClient roomId={roomId} />;
}
