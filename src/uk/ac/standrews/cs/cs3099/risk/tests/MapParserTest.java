package uk.ac.standrews.cs.cs3099.risk.tests;

import static org.junit.Assert.*;
import org.junit.Test;

import uk.ac.standrews.cs.cs3099.risk.game.*;
import com.google.gson.*;


public class MapParserTest {

    @Test(expected=MapParseException.class)
    public void brokenJson() throws MapParseException
	{
		MapParser m = new MapParser("crackhead");
    }

    @Test(expected=MapParseException.class)
    public void emptyJson() throws MapParseException
	{
		MapParser m = new MapParser("{}");
    }

    @Test(expected=MapParseException.class)
    public void wrongData() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"notamap\"}");
    }

    @Test(expected=MapParseException.class)
    public void dataOnly() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\"}");
    }

    @Test(expected=MapParseException.class)
    public void invalidContinents() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":1}");
    }

    @Test(expected=MapParseException.class)
    public void invalidContinents1() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":[]}");
    }

    @Test(expected=MapParseException.class)
    public void invalidContinents2() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{}}");
    }
}
