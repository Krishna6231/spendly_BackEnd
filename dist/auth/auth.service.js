"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const dynamoose = require("dynamoose");
const user_schema_1 = require("../database/schema/user.schema");
const category_schema_1 = require("../database/schema/category.schema");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.UserInstance = dynamoose.model('Users', user_schema_1.UserSchema);
        this.CategoryInstance = dynamoose.model('Categories', category_schema_1.CategorySchema);
    }
    async signup(email, password, name) {
        const existing = await this.UserInstance.scan({ email }).exec();
        if (existing.count > 0) {
            throw new common_1.ConflictException('User already exists');
        }
        const newUser = await this.UserInstance.create({
            email,
            name,
            password: bcrypt.hashSync(password, 8),
        });
        const defaultCategories = [
            { name: 'Food', color: '#FFC107' },
            { name: 'Medicine', color: '#CDDC39' },
            { name: 'Travel', color: '#00BCD4' },
            { name: 'Entertainment', color: '#607D8B' },
        ];
        const categoryPromises = defaultCategories.map((cat) => this.CategoryInstance.create({
            user_id: newUser.id,
            category: cat.name,
            limit: 1000,
            color: cat.color,
        }));
        await Promise.all(categoryPromises);
        return { ...newUser };
    }
    async login(email, password) {
        try {
            const [userData] = await this.UserInstance.scan()
                .where('email')
                .eq(email)
                .exec();
            if (!userData) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const isPasswordValid = bcrypt.compareSync(password, userData.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid password');
            }
            const payload = { sub: userData.id, email: userData.email };
            const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
            const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
            await this.UserInstance.update({ id: userData.id }, { refreshToken });
            return {
                user: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                },
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            console.error('Error during login process:', error);
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.UserInstance.get(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Old password is incorrect');
        }
        const hashedNewPassword = bcrypt.hashSync(newPassword, 8);
        await this.UserInstance.update({ id: userId }, { password: hashedNewPassword });
        return { message: 'Password updated successfully' };
    }
    async logout(refreshToken) {
        const user = await this.UserInstance.scan('refreshToken')
            .eq(refreshToken)
            .exec();
        if (!user || user.count === 0) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const userRecord = user[0];
        userRecord.refreshToken = '';
        await this.UserInstance.update(userRecord);
        return { message: 'Logout successful' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map