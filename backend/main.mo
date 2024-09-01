import Hash "mo:base/Hash";

import Int "mo:base/Int";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor {
  // Define the Bet type
  type Bet = {
    id: Text;
    description: Text;
    creator: Text;
    outcome: ?Text;
    createdAt: Int;
  };

  // Stable variable to store bets
  stable var betsEntries : [(Text, Bet)] = [];

  // Create a HashMap to store bets
  let bets = HashMap.fromIter<Text, Bet>(betsEntries.vals(), 0, Text.equal, Text.hash);

  // Create a new bet
  public func createBet(description: Text, creator: Text) : async Result.Result<Text, Text> {
    let id = Text.concat(creator, Int.toText(Time.now()));
    let newBet : Bet = {
      id = id;
      description = description;
      creator = creator;
      outcome = null;
      createdAt = Time.now();
    };
    bets.put(id, newBet);
    #ok(id)
  };

  // Get all bets
  public query func getBets() : async [Bet] {
    Iter.toArray(bets.vals())
  };

  // Get a specific bet by ID
  public query func getBet(id: Text) : async ?Bet {
    bets.get(id)
  };

  // System functions for upgrades
  system func preupgrade() {
    betsEntries := Iter.toArray(bets.entries());
  };

  system func postupgrade() {
    betsEntries := [];
  };
}
