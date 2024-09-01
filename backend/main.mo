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
  type UserId = Text;

  type BetStatus = {
    #Proposed;
    #Accepted;
    #OutcomeProposed;
    #Completed;
    #Cancelled;
  };

  type Bet = {
    id: BetId;
    description: Text;
    creator: UserId;
    counterparty: ?UserId;
    creatorProposedOutcome: ?Text;
    counterpartyProposedOutcome: ?Text;
    finalOutcome: ?Text;
    createdAt: Int;
    status: Text;
    smartContractAddress: ?Text;
  };

  stable var betsEntries : [(BetId, Bet)] = [];
  let bets = HashMap.fromIter<BetId, Bet>(betsEntries.vals(), 0, Text.equal, Text.hash);

  public shared(msg) func proposeBet(description: Text) : async Result.Result<BetId, Text> {
    let id = Text.concat(Principal.toText(msg.caller), Int.toText(Time.now()));
    let newBet : Bet = {
      id = id;
      description = description;
      creator = Principal.toText(msg.caller);
      counterparty = null;
      creatorProposedOutcome = null;
      counterpartyProposedOutcome = null;
      finalOutcome = null;
      createdAt = Time.now();
      status = "Proposed";
      smartContractAddress = null;
    };
    bets.put(id, newBet);
    #ok(id)
  };

  public shared(msg) func acceptBet(betId: BetId) : async Result.Result<Text, Text> {
    switch (bets.get(betId)) {
      case (null) { #err("Bet not found") };
      case (?bet) {
        if (bet.status != "Proposed") {
          #err("Bet is not in a proposable state")
        } else if (bet.creator == Principal.toText(msg.caller)) {
          #err("Cannot accept your own bet")
        } else {
          let updatedBet : Bet = {
            id = bet.id;
            description = bet.description;
            creator = bet.creator;
            counterparty = ?Principal.toText(msg.caller);
            creatorProposedOutcome = bet.creatorProposedOutcome;
            counterpartyProposedOutcome = bet.counterpartyProposedOutcome;
            finalOutcome = bet.finalOutcome;
            createdAt = bet.createdAt;
            status = "Accepted";
            smartContractAddress = ?createSmartContract(bet.id);
          };
          bets.put(betId, updatedBet);
          #ok("Bet accepted and smart contract created")
        }
      };
    }
  };

  public shared(msg) func proposeOutcome(betId: BetId, outcome: Text) : async Result.Result<Text, Text> {
    switch (bets.get(betId)) {
      case (null) { #err("Bet not found") };
      case (?bet) {
        if (bet.status != "Accepted" and bet.status != "OutcomeProposed") {
          #err("Bet is not in a state where outcomes can be proposed")
        } else {
          let isCreator = bet.creator == Principal.toText(msg.caller);
          let isCounterparty = bet.counterparty == ?Principal.toText(msg.caller);
          if (not isCreator and not isCounterparty) {
            #err("Only bet participants can propose outcomes")
          } else {
            let updatedBet : Bet = {
              id = bet.id;
              description = bet.description;
              creator = bet.creator;
              counterparty = bet.counterparty;
              creatorProposedOutcome = if (isCreator) ?outcome else bet.creatorProposedOutcome;
              counterpartyProposedOutcome = if (isCounterparty) ?outcome else bet.counterpartyProposedOutcome;
              finalOutcome = bet.finalOutcome;
              createdAt = bet.createdAt;
              status = "OutcomeProposed";
              smartContractAddress = bet.smartContractAddress;
            };
            bets.put(betId, updatedBet);
            #ok("Outcome proposed")
          }
        }
      };
    }
  };

  public shared(msg) func agreeOnOutcome(betId: BetId) : async Result.Result<Text, Text> {
    switch (bets.get(betId)) {
      case (null) { #err("Bet not found") };
      case (?bet) {
        if (bet.status != "OutcomeProposed") {
          #err("Bet is not in a state where outcomes can be agreed upon")
        } else if (bet.creatorProposedOutcome == null or bet.counterpartyProposedOutcome == null) {
          #err("Both parties must propose an outcome before agreeing")
        } else if (bet.creatorProposedOutcome != bet.counterpartyProposedOutcome) {
          #err("Proposed outcomes do not match")
        } else {
          let updatedBet : Bet = {
            id = bet.id;
            description = bet.description;
            creator = bet.creator;
            counterparty = bet.counterparty;
            creatorProposedOutcome = bet.creatorProposedOutcome;
            counterpartyProposedOutcome = bet.counterpartyProposedOutcome;
            finalOutcome = bet.creatorProposedOutcome;
            createdAt = bet.createdAt;
            status = "Completed";
            smartContractAddress = bet.smartContractAddress;
          };
          bets.put(betId, updatedBet);
          #ok("Outcome agreed and bet completed")
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
