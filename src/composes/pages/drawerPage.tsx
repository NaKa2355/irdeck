import { useEffect } from "react";
import { useRemotesGetter } from "../../hooks/useRemotesGetter";
import { RemotesList } from "../organisms/lists/remotesList";
import DrawerTemplate from "../templates/drawerTemplate";
import { useDevicesGetter } from "../../hooks/useDevicesGetter";

export function DrawerPage() {
  const remotesGetter = useRemotesGetter();
  const devicesGetter = useDevicesGetter();
  
  useEffect(() => {
    remotesGetter.fetch();
    devicesGetter.fetch();
  }, []);

  return (
    <div>
      <DrawerTemplate
        drawer={
          <RemotesList remotes={remotesGetter.data}/>
        }
      />
    </div>
  );
}
