import type { Metadata } from 'next';
import { ProfileDirectory } from '@/components/profile-directory';
import { profileRecommendations } from '@/data/profile';
import { localizedMetadata } from '@/i18n/metadata';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return localizedMetadata((await params).locale, 'directory.recommendations', '/recommendations');
}

export default function RecommendationsPage() {
  return (
    <ProfileDirectory
      namespace="directory.recommendations"
      eyebrow=""
      title=""
      description=""
      sections={profileRecommendations}
    />
  );
}
