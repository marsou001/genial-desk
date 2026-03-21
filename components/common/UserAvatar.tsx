import { getUser } from '@/lib';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';

export default async function UserAvatar() {
  const supabase = await createClient();
  const user = await getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', user.id)
    .single();

  const avatarUrl = profile?.avatar_url ?? null;
  const avatarInitial = (profile?.full_name || profile?.email || '?').charAt(0).toUpperCase();

  return avatarUrl ? (
    <Image
      src={avatarUrl}
      alt="User avatar"
      fill
      className="object-cover"
    />
  ) : (
    <span className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 text-sm font-semibold">
      {avatarInitial}
    </span>
  )
}