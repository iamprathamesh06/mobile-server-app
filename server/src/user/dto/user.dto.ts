export interface User {
  _id: string;
  //   name: string;
  email: string;
  //   address: string;
  phone: string;
  //   Location: string;
  roles: string[];
  idpService: string;
  idpId: string;
  timestamp: Date;
}
