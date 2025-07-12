import { Injectable, NestMiddleware, UnauthorizedException ,HttpException,HttpStatus} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("auth middleware called")
    const token = req.headers['authorization']?.split(' ')[1]; 
    console.log("token:",token);
    if (!token) {
    
      throw new HttpException('Token not provided',HttpStatus.UNAUTHORIZED);
    }

    let decodedToken;
    try {
      // Decode the token and extract user details
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key'); // Replace with your actual secret key
      console.log("token valid")
    } catch (err) {
      throw new HttpException('Invalid token',HttpStatus.UNAUTHORIZED);
    }

    const userId = decodedToken.userId;
    const role = decodedToken.role;

    req.user = { userId,role }; 
    next();
  }
}