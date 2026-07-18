export interface TableDto {
  id: string;
  weddingId: string;
  name: string;
  maxSeats: number;
  currentSeats: number;
  description?: string;
  positionX?: number;
  positionY?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterTableDto {
  weddingId?: string;
  name?: string;
  maxSeats?: number;
  currentSeats?: number;
  description?: string;
}

export interface CreateTableReq {
  weddingId: string;
  name: string;
  maxSeats: number;
  currentSeats?: number;
  description?: string;
  positionX?: number;
  positionY?: number;
}

export interface UpdateTableReq extends Partial<CreateTableReq> {
  id: string;
}

export interface AssignGuestReq {
  tableId: string;
  guestId: string;
}

export interface UnassignGuestReq {
  guestId: string;
}
