// user.types.ts
export type Address = `0x${string}`;

export interface IUser {
  username: string;
  twitterHandle: string | null;
  discordHandle: string | null;
  profilePicture: string | null;
}

export interface IConnection extends IUser {
  address: Address;
}

export interface IUserConnections {
  firstConnections: Array<IConnection>;
  secondConnections: Array<IConnection>;
}

export interface IMission {
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'done';
}

export interface IGuestBookEntry {
  id: string;
  author: {
    username: string;
    profilePicture: string;
    tag: string;
  };
  date: string;
  content: string;
}

export interface IGuestBook {
  entries: IGuestBookEntry[];
}

export interface IProfileEntry {
  imgSrc: string;
  date: Date;
}

export interface IProofEntry {
  imgSrc: string;
  date: Date;
}

export interface IEdge {
  key: string;
  source: string;
  target: string;
}

export interface IProfileUserData {
  user: IUser;
  userConnections: IUserConnections;
  missions: Array<IMission>;
  guestBook: Array<IGuestBook>;
  profileHistory: Array<IProfileEntry>;
  proofHistory: Array<IProofEntry>;
}

export interface IProfileUserDataWithEdges extends IProfileUserData {
  edges: IEdge[];
}
