import Hash "mo:base/Hash";

import Int "mo:base/Int";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";

actor {
  type BetId = Text;
  type UserId = Principal;

  type BetStatus = {
    #Proposed;
    #Accepted;
    #Completed;
    #Cancelled;
  };

  type Bet = {
    id: BetId;
    description: Text;
    creator: UserId;
    counterparty: ?UserId;
    outcome: ?Text;
    createdAt: Int;
    status: BetStatus;
    smartContractAddress: ?Text;
  };

  stable var betsEntries : [(BetId, Bet)] = [];
  let bets = HashMap.fromIter<BetId, Bet>(betsEntries.vals(), 0, Text.equal, Text.hash);

  public shared(msg) func proposeBet(description: Text) : async Result.Result<BetId, Text> {
    let id = Text.concat(Principal.toText(msg.caller), Int.toText(Time.now()));
    let newBet : Bet = {
      id = id;
      description = description;
      creator = msg.caller;
      counterparty = null;
      outcome = null;
      createdAt = Time.now();
      status = #Proposed;
      smartContractAddress = null;
    };
    bets.put(id, newBet);
    #ok(id)
  };

  public shared(msg) func acceptBet(betId: BetId) : async Result.Result<Text, Text> {
    switch (bets.get(betId)) {
      case (null) { #err("Bet not found") };
      case (?bet) {
        if (bet.status != #Proposed) {
          #err("Bet is not in a proposable state")
        } else if (bet.creator == msg.caller) {
          #err("Cannot accept your own bet")
        } else {
          let updatedBet : Bet = {
            id = bet.id;
            description = bet.description;
            creator = bet.creator;
            counterparty = ?msg.caller;
            outcome = bet.outcome;
            createdAt = bet.createdAt;
            status = #Accepted;
            smartContractAddress = ?createSmartContract(bet.id);
          };
          bets.put(betId, updatedBet);
          #ok("Bet accepted and smart contract created")
        }
      };
    }
  };

  public query func getBet(id: BetId) : async ?Bet {
    bets.get(id)
  };

  public query func getAllBets() : async [Bet] {
    Iter.toArray(bets.vals())
  };

  private func createSmartContract(betId: BetId) : Text {
    // This is a placeholder. In a real implementation, this would interact with the IC to create an actual smart contract.
    "ic://" # betId
  };

  system func preupgrade() {
    betsEntries := Iter.toArray(bets.entries());
  };

  system func postupgrade() {
    betsEntries := [];
  };
}
