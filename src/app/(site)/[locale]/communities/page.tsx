import type { Metadata } from 'next';
import { ProfileDirectory } from '@/components/profile-directory';
import { profileCommunities } from '@/data/profile';
import { localizedMetadata } from '@/i18n/metadata';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return localizedMetadata((await params).locale, 'directory.communities', '/communities');
}

export default function CommunitiesPage() {
  return (
    <ProfileDirectory
      namespace="directory.communities"
      eyebrow=""
      title=""
      description=""
      sections={profileCommunities}
    />
  );
}
