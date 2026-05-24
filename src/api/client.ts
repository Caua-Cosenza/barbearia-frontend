import axios from 'axios'
import type { ApiResponse } from '../types'

const VITE_URL = import.meta.env.VITE_API_URL ?? ''
const BASE_URL = VITE_URL ? `${VITE_URL}/api/v1` : '/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

export async function get<T>(url: string): Promise<ApiResponse<T>> {
  const res = await apiClient.get<ApiResponse<T>>(url)
  return res.data
}

export async function post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  const res = await apiClient.post<ApiResponse<T>>(url, body)
  return res.data
}

export async function put<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  const res = await apiClient.put<ApiResponse<T>>(url, body)
  return res.data
}
