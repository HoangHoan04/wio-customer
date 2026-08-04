interface ApiUser {
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
  [key: string]: unknown;
}

export function normalizeAuthUser(raw: ApiUser) {
  return {
    ...raw,
    fullName: raw.fullName || raw.customer?.fullName || raw.email,
  };
}
