type AuthUserInput = {
  id: string;
  email: string;
  phone?: string;
  fullName?: string;
  role: string;
  customer?: {
    fullName?: string;
    avatar?: string;
    [key: string]: unknown;
  };
  activeSubscription?: unknown;
};

export function normalizeAuthUser(raw: AuthUserInput) {
  return {
    ...raw,
    fullName: raw.fullName || raw.customer?.fullName || raw.email,
  };
}
