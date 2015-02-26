package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;

import uk.ac.standrews.cs.cs3099.risk.commands.AssignArmyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DefendCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DrawCardCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.FortifyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.commands.PlayCardsCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand.Deployment;

/**
 * GameState Class
 * Stores the entire game and controls board movement
 */
public class GameState {

	private Map map;
	private Deck deck;

	private int[] deployableArmies;

	private final int DECK_SIZE = 44;
	private final int TEMP_SEED = 123456;

	public GameState()
	{
		deck = new Deck(DECK_SIZE);
		deck.shuffle(TEMP_SEED);
	}

	public void loadMap(MapParser m) throws MapParseException
	{
		map = new Map(m);
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
		return deployableArmies[playerID];
	}

	public void playMove(Command move, int playerID){
		CommandType moveType = move.getType();
		if(moveType==CommandType.ASSIGN_ARMY){
			Territory territory = map.findTerritoryById(((AssignArmyCommand) move).getTerritoryId());
			territory.addArmies(1);
			territory.claim(playerID);
		}
		else if(moveType==CommandType.FORTIFY){

		}
		else if(moveType==CommandType.ATTACK){

		}
		else if(moveType==CommandType.DEPLOY){

		}
		else if(moveType==CommandType.TRADE_IN_CARDS){

		}
		else if(moveType==CommandType.DRAW_CARD){

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

	public boolean isMoveValid(Command move)
	{
		System.out.println("Move not found");
		return false;
	}

	public boolean isMoveValid(AttackCommand move)
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

	public boolean isMoveValid(FortifyCommand move)
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

	public boolean isMoveValid(PlayCardsCommand move)
	{
		// Check if own cards trading in.
		return true;
	}

	public boolean isMoveValid(DeployCommand move)
	{
		int playerId = move.getPlayerId();

		int deployingTroops = 0;

		for (Deployment deployment : move.getDeployments()){

			Territory deployTerritory = map.findTerritoryById(deployment.getTerritoryId());
			if(deployTerritory.getOwner() != playerId) return false;

			deployingTroops += deployTerritory.getArmies();

		}

		if(deployingTroops != getDeployableArmies(playerId)) return false;

		return true;
	}
	
	public boolean isMoveValid(DrawCardCommand move)
	{
		return true;
	}
	
	public boolean isMoveValid(DefendCommand move)
	{
		int playerId = move.getPlayerId();

		Territory defendTerritory = map.findTerritoryById(move.getTerritory());
		if(defendTerritory.getOwner() != playerId) return false;

		if ((defendTerritory.getArmies() < move.getArmies())
				|| (move.getArmies() > 2))
			return false;

		return true;
	}

	public boolean isMoveValid(AssignArmyCommand move)
	{

		int territoryId = move.getTerritoryId();

		Territory territory = map.findTerritoryById(territoryId);

		if(territory.isClaimed()){
			return false;
		}

		return true;
	}


}

