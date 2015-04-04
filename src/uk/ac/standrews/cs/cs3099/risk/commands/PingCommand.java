package uk.ac.standrews.cs.cs3099.risk.commands;

import com.google.gson.*;

import java.lang.reflect.Type;

public class PingCommand extends Command {
	private String command = "ping";
	private int payload;

	public PingCommand(int playerId)
	{
		super(playerId);
		this.payload = -1;
	}

	public PingCommand(int playerId, int noOfPlayers)
	{
		super(playerId);
		this.payload = noOfPlayers;
	}

	/**
	 * @return Integer count of the number players.
	 */
	public int getNoOfPlayers()
	{
		return payload;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.PING;
	}

	public static class PingCommandSerializer implements JsonSerializer<PingCommand> {
		@Override
		public JsonElement serialize(PingCommand command, Type type, JsonSerializationContext jsonSerializationContext)
		{
			JsonObject result = new JsonObject();
			result.add("command", new JsonPrimitive("ping"));

			int playerId = command.getPlayerId();
			int payload = command.getNoOfPlayers();

			// Serialise player_id = -1 as null (host).
			if (playerId == -1) {
				result.add("player_id", JsonNull.INSTANCE);
			} else {
				result.add("player_id", new JsonPrimitive(playerId));
			}

			// Serialise payload = -1 as null (client response).
			if (payload == -1) {
				result.add("payload", JsonNull.INSTANCE);
			} else {
				result.add("payload", new JsonPrimitive(payload));
			}

			return result;
		}
	}
}
