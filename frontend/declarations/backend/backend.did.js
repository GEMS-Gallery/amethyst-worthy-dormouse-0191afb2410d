export const idlFactory = ({ IDL }) => {
  const BetId = IDL.Text;
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const BetStatus = IDL.Variant({
    'Proposed' : IDL.Null,
    'Accepted' : IDL.Null,
    'Cancelled' : IDL.Null,
    'Completed' : IDL.Null,
  });
  const UserId = IDL.Principal;
  const Bet = IDL.Record({
    'id' : BetId,
    'smartContractAddress' : IDL.Opt(IDL.Text),
    'status' : BetStatus,
    'creator' : UserId,
    'createdAt' : IDL.Int,
    'description' : IDL.Text,
    'counterparty' : IDL.Opt(UserId),
    'outcome' : IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ 'ok' : BetId, 'err' : IDL.Text });
  return IDL.Service({
    'acceptBet' : IDL.Func([BetId], [Result_1], []),
    'getAllBets' : IDL.Func([], [IDL.Vec(Bet)], ['query']),
    'getBet' : IDL.Func([BetId], [IDL.Opt(Bet)], ['query']),
    'proposeBet' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
