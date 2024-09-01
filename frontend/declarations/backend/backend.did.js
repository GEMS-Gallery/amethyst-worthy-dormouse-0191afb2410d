export const idlFactory = ({ IDL }) => {
  const BetId = IDL.Text;
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const UserId = IDL.Text;
  const Category = IDL.Text;
  const Bet = IDL.Record({
    'id' : BetId,
    'smartContractAddress' : IDL.Opt(IDL.Text),
    'status' : IDL.Text,
    'creator' : UserId,
    'createdAt' : IDL.Int,
    'description' : IDL.Text,
    'finalOutcome' : IDL.Opt(IDL.Text),
    'creatorProposedOutcome' : IDL.Opt(IDL.Text),
    'counterparty' : IDL.Opt(UserId),
    'category' : Category,
    'counterpartyProposedOutcome' : IDL.Opt(IDL.Text),
  });
  const Result_1 = IDL.Variant({ 'ok' : BetId, 'err' : IDL.Text });
  return IDL.Service({
    'acceptBet' : IDL.Func([BetId], [Result], []),
    'agreeOnOutcome' : IDL.Func([BetId], [Result], []),
    'getAllBets' : IDL.Func([], [IDL.Vec(Bet)], ['query']),
    'getBet' : IDL.Func([BetId], [IDL.Opt(Bet)], ['query']),
    'proposeBet' : IDL.Func([IDL.Text, Category], [Result_1], []),
    'proposeOutcome' : IDL.Func([BetId, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
