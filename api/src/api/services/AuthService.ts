import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { env } from '../../env';

export interface AuthPayload {
  username: string;
}

export interface AuthResult {
  token: string;
  user: {
    username: string;
  };
}

@Service()
export class AuthService {
  public login(username: string, password: string): AuthResult {
    const isValid = username === env.auth.username && password === env.auth.password;
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ username }, env.auth.jwtSecret as jwt.Secret, {
      expiresIn: env.auth.expiresIn as jwt.SignOptions['expiresIn'],
    });

    return {
      token,
      user: {
        username,
      },
    };
  }

  public verify(token: string): AuthPayload {
    return jwt.verify(token, env.auth.jwtSecret as jwt.Secret) as AuthPayload;
  }
}
