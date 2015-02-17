package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.List;

import uk.ac.standrews.cs.cs3099.risk.game.DeployMove.Deployment;

/**
 * GameState Class
 * Stores the entire game and controls board movement
 */
public class GameState {

	private Map map;
	private Deck deck;

	private int[] playersDeployableArmies;
	private int tradeInCount = 0;
	private ArrayList<Card>[] playerCards = new ArrayList[getNumberOfPlayers()];
	private boolean inAttackPhase = false;
	private ArrayList<Move> attackPhaseMoves = new ArrayList<Move>();
	private List<Player> players;
	private final int[] TRADE_IN_VALUES = new int[6];

	private final int DECK_SIZE = 44;
	private final int TEMP_SEED = 123456;

	public GameState(List<Player> players)
	{
		players = this.players;
		deck = new Deck(DECK_SIZE);
		deck.shuffle(TEMP_SEED);
		initTradeInValues();
	}

	public void loadMap(MapParser m) throws MapParseException
	{
		map = new Map(m);
	}

	public void initTradeInValues(){
		TRADE_IN_VALUES[0] = 4;
		TRADE_IN_VALUES[1] = 6;
		TRADE_IN_VALUES[2] = 8;
		TRADE_IN_VALUES[3] = 10;
		TRADE_IN_VALUES[4] = 12;
		TRADE_IN_VALUES[5] = 15;
	}

	public int getNumberOfPlayers() {
		return players.size();
	}

	public void removeArmiesForTerritory(int id, int armies)
	{
		Territory territory = map.findTerritoryById(id);
		territory.removeArmies(armies);
	}

	public void addArmiesForTerritory(int id, int armies)
	{
		Territory territory = map.findTerritoryById(id);
		territory.addArmies(armies);
	}

	public void moveArmies(int from, int to, int armies)
	{
		removeArmiesForTerritory(from, armies);
		addArmiesForTerritory(to, armies);
	}

	/**
	 * @return Array of {@link Territory} instances which have no owner.
	 */
	public Territory[] getUnclaimedTerritories()
	{
		return getTerritoriesForPlayer(-1);
	}

	/**
	 * Get all territories currently owned by a player.
	 * @param playerID ID of the player to find territories for.
	 * @return Array of {@link Territory}.
	 */
	public Territory[] getTerritoriesForPlayer(int playerID)
	{
		ArrayList<Territory> territories = new ArrayList<Territory>();

		for (Territory territory : map.getTerritories()) {
			if (territory.getOwner() == playerID) {
				territories.add(territory);
			}
		}

		return territories.toArray(new Territory[0]);
	}

	public int getDeployableArmies(int playerID)
	{
		return playersDeployableArmies[playerID];
	}

	public void playMove(AssignArmyMove move, int playerID){
		Territory territory = map.findTerritoryById(move.getTerritoryId());
		territory.addArmies(1);
		territory.claim(playerID);
	}

	public void playMove(FortifyMove move){
		int destination = move.getDest();
		int source = move.getSource();
		int numberOfArmies = move.getArmies();
		moveArmies(source, destination, numberOfArmies);
	}

	public void playMove(DeployMove move){
		DeployMove.Deployment[] deployments = move.getDeployments();
		for(DeployMove.Deployment deployment : deployments){
			int id = deployment.getTerritoryId();
			int armies = deployment.getArmies();
			addArmiesForTerritory(id, armies);
		}
	}

	public void playMove(AttackMove move){
		inAttackPhase = true;
		while(!(attackPhaseMoves.size()==(3+getNumberOfPlayers()*2)));
		//pass randomNumbers to die
	}

	public void playMove(TradeCardsMove move, int playerID){
		Card[] cards = move.getCards();
		Territory[] playersTerritories = getTerritoriesForPlayer(playerID);
		int armies = calculateArmiesFromTradeIn();
		for(Card card:cards){
			for(Territory playerTerritory: playersTerritories){
				if(card.getTerritoryId()==playerTerritory.getId()){
					armies+=2; //this will need to be added to specific territory in future
					break;
				}
			}
			playerCards[playerID].remove(card);
		}
		playersDeployableArmies[playerID] += armies;
		tradeInCount++;
	}

//	public void playMove(DrawCardMove move, int playerID){
//		Card drawnCard = deck.dealCard();
//		playerCards[playerID].add(drawnCard);
//	}

	public int calculateArmiesFromTradeIn(){
		if(tradeInCount<=5){
			return TRADE_IN_VALUES[tradeInCount];
		}else {
			return ((tradeInCount-5)*5)+15; //5 additional armies to the previous set
		}
	}

	public boolean isGameComplete()
	{
		int player = -1;

		for (Territory territory : map.getTerritories()) {
			if (player == -1){
				player = territory.getOwner();
			} else if (territory.getOwner() != player) {
				return false;
			}
		}
		return true;
	}

	public int calculateDeployTroops(int playerId)
	{
		int deployableTroops = 0;
		
		// TERRITORIES
		int territoryCount = getTerritoriesForPlayer(playerId).length;

		if(territoryCount < 12){
			deployableTroops += 3;
		} else {
			deployableTroops += (territoryCount/3);
		}

		// CONTINENTS
		int continentTroops = 0;
		for(Continent continent : map.getContinents()){
			int continentOwned = 1;
			for(Territory territory : continent.getTerritories()){
				if (territory.getOwner() != playerId){
					continentOwned = -1;
					break;
				}
			}
			if (continentOwned == 1)
				continentTroops += continent.getContinentValue();
		}
		deployableTroops += continentTroops;

		return deployableTroops;
	}

	public boolean areOwnedTerritoriesConnected(int playerId, Territory source, Territory dest)
	{
		if(source.isLinkedTo(dest)) return true;

		for(Territory linkedTerritory : source.getLinkedTerritories()){
			if(linkedTerritory.getOwner() == playerId){
				return areOwnedTerritoriesConnected(playerId, linkedTerritory, dest);
			}
		}

		return false;
	}

	public boolean isMoveValid(Move move)
	{
		System.out.println("Move not found");
		return false;
	}

	public boolean isMoveValid(AttackMove move)
	{

		int playerId = move.getPlayerId();

		Territory sourceTerritory = map.findTerritoryById(move.getSource());
		if(sourceTerritory.getOwner() != playerId) return false;

		Territory destTerritory = map.findTerritoryById(move.getDest());
		if(destTerritory.getOwner() == playerId) return false;

		if(!sourceTerritory.isLinkedTo(destTerritory)) return false;

		if ((sourceTerritory.getArmies() <= move.getArmies())
				|| (sourceTerritory.getArmies() < 2) || (move.getArmies() > 3))
			return false;

		return true;
	}

	public boolean isMoveValid(FortifyMove move)
	{
		int playerId = move.getPlayerId();

		Territory fortifySource = map.findTerritoryById(move.getSource());
		if(fortifySource.getOwner() != playerId) return false;

		Territory fortifyDest = map.findTerritoryById(move.getDest());
		if(fortifyDest.getOwner() != playerId) return false;

		if(fortifySource.getArmies() > 1){
			if((move.getArmies()) < fortifySource.getArmies()) return false;
		} else {
			return false;
		}

		if(!areOwnedTerritoriesConnected(playerId, fortifySource, fortifyDest)) return false;

		return true;
	}

	public boolean isMoveValid(TradeCardsMove move)
	{
		// Check if own cards trading in.
		return true;
	}

	public boolean isMoveValid(DeployMove move)
	{
		int playerId = move.getPlayerId();

		int deployingTroops = 0;

		for (Deployment deployment : move.getDeployments()){

			Territory deployTerritory = map.findTerritoryById(deployment.getTerritoryId());
			if(deployTerritory.getOwner() != playerId) return false;

			deployingTroops += deployTerritory.getArmies();

		}
		
		if(deployingTroops != playersDeployableArmies[playerId]) return false;

		return true;
	}
	
	public boolean isMoveValid(DrawCardMove move)
	{
		return true;
	}
	
	public boolean isMoveValid(DefendMove move)
	{
		int playerId = move.getPlayerId();

		Territory defendTerritory = map.findTerritoryById(move.getTerritory());
		if(defendTerritory.getOwner() != playerId) return false;

		if ((defendTerritory.getArmies() < move.getArmies())
				|| (move.getArmies() > 2))
			return false;

		return true;
	}

	public boolean isMoveValid(AssignArmyMove move)
	{

		int territoryId = move.getTerritoryId();

		Territory territory = map.findTerritoryById(territoryId);

		if(territory.isClaimed()){
			return false;
		}

		return true;
	}


}

