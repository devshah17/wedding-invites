'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Suspense,
} from 'react';
import { useSearchParams } from 'next/navigation';

export interface PersonalizedInvitation {
  code: string;
  guestName: string;
  events: string[];
  note: string;
}

interface InvitationContextType {
  invitation: PersonalizedInvitation | null;
  isLoading: boolean;
}

const InvitationContext = createContext<InvitationContextType>({
  invitation: null,
  isLoading: false,
});

function InvitationLoader({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('invite');
  const [invitation, setInvitation] = useState<PersonalizedInvitation | null>(null);
  const [fetchedCode, setFetchedCode] = useState<string | null>(null);

  const isLoading = Boolean(inviteCode && fetchedCode !== inviteCode);

  useEffect(() => {
    if (!inviteCode) return;

    let active = true;

    fetch(`/api/invitations/${encodeURIComponent(inviteCode)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success && data.invitation) {
          setInvitation(data.invitation);
        }
        setFetchedCode(inviteCode);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Failed to load personalized invite:', err);
        setFetchedCode(inviteCode);
      });

    return () => {
      active = false;
    };
  }, [inviteCode]);

  return (
    <InvitationContext.Provider value={{ invitation, isLoading }}>
      {children}
    </InvitationContext.Provider>
  );
}

export function InvitationProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <InvitationLoader>{children}</InvitationLoader>
    </Suspense>
  );
}

export function usePersonalizedInvitation() {
  return useContext(InvitationContext);
}
