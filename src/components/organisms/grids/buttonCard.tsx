import { Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AvatarTextCard } from "../../monecules/avatarTextCard";
import { useIrGetter } from "../../../hooks/useIrGetter";
import { useIrSender } from "../../../hooks/useIrSender";
import { Button } from "../../../type/button";
import { SignalWifi0Bar, Wifi } from "@mui/icons-material";
import { useRecoilValue } from "recoil";
import { remotesAtom } from "../../../recoil/atoms/remotes";

interface ButtonCardProps {
  button: Button
  remoteId: string,
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onClick?: (id: string) => void
  onClickReceive?: (id: string) => void
}

export function ButtonCard(props: ButtonCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpend = Boolean(anchorEl);
  const { t } = useTranslation();
  const irGetter = useIrGetter();
  const [sendIr] = useIrSender()
  const [isLoading, setLoadingState] = useState(false);
  const remotes = useRecoilValue(remotesAtom);


  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleClick = async () => {
    if(!props.button.hasIrData) {
      return;
    }

    setLoadingState(true);
    const remote = remotes.remotes.get(props.remoteId);
    if(!remote) {
      return;
    }
    
    const deviceId = remote.deviceId;
    try {
      const irData = await irGetter.getIr(props.remoteId, props.button.id);
      await sendIr(deviceId, irData);
    } finally {
      setLoadingState(false);
    }
  }

  const handleReceive = () => {
    handleClose();
    props.onClickReceive?.(props.button.id);
  }

  const handleEdit = () => {
    handleClose();
    props.onEdit?.(props.button.id);
  }

  const handleDelete = () => {
    handleClose();
    props.onDelete?.(props.button.id);
  }

  const menu = (
    <Menu
      open={menuOpend}
      anchorEl={anchorEl}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem onClick={handleReceive}>
        {t("button.lean")}
      </MenuItem>

      {props.button.tag === "" && (
        <MenuItem onClick={handleEdit}>
          {t("button.edit")}
        </MenuItem>
      )}

      {props.button.tag === "" && (
        <MenuItem onClick={handleDelete}>
          {t("button.delete")}
        </MenuItem>
      )}
    </Menu>
  )

  return (
    <AvatarTextCard
      title={props.button.name}
      isLoading={isLoading}
      menu={menu}
      avatar={
        <Avatar
          sx={{
            width: 30,
            height: 30,
            color: "text.secondary",
            backgroundColor: "background.default",
            border: 1,
            borderColor: "divider"
          }}
        >
          {props.button.hasIrData ? <Wifi /> : <SignalWifi0Bar />}
        </Avatar>
      }
      onCardClicked={handleClick}
      onKebabMenuClicked={handleMenuClick}
    />
  )
}