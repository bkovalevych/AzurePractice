export class UserValue {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string
  displayName: string;
  constructor(init: Partial<UserValue>) {
    Object.assign(this, init);
  }
}
