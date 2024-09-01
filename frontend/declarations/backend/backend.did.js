export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Bet = IDL.Record({
    'id' : IDL.Text,
    'creator' : IDL.Text,
    'createdAt' : IDL.Int,
    'description' : IDL.Text,
    'outcome' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'createBet' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'getBet' : IDL.Func([IDL.Text], [IDL.Opt(Bet)], ['query']),
    'getBets' : IDL.Func([], [IDL.Vec(Bet)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
