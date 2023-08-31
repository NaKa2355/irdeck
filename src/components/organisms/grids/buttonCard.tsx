import { Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AvatarTextCard } from "../../monecules/avatarTextCard";

interface ButtonCardProps {
  id: string
  name: string
  icon?: JSX.Element
  canEdit?: boolean
  hasIrData?: boolean
  canDelete?: boolean
  isLoading?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onClick?: (id: string) => void
  onClickSend?: (id: string) => void
  onClickReceive?: (id: string) => void
}

export function ButtonCard(props: ButtonCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpend = Boolean(anchorEl);
  const { t } = useTranslation();

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = () => {
    props.onClickSend?.(props.id)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReceive = () => {
    handleClose();
    props.onClickReceive?.(props.id);
  }

  const handleEdit = () => {
    handleClose();
    props.onEdit?.(props.id);
  }

  const handleDelete = () => {
    handleClose();
    props.onDelete?.(props.id);
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
        {t("button.receive")}
      </MenuItem>

      {props.canEdit && (
        <MenuItem onClick={handleEdit}>
          {t("button.edit")}
        </MenuItem>
      )}

      {props.canDelete && (
        <MenuItem onClick={handleDelete}>
          {t("button.delete")}
        </MenuItem>
      )}
    </Menu>
  )

  return (
    <AvatarTextCard
      title={props.name}
      isLoading={props.isLoading}
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
          {props.icon}
        </Avatar>
      }
      onCardClicked={handleClick}
      onKebabMenuClicked={handleMenuClick}
    />
  )
}