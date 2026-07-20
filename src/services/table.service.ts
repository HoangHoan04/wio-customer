import type {
  AssignGuestReq,
  CreateTableReq,
  FilterTableDto,
  PaginationReq,
  PaginationRes,
  TableDto,
  UnassignGuestReq,
  UpdateTableReq,
} from "@/dto";
import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const tableService = {
  getTables: async (
    params: PaginationReq<FilterTableDto>,
  ): Promise<PaginationRes<TableDto>> => {
    const response = await apiService.post<PaginationRes<TableDto>>(
      API_ENDPOINTS.TABLE.PAGINATION,
      params,
    );
    return response.data;
  },

  getTableById: async (id: string): Promise<{ data: TableDto }> => {
    const response = await apiService.post<{ data: TableDto }>(
      API_ENDPOINTS.TABLE.FIND_BY_ID,
      { id },
    );
    return response.data;
  },

  createTable: async (data: CreateTableReq): Promise<{ data: TableDto }> => {
    const response = await apiService.post<{ data: TableDto }>(
      API_ENDPOINTS.TABLE.CREATE,
      data,
    );
    return response.data;
  },

  updateTable: async (data: UpdateTableReq): Promise<{ data: TableDto }> => {
    const response = await apiService.post<{ data: TableDto }>(
      API_ENDPOINTS.TABLE.UPDATE,
      data,
    );
    return response.data;
  },

  deleteTable: async (id: string): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.TABLE.DELETE,
      { id },
    );
    return response.data;
  },

  assignGuest: async (data: AssignGuestReq): Promise<any> => {
    const response = await apiService.post<any>(
      API_ENDPOINTS.TABLE.ASSIGN_GUEST,
      data,
    );
    return response.data;
  },

  unassignGuest: async (data: UnassignGuestReq): Promise<any> => {
    const response = await apiService.post<any>(
      API_ENDPOINTS.TABLE.UNASSIGN_GUEST,
      data,
    );
    return response.data;
  },
};

export default tableService;
