import { NetworkAdapterInterface } from "@automerge/automerge-repo";

import { Repo } from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/lib/constants";
export default clientGetServerRepo;

function clientGetServerRepo() {
  return new Repo({
    network: [
      new BrowserWebSocketClientAdapter(
        NEXT_PUBLIC_WEBSOCKET_URL
      ) as any as NetworkAdapterInterface,
    ],
  });
}
