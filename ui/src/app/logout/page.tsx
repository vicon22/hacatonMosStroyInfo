import Logout from '@/features/admission/components/Logout/Logout';
import { pageInit } from '@/shared/utils/app/pageInit';

export default async function LogoutPage() {
  await pageInit();

  return <Logout/>;
}