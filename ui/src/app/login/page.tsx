
import SignIn from '@/features/admission/components/SignIn/SignIn';
import { pageInit } from '@/shared/utils/app/pageInit';

export default async function LoginPage() {
  await pageInit();

  return (
    <SignIn />
  )
}