import { Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RemoteType } from "../../../type/remote";
import { SettingsRemote, Thermostat, ToggleOff, TouchApp } from "@mui/icons-material";
import { AvatarTextCard } from "../../monecules/avatarTextCard";

interface RemoteCardProps {
  id: string
  name: string
  remoteType: RemoteType
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onClick?: (id: string) => void
}

interface RemoteIconProps {
  remoteType: RemoteType,
  size?: number,
};

function RemoteIcon(props: RemoteIconProps) {
  switch (props.remoteType) {
    case RemoteType.Custom:
      return (<SettingsRemote color='inherit' fontSize="small" />);
    case RemoteType.Button:
      return (<TouchApp color='inherit' fontSize="small" />);
    case RemoteType.Toggle:
      return (<ToggleOff color='inherit' fontSize="small" />);
    case RemoteType.Thermostat:
      return (<Thermostat color='inherit' fontSize="small" />);
  }
}

export function RemoteCard(props: RemoteCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuOpend = Boolean(anchorEl);
  const { t } = useTranslation();

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = () => {
    props.onClick?.(props.id);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    props.onEdit?.(props.id);
  }

  const handleDelete = () => {
    handleClose();
    props.onDelete?.(props.id);
  }

  return (
    <AvatarTextCard
      title={props.name}
      menu={
        <Menu
          open={menuOpend}
          anchorEl={anchorEl}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleEdit}>
            {t("button.edit")}
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            {t("button.delete")}
          </MenuItem>
        </Menu>
      }
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
          <RemoteIcon remoteType={props.remoteType} />
        </Avatar>
      }
      onCardClicked={handleClick}
      onKebabMenuClicked={handleMenuClick}
    />
  )
}
