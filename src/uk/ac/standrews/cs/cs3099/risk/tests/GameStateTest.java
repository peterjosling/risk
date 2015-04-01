package uk.ac.standrews.cs.cs3099.risk.tests;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import uk.ac.standrews.cs.cs3099.risk.commands.AssignArmyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.FortifyCommand;
import uk.ac.standrews.cs.cs3099.risk.game.*;

import java.util.ArrayList;


public class GameStateTest {

    @Test
    public void gettersAndSetters() {


        // Nothing to test yet
    }
    
    @Test
    public void checkGameCompletion(){

    	
    	// Cannot test yet
    	
    }
    
    @Test
    public void validateAssignArmy(){
    	

    	
    	AssignArmyCommand move;
    	
    	// Need initialisation of map to test
    	
    }
    
    @Test
    public void validateFortify(){
    	

    	FortifyCommand move;
    	
    	// Need initialisation of map to test
    	
    }
    
    @Test
    public void validateDeploy(){
    	

    	
    	DeployCommand move;
    	
    	// Need initialisation of map to test
    	
    }
    
    @Test
    public void validateAttack(){

    	
    	AttackCommand move;
    	
    	// Need initialisation of map to test
    	
    }

	private Continent continent1;
	private Continent continent2;
	Territory territory1;
	Territory territory2;
	Territory territory3;
	Territory territory4;
	GameState gs;

	@Before
	public void setup() {
//		continent1 = new Continent(1);
//		territory1 = new Territory(1, continent1);
//		territory2 = new Territory(2, continent1);
//		territory3 = new Territory(3, continent1);
//		territory4 = new Territory(4, continent2);
		ArrayList<Integer> players = new ArrayList<Integer>();
		int numberOfPlayers = 3;
		for(int playerNum=0; playerNum<numberOfPlayers; playerNum++){
			players.add(playerNum);
		}

		gs = new GameState(players);
		try {
			MapParser mp = new MapParser("/Users/nicholaskneeshaw/Documents/CS3099/risk/risk_map.json");
			gs.loadMap(mp);
		} catch (MapParseException e) {
			System.out.println("Awh no");
			e.printStackTrace();
		}

	}

    @Test
	public void armiesTest(){
		assertEquals(0, gs.getMap().findTerritoryById(1).getArmies());
		gs.addArmiesForTerritory(1, 3);
		assertEquals(3, gs.getMap().findTerritoryById(1).getArmies());
		assertEquals(0, gs.getMap().findTerritoryById(2).getArmies());
		gs.addArmiesForTerritory(2, 1);
		assertEquals(1, gs.getMap().findTerritoryById(2).getArmies());
		gs.removeArmiesForTerritory(1, 1);
		assertEquals(2, gs.getMap().findTerritoryById(1).getArmies());
		gs.moveArmies(1,2,1);
		assertEquals(1, gs.getMap().findTerritoryById(1).getArmies());
		assertEquals(2, gs.getMap().findTerritoryById(2).getArmies());
		gs.moveArmies(1,2,1);
		assertEquals(1, gs.getMap().findTerritoryById(1).getArmies());
		assertEquals(2, gs.getMap().findTerritoryById(2).getArmies());
	}



}
