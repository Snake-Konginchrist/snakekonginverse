import type { Metadata } from 'next';
import { ProfileDirectory } from '@/components/profile-directory';
import { profileChangelog } from '@/data/profile';
import { localizedMetadata } from '@/i18n/metadata';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return localizedMetadata((await params).locale, 'directory.changelog', '/changelog');
}

export default function ChangelogPage() {
  return (
    <ProfileDirectory
      namespace="directory.changelog"
      eyebrow=""
      title=""
      description=""
      sections={[
        {
          key: 'releases',
          eyebrow: 'RELEASES',
          title: '版本记录',
          description: '这是网站本身的更新日志，不等同于产品发布日志。',
          items: profileChangelog,
        },
      ]}
    />
  );
}
