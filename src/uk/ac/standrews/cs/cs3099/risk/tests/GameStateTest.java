package uk.ac.standrews.cs.cs3099.risk.tests;

import static org.junit.Assert.*;

import org.junit.Test;

import uk.ac.standrews.cs.cs3099.risk.commands.AssignArmyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.FortifyCommand;
import uk.ac.standrews.cs.cs3099.risk.game.*;


public class GameStateTest {

    @Test
    public void gettersAndSetters() {
        GameState g = new GameState();

        // Nothing to test yet
    }
    
    @Test
    public void checkGameCompletion(){
        GameState g = new GameState();    	
    	
    	// Cannot test yet
    	
    }
    
    @Test
    public void validateAssignArmy(){
    	
    	GameState g = new GameState();
    	
    	AssignArmyCommand move;
    	
    	// Need initialisation of map to test
    	
    }
    
    @Test
    public void validateFortify(){
    	
    	GameState g = new GameState();
    	
    	FortifyCommand move;
    	
    	// Need initialisation of map to test
    	
    }
    
    @Test
    public void validateDeploy(){
    	
    	GameState g = new GameState();
    	
    	DeployCommand move;
    	
    	// Need initialisation of map to test
    	
    }
    
    @Test
    public void validateAttack(){
    	
    	GameState g = new GameState();
    	
    	AttackCommand move;
    	
    	// Need initialisation of map to test
    	
    }
    
    
}
