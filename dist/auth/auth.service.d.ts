import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    private UserInstance;
    private CategoryInstance;
    constructor(jwtService: JwtService);
    signup(email: string, password: string, name: string): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        refreshToken?: string;
        conformToSchema: (this: import("dynamoose/dist/Item").Item, settings?: import("dynamoose/dist/Item").ItemObjectFromSchemaSettings) => Promise<import("dynamoose/dist/Item").Item>;
        toDynamo: (this: import("dynamoose/dist/Item").Item, settings?: Partial<import("dynamoose/dist/Item").ItemObjectFromSchemaSettings>) => Promise<any>;
    }>;
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
}
