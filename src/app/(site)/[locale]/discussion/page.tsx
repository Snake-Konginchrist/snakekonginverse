import type { Metadata } from 'next';
import { ProfileDirectory } from '@/components/profile-directory';
import { profileSocials } from '@/data/profile';
import { localizedMetadata } from '@/i18n/metadata';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return localizedMetadata((await params).locale, 'directory.discussion', '/discussion');
}

export default function DiscussionPage() {
  return (
    <ProfileDirectory
      namespace="directory.discussion"
      eyebrow=""
      title=""
      description=""
      sections={[
        {
          key: 'join',
          eyebrow: 'JOIN THE CONVERSATION',
          title: '参与公开讨论',
          description: '项目协作适合从 GitHub 开始，开发过程和即时想法可以在 X 找到。',
          items: profileSocials,
        },
      ]}
    />
  );
}
