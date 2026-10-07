import { AuthMode } from '../../../pages/auth/auth/auth';

export interface AuthCardContent {
  type: AuthMode;
  role: string;
  info: string;
  icon: string;
}
