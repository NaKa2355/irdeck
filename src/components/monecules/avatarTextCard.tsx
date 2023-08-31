import { Box, Card, CardActionArea, CardContent, CardHeader, CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { IconDots } from "@tabler/icons-react";
import React from "react"


function LoadingLayer() {
  return (
    <Box sx={{
      position: "absolute",
      pointerEvents: "none",
      width: "100%",
      height: "100%"
    }}>
      <Box sx={{
        position: "absolute",
        backgroundColor: "text.primary",
        opacity: "0.3",
        width: "100%",
        height: "100%"
      }}>
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    </Box>
  )
}

interface AvatarTextCardProps {
  title: string,
  avatar: React.ReactNode,
  menu: React.ReactNode,
  isLoading?: boolean,
  onKebabMenuClicked?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCardClicked?: () => void
}

export function AvatarTextCard(props: AvatarTextCardProps) {
  return (
    <Box >
      <Card variant="outlined" sx={{ position: "relative" }}>
        {props.isLoading &&
          <LoadingLayer/>
        }

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
    </Box>
  )
}