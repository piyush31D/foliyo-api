declare module 'msg91' {
  export interface msg91 {
    new(authKey: string, senderId: string, route: route): void;
    send(number: string | string[], message: string, cb?: (err: Error, res: string) => void): void
    getBalance(cb: (err: Error, res: number) => void): void;
    getBalance(customRoute: route, cb: (err: Error, res: string) => void): void;
  }
  export class msg91 {
    constructor(authKey: string, senderId: string, route: route);
  }
  type route = '1' | '4';
  export default msg91;
}




