"use client";

import type {
  CreateGuestReq,
  FilterGuestDto,
  PaginationReq,
  RsvpReq,
  UpdateGuestReq,
} from "@/dto";
import { guestService } from "@/services/guest.service";
import { useState } from "react";

export function useGuest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getGuests = async (
    invitationId: string,
    pagination: PaginationReq<FilterGuestDto> = { skip: 0, take: 50 },
  ) => {
    setLoading(true);
    setError("");
    try {
      const res = await guestService.getGuests({
        ...pagination,
        where: { ...pagination.where, invitationId },
      });
      return res;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Không thể tải danh sách khách mời",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createGuest = async (data: CreateGuestReq) => {
    setLoading(true);
    setError("");
    try {
      const res = await guestService.createGuest(data);
      return res;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Thêm khách mời thất bại",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGuest = async (data: UpdateGuestReq) => {
    setLoading(true);
    setError("");
    try {
      const res = await guestService.updateGuest(data);
      return res;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Cập nhật khách mời thất bại",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGuest = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await guestService.deleteGuest(id);
      return res;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Xóa khách mời thất bại",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateQr = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await guestService.generateQr(id);
      return res;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Tạo mã QR thất bại",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const importExcel = async (invitationId: string, file: File) => {
    setLoading(true);
    setError("");
    try {
      const res = await guestService.importExcel(invitationId, file);
      return res;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Import Excel thất bại",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMany = async (invitationId: string, guests: CreateGuestReq[]) => {
    setLoading(true);
    setError("");
    try {
      const res = await guestService.createMany(invitationId, guests);
      return res;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Thêm nhiều khách mờ thất bại",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleExcel = async () => {
    setLoading(true);
    setError("");
    try {
      const blob = await guestService.downloadSampleExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "guest-sample.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Tải mẫu Excel thất bại",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitRsvp = async (data: RsvpReq) => {
    setLoading(true);
    setError("");
    try {
      const res = await guestService.rsvp(data);
      return res;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Gửi RSVP thất bại",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const identifyGuest = async (invitationCode: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await guestService.identify(invitationCode);
      return res;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Mã mời không chính xác",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    getGuests,
    createGuest,
    updateGuest,
    deleteGuest,
    generateQr,
    importExcel,
    createMany,
    downloadSampleExcel,
    submitRsvp,
    identifyGuest,
  };
}
