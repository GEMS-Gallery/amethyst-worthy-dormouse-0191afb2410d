import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Bet {
  'id' : BetId,
  'smartContractAddress' : [] | [string],
  'status' : string,
  'creator' : UserId,
  'createdAt' : bigint,
  'description' : string,
  'finalOutcome' : [] | [string],
  'creatorProposedOutcome' : [] | [string],
  'counterparty' : [] | [UserId],
  'counterpartyProposedOutcome' : [] | [string],
}
export type BetId = string;
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : BetId } |
  { 'err' : string };
export type UserId = string;
export interface _SERVICE {
  'acceptBet' : ActorMethod<[BetId], Result>,
  'agreeOnOutcome' : ActorMethod<[BetId], Result>,
  'getAllBets' : ActorMethod<[], Array<Bet>>,
  'getBet' : ActorMethod<[BetId], [] | [Bet]>,
  'proposeBet' : ActorMethod<[string], Result_1>,
  'proposeOutcome' : ActorMethod<[BetId, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
