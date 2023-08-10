import { Box, Card, CardActionArea, CardContent, CardHeader, Grid, IconButton, Typography } from "@mui/material";
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
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              alignItems="flex-start"
              height="2em"
            >
              <Typography
                sx={{
                  fontSize: "1em",
                  fontWeight: "bold",
                  overflowWrap: "revert",
                }}
              >
                {props.title}
              </Typography>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>

      {props.menu}
    </div>
  )
}