import type { Metadata } from 'next';
import { ProfileDirectory } from '@/components/profile-directory';
import { profileIdentities } from '@/data/profile';
import { localizedMetadata } from '@/i18n/metadata';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return localizedMetadata((await params).locale, 'directory.identities', '/identities');
}

export default function IdentitiesPage() {
  return (
    <ProfileDirectory
      namespace="directory.identities"
      eyebrow=""
      title=""
      description=""
      sections={profileIdentities}
    />
  );
}
