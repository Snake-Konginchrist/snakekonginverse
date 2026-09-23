import type { Metadata } from 'next';
import { ProfileDirectory } from '@/components/profile-directory';
import { profileLinks } from '@/data/profile';
import { localizedMetadata } from '@/i18n/metadata';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return localizedMetadata((await params).locale, 'directory.links', '/links');
}

export default function LinksPage() {
  return (
    <ProfileDirectory
      namespace="directory.links"
      eyebrow=""
      title=""
      description=""
      sections={profileLinks}
    />
  );
}
