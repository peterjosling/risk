package uk.ac.standrews.cs.cs3099.risk.commands;


import com.google.gson.*;

import java.lang.reflect.Type;
import java.sql.Time;

public class TimeoutCommand extends Command {
	private String command = "timeout";
	private int payload;

	public TimeoutCommand(int playerId, int ackId, int timeoutId) 
	{
		super(playerId, ackId);
		this.payload = timeoutId;
	}

	/**
	 * @return Integer ID of the player who has timed out.
	 */
	public int getTimeoutId()
	{
		return payload;
	}
	
	@Override
	public CommandType getType() 
	{
		return CommandType.TIMEOUT;
	}

	public static class TimeoutCommandSerializer implements JsonSerializer<TimeoutCommand> {
		@Override
		public JsonElement serialize(TimeoutCommand command, Type type, JsonSerializationContext jsonSerializationContext)
		{
			JsonObject result = new JsonObject();
			result.add("command", new JsonPrimitive("timeout"));

			int playerId = command.getPlayerId();
			int payload = command.getTimeoutId();
			int ackId = command.getAckId();

			// Serialise player_id = -1 as null (host).
			if (playerId == -1) {
				result.add("player_id", JsonNull.INSTANCE);
			} else {
				result.add("player_id", new JsonPrimitive(playerId));
			}

			result.add("payload", new JsonPrimitive(payload));
			result.add("ack_id", new JsonPrimitive(ackId));

			return result;
		}
	}

	public static class TimeoutCommandDeserializer implements JsonDeserializer<TimeoutCommand> {
		@Override
		public TimeoutCommand deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
			JsonObject obj = jsonElement.getAsJsonObject();

			// If the player_id field is null, change it to -1 before we deserialize.
			JsonElement playerId = obj.get("player_id");

			if (playerId.isJsonNull()) {
				obj.add("player_id", new JsonPrimitive(-1));
			}

			TimeoutCommand timeout = new TimeoutCommand(obj.get("player_id").getAsInt(), obj.get("ack_id").getAsInt(),
					obj.get("payload").getAsInt());

			return timeout;
		}
	}
}
