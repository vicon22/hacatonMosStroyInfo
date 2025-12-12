import { UserData } from '@/entities/user/types';

export function FullName(props: Partial<UserData>) {
  return (
    <>
      {
        [
          props.first_name,
          props.last_name,
        ]
          .filter(Boolean)
          .join(' ')
      }
    </>
  )
}