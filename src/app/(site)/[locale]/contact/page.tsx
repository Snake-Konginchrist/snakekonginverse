import type { Metadata } from 'next';
import { ProfileDirectory } from '@/components/profile-directory';
import { SocialMatrix } from '@/components/social-matrix';
import { profileSocials } from '@/data/profile';
import { localizedMetadata } from '@/i18n/metadata';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return localizedMetadata((await params).locale, 'directory.contact', '/contact');
}

export default function ContactPage() {
  return (
    <>
      <ProfileDirectory
        namespace="directory.contact"
        eyebrow=""
        title=""
        description=""
        sections={[
          {
            key: 'channels',
            eyebrow: 'PUBLIC CHANNELS',
            title: '公开入口',
            description: '账号和链接均指向公开主页，不在网站里虚构邮箱或私密群组。',
            items: profileSocials,
          },
        ]}
      />
      <SocialMatrix />
    </>
  );
}
