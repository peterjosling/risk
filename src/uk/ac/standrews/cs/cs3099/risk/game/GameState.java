package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;

/**
 * GameState Class
 * Stores the entire game and controls board movement
 */
public class GameState {

	private Map map;
	private Deck deck;
	
	private int[] playersArmies;

	private final int DECK_SIZE = 44;
	private final int TEMP_SEED = 123456;

	public GameState()
	{
		deck = new Deck(DECK_SIZE);
		deck.shuffle(TEMP_SEED);
	}

	public void loadMap(String json) throws MapParseException
	{
		map = new Map();

		map.parseMapData(json);
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
	
	public void playMove(Move move, int playerID){
		MoveType moveType = move.getType();
		if(moveType==MoveType.ASSIGN_ARMY){
			Territory territory = map.findTerritoryById(((AssignArmyMove) move).getTerritoryId());
			territory.addArmies(1);
			territory.claim(playerID);
		}
		else if(moveType==MoveType.FORTIFY){

		}
		else if(moveType==MoveType.ATTACK){

		}
		else if(moveType==MoveType.DEPLOY){

		}
		else if(moveType==MoveType.TRADE_IN_CARDS){

		}
		else if(moveType==MoveType.DRAW_CARD){

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
	
	public int calculateDeployTroops(Player player)
	{
		int deployableTroops = 0;
		int playerId = player.getId();
		
		// TERRITORIES
		int territoryCount = 0;
		for (Territory territory : map.getTerritories()) {
			if (territory.getOwner() == playerId){
				territoryCount ++;
			} 
		}
		
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
				if(territory.getOwner() != playerId){
					continentOwned = -1;
				}
			}
			if(continentOwned == 1){
				continentTroops += continent.getContinentValue();
			}
		}
		deployableTroops += continentTroops;
		
		// cards??
		
		return deployableTroops;
	}
	
	public boolean isMoveValid(Move move)
	{
		
		MoveType type = move.getType();
		int playerId = move.getPlayerId();
		
		switch (type) {
		case ATTACK:
			AttackMove attackMove = (AttackMove) move;
			
			Territory sourceTerritory = map.findTerritoryById(attackMove.getSource());
			if(sourceTerritory.getOwner() != playerId) return false;
			
			Territory destTerritory = map.findTerritoryById(attackMove.getDest());
			if(destTerritory.getOwner() == playerId) return false;
			
			if(!sourceTerritory.isLinkedTo(destTerritory)) return false;
			
			// INCORRECT?
			if ((sourceTerritory.getArmies() != attackMove.getArmies())
					&& (sourceTerritory.getArmies() > 1))
				return false;
			
			break;
		case FORTIFY:
			FortifyMove fortifyMove = (FortifyMove) move;
			
			Territory source1Territory = map.findTerritoryById(fortifyMove.getSource());
			if(source1Territory.getOwner() != playerId) return false;

			Territory dest1Territory = map.findTerritoryById(fortifyMove.getDest());
			if(dest1Territory.getOwner() != playerId) return false;
			
			if(source1Territory.getArmies() > 1){
				if((fortifyMove.getArmies()) < source1Territory.getArmies()) return false;
			} else {
				return false;
			}
			
			// Check source and destination are connected ?!?!
			
			
			break;
		case TRADE_IN_CARDS:
			
			break;
		case DEPLOY:
			DeployMove deployMove = (DeployMove) move;  
			
			// check armies
			// check own all territories within Deployments[]
			
			break;
		case DRAW_CARD:
			
			// ??
			
			break;
		case ASSIGN_ARMY:
			AssignArmyMove assignMove = (AssignArmyMove) move;  
			
			int territoryId = assignMove.getTerritoryId();
			
			Territory territory = map.findTerritoryById(territoryId);
			
			if(territory.isClaimed()){
				return false;
			}
				
			break;
			
		default:
			System.out.println("Type not found.");
			break;
		}
		
		return true;
	}
}

