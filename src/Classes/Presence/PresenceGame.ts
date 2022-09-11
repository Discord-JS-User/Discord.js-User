import Client from "../../Client";
import GuildMember from "../GuildMember";
import GuildMemberPresence from "./GuildMemberPresence";
import PresenceActivity from "./PresenceActivity";

class PresenceGame extends PresenceActivity {
	public session_id?: string;

	constructor(client: Client, data: any) {
		super(client, data);

		this.session_id = data.session_id;
	}
}

export default PresenceGame;
