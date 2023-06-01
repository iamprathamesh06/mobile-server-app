export class User {
  _key: string;
  _id: string;
  _rev: string;
  name: {
    fName: string;
    sName: string;
  };
  email: string;
  phoneNumber: number;
  address: string;
  createdOn: Date;
  roles: string[];
}
