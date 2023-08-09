import { Card, CardActionArea, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import { IconDots } from "@tabler/icons-react";
import React from "react"

interface AvatarTextCardProps {
  title: string,
  avatar: React.ReactNode,
  menu: React.ReactNode,
  onKebabMenuClicked?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCardClicked?: () => void
}

export function AvatarTextCard(props: AvatarTextCardProps) {
  return (
    <div>
      <Card variant="outlined">
        <CardActionArea onClick={props.onCardClicked}>
          <CardHeader
            avatar={props.avatar}

            action={
              <IconButton
                onMouseDown={(event) => {
                  event.stopPropagation()
                }}

                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  props.onKebabMenuClicked?.(event);
                }}
              >
                <IconDots size={20} />
              </IconButton>
            }
          />

          <CardContent>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontWeight: "bold",
                textOverflow: "ellipsis",
              }}
            >
              {props.title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      {props.menu}
    </div>
  )
}