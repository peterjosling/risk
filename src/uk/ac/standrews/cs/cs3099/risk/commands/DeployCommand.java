package uk.ac.standrews.cs.cs3099.risk.commands;

import com.google.gson.*;

import java.lang.reflect.Type;

public class DeployCommand extends Command {
	private String command = "deploy";
	private Deployment[] payload;

	public DeployCommand(int playerId, int ackId, Deployment[] deployments)
	{
		super(playerId, ackId);
		payload = deployments;
	}

	public Deployment[] getDeployments()
	{
		return payload;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.DEPLOY;
	}

	public static class Deployment {
		private int territoryId;
		private int armies;
		
		public Deployment(int id, int armies){
			this.territoryId = id;
			this.armies = armies;
		}

		public int getTerritoryId() {
			return territoryId;
		}

		public int getArmies() {
			return armies;
		}
	}

	public static class DeploymentDeserializer implements JsonDeserializer<Deployment> {
		@Override
		public Deployment deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException
		{
			JsonArray jsonArray = json.getAsJsonArray();
			int id = jsonArray.get(0).getAsInt();
			int count = jsonArray.get(1).getAsInt();
			return new Deployment(id, count);
		}
	}

	public static class DeploymentSerializer implements JsonSerializer<Deployment> {
		@Override
		public JsonElement serialize(Deployment deployment, Type type, JsonSerializationContext jsonSerializationContext)
		{
			JsonArray jsonArray = new JsonArray();
			jsonArray.add(new JsonPrimitive(deployment.territoryId));
			jsonArray.add(new JsonPrimitive(deployment.armies));
			return jsonArray;
		}
	}
}
