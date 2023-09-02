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
  const [isRemoteEmpty, setRemoteIsEmpty] = useState(false);

  useEffect(() => {
    remotesGetter.fetch();
    devicesGetter.fetch();
  }, []);

  const onRemoteSelected = (remoteId: string) => {
    setRemoteIsEmpty(false);
    selectRemote(remoteId);
    console.log(remoteId);
  }

  const onRemoteIsEmpty = () => {
    setRemoteIsEmpty(true);
  }

  return (
    <div>
      <DrawerTemplate
        title={remotesGetter.data.get(selectedRemoteId)?.name ?? ""}
        drawer={
          <RemotesList
            onRemoteSelected={onRemoteSelected}
            onRemoteEmpty={onRemoteIsEmpty}
          />
        }
        contents={
          <div>
            {!isRemoteEmpty && 
              <ButtonsGrid remoteId={selectedRemoteId} />
            }
            {isRemoteEmpty &&
              <p>No Remotes</p>
            }
          </div>
        }
      />
    </div>
  );
}
