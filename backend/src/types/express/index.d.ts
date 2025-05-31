import { UserRole } from "../auth";

declare global {
    namespace Express {
        interface User {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            permissions?: string[];
            [key: string]: any;
        }

        interface Request {
            user?: User;
            role?: UserRole;
            libraryId?: string; // Only applicable for ADMIN roles
        }
    }
}

export { };
