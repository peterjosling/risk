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

	@Test(expected=MapParseException.class)
	public void invalidContinents3() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":{}}}");
	}

	@Test(expected=MapParseException.class)
	public void incompleteMap() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}}");
	}

	@Test(expected=MapParseException.class)
	public void invalidConnections1() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}, \"connections\":{}}");
	}

	@Test(expected=MapParseException.class)
	public void invalidConnections2() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}, \"connections\":[]}");
	}

	@Test(expected=MapParseException.class)
	public void invalidConnections3() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}, \"connections\":[[0,1]]}");
	}

	@Test(expected=MapParseException.class)
	public void everythingElse() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}, \"connections\":[[0,1]]," +
									 "\"continent_values\":[]}");
	}

	@Test(expected=MapParseException.class)
	public void everythingElse0() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}, \"connections\":[[0,1]]," +
									 "\"continent_values\":{}}");
	}

	@Test(expected=MapParseException.class)
	public void everythingElse1() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}, \"connections\":[[0,1]]," +
									 "\"continent_values\":{\"0\":\"crackpipe\"}}");
	}

	@Test(expected=MapParseException.class)
	public void everythingElse2() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}, \"connections\":[[0,1]]," +
									 "\"continent_values\":{\"0\":0}, \"country_name\":{\"0\":\"a\"}}");
	}

	@Test(expected=MapParseException.class)
	public void everythingElse3() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}, \"connections\":[[0,1]]," +
									 "\"continent_values\":{\"0\":0}, \"country_name\":{\"0\":\"a\"}," +
									 "\"country_card\":{\"0\":0}}");
	}

	@Test(expected=MapParseException.class)
	public void everythingElse4() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}, \"connections\":[[0,1]]," +
									 "\"continent_values\":{\"0\":0}, \"country_name\":{\"0\":\"a\"}," +
									 "\"country_card\":{\"0\":0}, \"continent_names\":{\"0\":\"aa\"}}");
	}

	@Test
	public void everythingElse5() throws MapParseException
	{
		MapParser m = new MapParser("{\"data\":\"map\", \"continents\":{\"0\":[0, 1]}, \"connections\":[[0,1]]," +
									 "\"continent_values\":{\"0\":\"crackpipe\"}, \"country_name\":{\"0\":\"a\"}," +
									 "\"continent_values\":{\"0\":0}, \"country_name\":{\"0\":\"a\"}," +
									 "\"country_card\":{\"0\":0}, \"continent_names\":{\"0\":\"aa\"}, \"wildcards\":2}");
	}
}
