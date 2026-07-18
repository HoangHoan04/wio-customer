import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export interface GiphyImage {
  id: string;
  title: string;
  images: {
    fixed_width_downsampled: { url: string; width: string; height: string };
    original: { url: string; width: string; height: string };
    preview_gif: { url: string };
  };
}

export interface GiphySearchResult {
  data: GiphyImage[];
  pagination: { total_count: number; count: number; offset: number };
  meta: { status: number; msg: string };
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  alt: string;
  src: {
    medium: string;
    large: string;
    original: string;
    tiny: string;
  };
}

export interface PexelsSearchResult {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

const giphyService = {
  search: async (
    q?: string,
    limit = 25,
    offset = 0,
  ): Promise<GiphySearchResult> => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    const url = `${API_ENDPOINTS.GIPHY.SEARCH}?${params.toString()}`;
    const response = await apiService.get<GiphySearchResult>(url);
    return response.data;
  },
  pexelsSearch: async (
    q?: string,
    perPage = 20,
    page = 1,
  ): Promise<PexelsSearchResult> => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("perPage", String(perPage));
    params.set("page", String(page));
    const url = `${API_ENDPOINTS.GIPHY.PEXELS_SEARCH}?${params.toString()}`;
    const response = await apiService.get<PexelsSearchResult>(url);
    return response.data;
  },
};

export default giphyService;
