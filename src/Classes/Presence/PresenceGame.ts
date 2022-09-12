import Client from "../../Client";
import PresenceActivity from "./PresenceActivity";

class PresenceGame extends PresenceActivity {
	public session_id?: string;

	constructor(client: Client, data: any) {
		super(client, data);

		this.session_id = data.session_id;
	}
}

export default PresenceGame;
