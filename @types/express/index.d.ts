import { UserDocument } from "../../src/modules/auth/models/user-model";

declare global {
  namespace Express {
    interface Request {
      user: UserDocument
    }
  }
}

