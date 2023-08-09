import { Grid } from "@mui/material";
import { Remote, RemoteType } from "../../../type/remote";
import { RemoteCard } from "./remoteCard";

interface RemotesGridProps {
  remotes: Map<string, Remote>
  onClick?: (applianceId: string) => void,
  onDelete?: (applianceId: string) => void,
  onEdit?: (applianceId: string) => void,
  isLoading?: boolean,
}


export function RemotesGrid(props: RemotesGridProps) {
  const cards = Array.from(props.remotes).map(([id, remote]) => (
    <Grid item xs={1} key={id}>
      <RemoteCard
        id={id}
        name={remote.name}
        remoteType={remote.tag as RemoteType}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onClick={props.onClick}
      />
    </Grid>
  ));

  return (
    <Grid container spacing={2} columns={{ xs: 2, sm: 3, md: 4 }}>
      {cards}
    </Grid>
  )
}