import type { SessionUser } from "../services/auth.service";

export type OwnerAccount = SessionUser;
export interface OperatorAccount {
  id: number; name: string; username: string; active: boolean; createdAt: string;
}
export interface PaginationData { currentPage: number; totalPages: number; totalItems: number }
export interface OperatorsResponse { operators: OperatorAccount[]; pagination: PaginationData }
export interface ChangeUsernameInput { username: string; currentPassword: string }
export interface ChangePasswordInput { currentPassword: string; newPassword: string; confirmPassword: string }
export interface CreateOperatorInput { name: string; username: string; password: string; confirmPassword: string }
export interface ChangeOperatorPasswordInput { password: string; passwordConfirmation: string }
