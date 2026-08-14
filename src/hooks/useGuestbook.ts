import { wishService, type Wish } from "@/services/wish.service";
import { useCallback, useEffect, useState } from "react";

export interface UseGuestbookData {
  invitationId?: string;
  guestId?: string;
  guestName?: string;
}

export function useGuestbook(data?: UseGuestbookData) {
  const [messages, setMessages] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [content, setContent] = useState("");

  const invitationId = data?.invitationId;
  const guestId = data?.guestId;
  const defaultGuestName = data?.guestName;

  useEffect(() => {
    if (defaultGuestName) {
      setGuestName(defaultGuestName);
    }
  }, [defaultGuestName]);

  const fetchMessages = useCallback(async () => {
    if (!invitationId) return;
    setLoading(true);
    try {
      const res = await wishService.getByInvitation(invitationId, {
        isApproved: true,
      });
      setMessages(res?.data || []);
    } catch (err) {
      console.error("Failed to load wishes:", err);
    } finally {
      setLoading(false);
    }
  }, [invitationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const submit = useCallback(async () => {
    const trimmedName = guestName.trim();
    const trimmedContent = content.trim();
    if (!invitationId || !trimmedName || !trimmedContent) return false;

    setSubmitting(true);
    try {
      await wishService.create({
        invitationId,
        guestId,
        guestName: trimmedName,
        content: trimmedContent,
      });
      setContent("");
      await fetchMessages();
      return true;
    } catch (err) {
      console.error("Failed to submit wish:", err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [invitationId, guestId, guestName, content, fetchMessages]);

  return {
    messages,
    loading,
    submitting,
    guestName,
    setGuestName,
    content,
    setContent,
    submit,
  };
}
