import { Request, Response } from 'express';
import authService from './role.service';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

class RoleController {
    
}

export default new RoleController();