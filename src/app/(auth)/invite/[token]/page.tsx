import { InviteRegistration } from "@/components/forms/invite-registration";

interface InvitePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  
  if (!token || token === "undefined") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
        <div className="w-full max-w-xl">
          <InviteRegistration token="" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-xl">
        <InviteRegistration token={token} />
      </div>
    </div>
  );
}


