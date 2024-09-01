import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Bet {
  'id' : string,
  'creator' : string,
  'createdAt' : bigint,
  'description' : string,
  'outcome' : [] | [string],
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'createBet' : ActorMethod<[string, string], Result>,
  'getBet' : ActorMethod<[string], [] | [Bet]>,
  'getBets' : ActorMethod<[], Array<Bet>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
