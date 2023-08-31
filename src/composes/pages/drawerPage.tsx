import { useEffect, useState } from "react";
import { useRemotesGetter } from "../../hooks/useRemotesGetter";
import { RemotesList } from "../organisms/lists/remotesList";
import DrawerTemplate from "../templates/drawerTemplate";
import { useDevicesGetter } from "../../hooks/useDevicesGetter";
import { ButtonsGrid } from "../organisms/grids/buttonsGrid";

export function DrawerPage() {
  const remotesGetter = useRemotesGetter();
  const devicesGetter = useDevicesGetter();
  const [selectedRemoteId, selectRemote] = useState("");
  
  useEffect(() => {
    remotesGetter.fetch();
    devicesGetter.fetch();
  }, []);

  const onRemoteSelected = (remoteId: string) => {
    selectRemote(remoteId);
    console.log(remoteId)
  }

  return (
    <div>
      <DrawerTemplate
        drawer={
          <RemotesList onRemoteSelected={onRemoteSelected}/>
        }

        contents={
          <ButtonsGrid remoteId={selectedRemoteId} />
        }

      />
    </div>
  );
}
